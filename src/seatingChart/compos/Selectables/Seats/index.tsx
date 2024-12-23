// Seats.tsx
import React from "react";
import AddSeat from "./AddSeat";
import Seat from "./Seat";
import RemoveSeat from "./RemoveSeat";
import "./style.css";
import { useSelected } from "../../../context/SelectedContext";

const Seats = () => {
   const { state, extraChairs, setExtraChairs, setAssigned, firestoreLoaded } =
      useSelected();

   if (!firestoreLoaded) {
      return null;
   }

   const addKitchenSeatHandler = () => {
      setAssigned(
         `Seat k${-1 * extraChairs}`,
         [],
         false,
         React.createRef<HTMLDivElement>()
      );
      setExtraChairs(extraChairs + 1);
   };

   // Helper function to calculate display number
   const getDisplayNumber = (id: string, num: number): number => {
      if (id.startsWith("k")) {
         // Kitchen seats: Just show their actual number
         return num + extraChairs;
      } else if (id.startsWith("b")) {
         // Bathroom seats: Show number + 16 + extra seats
         return 31 + extraChairs - num;
      }
      return 0; // For invisible seats
   };

   var kSeatsEls: Array<React.ReactNode> = [];
   for (var kId = 1 - extraChairs; kId < 17; kId++) {
      kSeatsEls.push(
         <React.Fragment key={kId}>
            <Seat
               id={`k${kId}`}
               displayNumber={getDisplayNumber("k", kId)}
               ref={state[`Seat k${kId}`].ref}
            />
            {kId < 1 && <RemoveSeat />}
         </React.Fragment>
      );
   }

   var bSeatsEls: Array<React.ReactNode> = [];
   var bId = 14;
   while (state[`Seat b${bId}`]) {
      bSeatsEls.push(
         <React.Fragment key={bId}>
            <Seat
               id={`b${bId}`}
               displayNumber={getDisplayNumber("b", bId)}
               ref={state[`Seat b${bId}`].ref}
            />
         </React.Fragment>
      );
      bId--;
   }

   return (
      <>
         <div className="seat-col">
            <AddSeat addHandler={addKitchenSeatHandler} />
            <div style={{ height: "8px" }} />
            {kSeatsEls}
            <Seat
               id={"nope"}
               displayNumber={0}
               invis={true}
               ref={React.createRef<HTMLDivElement>()}
            />
            <div className="seat-row">
               <Seat
                  id={"nope"}
                  displayNumber={0}
                  invis={true}
                  ref={React.createRef<HTMLDivElement>()}
               />
               <Seat
                  id={"nope"}
                  displayNumber={0}
                  invis={true}
                  ref={React.createRef<HTMLDivElement>()}
               />
               {bSeatsEls}
            </div>
         </div>
      </>
   );
};

export default Seats;
