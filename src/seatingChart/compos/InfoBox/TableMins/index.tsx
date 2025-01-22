import React, { useState, useEffect } from "react";
import "./style.css";
import { deleteField, DocumentReference, updateDoc } from "firebase/firestore";
import { useSelected } from "../../../context/SelectedContext";
import ToggleSwitch from "../../../../shared/ToggleSwitch";
import { hash } from "../../../utils/generic";

export interface TableMinsState {
   [partyKey: string]: {
      hasMin: boolean;
      ticketsPurchased: boolean;
      contractAmount: string;
      contractSigned: boolean;
      payableBy: string;
   };
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

const TableMins: React.FC<TableMinsProps> = ({
   parties,
   className = "",
   contentClass = "",
   header = "Table Minimum",
   manualTableMinToRender = undefined,
}) => {
   const { docTableMins, docRef } = useSelected();
   const [tableMins, setTableMins] = useState<TableMinsState>(
      docTableMins || {}
   );

   useEffect(() => {
      if (docTableMins) {
         setTableMins(docTableMins);
      }
   }, [docTableMins]);

   useEffect(() => {
      return () => {
         if (updateTimeout) {
            clearTimeout(updateTimeout);
         }
      };
   }, []);

   const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      updateFirestoreTableMins(docRef, newTableMins);
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
                              const newTableMins = { ...tableMins };
                              newTableMins[partyKey] = {
                                 ...newTableMins[partyKey],
                                 contractAmount: e.target.value,
                              };
                              setTableMins(newTableMins);
                              updateFirestoreTableMins(docRef, newTableMins);
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
                              const newTableMins = { ...tableMins };
                              newTableMins[partyKey] = {
                                 ...newTableMins[partyKey],
                                 payableBy: e.target.value,
                              };
                              setTableMins(newTableMins);
                              updateFirestoreTableMins(docRef, newTableMins);
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
                              const newTableMins = { ...tableMins };
                              newTableMins[partyKey] = {
                                 ...newTableMins[partyKey],
                                 ticketsPurchased: e.target.checked,
                              };
                              setTableMins(newTableMins);
                              updateFirestoreTableMins(docRef, newTableMins);
                           }}
                        />
                     </div>

                     <div className="label-wrapper">
                        <div className="min-label">Contract Signed</div>
                        <ToggleSwitch
                           checked={
                              tableMins[partyKey]?.contractSigned || false
                           }
                           onChange={(e) => {
                              const newTableMins = { ...tableMins };
                              newTableMins[partyKey] = {
                                 ...newTableMins[partyKey],
                                 contractSigned: e.target.checked,
                              };
                              setTableMins(newTableMins);
                              updateFirestoreTableMins(docRef, newTableMins);
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
   deleteMinKey?: string
): Promise<void> => {
   const newHash = hash(newTableMins);
   if (newHash === prevTableMinsHash) return;
   prevTableMinsHash = newHash;

   if (updateTimeout) {
      clearTimeout(updateTimeout);
   }

   return new Promise((resolve) => {
      updateTimeout = setTimeout(async () => {
         try {
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

            await updateDoc(docRef, updateData);
            resolve();
         } catch (error) {
            console.error("Error updating Firestore:", error);
            throw error;
         }
      }, 1000);
   });
};
