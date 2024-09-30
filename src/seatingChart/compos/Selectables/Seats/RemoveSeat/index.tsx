import React from "react";
import { useSelected } from "../../../../context/SelectedContext";
import { xSvg } from "../../../../utils/svgs";
import Tooltip from "../../../Tooltip";
import "./style.css";
import { deleteField, updateDoc } from "firebase/firestore";

const RemoveSeat: React.FC = () => {
   const { setState, extraChairs, setExtraChairs, docRef } = useSelected();

   const removeSeatHandler = () => {
      setExtraChairs(extraChairs - 1);
      const removedKey = `Seat k${-1 * (extraChairs - 1)}`;
      updateDoc(docRef, {
         [`state.${removedKey}`]: deleteField(),
      });

      setState((prev) => {
         delete prev[removedKey];
         // Return the new object without the removed seat
         return prev;
      });
   };

   return (
      <div className="relative">
         <div onClick={removeSeatHandler} className="remove-wrapper">
            <Tooltip content={"Remove Seat 🪑"}>
               <div className="remove-seat">{xSvg}</div>
            </Tooltip>
         </div>
      </div>
   );
};

export default RemoveSeat;
