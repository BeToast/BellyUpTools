import "./style.css";
import { useSelected } from "../../context/SelectedContext";
import { useState, useEffect, useCallback } from "react";
import { getColour } from "../../utils/colours";

const InfoBox: React.FC<{}> = ({}) => {
   const { state, setSelected, setAssigned, removeAssigned } = useSelected();
   const selectedIds = Object.keys(state).filter((id) => state[id].selected);

   const railCount = selectedIds.filter((selected) =>
      selected.startsWith("Seat ")
   ).length;
   // selectedIds.some((el) => el.id.match(/Seat k+\d/));
   const tableCount = selectedIds.filter((selected) =>
      selected.startsWith("Table ")
   ).length;

   const [partyName, setPartyName] = useState<string>("");
   const [partySize, setPartyCount] = useState<number>(1);
   const [parties, setParties] = useState<Array<string>>([]);

   const updateParties = useCallback(() => {
      const updatedParties = new Set<string>();
      selectedIds.forEach((id) => {
         if (state[id].assigned) {
            state[id].assigned.forEach((party: string) => {
               updatedParties.add(party);
            });
         }
      });
      const newParties = Array.from(updatedParties);
      if (JSON.stringify(newParties) !== JSON.stringify(parties)) {
         setParties(newParties);
      }
   }, [selectedIds, state, parties]);

   useEffect(() => {
      updateParties();
   }, [updateParties]);

   const addPartyHandler = (name: string, count: number): void => {
      const newParty = `${name.trim()}(${count})`;
      setPartyName(""); // Clear the input after adding
      setPartyCount(1); // Reset party count
      selectedIds.forEach((id) => {
         setAssigned(id, [...(state[id].assigned || []), newParty]);
      });
   };

   const selectedRemoveHandler = (selectedId: string) => {
      setSelected(selectedId, false);
   };

   const partyRemoveHandler = (party: string) => {
      selectedIds.forEach((id) => {
         removeAssigned(id, party);
      });
   };

   const deselectHandler = () => {
      selectedIds.forEach((id) => setSelected(id, false));
   };

   const addPartyJsx = (
      <>
         <p className="party-input-label">Enter name and size of party.</p>

         <div className="input-group">
            <input
               type="text"
               className="name-input"
               placeholder={
                  parties.length > 0 ? "Party Name" : "Add another party"
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
               onChange={(e) => {
                  const parsedValue = parseInt(e.target.value);
                  setPartyCount(isNaN(parsedValue) ? 1 : parsedValue);
               }}
               onKeyDown={(e) => {
                  if (e.key === "Enter") {
                     e.preventDefault();
                     addPartyHandler(partyName, partySize);
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
      </>
   );
   return (
      <>
         <div className="info-wrap no-print">
            <div className="info-box">
               {/* party list */}
               {parties.length > 0 ? (
                  <div className="parties">
                     {parties.map((party) => (
                        <div key={party} className="party">
                           {party}
                        </div>
                     ))}
                  </div>
               ) : (
                  <></>
               )}

               {/* add party box */}
               {/* if has table or there is no assigned party then display add party box */}
               <div>
                  {tableCount > 0 || parties.length == 0 ? addPartyJsx : <></>}
               </div>
               {/* selected/assigned info */}
               <div className="selected-info">
                  <div>{tableCount} : Tables</div>
                  <div>{railCount} : Rail</div>
               </div>
            </div>
         </div>
      </>
   );

   // return (
   //    <>
   //       <div className="info-wrap no-print">
   //          <div className="info-box">
   //             <div className="heading">
   //                {parties.map((party) => (
   //                   <span style={{ width: "100%" }}>{party}</span>
   //                ))}
   //             </div>

   //             <div style={{ width: "100%" }}>
   //                {selectedIds.length > 0 ? (
   //                   <>
   //                      <ul>
   //                         {selectedIds.map((id) => (
   //                            <li
   //                               onClick={() => selectedRemoveHandler(id)}
   //                               className="remove-hover selected-id"
   //                               key={id}
   //                            >
   //                               {id}
   //                            </li>
   //                         ))}
   //                      </ul>
   //                      <div>
   //                         <div className="heading">Parties at Selected</div>
   //                         <ul>
   //                            {parties.map((name, index) => (
   //                               <li
   //                                  onClick={() => partyRemoveHandler(name)}
   //                                  className="remove-hover"
   //                                  key={index}
   //                               >
   //                                  {name}
   //                               </li>
   //                            ))}
   //                         </ul>
   //                      </div>
   //
   //                      <button
   //                         onClick={deselectHandler}
   //                         className="deselect-button"
   //                      >
   //                         Deselect All
   //                      </button>
   //                   </>
   //                ) : (
   //                   <p>None selected</p>
   //                )}
   //             </div>
   //          </div>
   //       </div>
   //    </>
   // );
};

export default InfoBox;
