import React, { useEffect, useRef, useState } from "react";
import AddSeat from "./AddSeat";
import Seat from "./Seat";
import RemoveSeat from "./RemoveSeat";
import "./style.css";
import { useSelected } from "../../../context/SelectedContext";

const MAX_POSITIVE_K_SEATS = 16; // Default number of kitchen seats
const MAX_NEGATIVE_K_SEATS = 15; // Maximum number of additional seats
const MAX_B_SEATS = 14; // Number of bar seats

const Seats = () => {
   const [kSeats, setKSeats] = useState<Array<number>>(
      Array.from({ length: MAX_POSITIVE_K_SEATS }, (_, i) => i + 1)
   );
   const bSeats = Array.from(
      { length: MAX_B_SEATS },
      (_, i) => MAX_B_SEATS - i
   );

   const { state, setAssigned, setExtraChairs } = useSelected();

   const isFirstRender = useRef(true);

   // Create refs for all possible seats
   const kSeatRefs = useRef(
      Array.from({ length: MAX_POSITIVE_K_SEATS + MAX_NEGATIVE_K_SEATS }, () =>
         React.createRef<HTMLDivElement>()
      )
   );
   const bSeatRefs = useRef(
      Array.from({ length: MAX_B_SEATS }, () =>
         React.createRef<HTMLDivElement>()
      )
   );

   useEffect(() => {
      if (isFirstRender.current) {
         kSeats.forEach((id, index) => {
            setAssigned(`Seat k${id}`, [], false, kSeatRefs.current[index]);
         });
         bSeats.forEach((id) => {
            setAssigned(
               `Seat b${id}`,
               [],
               false,
               bSeatRefs.current[MAX_B_SEATS - id]
            );
         });
         isFirstRender.current = false;
      } else {
         kSeats.forEach((id, index) => {
            setAssigned(
               `Seat k${id}`,
               state[`Seat k${id}`]?.assigned || [],
               state[`Seat k${id}`]?.selected || false,
               kSeatRefs.current[index]
            );
         });
      }
   }, [kSeats]);

   const addKitchenSeatHandler = () => {
      const newSeatId = Math.min(...kSeats) - 1;
      if (kSeats.length < MAX_POSITIVE_K_SEATS + MAX_NEGATIVE_K_SEATS) {
         setKSeats((prevSeats) => [newSeatId, ...prevSeats]);
         setAssigned(`Seat k${newSeatId}`, [], false, kSeatRefs.current[0]);
      }
   };

   let extraChairs = kSeats.length - MAX_POSITIVE_K_SEATS;
   if (extraChairs > -1) {
      setExtraChairs(extraChairs);
   }

   return (
      <>
         <div className="seat-col">
            <AddSeat addHandler={addKitchenSeatHandler} />
            <div style={{ height: "8px" }} />
            {kSeats.map((num, index) => (
               <React.Fragment key={num}>
                  <Seat
                     id={`k${num}`}
                     displayNumber={index + 1}
                     ref={kSeatRefs.current[index]}
                  />
                  {index === 0 && num <= 0 && (
                     <RemoveSeat kSeats={kSeats} setKSeats={setKSeats} />
                  )}
               </React.Fragment>
            ))}
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
               {bSeats.map((num, index) => (
                  <Seat
                     key={num}
                     id={`b${num}`}
                     displayNumber={MAX_B_SEATS - index}
                     ref={bSeatRefs.current[MAX_B_SEATS - num]}
                  />
               ))}
            </div>
         </div>
      </>
   );
};

export default Seats;
