import React from "react";
import { getReturnJsx } from "..";
import { getLrtb, partyUnPound } from "../../utils";
import LineDiv from "../LineDiv";

const TableHandler: React.FC<{
   style?: React.CSSProperties;
   assigned?: string;
   elements: Element[];
   scrollTop: number;
   paperRect: DOMRect;
   flexieMargin: number;
   printName?: boolean;
   printLines?: boolean;
}> = ({
   style,
   assigned,
   elements,
   scrollTop,
   paperRect,
   flexieMargin,
   printName = true,
   printLines = true,
}) => {
   var linesJsx: JSX.Element = <></>;

   const tableLrtb = getLrtb(elements);
   const assignedUnPounded = assigned ? partyUnPound(assigned) : undefined;

   const tableLeft = tableLrtb.left - paperRect.left;
   const tableRight = tableLrtb.right - paperRect.left;
   const tableTop = tableLrtb.top + scrollTop - flexieMargin;
   const tableBottom = tableLrtb.bottom + scrollTop - flexieMargin;

   const tableCenterX = (tableLeft + tableRight) / 2;
   const tableCenterY = (tableTop + tableBottom) / 2;

   const tableNumbers = elements
      .filter((el) => el.id.startsWith("Table "))
      .map((el) => parseInt(el.id.split(" ")[1]));
   const onlyKitchenTables = tableNumbers.every(
      (num) => num >= 10 && num <= 16
   );
   const onlyBathroomTables = tableNumbers.every(
      (num) => num >= 16 && num <= 21
   );
   const onlyCornerTables =
      tableNumbers.some((num) => num >= 10 && num <= 16) &&
      tableNumbers.some((num) => num >= 16 && num <= 21);

   // ONE TABLE LOGIC -------------------------------------------------------------------------------------------
   if (elements.length == 1) {
      style = {
         ...style,
         left: `${tableCenterX}px`,
         top: `${tableCenterY}px`,
         transform: "translateX(-50%) translateY(-50%)",
      };
      return getReturnJsx({
         style,
         assignedUnPounded,
         linesJsx,
         singleLine: false,
      });
   }

   // KITCHEN TABLE LOGIC ----------------------------------------------------------------------------------------
   else if (onlyKitchenTables) {
      const kitchenTables = elements.filter((el) => el.id.startsWith("Table "));
      const sortedTables = kitchenTables.sort((a, b) => {
         const rectA = a.getBoundingClientRect();
         const rectB = b.getBoundingClientRect();
         return rectA.top - rectB.top;
      });

      const topTable = sortedTables[0];
      const bottomTable = sortedTables[sortedTables.length - 1];

      const topTableRect = topTable.getBoundingClientRect();
      const bottomTableRect = bottomTable.getBoundingClientRect();

      const tableRadius = topTableRect.height / 2;

      // Calculate points relative to the paper
      const topLeftX = topTableRect.left - paperRect.left;
      const topLeftY = topTableRect.top + scrollTop - flexieMargin;
      const topRightX = topTableRect.right - paperRect.left;
      const topRightY = topTableRect.top + scrollTop - flexieMargin;
      const bottomLeftX = bottomTableRect.left - paperRect.left;
      const bottomLeftY = bottomTableRect.top + scrollTop - flexieMargin;
      const bottomRightX = bottomTableRect.right - paperRect.left;
      const bottomRightY = bottomTableRect.top + scrollTop - flexieMargin;

      linesJsx = printLines ? (
         <React.Fragment>
            <LineDiv
               pointOne={{ x: topLeftX + 1, y: topLeftY + tableRadius }}
               pointTwo={{
                  x: bottomLeftX + 1,
                  y: bottomLeftY + tableRadius,
               }}
            />
            <LineDiv
               pointOne={{ x: topRightX - 1, y: topRightY + tableRadius }}
               pointTwo={{
                  x: bottomRightX - 1,
                  y: bottomRightY + tableRadius,
               }}
            />
         </React.Fragment>
      ) : (
         <></>
      );

      style = {
         ...style,
         left: `${tableCenterX}px`,
         top: `${tableCenterY}px`,
         transform: "translateX(-50%) translateY(-50%)",
      };

      return getReturnJsx({
         style,
         assignedUnPounded,
         linesJsx,
         singleLine: false,
      });
      // BATHROOM TABLE LOGIC ----------------------------------------------------------------------------------------
   } else if (onlyBathroomTables) {
      const kitchenTables = elements.filter((el) => el.id.startsWith("Table "));
      const sortedTables = kitchenTables.sort((a, b) => {
         const rectA = a.getBoundingClientRect();
         const rectB = b.getBoundingClientRect();
         return rectA.left - rectB.left;
      });

      const leftmostTable = sortedTables[0];
      const rightmostTable = sortedTables[sortedTables.length - 1];

      const leftmostTableRect = leftmostTable.getBoundingClientRect();
      const rightmostTableRect = rightmostTable.getBoundingClientRect();

      const tableRadius = leftmostTableRect.height / 2;

      // Calculate points relative to the paper
      const topLeftX = leftmostTableRect.left - paperRect.left;
      const topLeftY = leftmostTableRect.top + scrollTop - flexieMargin;
      const topRightX = rightmostTableRect.right - paperRect.left;
      const topRightY = rightmostTableRect.top + scrollTop - flexieMargin;
      const bottomLeftX = leftmostTableRect.left - paperRect.left;
      const bottomLeftY = leftmostTableRect.bottom + scrollTop - flexieMargin;
      const bottomRightX = rightmostTableRect.right - paperRect.left;
      const bottomRightY = rightmostTableRect.bottom + scrollTop - flexieMargin;

      linesJsx = printLines ? (
         <React.Fragment>
            <LineDiv
               pointOne={{ x: topLeftX + tableRadius, y: topLeftY }}
               pointTwo={{ x: topRightX - tableRadius, y: topRightY }}
            />
            <LineDiv
               pointOne={{
                  x: bottomLeftX + tableRadius,
                  y: bottomLeftY - 2,
               }}
               pointTwo={{
                  x: bottomRightX - tableRadius,
                  y: bottomRightY - 2,
               }}
            />
         </React.Fragment>
      ) : (
         <></>
      );

      style = {
         ...style,
         left: `${tableCenterX}px`,
         top: `${tableCenterY}px`,
         transform: "translateX(-50%) translateY(-50%)",
      };
      return getReturnJsx({
         style,
         assignedUnPounded,
         linesJsx,
         singleLine: false,
      });

      //CORNER TABLE LOGIC ----------------------------------------------------------------------------------------
   } else if (onlyCornerTables) {
      const cornerTables = elements.filter((el) => el.id.startsWith("Table "));
      const sortedTables = cornerTables.sort((a, b) => {
         const rectA = a.getBoundingClientRect();
         const rectB = b.getBoundingClientRect();
         return rectA.left - rectB.left || rectA.top - rectB.top;
      });

      const topLeftTable = sortedTables[0];
      const bottomRightTable = sortedTables[sortedTables.length - 1];

      const topLeftRect = topLeftTable.getBoundingClientRect();
      const bottomRightRect = bottomRightTable.getBoundingClientRect();

      const tableRadius = topLeftRect.height / 2;

      // Calculate points relative to the paper
      const topLeftX = topLeftRect.left - paperRect.left;
      const topLeftY = topLeftRect.top + scrollTop - flexieMargin;
      const bottomRightX = bottomRightRect.right - paperRect.left;
      const bottomRightY = bottomRightRect.bottom + scrollTop - flexieMargin;

      linesJsx = printLines ? (
         <React.Fragment>
            {/* Vertical line */}
            <LineDiv
               pointOne={{ x: topLeftX + 1, y: topLeftY + tableRadius }}
               pointTwo={{
                  x: topLeftX + 1,
                  y: bottomRightY - tableRadius,
               }}
            />
            {/* Horizontal line */}
            <LineDiv
               pointOne={{
                  x: topLeftX + tableRadius,
                  y: bottomRightY - 2,
               }}
               pointTwo={{
                  x: bottomRightX - tableRadius,
                  y: bottomRightY - 2,
               }}
            />
            {/* Diagonal line */}
            <LineDiv
               pointOne={{
                  x: topLeftX + tableRadius * 1.8,
                  y: topLeftY + tableRadius / 2.3,
               }}
               pointTwo={{
                  x: bottomRightX - tableRadius * 0.3,
                  y: bottomRightY - tableRadius / 0.59,
               }}
            />
         </React.Fragment>
      ) : (
         <></>
      );

      style = {
         ...style,
         left: `${topLeftX + 8}px`,
         top: `${tableCenterY}px`,
         transform: "translateY(-50%)",
      };
      return getReturnJsx({
         style,
         assignedUnPounded,
         linesJsx,
         singleLine: false,
      });
   }
};

export default TableHandler;
