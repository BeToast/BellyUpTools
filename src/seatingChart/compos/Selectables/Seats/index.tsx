import React, { useEffect, useRef, useState } from "react";
import { onSnapshot, updateDoc, increment } from "firebase/firestore";

import AddSeat from "./AddSeat";
import Seat from "./Seat";
import RemoveSeat from "./RemoveSeat";
import "./style.css";
import { useSelected } from "../../../context/SelectedContext";

const Seats = () => {
   const {
      state,
      extraChairs,
      setExtraChairs,
      // setState,
      setAssigned,
      // docRef,
      firestoreLoaded,
   } = useSelected();

   if (!firestoreLoaded) {
      return null;
   }
   // let extraChairs = kSeats.length - 16;
   // if (extraChairs > -1) {
   //    setDocExtraChairs(extraChairs);
   // }

   const addKitchenSeatHandler = async () => {
      setAssigned(
         `Seat k${17 + extraChairs}`,
         [],
         false,
         React.createRef<HTMLDivElement>()
      );
      setExtraChairs(extraChairs + 1);
   };

   var kSeatsEls: Array<React.ReactNode> = [];
   for (var kId = 1 - extraChairs; kId < 17; kId++) {
      console.log(kId);
      // console.log(state[`Seat k${kId}`]);
      kSeatsEls.push(
         <React.Fragment key={kId}>
            <Seat
               id={`k${kId}`}
               displayNumber={kId + extraChairs}
               ref={state[`Seat k${kId}`].ref}
            />
            {kId < 1 && (
               <></>
               //TODO add remove seat
               // <RemoveSeat
               //    kSeats={kSeats}
               //    setKSeats={setKSeats}
               //    docRef={docRef}
               // />
            )}
         </React.Fragment>
      );
   }
   var bSeatsEls: Array<React.ReactNode> = [];
   var bId = 1;
   while (state[`Seat b${bId}`]) {
      bSeatsEls.push(
         <React.Fragment key={bId}>
            <Seat
               id={`b${bId}`}
               displayNumber={bId}
               ref={state[`Seat b${bId}`].ref}
            />
         </React.Fragment>
      );
      bId++;
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
