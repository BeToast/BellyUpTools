import React from "react";
import TableHandler from "./TableHandler/index.tsx";
import TableRailHandler from "./TableRailHandler/index.tsx";
import RailHandler from "./RailHandler.tsx/index.tsx";
import { styleBase } from "../utils.ts";

import "./style.css";

const NameAndLines: React.FC<{
   assigned?: string;
   elements?: Element[];
   assignedLink?: Array<string>;
   elementsLink?: Array<Array<Element>>;
   scrollTop: number;
   paperRect: DOMRect | null;
   flexieMargin: number;
}> = ({
   assigned,
   elements,
   assignedLink,
   elementsLink,
   scrollTop,
   paperRect,
   flexieMargin,
}) => {
   const _DEBUG = false;
   if (paperRect) {
      // handle singles
      if (assigned && elements) {
         const hasKitchenSeats = elements.some((el) =>
            el.id.match(/Seat k+\d/)
         );
         const hasBathroomSeats = elements.some((el) =>
            el.id.match(/Seat b+\d/)
         );
         const tableCount = elements.filter((el) =>
            el.id.startsWith("Table ")
         ).length;

         if (_DEBUG) {
            console.log("tableCount: ", tableCount);
            console.log("hasKitchenSeats: ", hasKitchenSeats);
            console.log("hasBathroomSeats: ", hasBathroomSeats);
         }

         let style: React.CSSProperties = styleBase;

         if (_DEBUG) console.log("paperRect: true");

         if (tableCount == 1 && !hasKitchenSeats && !hasBathroomSeats) {
            if (_DEBUG) console.log("one table");
            return (
               <TableHandler
                  style={style}
                  assigned={assigned}
                  elements={elements}
                  scrollTop={scrollTop}
                  paperRect={paperRect}
                  flexieMargin={flexieMargin}
               />
            );
         }

         if (tableCount > 1 && !hasKitchenSeats && !hasBathroomSeats) {
            return (
               <TableHandler
                  style={style}
                  assigned={assigned}
                  elements={elements}
                  scrollTop={scrollTop}
                  paperRect={paperRect}
                  flexieMargin={flexieMargin}
               />
            );
         } else if (tableCount > 0 && (hasKitchenSeats || hasBathroomSeats)) {
            if (_DEBUG) console.log("tables and rail");
            return (
               <TableRailHandler
                  style={style}
                  assigned={assigned}
                  elements={elements}
                  scrollTop={scrollTop}
                  paperRect={paperRect}
                  flexieMargin={flexieMargin}
               />
            );
         } else if (tableCount == 0 && (hasKitchenSeats || hasBathroomSeats)) {
            return (
               <RailHandler
                  style={style}
                  assigned={assigned}
                  elements={elements}
                  scrollTop={scrollTop}
                  paperRect={paperRect}
                  flexieMargin={flexieMargin}
                  hasKitchenSeats={hasKitchenSeats}
                  hasBathroomSeats={hasBathroomSeats}
               />
            );
         }
      }
      //handle link groups LINKS LINKS LINKS LINKS
      else if (assignedLink && elementsLink) {
         var combinedHasKitchenSeats: boolean = false;
         var combinedHasBathroomSeats: boolean = false;
         var combinedTableCount: number = 0;

         //what will be returned
         var outputJsx: Array<JSX.Element> = [];

         //for loop to iterate through both assignedLink and elementsLink array
         for (let i = 0; i < elementsLink.length; i++) {
            //this does not render the linked groups if there would be a undefined error
            if (elementsLink[i] === undefined) {
               elementsLink.splice(i, 1);
               i--; // Decrement i to account for the removed element
               continue;
            }
            //get hasKitchenSeats, hasBathroomSeats, and tableCount for this party.
            const hasKitchenSeats = elementsLink[i].some((el) =>
               el.id.match(/Seat k+\d/)
            );
            const hasBathroomSeats = elementsLink[i].some((el) =>
               el.id.match(/Seat b+\d/)
            );
            const tableCount = elementsLink[i].filter((el) =>
               el.id.startsWith("Table ")
            ).length;

            console.log(
               `el: ${elementsLink[i]}\nk: ${hasKitchenSeats}\nb: ${hasBathroomSeats}\nt: ${tableCount}`
            );

            //update linkedParties infos
            combinedHasKitchenSeats =
               combinedHasKitchenSeats || hasKitchenSeats; //or GATE
            combinedHasBathroomSeats =
               combinedHasBathroomSeats || hasBathroomSeats; //or GATE
            combinedTableCount += tableCount; // +=

            let style: React.CSSProperties = styleBase;

            // if (_DEBUG) console.log("paperRect: true");

            if (tableCount == 1 && !hasKitchenSeats && !hasBathroomSeats) {
               outputJsx.push(
                  <React.Fragment key={assignedLink[i]}>
                     <TableHandler
                        style={style}
                        assigned={assignedLink[i]}
                        elements={elementsLink[i]}
                        scrollTop={scrollTop}
                        paperRect={paperRect}
                        flexieMargin={flexieMargin}
                        printLines={false}
                     />
                  </React.Fragment>
               );
            }

            if (tableCount > 1 && !hasKitchenSeats && !hasBathroomSeats) {
               outputJsx.push(
                  <React.Fragment key={assignedLink[i]}>
                     <TableHandler
                        style={style}
                        assigned={assignedLink[i]}
                        elements={elementsLink[i]}
                        scrollTop={scrollTop}
                        paperRect={paperRect}
                        flexieMargin={flexieMargin}
                        printLines={false}
                     />
                  </React.Fragment>
               );
            } else if (
               tableCount > 0 &&
               (hasKitchenSeats || hasBathroomSeats)
            ) {
               console.log("table rail");
               outputJsx.push(
                  <React.Fragment key={assignedLink[i]}>
                     <TableRailHandler
                        style={style}
                        assigned={assignedLink[i]}
                        elements={elementsLink[i]}
                        scrollTop={scrollTop}
                        paperRect={paperRect}
                        flexieMargin={flexieMargin}
                        printLines={false}
                     />
                  </React.Fragment>
               );
            } else if (
               tableCount == 0 &&
               (hasKitchenSeats || hasBathroomSeats)
            ) {
               outputJsx.push(
                  <React.Fragment key={assignedLink[i]}>
                     <RailHandler
                        style={style}
                        assigned={assignedLink[i]}
                        elements={elementsLink[i]}
                        scrollTop={scrollTop}
                        paperRect={paperRect}
                        flexieMargin={flexieMargin}
                        hasKitchenSeats={hasKitchenSeats}
                        hasBathroomSeats={hasBathroomSeats}
                     />
                  </React.Fragment>
               );
            }
         }

         //// MAKE THEM LINES BB!!!! high energy coding
         if (
            combinedTableCount == 1 &&
            !combinedHasKitchenSeats &&
            !combinedHasBathroomSeats
         ) {
            outputJsx.push(
               <TableHandler
                  elements={elementsLink.flat()}
                  scrollTop={scrollTop}
                  paperRect={paperRect}
                  flexieMargin={flexieMargin}
               />
            );
         }

         if (
            combinedTableCount > 1 &&
            !combinedHasKitchenSeats &&
            !combinedHasBathroomSeats
         ) {
            outputJsx.push(
               <TableHandler
                  elements={elementsLink.flat()}
                  scrollTop={scrollTop}
                  paperRect={paperRect}
                  flexieMargin={flexieMargin}
               />
            );
         } else if (
            combinedTableCount > 0 &&
            (combinedHasKitchenSeats || combinedHasBathroomSeats)
         ) {
            console.log("table rail yuh");
            outputJsx.push(
               <TableRailHandler
                  elements={elementsLink.flat()}
                  scrollTop={scrollTop}
                  paperRect={paperRect}
                  flexieMargin={flexieMargin}
                  printLines={true}
               />
            );
         } else if (
            combinedTableCount == 0 &&
            (combinedHasKitchenSeats || combinedHasBathroomSeats)
         ) {
            //we dont do anything for only rails at the moment
            // outputJsx.push(
            //    <RailHandler
            //       elements={elementsLink.flat()}
            //       scrollTop={scrollTop}
            //       paperRect={paperRect}
            //       flexieMargin={flexieMargin}
            //       hasKitchenSeats={combinedHasKitchenSeats}
            //       hasBathroomSeats={combinedHasBathroomSeats}
            //    />
            // );
         }
         return outputJsx;
      }
   }
};
export default NameAndLines;

