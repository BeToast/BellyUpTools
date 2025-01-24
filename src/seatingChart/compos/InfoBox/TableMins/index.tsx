import React, { useState, useEffect } from "react";
import "./style.css";
import { deleteField, DocumentReference, updateDoc } from "firebase/firestore";
import { useSelected } from "../../../context/SelectedContext";
import ToggleSwitch from "../../../../shared/ToggleSwitch";
import { hash } from "../../../utils/generic";
import { getTableMinStatus } from "./utils";

export interface TableMinsState {
   [partyKey: string]: tableMinValue;
}
export interface tableMinValue {
   hasMin: boolean;
   ticketsPurchased: boolean;
   contractAmount: string;
   contractSigned: boolean;
   payableBy: string;
}

interface TableMinsProps {
   parties: string[];
   className?: string;
   contentClass?: string;
   header?: string;
   manualTableMinToRender?: string | undefined;
}

let prevTableMinsHash: number = 0;
let updateTimeout: NodeJS.Timeout | null = null;

const _DEBUG = false;

const TableMins: React.FC<TableMinsProps> = ({
   parties,
   className = "",
   contentClass = "",
   header = "Table Minimum",
   manualTableMinToRender = undefined,
}) => {
   if (_DEBUG)
      console.log("[TableMins] Component rendered with parties:", parties);

   const {
      assignedState,
      docTableMins,
      docRef,
      setTableMinStatues,
      setWriting,
   } = useSelected();
   const [tableMins, setTableMins] = useState<TableMinsState>(
      docTableMins || {}
   );

   useEffect(() => {
      if (docTableMins) {
         if (_DEBUG)
            console.log("[TableMins] docTableMins updated:", docTableMins);
         setTableMins(docTableMins);
      }
   }, [docTableMins]);

   useEffect(() => {
      if (_DEBUG) console.log("[TableMins] Starting status update");
      console.time("updateTableMinStatuses");
      updateTableMinStatuses();
      console.timeEnd("updateTableMinStatuses");
   }, [tableMins, assignedState]);

   const updateTableMinStatuses = () => {
      setTableMinStatues((prev) => {
         const newStatuses: Record<string, string> = {};

         if (!tableMins || !assignedState) return prev;

         const numbersMap = new Map<string, number[]>();

         // setup numbers
         Object.entries(assignedState).forEach(([tableId, parties]) => {
            if (!tableId.startsWith("Table") || parties.length == 0) return; //skip if not table

            const joinedParties = parties.join(","); //join parties
            numbersMap.set(
               joinedParties,
               numbersMap.get(joinedParties)
                  ? [
                       ...numbersMap.get(joinedParties)!,
                       parseInt(tableId.slice(-2)),
                    ]
                  : [parseInt(tableId.slice(-2))]
            );
         });

         // set values
         numbersMap.forEach((tableNums, joinedParties) => {
            tableNums.sort((a, b) => a - b);
            const midIndex = Math.ceil((tableNums.length - 1) / 2);

            tableNums.forEach(() => {
               tableNums.forEach((num, index) => {
                  if (index === midIndex) {
                     //if index to print min at
                     newStatuses[`Table ${num}`] = getTableMinStatus(
                        tableMins[joinedParties],
                        true
                     );
                  } else {
                     newStatuses[`Table ${num}`] = getTableMinStatus(
                        tableMins[joinedParties],
                        false
                     );
                  }
               });
            });
         });
         return newStatuses;
      });
   };

   useEffect(() => {
      return () => {
         if (updateTimeout) {
            if (_DEBUG)
               console.log("[TableMins] Cleanup: clearing update timeout");
            clearTimeout(updateTimeout);
         }
      };
   }, []);

   const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (_DEBUG)
         console.log("[TableMins] Toggle changed:", event.target.checked);
      const startTime = performance.now();

      const isChecked = event.target.checked;
      const partyKey = parties.join(",");
      const newTableMins = { ...tableMins };

      if (isChecked) {
         newTableMins[partyKey] = {
            ...tableMins[partyKey], // Preserve existing values if they exist
            hasMin: true,
            // Set defaults only for missing fields
            ticketsPurchased: tableMins[partyKey]?.ticketsPurchased ?? false,
            contractAmount: tableMins[partyKey]?.contractAmount ?? "",
            contractSigned: tableMins[partyKey]?.contractSigned ?? false,
            payableBy: tableMins[partyKey]?.payableBy ?? "",
         };
      } else {
         newTableMins[partyKey] = {
            ...newTableMins[partyKey],
            hasMin: false,
         };
      }

      setTableMins(newTableMins);
      if (_DEBUG)
         console.log(
            "[TableMins] State update took:",
            performance.now() - startTime,
            "ms"
         );

      updateFirestoreTableMins(docRef, newTableMins, setWriting);
   };

   const partyKey = manualTableMinToRender
      ? tableMins[manualTableMinToRender]
         ? manualTableMinToRender
         : parties.join(",")
      : parties.join(",");
   const hasMin = tableMins[partyKey]?.hasMin ?? false;

   return (
      <>
         <div className={`section ${className}`}>
            <div className="absolute">
               <div className="header horz">
                  {header}
                  <div style={{ marginTop: "2px", marginLeft: "6px" }}>
                     <ToggleSwitch
                        checked={hasMin}
                        onChange={handleToggleChange}
                        disabled={parties.length === 0}
                     />
                  </div>
               </div>
               {hasMin ? <div className="vert-line" /> : <></>}
            </div>
            <div className={`content ${contentClass}`}>
               {hasMin ? (
                  <div className="min-vert">
                     <div className="label-wrapper">
                        <div className="min-label">Contract Amount:</div>
                        <input
                           type="text"
                           value={tableMins[partyKey]?.contractAmount || ""}
                           onChange={(e) => {
                              if (_DEBUG)
                                 console.log(
                                    "[TableMins] Contract amount changed"
                                 );
                              const startTime = performance.now();
                              const newTableMins = { ...tableMins };
                              newTableMins[partyKey] = {
                                 ...newTableMins[partyKey],
                                 contractAmount: e.target.value,
                              };
                              setTableMins(newTableMins);
                              if (_DEBUG)
                                 console.log(
                                    "[TableMins] Contract amount update took:",
                                    performance.now() - startTime,
                                    "ms"
                                 );
                              updateFirestoreTableMins(
                                 docRef,
                                 newTableMins,
                                 setWriting
                              );
                           }}
                           className="min-input"
                        />
                     </div>

                     <div className="label-wrapper">
                        <div className="min-label">Payable By:</div>
                        <input
                           type="text"
                           value={tableMins[partyKey]?.payableBy || ""}
                           onChange={(e) => {
                              if (_DEBUG)
                                 console.log("[TableMins] Payable by changed");
                              const startTime = performance.now();
                              const newTableMins = { ...tableMins };
                              newTableMins[partyKey] = {
                                 ...newTableMins[partyKey],
                                 payableBy: e.target.value,
                              };
                              setTableMins(newTableMins);
                              if (_DEBUG)
                                 console.log(
                                    "[TableMins] Payable by update took:",
                                    performance.now() - startTime,
                                    "ms"
                                 );
                              updateFirestoreTableMins(
                                 docRef,
                                 newTableMins,
                                 setWriting
                              );
                           }}
                           className="min-input"
                        />
                     </div>

                     <div className="label-wrapper">
                        <div className="min-label">Tickets Purchased</div>
                        <ToggleSwitch
                           checked={
                              tableMins[partyKey]?.ticketsPurchased || false
                           }
                           onChange={(e) => {
                              if (_DEBUG)
                                 console.log(
                                    "[TableMins] Tickets purchased changed"
                                 );
                              const startTime = performance.now();
                              const newTableMins = { ...tableMins };
                              newTableMins[partyKey] = {
                                 ...newTableMins[partyKey],
                                 ticketsPurchased: e.target.checked,
                              };
                              setTableMins(newTableMins);
                              if (_DEBUG)
                                 console.log(
                                    "[TableMins] Tickets purchased update took:",
                                    performance.now() - startTime,
                                    "ms"
                                 );
                              updateFirestoreTableMins(
                                 docRef,
                                 newTableMins,
                                 setWriting
                              );
                           }}
                        />
                     </div>

                     <div className="min-wrapper">
                        <div className="min-label">Contract Signed</div>
                        <ToggleSwitch
                           checked={
                              tableMins[partyKey]?.contractSigned || false
                           }
                           onChange={(e) => {
                              if (_DEBUG)
                                 console.log(
                                    "[TableMins] Contract signed changed"
                                 );
                              const startTime = performance.now();
                              const newTableMins = { ...tableMins };
                              newTableMins[partyKey] = {
                                 ...newTableMins[partyKey],
                                 contractSigned: e.target.checked,
                              };
                              setTableMins(newTableMins);
                              if (_DEBUG)
                                 console.log(
                                    "[TableMins] Contract signed update took:",
                                    performance.now() - startTime,
                                    "ms"
                                 );
                              updateFirestoreTableMins(
                                 docRef,
                                 newTableMins,
                                 setWriting
                              );
                           }}
                        />
                     </div>
                  </div>
               ) : (
                  <></>
               )}
            </div>
         </div>
      </>
   );
};

