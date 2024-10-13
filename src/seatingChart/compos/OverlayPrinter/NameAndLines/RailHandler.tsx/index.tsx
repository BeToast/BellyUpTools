import React from "react";
import { getReturnJsx } from "..";
import { getLrtb, partyUnPound } from "../../utils";
import LineDiv from "../LineDiv";

const RailHandler: React.FC<{
   style?: React.CSSProperties;
   assigned?: string;
   elements: Element[];
   scrollTop: number;
   paperRect: DOMRect;
   flexieMargin: number;
   hasKitchenSeats: boolean;
   hasBathroomSeats: boolean;
   printName?: boolean;
   printLines?: boolean;
}> = ({
   style,
   assigned,
   elements,
   scrollTop,
   paperRect,
   flexieMargin,
   hasKitchenSeats,
   hasBathroomSeats,
   printName = true,
   printLines = true,
}) => {
   var linesJsx: JSX.Element = <></>;

   const railLrtb = getLrtb(elements);
   const assignedUnPounded = assigned ? partyUnPound(assigned) : undefined;
   //X
   const relativeLeft = railLrtb.left - paperRect.left;
   const relativeRight = railLrtb.right - paperRect.left;
   const centerX = (relativeLeft + relativeRight) / 2;
   //Y
   const setTop = railLrtb.top + scrollTop - flexieMargin;
   const setBottom = railLrtb.bottom + scrollTop - flexieMargin;
   const centerY = (setTop + setBottom) / 2;

   // KITCHEN --------------------------------------------------------------------------------------------
   if (hasKitchenSeats && !hasBathroomSeats) {
      linesJsx = (
         <React.Fragment>
            <LineDiv
               pointOne={{ x: relativeRight - 1, y: setTop - 1 }}
               pointTwo={{
                  x: relativeRight + 16,
                  y: centerY - 8,
               }}
            />
            <LineDiv
               pointOne={{
                  x: relativeRight - 3,
                  y: setBottom - 1,
               }}
               pointTwo={{
                  x: relativeRight + 16,
                  y: centerY + 8,
               }}
            />
         </React.Fragment>
      );
      style = {
         ...style,
         left: `${relativeRight + 12}px`,
         top: `${centerY + 4}px`,
         transform: "translateY(-50%) rotate(-30deg)",
         transformOrigin: "left",
      };
      return getReturnJsx({ style, assignedUnPounded, linesJsx });
   } // BATHROOM ----------------------------------------------------------------------------------------
   else if (!hasKitchenSeats && hasBathroomSeats) {
      linesJsx = (
         <React.Fragment>
            <LineDiv
               pointOne={{ x: relativeLeft - 1, y: setTop - 1 }}
               pointTwo={{
                  x: centerX - 10,
                  y: setTop - 16,
               }}
            />
            <LineDiv
               pointOne={{
                  x: relativeRight - 2,
                  y: setTop + 1,
               }}
               pointTwo={{
                  x: centerX + 10,
                  y: setTop - 16 + 1,
               }}
            />
         </React.Fragment>
      );
      style = {
         ...style,
         left: `${centerX - 10}px`,
         top: `${setTop - 4}px`,
         transform: "translateY(-100%) rotate(-30deg)",
         transformOrigin: "left",
      };
      return getReturnJsx({ style, assignedUnPounded, linesJsx });
   } // BOTH ------------------------------------------------------------------------------------------
   else if (hasKitchenSeats && hasBathroomSeats) {
      const seatRect = elements[0].getBoundingClientRect();
      const seatWidth = seatRect.width;
      const seatHeight = seatRect.height;

      linesJsx = (
         <React.Fragment>
            <LineDiv
               pointOne={{
                  x: relativeLeft + seatWidth,
                  y: setTop,
               }}
               pointTwo={{
                  x: centerX + 12,
                  y: centerY - 28,
               }}
            />
            <LineDiv
               pointOne={{
                  x: relativeRight - 1,
                  y: setBottom - seatHeight + 1,
               }}
               pointTwo={{
                  x: centerX + 28 - 1,
                  y: centerY - 12,
               }}
            />
         </React.Fragment>
      );
      style = {
         ...style,
         left: `${centerX + 12}px`,
         top: `${centerY - 15}px`,
         transform: "translateY(-60%) rotate(-30deg)",
         transformOrigin: "left",
      };
      return getReturnJsx({ style, assignedUnPounded, linesJsx });
   }
};

export default RailHandler;