export const getReturnJsx = ({
   style = undefined,
   assignedUnPounded = undefined,
   linesJsx = <></>,
   singleLine = true,
}: {
   style?: React.CSSProperties;
   assignedUnPounded?: Array<string>;
   linesJsx?: JSX.Element;
   singleLine?: boolean;
}) => {
   var partyJsx: React.ReactNode = <></>;
   if (assignedUnPounded) {
      if (singleLine) {
         partyJsx = (
            <div className="party-name">{assignedUnPounded.join(" ")}</div>
         );
      } else {
         //put _'s first
         assignedUnPounded.sort((a, b) => {
            if (a.startsWith("_") && !b.startsWith("_")) {
               return -1; // a comes before b
            } else if (!a.startsWith("_") && b.startsWith("_")) {
               return 1; // b comes before a
            } else {
               return a.localeCompare(b); // alphabetical order for the rest
            }
         });
         partyJsx = assignedUnPounded.map((party, index) => {
            const isConnected: boolean = !party.startsWith("_");
            return (
               <>
                  <div key={index} className="party-name">
                     {isConnected ? party : party.substring(1)}
                  </div>
                  {isConnected ? <></> : <div className="party-divider" />}
               </>
            );
         });
      }
   }

   return (
      <React.Fragment>
         {assignedUnPounded ? <div style={style}>{partyJsx}</div> : <></>}
         {linesJsx}
      </React.Fragment>
   );
};
