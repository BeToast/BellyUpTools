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
      setState,
      setSelected,
      setAssigned,
      selectGroup,
      deselectAll,
      setParties,
      setPartyOveride,
      removePartyLink,
      tableMinStatues,
      // setGoldberg,
      // removeGoldberg,
   } = useSelected();
   const tableId = `Table ${id}`;
   const tableState = state[tableId];

   const tableClass = getElementClass(tableState);

   // const [textRef, containerRef] = useTextFit(0.8);
   // const [textRef, containerRef] = useTextFit();

   const confirmedMin: string | undefined =
      tableMinStatues[tableId] == "INCOMPLETE" ||
      tableMinStatues[tableId] == "NONE" ||
      tableMinStatues[tableId] == "CONFIRMED"
         ? undefined
         : tableMinStatues[tableId];

   const confirmedMinClass: string = tableMinStatues[tableId]
      ? tableMinStatues[tableId] == "INCOMPLETE" ||
        tableMinStatues[tableId] == "NONE"
         ? tableMinStatues[tableId]
         : "CONFIRMED"
      : "";

   return (
      <div
         ref={ref}
         id={tableId}
         className={`table ${tableClass} ${confirmedMinClass} ${
            tableState?.goldberg ? "goldberg" : ""
         }`}
         onClick={() =>
            handleElementClick(
               getElementSelectState(tableState),
               tableId,
               selectedIds,
               getAssignments(tableId, state),
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
         {confirmedMin ? (
            // <div ref={containerRef} className="table-min-container">
            //    <div ref={textRef} className="table-min-text">
            //       <div>{confirmedMin}</div>
            //    </div>
            // </div>
            <div className="table-min">{confirmedMin}</div>
         ) : (
            <></>
         )}
         <div className="table-id no-select">{id}</div>
      </div>
   );
});

export default Table;
