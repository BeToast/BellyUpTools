import React from "react";
import { getReturnJsx } from "..";
import { getLrtb, Lrtb, partyUnPound } from "../../utils";
import LineDiv from "../LineDiv";

const TableRailHandler: React.FC<{
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
   //kitchen rail varables
   let kRailLrtb: Lrtb,
      kRailLeft: number,
      kRailRight: number,
      kRailTop: number,
      kRailBottom: number;
   //barthroom rail varables
   let bRailLrtb: Lrtb,
      bRailLeft: number,
      bRailRight: number,
      bRailTop: number,
      bRailBottom: number;
   var linesJsx: JSX.Element = <></>;

   const tables = elements.filter((el) => el.id.startsWith("Table "));
   const kitchenRail = elements.filter((el) => el.id.match(/Seat k+\d/));
   const bathroomRail = elements.filter((el) => el.id.match(/Seat b+\d/));

   if (tables.length == 0) {
      throw new Error(
         "No tables found in TableRailHandler, component should not have been called"
      );
   }

   const tableLrtb = getLrtb(tables);
   const assignedUnPounded = assigned ? partyUnPound(assigned) : undefined;

   const tableLeft = tableLrtb.left - paperRect.left;
   const tableRight = tableLrtb.right - paperRect.left;
   const tableTop = tableLrtb.top + scrollTop - flexieMargin;
   const tableBottom = tableLrtb.bottom + scrollTop - flexieMargin;

   const tableCenterX = (tableLeft + tableRight) / 2;
   const tableCenterY = (tableTop + tableBottom) / 2;
   const tableRadius = tables[0].getBoundingClientRect().height / 2;

   //kitchen rail and tables
   if (kitchenRail.length > 0 && bathroomRail.length == 0) {
      kRailLrtb = getLrtb(kitchenRail);
      kRailLeft = kRailLrtb.left - paperRect.left;
      // kRailRight = kRailLrtb.right - paperRect.left;
      kRailTop = kRailLrtb.top + scrollTop - flexieMargin - 26;
      kRailBottom = kRailLrtb.bottom + scrollTop - flexieMargin - 26;

      if (printLines) {
         linesJsx = (
            <React.Fragment>
               <LineDiv
                  pointOne={{
                     x: tableLeft + tableRadius,
                     y: tableTop - 25,
                  }}
                  pointTwo={{
                     x: kRailLeft,
                     y: kRailTop + 1,
                  }}
               />
               <LineDiv
                  pointOne={{
                     x: tableLeft + tableRadius,
                     y: tableBottom - 27,
                  }}
                  pointTwo={{
                     x: kRailLeft,
                     y: kRailBottom - 1,
                  }}
               />
               {tables.length > 1 ? (
                  <LineDiv
                     pointOne={{
                        x: tableLeft + 1,
                        y: tableTop + 26,
                     }}
                     pointTwo={{
                        x: tableLeft + 1,
                        y: tableBottom - tableRadius - 26,
                     }}
                  />
               ) : (
                  <></>
               )}
            </React.Fragment>
         );
      }
      style = {
         //TODO: reposition this to make it visually distince trom only table handler
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
   } //bathroom rail and tables
   else if (kitchenRail.length == 0 && bathroomRail.length > 0) {
      bRailLrtb = getLrtb(bathroomRail);
      bRailLeft = bRailLrtb.left - paperRect.left;
      bRailRight = bRailLrtb.right - paperRect.left - 2;
      // bRailTop = bRailLrtb.top + scrollTop - flexieMargin - 26;
      bRailBottom = bRailLrtb.bottom + scrollTop - flexieMargin - 26;

      linesJsx = (
         <React.Fragment>
            <LineDiv
               pointOne={{
                  x: tableLeft - 1,
                  y: tableTop + tableRadius - 26,
               }}
               pointTwo={{
                  x: bRailLeft - 2,
                  y: bRailBottom,
               }}
            />
            <LineDiv
               pointOne={{
                  x: tableRight - 3,
                  y: tableTop + tableRadius - 26,
               }}
               pointTwo={{
                  x: bRailRight,
                  y: bRailBottom,
               }}
            />
            {tables.length > 1 ? (
               <LineDiv
                  pointOne={{
                     x: tableLeft + tableRadius,
                     y: tableBottom - 27,
                  }}
                  pointTwo={{
                     x: tableRight - tableRadius,
                     y: tableBottom - 27,
                  }}
               />
            ) : (
               <></>
            )}
         </React.Fragment>
      );
      style = {
         //TODO: reposition this to make it visually distince trom only table handler
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
   } //both kitchen and bathroom rail
   else if (kitchenRail.length > 0 && bathroomRail.length > 0) {
      kRailLrtb = getLrtb(kitchenRail);
      kRailLeft = kRailLrtb.left - paperRect.left;
      kRailRight = kRailLrtb.right - paperRect.left - 2;
      kRailTop = kRailLrtb.top + scrollTop - flexieMargin - 26;
      kRailBottom = kRailLrtb.bottom + scrollTop - flexieMargin - 26;

      bRailLrtb = getLrtb(bathroomRail);
      bRailLeft = bRailLrtb.left - paperRect.left;
      bRailRight = bRailLrtb.right - paperRect.left - 2;
      // bRailTop = bRailLrtb.top + scrollTop - flexieMargin - 26;
      bRailBottom = bRailLrtb.bottom + scrollTop - flexieMargin - 26;
      linesJsx = (
         <React.Fragment>
            <LineDiv
               pointOne={{
                  x: tableLeft + tableRadius,
                  y: tableTop - 26,
               }}
               pointTwo={{
                  x: kRailLeft,
                  y: kRailTop,
               }}
            />
            <LineDiv
               pointOne={{
                  x: tableRight - 2,
                  y: tableBottom - 26 - tableRadius,
               }}
               pointTwo={{
                  x: bRailRight,
                  y: bRailBottom,
               }}
            />
         </React.Fragment>
      );
      style = {
         //TODO: reposition this to make it visually distince trom only table handler
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
   } else if (kitchenRail.length == 0 && bathroomRail.length == 0) {
      throw new Error(
         "No rails seats in TableRailHandler, component should not have been called"
      );
   }
};

export default TableRailHandler;
