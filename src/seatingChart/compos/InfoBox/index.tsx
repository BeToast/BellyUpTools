import "./style.css";
import { useSelected } from "../../context/SelectedContext";
import { useState, useEffect, useMemo, useCallback } from "react";
import RemoveParty from "./RemoveParty";
import LinkParty from "./LinkParty";
import { arraysEqual } from "../../utils/generic";
import InfoSection from "./InfoSection";
import PartyConnected from "./PartyConnected";

const InfoBox: React.FC<{}> = ({}) => {
   const {
      state,
      unlinkedPartiesArray,
      parties,
      setParties,
      partyOveride,
      setPartyOveride,
      setAssigned,
      setSelected,
      partyLinks,
      addPartyLink,
      removePartyLink,
   } = useSelected();

   //for forced re-render
   const [, updateState] = useState({});
   const forceUpdate = useCallback(() => updateState({}), []);
   useEffect(() => {
      forceUpdate();
   }, [parties, forceUpdate]);

   const selectedIds = useMemo(
      () => Object.keys(state).filter((id) => state[id].selected),
      [state]
   );

   const selectedCount: number = useMemo(
      () => selectedIds.length,
      [selectedIds]
   );

   const railCount = selectedIds.filter((selected) =>
      selected.startsWith("Seat ")
   ).length;
   // selectedIds.some((el) => el.id.match(/Seat k+\d/));
   const tableCount = selectedIds.filter((selected) =>
      selected.startsWith("Table ")
   ).length;

   // used for input fields
   const [partyName, setPartyName] = useState<string>("");
   const [partySize, setPartySize] = useState<number | undefined>(undefined);

   // syncs infoBox state with SelectedContext state
   useEffect(() => {
      //party ovverride boolean to populate parties when going from none selected
      if (partyOveride) {
         // selectedIds.forEach((id) => {
         //    setAssigned(id, parties);
         // });
         setAssigned(selectedIds, parties);
      } else {
         if (selectedCount > 0) {
            setParties(state[selectedIds[0]].assigned);
            setPartyOveride(true);
         }
      }
   }, [parties, selectedCount]);

   ///////////////////////////////////////////////////////
   // start LinkParty variables
   ///////////////////////////////////////////////////////

   //combined links and unlinked parties
   const combinedLinkOptions = useMemo((): Array<Array<Array<string>>> => {
      return [...partyLinks, ...unlinkedPartiesArray];
   }, [partyLinks, unlinkedPartiesArray]);

   //combined link options which do not include the current party
   const otherCombinedLinkOptions = useMemo(() => {
      return combinedLinkOptions.filter((linkOption) => {
         // Flatten the linkOption to check if it contains any of the currParties
         const flattenedLinkOption = linkOption.flat(1);

         // Check if none of the currParties are in the flattenedLinkOption
         return !parties.some((party) =>
            flattenedLinkOption.some((flattenedParty) =>
               flattenedParty.includes(party)
            )
         );
      });
   }, [combinedLinkOptions, parties]);

   //index of the links for this party in the partyLinks array
   const linkedArrayIndex = partyLinks.findIndex((link) =>
      link.some((party) => arraysEqual(parties, party))
   );

   ///////////////////////////////////////////////////////
   // end LinkParty variables
   ///////////////////////////////////////////////////////

   ///////////////////////////////////////////////////////
   // start connect/disconnect handlers
   ///////////////////////////////////////////////////////
   const connectHandler = (party: string) => {
      const newParties = [...parties];
      const index = newParties.indexOf(party);
      if (index !== -1) {
         newParties[index] = party.substring(1);
         setParties(newParties);
      }
   };

   const disconnectHandler = (party: string) => {
      const newParties = [...parties];
      const index = newParties.indexOf(party);
      if (index !== -1) {
         newParties[index] = `_${party}`;
         setParties(newParties);
      }
   };
   ///////////////////////////////////////////////////////
   // end connect/disconnect handlers
   ///////////////////////////////////////////////////////

   const addPartyHandler = (name: string, size: number | undefined): void => {
      const newParty = `${name.trim()}(${size ? size : 1})`;
      setPartyName(""); // Clear the input after adding
      setPartySize(undefined); // Reset party count

      var otherParty: Array<string> | undefined = undefined;
      const newParties = [...parties, newParty];
      if (linkedArrayIndex !== -1) {
         otherParty = removePartyLink(parties, linkedArrayIndex);
         if (otherParty) {
            addPartyLink(newParties, otherParty);
         }
      }
      setParties(newParties);
   };

   const removePartyHandler = (party: string) => {
      const newParties = parties.filter((p) => p !== party);

      //find index of linked parties
      const partyLinkIndex = partyLinks.findIndex((link) =>
         link.some((assigned) => arraysEqual(parties, assigned))
      );

      var otherParty: Array<string> | undefined = undefined;
      //if it is linked remove the link
      if (partyLinkIndex !== -1) {
         otherParty = removePartyLink(parties, partyLinkIndex);
         if (otherParty && newParties.length > 0) {
            addPartyLink(newParties, otherParty);
         }
      }
      //update state
      setParties(newParties);
   };

   const deselectHandler = () => {
      selectedIds.forEach((id) => setSelected(id, false));
      setParties([]);
      setPartyOveride(false);
   };

   const addPartyJsx = (
      <div className="party-input-wrapper">
         <div className="input-group">
            <input
               type="text"
               className="name-input"
               id="party-name-input"
               placeholder={
                  parties.length > 0 ? "Add another party" : "Enter party name"
               }
               value={partyName}
               onChange={(e) => setPartyName(e.target.value)}
               onKeyDown={(e) => {
                  if (e.key === "Enter") {
                     e.preventDefault();
                     const partySizeInput =
                        document.getElementById("party-size-input");
                     if (partySizeInput) {
                        partySizeInput.focus();
                     }
                  }
               }}
            />
            <input
               type="number"
               className="number-input"
               id="party-size-input"
               placeholder="1"
               value={partySize ? partySize : ""}
               onChange={(e) => {
                  const parsedValue = parseInt(e.target.value);
                  setPartySize(isNaN(parsedValue) ? undefined : parsedValue);
               }}
               onKeyDown={(e) => {
                  if (e.key === "Enter") {
                     e.preventDefault();
                     addPartyHandler(partyName, partySize);
                     const partyNameInput =
                        document.getElementById("party-name-input");
                     if (partyNameInput) {
                        partyNameInput.focus();
                     }
                  }
               }}
            />
            <button
               onClick={() => {
                  addPartyHandler(partyName, partySize);
               }}
               className="add-button"
            >
               Add
            </button>
         </div>
      </div>
   );

   return (
      <>
         <div className="info-wrap no-print">
            <div className="info-wrap-fixed">
               <div className="info-box">
                  {/* party list */}
                  <InfoSection header="Parties">
                     {parties.length > 0 ? (
                        <div className="parties">
                           {parties.map((party, index) => (
                              <div key={party} className="party-row">
                                 <RemoveParty
                                    party={party}
                                    removePartyHandler={() =>
                                       removePartyHandler(party)
                                    }
                                 />
                                 {parties.length > 1 ? (
                                    <PartyConnected
                                       party={party}
                                       connectHandler={() =>
                                          connectHandler(party)
                                       }
                                       disconnectHandler={() =>
                                          disconnectHandler(party)
                                       }
                                    />
                                 ) : (
                                    <></>
                                 )}
                                 <div key={index} className="party">
                                    {party.startsWith("_")
                                       ? party.substring(1)
                                       : party}
                                 </div>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <></>
                     )}

                     {/* add party box */}
                     {/* if has table or there is no assigned party then display add party box */}
                     {tableCount > 0 || parties.length == 0 ? (
                        addPartyJsx
                     ) : (
                        <></>
                     )}
                  </InfoSection>
                  {/* selected/assigned info */}
                  <InfoSection header="Seats">
                     <div className="selected-info">
                        <div>
                           {tableCount} : {tableCount > 1 ? "Tables" : "Table"}
                        </div>
                        <div>{railCount} : Rail</div>
                     </div>
                  </InfoSection>

                  {/* if there is things to be linked to */}
                  {parties.length > 0 &&
                  (otherCombinedLinkOptions.length > 0 ||
                     linkedArrayIndex > -1) &&
                  (tableCount > 0 || railCount > 0) ? ( // if there is a selected Selectable
                     <InfoSection header="Linked">
                        <LinkParty
                           currParties={parties}
                           linkedArrayIndex={linkedArrayIndex}
                           otherCombinedLinkOptions={otherCombinedLinkOptions}
                        />
                     </InfoSection>
                  ) : (
                     <></>
                  )}
                  {/* deselect */}
                  {selectedCount > 0 ? (
                     <button
                        onClick={deselectHandler}
                        className="deselect-button"
                     >
                        Done
                     </button>
                  ) : (
                     <></>
                  )}
               </div>
            </div>
         </div>
      </>
   );
};

export default InfoBox;
