import React from "react";
import { useSelected } from "../../../../context/SelectedContext";
import { xSvg } from "../../../../utils/svgs";
import Tooltip from "../../../Tooltip";
import "./style.css";

const RemoveSeat: React.FC = () => {
   const { setState, extraChairs, setExtraChairs } = useSelected();

   const removeSeatHandler = () => {
      setExtraChairs(extraChairs - 1);
      setState((prev) => {
         delete prev[`Seat k${-1 * (extraChairs - 1)}`];
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
