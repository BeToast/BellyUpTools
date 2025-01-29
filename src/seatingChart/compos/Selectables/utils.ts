import { RecordValue } from "../../context/SelectedContext";

export const getElementClass = (
   elementState: RecordValue | undefined
): string => {
   if (elementState) {
      if (elementState.selected) {
         if (elementState.assigned.length > 0) {
            return "selected ass";
         }
         return "selected";
      } else if (elementState.assigned.length > 0) {
         return "assigned";
      }
   }
   return "vacant";
};

export enum SelectState {
   VACANT,
   SELECTED,
   ASSIGNED,
   SELECTEDASSIGNED,
}
export const getElementSelectState = (
   elementState: RecordValue | undefined
): SelectState => {
   if (elementState) {
      if (elementState.selected) {
         if (elementState.assigned.length > 0) {
            return SelectState.SELECTEDASSIGNED;
         } else {
            return SelectState.SELECTED;
         }
      } else if (elementState.assigned.length > 0) {
         return SelectState.ASSIGNED;
      }
   }
   return SelectState.VACANT;
};

export const handleElementClick = (
   elementSelectState: SelectState,
   id: string,
   selectedIds: Array<string>,
   thisAssignments: string[],
   selectedAssignments: string[],
   setState: React.Dispatch<React.SetStateAction<Record<string, RecordValue>>>,
   setSelected: (id: string, selected: boolean) => void,
   selectGroup: (id: string) => void,
   deselectAll: () => void,
   setAssigned: (id: string, party: Array<string>) => void,
   updateInfoBoxParties: (parties: Array<string>) => void,
   setPartyOveride: (partyOveride: boolean) => void,
   removePartyLink: (
      thisParty: Array<string>,
      index?: number
   ) => Array<string> | undefined
   // setGoldberg: (id: string, goldberg: boolean) => void,
   // removeGoldberg: (id: string) => void
) => {
   if (elementSelectState === SelectState.VACANT) {
      if (selectedAssignments.length > 0) {
         //setState to assign partys to new selection and goldberg state
         setState((prev) => {
            const newState = {
               ...prev,
               [id]: {
                  selected: true,
                  goldberg: prev[selectedIds[0]].goldberg,
                  assigned: selectedAssignments,
                  ref: prev[id].ref,
               },
            };
            return newState;
         });
      } else {
         //if none selected. then ovveride with InfoBox party state
         setPartyOveride(true);
      }
      //update state to selected
      setSelected(id, true);
   } else if (elementSelectState === SelectState.SELECTED) {
      // deselect and remove assignments
      setState((prev) => {
         return {
            ...prev,
            [id]: {
               selected: false,
               goldberg: prev[id].goldberg,
               assigned: selectedAssignments,
               ref: prev[id].ref,
            },
         };
      });
   } else if (elementSelectState === SelectState.ASSIGNED) {
      deselectAll();
      // updateInfoBoxParties([]);]

      updateInfoBoxParties(thisAssignments);
      selectGroup(id);
   } else if (elementSelectState === SelectState.SELECTEDASSIGNED) {
      if (selectedIds.length < 2) {
         removePartyLink(thisAssignments);
      }

      //update assigned, goldberg, and selected
      setState((prev) => {
         const newState = {
            ...prev,
            [id]: {
               selected: false,
               goldberg: false,
               assigned: [],
               ref: prev[id].ref,
            },
         };
         return newState;
      });
   }
   document.getElementById("party-name-input")?.focus();
};

export const getAssignments = (
   id: string,
   state: Record<string, RecordValue>
): string[] => {
   return state[id].assigned;
};
export const getOtherSelectedAssignments = (
   state: Record<string, RecordValue>
): string[] => {
   const selectedId = Object.keys(state).find((id) => state[id].selected);
   //return assigned if another variable is selected
   return selectedId ? state[selectedId].assigned : [];
};

export type Lrtb = {
   left: number;
   right: number;
   top: number;
   bottom: number;
};

export const getLrtb: (elements: Element[]) => Lrtb = (elements: Element[]) => {
   let leftmost = Infinity;
   let rightmost = -Infinity;
   let topmost = Infinity;
   let bottommost = -Infinity;

   for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const rect = element.getBoundingClientRect();

      if (rect.left < leftmost) {
         leftmost = rect.left;
      }

      if (rect.right > rightmost) {
         rightmost = rect.right;
      }

      if (rect.top < topmost) {
         topmost = rect.top;
      }

      if (rect.bottom > bottommost) {
         bottommost = rect.bottom;
      }
   }

   return {
      left: leftmost,
      right: rightmost,
      top: topmost,
      bottom: bottommost,
   };
};
