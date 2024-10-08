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
      // setState,
      // setAssigned,
      // setExtraChairs,
      // docRef,
      // firestoreLoaded,
   } = useSelected();
   console.log(state);

   return null;

   const [kSeats, setKSeats] = useState<Array<number>>([]);
   const bSeats = Array.from({ length: 14 }, (_, i) => 14 - i);

   const isFirstRender = useRef(true);

   // Create refs for all possible seats
   const kSeatRefs = useRef<Array<React.RefObject<HTMLDivElement>>>([]);
   const bSeatRefs = useRef(
      Array.from({ length: 14 }, () => React.createRef<HTMLDivElement>())
   );

   useEffect(() => {
      // Fetch initial count and set up listener
      const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
         if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            const count = data.kSeats || 16;
            setKSeats(Array.from({ length: count }, (_, i) => i + 1));

            // Ensure we have enough refs for all seats
            while (kSeatRefs.current.length < count) {
               kSeatRefs.current.push(React.createRef<HTMLDivElement>());
            }
         }
      });

      return () => unsubscribe();
   }, []);

   //ASSIGN REFS TO SEATS
   useEffect(() => {
      if (isFirstRender.current) {
         setState((prev) => {
            const newState = { ...prev };

            kSeats.forEach((id, index) => {
               newState[`Seat k${id}`] = {
                  ...newState[`Seat k${id}`],
                  ref: kSeatRefs.current[index],
               };
            });

            bSeats.forEach((id) => {
               newState[`Seat b${id}`] = {
                  ...newState[`Seat b${id}`],
                  ref: bSeatRefs.current[14 - id],
               };
            });

            return newState;
         });

         isFirstRender.current = false;
      } else {
         setState((prev) => {
            const newState = { ...prev };

            kSeats.forEach((id, index) => {
               newState[`Seat k${id}`] = {
                  ...newState[`Seat k${id}`],
                  ref: kSeatRefs.current[index],
               };
            });

            return newState;
         });
      }
   }, [kSeats, bSeats]);

   const addKitchenSeatHandler = async () => {
      await updateDoc(docRef, {
         kSeats: increment(1),
      });
   };

   let extraChairs = kSeats.length - 16;
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
                  {index === 0 && kSeats.length > 16 && (
                     <RemoveSeat
                        kSeats={kSeats}
                        setKSeats={setKSeats}
                        docRef={docRef}
                     />
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
                     displayNumber={14 - index}
                     ref={bSeatRefs.current[14 - num]}
                  />
               ))}
            </div>
         </div>
      </>
   );
};

export default Seats;
