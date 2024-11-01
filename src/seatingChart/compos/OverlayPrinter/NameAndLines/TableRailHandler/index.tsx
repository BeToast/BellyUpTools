import React from "react";
import { getReturnJsx } from "..";
import {
   findThirdPoint,
   getCenter,
   getLrtb,
   Lrtb,
   partyUnPound,
   Point,
} from "../../utils";
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

   const tables = elements
      .filter((el) => el.id.startsWith("Table "))
      .sort((a, b) => {
         const numA = parseInt(a.id.slice(6), 10);
         const numB = parseInt(b.id.slice(6), 10);
         return numA - numB;
      });

   const firstTableLrtb = getLrtb([tables.at(0)!]);

   const firstTableLeft = firstTableLrtb.left - paperRect.left;
   const firstTableRight = firstTableLrtb.right - paperRect.left;
   const firstTableTop = firstTableLrtb.top + scrollTop - flexieMargin;
   const firstTableBottom = firstTableLrtb.bottom + scrollTop - flexieMargin;

   const firstTableCenter: Point = {
      x: (firstTableLeft + firstTableRight) / 2 - 2,
      y: (firstTableTop + firstTableBottom) / 2 - 2,
   };

   const lastTableLrtb = getLrtb([tables.at(-1)!]);

   const lastTableLeft = lastTableLrtb.left - paperRect.left;
   const lastTableRight = lastTableLrtb.right - paperRect.left;
   const lastTableTop = lastTableLrtb.top + scrollTop - flexieMargin;
   const lastTableBottom = lastTableLrtb.bottom + scrollTop - flexieMargin;

   const lastTableCenter: Point = {
      x: (lastTableLeft + lastTableRight) / 2 - 2,
      y: (lastTableTop + lastTableBottom) / 2 - 2,
   };

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
      kRailTop = kRailLrtb.top + scrollTop - flexieMargin;
      kRailBottom = kRailLrtb.bottom + scrollTop - flexieMargin;

      if (printLines) {
         linesJsx = (
            <React.Fragment>
               <LineDiv
                  pointOne={findThirdPoint(
                     {
                        x: kRailLeft - 1,
                        y: kRailTop - 2,
                     },
                     firstTableCenter,
                     tableRadius,
                     false
                  )}
                  pointTwo={{
                     x: kRailLeft - 1,
                     y: kRailTop - 2,
                  }}
               />
               <LineDiv
                  pointOne={findThirdPoint(
                     {
                        x: kRailLeft,
                        y: kRailBottom,
                     },
                     lastTableCenter,
                     tableRadius,
                     true
                  )}
                  pointTwo={{
                     x: kRailLeft - 1,
                     y: kRailBottom - 3,
                  }}
               />
               {tables.length > 1 ? (
                  <LineDiv
                     pointOne={{
                        x: tableLeft + 1,
                        y: tableTop + tableRadius,
                     }}
                     pointTwo={{
                        x: tableLeft + 1,
                        y: tableBottom - tableRadius,
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
      bRailBottom = bRailLrtb.bottom + scrollTop - flexieMargin;

      linesJsx = (
         <React.Fragment>
            <LineDiv
               pointOne={findThirdPoint(
                  {
                     x: bRailLeft - 2,
                     y: bRailBottom,
                  },
                  firstTableCenter,
                  tableRadius,
                  false
               )}
               pointTwo={{
                  x: bRailLeft - 2,
                  y: bRailBottom,
               }}
            />
            <LineDiv
               pointOne={findThirdPoint(
                  {
                     x: bRailRight,
                     y: bRailBottom,
                  },
                  lastTableCenter,
                  tableRadius,
                  true
               )}
               pointTwo={{
                  x: bRailRight,
                  y: bRailBottom,
               }}
            />
            {tables.length > 1 ? (
               <LineDiv
                  pointOne={{
                     x: tableLeft + tableRadius,
                     y: tableBottom - 3,
                  }}
                  pointTwo={{
                     x: tableRight - tableRadius,
                     y: tableBottom - 3,
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
      kRailTop = kRailLrtb.top + scrollTop - flexieMargin;
      kRailBottom = kRailLrtb.bottom + scrollTop - flexieMargin;

      bRailLrtb = getLrtb(bathroomRail);
      bRailLeft = bRailLrtb.left - paperRect.left;
      bRailRight = bRailLrtb.right - paperRect.left - 2;
      bRailTop = bRailLrtb.top + scrollTop - flexieMargin;
      bRailBottom = bRailLrtb.bottom + scrollTop - flexieMargin;
      linesJsx = (
         <React.Fragment>
            <LineDiv
               pointOne={findThirdPoint(
                  {
                     x: kRailLeft,
                     y: kRailTop,
                  },
                  firstTableCenter,
                  tableRadius,
                  false
               )}
               pointTwo={{
                  x: kRailLeft - 1,
                  y: kRailTop - 1,
               }}
            />
            <LineDiv
               pointOne={findThirdPoint(
                  {
                     x: bRailRight,
                     y: bRailBottom,
                  },
                  lastTableCenter,
                  tableRadius,
                  true
               )}
               pointTwo={{
                  x: bRailRight,
                  y: bRailBottom - 2,
               }}
            />
            <LineDiv
               pointOne={{
                  x: tableLeft + 1,
                  y: tableTop + tableRadius,
               }}
               pointTwo={{
                  x: tableLeft + 1,
                  y: tableBottom - tableRadius,
               }}
            />
            <LineDiv
               pointOne={{
                  x: tableLeft + tableRadius,
                  y: tableBottom - 3,
               }}
               pointTwo={{
                  x: tableRight - tableRadius,
                  y: tableBottom - 3,
               }}
            />
            <LineDiv
               pointOne={{
                  x: kRailRight,
                  y: kRailTop - 2,
               }}
               pointTwo={{
                  x: bRailRight + 2,
                  y: bRailTop,
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
