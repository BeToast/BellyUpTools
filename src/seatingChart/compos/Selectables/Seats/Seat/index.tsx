import { forwardRef } from "react";
import { useSelected } from "../../../../context/SelectedContext";
import {
   getAssignments,
   getElementClass,
   getElementSelectState,
   getOtherSelectedAssignments,
   handleElementClick,
} from "../../utils";
import "./style.css";

interface SeatProps {
   id: string;
   displayNumber: number;
   invis?: boolean;
}

const Seat = forwardRef<HTMLDivElement, SeatProps>(
   ({ id, displayNumber, invis = false }, ref) => {
      const {
         state,
         selectedIds,
         setState,
         setSelected,
         selectGroup,
         setAssigned,
         deselectAll,
         setParties,
         setPartyOveride,
         removePartyLink,
         // setGoldberg,
         // removeGoldberg,
      } = useSelected();
      const seatId = `Seat ${id}`;
      const seatState = state[seatId];

      const seatClass = getElementClass(seatState);

      return (
         <>
            <div
               ref={ref}
               id={seatId}
               className={`seat ${seatClass} ${invis ? "invis" : ""} ${
                  seatState?.goldberg ? "goldberg" : ""
               }`}
               onClick={() =>
                  handleElementClick(
                     getElementSelectState(seatState),
                     seatId,
                     selectedIds,
                     getAssignments(seatId, state),
                     getOtherSelectedAssignments(state),
                     setState,
                     setSelected,
                     selectGroup,
                     deselectAll,
                     setAssigned,
                     setParties,
                     setPartyOveride,
                     removePartyLink
                     // setGoldberg,
                     // removeGoldberg
                  )
               }
            >
               <div className="seat-id no-select">{displayNumber}</div>
            </div>
         </>
      );
   }
);

export default Seat;
