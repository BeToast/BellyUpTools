import React, { useEffect, useRef } from "react";
import Table from "./Table";
import "./style.css";
import { useSelected } from "../../../context/SelectedContext";

const Tables = () => {
   const kTables: Array<number> = [10, 11, 12, 13, 14, 15];
   const bTables: Array<number> = [16, 17, 18, 19, 20, 21];

   const { setAssigned } = useSelected();

   // Create refs for all tables
   const kTableRefs = useRef(
      kTables.map(() => React.createRef<HTMLDivElement>())
   );
   const bTableRefs = useRef(
      bTables.map(() => React.createRef<HTMLDivElement>())
   );

   // TODO: this can be updated to just have a hardcoded start state.
   useEffect(() => {
      kTables.forEach((id, index) => {
         setAssigned(`Table ${id}`, [], false, kTableRefs.current[index]);
      });
      bTables.forEach((id, index) => {
         setAssigned(`Table ${id}`, [], false, bTableRefs.current[index]);
      });
   }, []);

   return (
      <div className="table-col">
         {kTables.map((num, index) => (
            <Table key={num} id={num} ref={kTableRefs.current[index]} />
         ))}
         <div className="table-row">
            {bTables.map((num, index) => (
               <Table key={num} id={num} ref={bTableRefs.current[index]} />
            ))}
         </div>
      </div>
   );
};

export default Tables;
