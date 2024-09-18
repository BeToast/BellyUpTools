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

   const twentySix: number = 25;

   // KITCHEN --------------------------------------------------------------------------------------------
   if (hasKitchenSeats && !hasBathroomSeats) {
      linesJsx = (
         <React.Fragment>
            <LineDiv
               pointOne={{ x: relativeRight, y: setTop - twentySix }}
               pointTwo={{
                  x: relativeRight + 16,
                  y: centerY - 8 - twentySix,
               }}
            />
            <LineDiv
               pointOne={{
                  x: relativeRight - 2,
                  y: setBottom - twentySix,
               }}
               pointTwo={{
                  x: relativeRight + 16 - 2,
                  y: centerY + 8 - twentySix,
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
               pointOne={{ x: relativeLeft, y: setTop - twentySix }}
               pointTwo={{
                  x: centerX - 10,
                  y: setTop - 16 - twentySix,
               }}
            />
            <LineDiv
               pointOne={{
                  x: relativeRight - 2,
                  y: setTop - twentySix + 2,
               }}
               pointTwo={{
                  x: centerX + 10,
                  y: setTop - 16 - twentySix + 2,
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
                  y: setTop - twentySix,
               }}
               pointTwo={{
                  x: centerX + 12,
                  y: centerY - twentySix - 28,
               }}
            />
            <LineDiv
               pointOne={{
                  x: relativeRight - 2,
                  y: setBottom - seatHeight - twentySix + 2,
               }}
               pointTwo={{
                  x: centerX + 28 - 2,
                  y: centerY - twentySix - 12,
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
