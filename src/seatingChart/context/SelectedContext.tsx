import React, {
   createContext,
   useContext,
   useState,
   useCallback,
   useEffect,
   useRef,
} from "react";
import {
   arraysEqual,
   hash,
   hashRecord,
   isArrayInArrayOfArrays,
} from "../utils/generic";
import { DocumentReference, onSnapshot } from "firebase/firestore";
import { InputsState } from "../compos/Inputs";
import { createAssignedElementsRecord } from "../compos/OverlayPrinter/utils";
import {
   FlattenedPartyLink,
   reconstructPartyLinks,
} from "./PartyLinksToFirestore/utils";
export interface RecordValue {
   selected: boolean;
   assigned: Array<string>;
   ref: React.RefObject<HTMLDivElement>;
}

interface SelectedContextType {
   state: Record<string, RecordValue>;
   setState: React.Dispatch<React.SetStateAction<Record<string, RecordValue>>>;
   selectedIds: Array<string>;
   assignedElements: Record<string, Array<Element>>;
   extraChairs: number;
   setExtraChairs: React.Dispatch<React.SetStateAction<number>>;
   unlinkedPartiesArray: Array<Array<Array<string>>>;
   partyLinks: Array<Array<Array<string>>>;
   setPartyLinks: React.Dispatch<
      React.SetStateAction<Array<Array<Array<string>>>>
   >;
   parties: Array<string>;
   setParties: (parties: Array<string>) => void;
   partyOveride: boolean;
   setPartyOveride: (partyOveride: boolean) => void;
   // setVacant: (id: string) => void;
   setSelected: (id: string, selected: boolean) => void;
   selectGroup: (id: string) => void;
   deselectAll: () => void;
   setAssigned: (
      ids: string | string[],
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
   assignedState: Record<string, Array<string>>;
   prevAssignedStateHash: string;
   docRef: DocumentReference;
   docInputs: InputsState | undefined;
   setDocInputs: React.Dispatch<React.SetStateAction<InputsState | undefined>>;
   docState: [string, string[]][] | undefined;
   setDocState: React.Dispatch<
      React.SetStateAction<[string, string[]][] | undefined>
   >;
   firestoreLoaded: boolean;
   writing: boolean;
   setWriting: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectedContext = createContext<SelectedContextType>({
   state: {},
   setState: () => {},
   selectedIds: [],
   assignedElements: {},
   extraChairs: 0,
   setExtraChairs: () => {},
   unlinkedPartiesArray: [],
   partyLinks: [],
   setPartyLinks: () => {},
   parties: [],
   setParties: () => {},
   partyOveride: true,
   setPartyOveride: () => {},
   setSelected: () => {},
   selectGroup: () => {},
   deselectAll: () => {},
   setAssigned: () => {},
   removeAssigned: () => {},
   addPartyLink: () => {},
   removePartyLink: () => undefined,
   assignedState: {},
   prevAssignedStateHash: "",
   docRef: {} as DocumentReference,
   docState: undefined,
   setDocState: () => {},
   docInputs: undefined,
   setDocInputs: () => {},
   firestoreLoaded: false,
   writing: false,
   setWriting: () => {},
});

export const SelectedProvider: React.FC<{
   docRef: DocumentReference;
   children: React.ReactNode;
}> = ({ docRef, children }) => {
   const [docInputs, setDocInputs] = useState<InputsState | undefined>(
      undefined
   );
   const [docState, setDocState] = useState<[string, string[]][] | undefined>(
      undefined
   );

   const [firestoreLoaded, setFirestoreLoaded] = useState<boolean>(false);

   const prevHashRef = useRef({
      inputs: 0,
      state: 0,
      partyLinks: 0,
   });

   useEffect(() => {
      const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
         if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            if (data) {
               if (data.inputs) {
                  const newHash = hash(data.inputs);
                  if (newHash !== prevHashRef.current.inputs) {
                     setDocInputs(data.inputs);
                     prevHashRef.current.inputs = newHash;
                  }
               }

               if (data.state) {
                  const newState = Object.entries(data.state).filter(
                     ([_, value]) => Array.isArray(value)
                  ) as [string, string[]][];
                  const newHash = hash(newState);
                  if (newHash !== prevHashRef.current.state) {
                     setDocState(newState);
                     prevHashRef.current.state = newHash;
                  }
                  setExtraChairs(newState.length - 42);
               }

               if (data.partyLinks) {
                  const flattenedLinks =
                     data.partyLinks as FlattenedPartyLink[];
                  const reconstructedLinks =
                     reconstructPartyLinks(flattenedLinks);
                  const newHash = hash(reconstructedLinks);
                  if (newHash !== prevHashRef.current.partyLinks) {
                     setPartyLinks(reconstructedLinks);
                     prevHashRef.current.partyLinks = newHash;
                  }
               }
            }
         }
      });

      return () => unsubscribe();
   }, [docRef]);

   useEffect(() => {
      if (!docState) return;

      console.log("Processing updated docState");

      setState((prevState) => {
         const newState: Record<string, RecordValue> = { ...prevState };

         docState.forEach(([id, assigned]) => {
            newState[id] = {
               ...prevState[id], // Preserve existing properties
               assigned,
               selected: prevState[id]?.selected ?? false,
               ref: prevState[id]?.ref ?? React.createRef<HTMLDivElement>(),
            };
         });

         console.log("Updating local state with processed docState");
         return newState;
      });
      setFirestoreLoaded(true);
   }, [docState]);

   // const getDocRef = useCallback(() => {
   //    return doc(chartCollection, chartId)
   // }, [chartCollection, chartId]);

   const [state, setState] = useState<Record<string, RecordValue>>({});

   const [selectedIds, setSelectedIds] = useState<Array<string>>([]);
   const [assignedElements, setAssignedElements] = useState<
      Record<string, Array<Element>>
   >({});

   useEffect(() => {
      setSelectedIds(Object.keys(state).filter((id) => state[id].selected));
      setAssignedElements(createAssignedElementsRecord(state));
   }, [state]);

   const [extraChairs, setExtraChairs] = useState<number>(0);
   const [keyToRemove, setKeyToRemove] = useState<string | null>(null);

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

   const [assignedState, setAssignedState] = useState<
      Record<string, Array<string>>
   >({});
   const [prevAssignedStateHash, setPrevAssignedStateHash] =
      useState<string>("");
   const [writing, setWriting] = useState<boolean>(false);

   //this is to set assignedState when nessicary for firebase syncing
   useEffect(() => {
      // Compute the new assigned state
      const newAssignedState: Record<string, Array<string>> = {};

      for (const [key, value] of Object.entries(state)) {
         if (value.assigned) {
            newAssignedState[key] = value.assigned;
         }
      }
      // console.log("newAssignedState", newAssignedState);

      // Hash the new state
      const newStateHash = hashRecord(newAssignedState);

      // If the hash is different, update the state
      if (newStateHash !== prevAssignedStateHash) {
         setAssignedState(newAssignedState);
         setPrevAssignedStateHash(newStateHash);
      }
   }, [state]);

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
         ids: string | string[],
         newAssigned: Array<string>,
         newSelected?: boolean,
         newRef?: React.RefObject<HTMLDivElement>
      ) => {
         setState((prev) => {
            const updates: { [key: string]: any } = {};
            const idArray = Array.isArray(ids) ? ids : [ids];

            idArray.forEach((id) => {
               updates[id] = {
                  ...prev[id],
                  assigned: [...newAssigned],
                  ...(newSelected !== undefined && { selected: newSelected }),
                  ...(newRef !== undefined && { ref: newRef }),
               };
            });

            return { ...prev, ...updates };
         });
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
      setState,
      selectedIds,
      assignedElements,
      extraChairs,
      setExtraChairs,
      unlinkedPartiesArray,
      partyLinks,
      setPartyLinks,
      parties,
      setParties,
      partyOveride,
      setPartyOveride,
      setSelected,
      selectGroup,
      deselectAll,
      setAssigned,
      removeAssigned,
      addPartyLink,
      removePartyLink,
      assignedState,
      prevAssignedStateHash,
      docRef,
      docState,
      setDocState,
      docInputs,
      setDocInputs,
      firestoreLoaded,
      writing,
      setWriting,
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