export default TableMins;

export const updateFirestoreTableMins = async (
   docRef: DocumentReference,
   newTableMins: TableMinsState,
   setWriting: React.Dispatch<React.SetStateAction<boolean>>,
   deleteMinKey?: string
): Promise<void> => {
   if (_DEBUG) console.log("[Firestore] Starting update process");
   console.time("firestoreUpdate");

   const newHash = hash(newTableMins);
   if (newHash === prevTableMinsHash) {
      if (_DEBUG) console.log("[Firestore] Update skipped - same hash");
      return;
   }

   setWriting(true);
   prevTableMinsHash = newHash;

   if (updateTimeout) {
      if (_DEBUG) console.log("[Firestore] Clearing previous timeout");
      clearTimeout(updateTimeout);
   }

   return new Promise((resolve) => {
      if (_DEBUG) console.log("[Firestore] Setting timeout for update");
      updateTimeout = setTimeout(async () => {
         try {
            if (_DEBUG) console.log("[Firestore] Preparing update data");
            const updateData = {
               ...(deleteMinKey && {
                  [`tableMins.${deleteMinKey}`]: deleteField(),
               }),
               ...Object.entries(newTableMins).reduce(
                  (acc, [key, value]) => ({
                     ...acc,
                     [`tableMins.${key}`]: value,
                  }),
                  {}
               ),
            };

            if (_DEBUG) console.log("[Firestore] Sending update to Firestore");
            const updateStart = performance.now();
            await updateDoc(docRef, updateData);
            if (_DEBUG)
               console.log(
                  "[Firestore] Update completed in:",
                  performance.now() - updateStart,
                  "ms"
               );

            setWriting(false);
            console.timeEnd("firestoreUpdate");
            resolve();
         } catch (error) {
            console.error("[Firestore] Error updating:", error);
            console.timeEnd("firestoreUpdate");
            setWriting(false);
            throw error;
         }
      }, 1000);
   });
};
