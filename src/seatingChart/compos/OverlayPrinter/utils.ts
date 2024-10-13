import { RecordValue } from "../../context/SelectedContext";
import { arraysEqual } from "../../utils/generic";

export interface Lrtb {
   left: number;
   right: number;
   top: number;
   bottom: number;
}

export interface Point {
   x: number;
   y: number;
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
   state: Record<string, RecordValue>
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

export const findThirdPoint = (
   seatPoint: Point,
   tableCenter: Point,
   tableRadius: number,
   isLeftTangent: boolean
): Point => {
   tableRadius--;
   // Vector from circle center to seat point
   const dx = seatPoint.x - tableCenter.x;
   const dy = seatPoint.y - tableCenter.y;

   // Distance from circle center to seat point
   const distance = Math.sqrt(dx * dx + dy * dy);

   // Angle between the line from circle center to seat point and the tangent line
   const angle = Math.acos(tableRadius / distance);

   // Determine rotation direction based on isLeftTangent
   const rotationAngle = isLeftTangent ? angle : -angle;

   // Rotate the vector from circle center to seat point
   const rotatedDx =
      dx * Math.cos(rotationAngle) - dy * Math.sin(rotationAngle);
   const rotatedDy =
      dx * Math.sin(rotationAngle) + dy * Math.cos(rotationAngle);

   // Scale the rotated vector to the circle's radius
   const scale =
      tableRadius / Math.sqrt(rotatedDx * rotatedDx + rotatedDy * rotatedDy);

   // Calculate the tangent point
   return {
      x: tableCenter.x + rotatedDx * scale,
      y: tableCenter.y + rotatedDy * scale,
   };
};

export const getCenter = (element: Element): Point => {
   const rect = element.getBoundingClientRect();
   return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
   };
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
