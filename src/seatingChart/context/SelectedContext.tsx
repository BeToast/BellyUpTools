import React, {
   createContext,
   useContext,
   useState,
   useCallback,
   useEffect,
   useMemo,
} from "react";
import { arraysEqual, isArrayInArrayOfArrays } from "../utils/generic";
export interface recordValue {
   selected: boolean;
   assigned: Array<string>;
   ref: React.RefObject<HTMLDivElement>;
}

interface SelectedContextType {
   state: Record<string, recordValue>;
   selectedIds: Array<string>;
   unlinkedPartiesArray: Array<Array<Array<string>>>;
   partyLinks: Array<Array<Array<string>>>;
   parties: Array<string>;
   setParties: (parties: Array<string>) => void;
   partyOveride: boolean;
   extraChairs: number;
   setExtraChairs: (extraChairs: number) => void;
   setPartyOveride: (partyOveride: boolean) => void;
   // setVacant: (id: string) => void;
   setSelected: (id: string, selected: boolean) => void;
   selectGroup: (id: string) => void;
   deselectAll: () => void;
   setAssigned: (
      id: string,
      assigned: Array<string>,
      selected?: boolean,
      ref?: React.RefObject<HTMLDivElement>
   ) => void;
   removeAssigned: (id: string, party: string) => void;
   addPartyLink: (thisParty: Array<string>, linkedParty: Array<string>) => void;
   removePartyLink: (
      thisParty: Array<string>,
      index?: number
   ) => Array<string> | undefined;
}

const SelectedContext = createContext<SelectedContextType>({
   state: {},
   selectedIds: [],
   unlinkedPartiesArray: [],
   partyLinks: [],
   parties: [],
   setParties: () => {},
   partyOveride: true,
   extraChairs: 0,
   setExtraChairs: () => {},
   setPartyOveride: () => {},
   setSelected: () => {},
   selectGroup: () => {},
   deselectAll: () => {},
   setAssigned: () => {},
   removeAssigned: () => {},
   addPartyLink: () => {},
   removePartyLink: () => undefined,
});

interface SelectedProviderProps {
   children: React.ReactNode;
}

