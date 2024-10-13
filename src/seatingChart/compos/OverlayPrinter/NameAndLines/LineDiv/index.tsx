import React from "react";
import "./style.css";
import { Point } from "jspdf";

interface LineProps {
   pointOne: Point;
   pointTwo: Point;
}

const LineDiv: React.FC<LineProps> = ({ pointOne, pointTwo }) => {
   // Calculate the length of the line
   const length = Math.sqrt(
      Math.pow(pointTwo.x - pointOne.x, 2) +
         Math.pow(pointTwo.y - pointOne.y, 2)
   );

   // Calculate the angle of the line
   const angle = Math.atan2(pointTwo.y - pointOne.y, pointTwo.x - pointOne.x);

   // Convert angle to degrees
   const degrees = angle * (180 / Math.PI);

   // Style for the line div
   const lineStyle: React.CSSProperties = {
      width: `${length}px`,
      transform: `translate(${pointOne.x}px, ${pointOne.y}px) rotate(${degrees}deg)`, // Translate and rotate the line
   };

   return <div className={"line"} style={lineStyle} />;
};

export default LineDiv;
