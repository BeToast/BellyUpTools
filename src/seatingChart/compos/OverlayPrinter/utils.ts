import { recordValue } from "../../context/SelectedContext";
import { arraysEqual } from "../../utils/generic";

export interface Lrtb {
   left: number;
   right: number;
   top: number;
   bottom: number;
}

export function getLrtb(elements: Element[]): Lrtb {
   const rects = elements.map((el) => el.getBoundingClientRect());
   return {
      left: Math.min(...rects.map((r) => r.left)),
      right: Math.max(...rects.map((r) => r.right)),
      top: Math.min(...rects.map((r) => r.top)),
      bottom: Math.max(...rects.map((r) => r.bottom)),
   };
}

export function createAssignedElementsRecord(
   state: Record<string, recordValue>
): Record<string, Array<Element>> {
   //make a set for each unique assigned value
   const uniqueAssigned = new Set<string>();
   Object.values(state).forEach((item) => {
      // item.assigned.forEach((value) => uniqueAssigned.add(value));
      uniqueAssigned.add(item.assigned.join("£"));
   });

   //create a record with party as key and dom seats as values
   const result: Record<string, Array<Element>> = {};
   uniqueAssigned.forEach((assignedValue) => {
      const elements: Element[] = [];
      Object.entries(state).forEach(([id, item]) => {
         if (arraysEqual(item.assigned, assignedValue.split("£"))) {
            const element = document.getElementById(id);
            if (element) {
               elements.push(element);
            }
         }
      });
      if (elements.length > 0) {
         result[assignedValue] = elements;
      }
   });

   return result;
}

export const partyPound = (parties: Array<string>) => {
   return parties.join("£");
};
export const partyUnPound = (partyPound: string): Array<string> => {
   return partyPound.split("£");
};

export const styleBase: React.CSSProperties = {
   position: "absolute",
   margin: 0,
   color: "black",
   zIndex: 30,
   // backgroundColor: "transparent",
   // padding: "4px 8px",
   // borderRadius: "8px",
   pointerEvents: "none",
   fontSize: "15px",
   backgroundColor: "transparent",
   display: "flex",
   flexDirection: "column",
   alignItems: "center",
};
