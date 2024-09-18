import { forwardRef } from "react";
import { useSelected } from "../../../../context/SelectedContext";
import {
   getElementClass,
   handleElementClick,
   getOtherSelectedAssignments,
   getElementSelectState,
   getAssignments,
} from "../../utils";
import "./style.css";

interface TableProps {
   id: number;
}

const Table = forwardRef<HTMLDivElement, TableProps>(({ id }, ref) => {
   const {
      state,
      selectedIds,
      setSelected,
      setAssigned,
      selectGroup,
      deselectAll,
      setParties,
      setPartyOveride,
      removePartyLink,
   } = useSelected();
   const tableId = `Table ${id}`;
   const tableState = state[tableId];

   const tableClass = getElementClass(tableState);

   return (
      <div
         ref={ref}
         id={tableId}
         className={`table ${tableClass}`}
         onClick={() =>
            handleElementClick(
               getElementSelectState(tableState),
               tableId,
               selectedIds,
               getAssignments(tableId, state),
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
         <div className="table-id no-select">{id}</div>
      </div>
   );
});

export default Table;