export const SelectedProvider: React.FC<SelectedProviderProps> = ({
   children,
}) => {
   const [state, setState] = useState<Record<string, recordValue>>({});

   const [selectedIds, setSelectedIds] = useState<Array<string>>([]);

   useEffect(
      () =>
         setSelectedIds(Object.keys(state).filter((id) => state[id].selected)),
      [state]
   );

   const [unlinkedPartiesArray, setUnlinkedPartiesArray] = useState<
      Array<Array<Array<string>>>
   >([]);
   const [partyLinks, setPartyLinks] = useState<Array<Array<Array<string>>>>(
      []
   );

   // the party list for this infoBox
   // updates the state onChange
   const [parties, setParties] = useState<Array<string>>([]);

   //when setPartyOverride is true, then whatever parties are in the InfoBox state will be assigned to the clicked selectable
   const [partyOveride, setPartyOveride] = useState<boolean>(false);
   const [extraChairs, setExtraChairs] = useState<number>(0);

   const updateUnlinkedPartiesArray = useCallback(() => {
      // Flatten partyLinks into a single array of all linked parties
      const linkedParties = partyLinks.flat(2);

      // Get all unique parties from state
      const allParties: Array<Array<string>> = [];

      Object.values(state).forEach((record) => {
         // Skip empty assigned arrays
         if (record.assigned.length === 0) {
            return;
         }
         // Check if this exact assigned array already exists in allParties
         const existingParty = allParties.find(
            (party) =>
               party.length === record.assigned.length &&
               party.every((item, index) => item === record.assigned[index])
         );

         // If it doesn't exist, add it to allParties
         if (!existingParty) {
            allParties.push([...record.assigned]);
         }
      });

      // Filter out parties that are in linkedParties
      const unlinkedParties = allParties.filter(
         (party) =>
            !linkedParties.some(
               (linkedParty) =>
                  party.length === linkedParty.length &&
                  party.every((item, index) => item === linkedParty[index])
            )
      );

      // Transform unlinkedParties into string[][][]
      const newUnlinkedPartiesArray = unlinkedParties.map((party) => [party]);

      // Update the state
      setUnlinkedPartiesArray(newUnlinkedPartiesArray);
   }, [state, partyLinks]);

   useEffect(() => {
      updateUnlinkedPartiesArray();
   }, [state, partyLinks, updateUnlinkedPartiesArray]);

   //copies the currently selected assignments to the newly selected.
   const setSelected = useCallback((id: string, selected: boolean) => {
      setState((prev) => {
         return {
            ...prev,
            [id]: {
               selected: selected,
               assigned: prev[id].assigned,
               ref: prev[id].ref,
            },
         };
      });
   }, []);

   const selectGroup = useCallback((id: string) => {
      setState((prev) => {
         const partyKeys: string[] = Object.keys(prev).filter(
            (currId: string) =>
               arraysEqual(prev[currId].assigned, prev[id].assigned)
         );

         return partyKeys.reduce(
            (newState, key) => {
               return {
                  ...newState,
                  [key]: {
                     ...prev[key],
                     selected: true,
                  },
               };
            },
            { ...prev }
         );
      });
   }, []);
   const deselectAll = useCallback(() => {
      setState((prev) => {
         const newState = { ...prev };
         Object.keys(newState).forEach((key) => {
            newState[key].selected = false;
         });
         return newState;
      });
   }, []);

   //sets the assigned value to the party array. and maybe a colour
   const setAssigned = useCallback(
      (
         id: string,
         newAssigned: Array<string>,
         newSelected?: boolean,
         newRef?: React.RefObject<HTMLDivElement>
      ) => {
         // const isAssigned: boolean = newAssigned.length > 0;

         setState((prev) => ({
            ...prev,
            [id]: {
               selected:
                  newSelected !== undefined ? newSelected : prev[id].selected,
               assigned: [...newAssigned],
               ref: newRef !== undefined ? newRef : prev[id].ref,
            },
         }));
      },
      []
   );

   //remove party from the assigned array.
   const removeAssigned = useCallback((id: string, partyToRemove: string) => {
      setState((prev) => {
         const currentItem = prev[id];
         const remainingAssigned = currentItem.assigned.filter(
            (party) => party !== partyToRemove
         );

         // Determine new state and color based on remaining assigned parties
         // const isStillAssigned: boolean = remainingAssigned.length > 0;

         // Return updated state
         return {
            ...prev,
            [id]: {
               selected: prev[id].selected,
               assigned: remainingAssigned,
               ref: prev[id].ref,
            },
         };
      });
   }, []);

   const addPartyLink = useCallback(
      (thisParty: string[], linkedParty: string[]) => {
         setPartyLinks((prev) => {
            const newLinks = [...prev];
            const relatedLinkIndices: number[] = [];

            // Find all related links
            newLinks.forEach((link, index) => {
               if (
                  link.some(
                     (party) =>
                        party.every(
                           (item, index) => item === thisParty[index]
                        ) ||
                        party.every(
                           (item, index) => item === linkedParty[index]
                        )
                  )
               ) {
                  relatedLinkIndices.push(index);
               }
            });

            if (relatedLinkIndices.length > 0) {
               // Merge all related links
               const mergedLink = relatedLinkIndices.reduce((acc, index) => {
                  return [...acc, ...newLinks[index]];
               }, [] as string[][]);

               // Add thisParty and linkedParty if they're not already in the mergedLink
               if (
                  !mergedLink.some((party) =>
                     party.every((item, index) => item === thisParty[index])
                  )
               ) {
                  mergedLink.push(thisParty);
               }
               if (
                  !mergedLink.some((party) =>
                     party.every((item, index) => item === linkedParty[index])
                  )
               ) {
                  mergedLink.push(linkedParty);
               }

               // Remove duplicates
               const uniqueMergedLink = mergedLink.filter(
                  (party, index, self) =>
                     index ===
                     self.findIndex((t) =>
                        t.every((item, i) => item === party[i])
                     )
               );

               // Remove old links and add the merged link
               relatedLinkIndices
                  .sort((a, b) => b - a)
                  .forEach((index) => newLinks.splice(index, 1));
               newLinks.push(uniqueMergedLink);
            } else {
               // If no related links found, create a new one
               newLinks.push([thisParty, linkedParty]);
            }

            return newLinks;
         });
      },
      []
   );

   //remove a specific party from the array of parties at index.
   const removePartyLink = useCallback(
      (thisParty: string[], index?: number): Array<string> | undefined => {
         var firstRemovedParty: Array<string> | undefined;
         setPartyLinks((prev) => {
            if (index == undefined) {
               index = prev.findIndex((link) =>
                  isArrayInArrayOfArrays(thisParty, link)
               );
            }
            // Check if the index is valid
            if (index < 0 || index >= prev.length) {
               console.error("Invalid index");
               return prev;
            }
            //store local copy of the array
            const updatedLinks = [...prev];
            //remove if 2 or less bc that means the link is gone
            if (prev[index].length <= 2) {
               const removedLink = updatedLinks.splice(index, 1)[0];
               firstRemovedParty = removedLink.find(
                  (party) => !arraysEqual(party, thisParty)
               );
            } else {
               //remove the party from the array
               const updatedParties = prev[index].filter(
                  (party) => !arraysEqual(party, thisParty)
               );
               firstRemovedParty = updatedParties[0];
               updatedLinks[index] = updatedParties;
            }
            return updatedLinks;
         });
         return firstRemovedParty;
      },
      []
   );

   const value: SelectedContextType = {
      state,
      selectedIds,
      unlinkedPartiesArray,
      partyLinks,
      parties,
      setParties,
      partyOveride,
      extraChairs,
      setExtraChairs,
      setPartyOveride,
      setSelected,
      selectGroup,
      deselectAll,
      setAssigned,
      removeAssigned,
      addPartyLink,
      removePartyLink,
   };

   return (
      <SelectedContext.Provider value={value}>
         {children}
      </SelectedContext.Provider>
   );
};

export const useSelected = (): SelectedContextType => {
   const context = useContext(SelectedContext);
   if (context === undefined) {
      throw new Error("useSelected must be used within a SelectedProvider");
   }
   return context;
};
