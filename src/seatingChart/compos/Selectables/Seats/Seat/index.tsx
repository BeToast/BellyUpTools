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
         setSelected,
         selectGroup,
         setAssigned,
         deselectAll,
         setParties,
         setPartyOveride,
         removePartyLink,
      } = useSelected();
      const seatId = `Seat ${id}`;
      const seatState = state[seatId];

      const seatClass = getElementClass(seatState);

      return (
         <>
            <div
               ref={ref}
               id={seatId}
               className={`seat ${seatClass} ${invis ? "invis" : ""}`}
               onClick={() =>
                  handleElementClick(
                     getElementSelectState(seatState),
                     seatId,
                     selectedIds,
                     getAssignments(seatId, state),
                     getOtherSelectedAssignments(state),
                     setSelected,
                     selectGroup,
                     deselectAll,
                     setAssigned,
                     setParties,
                     setPartyOveride,
                     removePartyLink
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
