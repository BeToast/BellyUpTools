import React from "react";
import "./style.css";

const WalkUpPurchases: React.FC<{
   json: any[];
   // eventName: string;
   // eventDate: Date;
}> = ({ json }) => {
   if (!json || json.length === 0) {
      return null;
   }

   // Calculate total cash transactions (Walk_Up with empty Card Brand)
   // console.log(json);
   // const cashTransactions = json.filter((row) =>
   //    console.log(row["Cart Source"])
   // );
   // console.log(cashTransactions.length);

   const cashTransactions = json.filter(
      (row) => row["Cart Source"] === "Walk_Up" && !row["Card Brand"]
   );
   const totalCash = cashTransactions.reduce(
      (sum, row) =>
         sum + (parseFloat(row["Cart Total"]?.toString() ?? "0") || 0),
      0
   );

   // Count General Admission tickets
   const gaCount = cashTransactions
      .filter((row) => row["Ticket Type"] === "General Admission")
      .reduce(
         (sum, row) => sum + (parseInt(row.QTY?.toString() ?? "0", 10) || 0),
         0
      );

   // Count Reserved tickets
   const resCount = cashTransactions
      .filter((row) => row["Ticket Type"] === "Reserved")
      .reduce(
         (sum, row) => sum + (parseInt(row.QTY?.toString() ?? "0", 10) || 0),
         0
      );

   console.log(totalCash);

   return (
      <div className="card">
         <h2>Walk-Up Purchase Analysis</h2>
         <div>
            <h3>Cash Transactions</h3>
            <p>Total Cash: ${totalCash.toFixed(2)}</p>
            <p>Number of Cash Transactions: {cashTransactions.length}</p>
         </div>
         <div>
            <h3>Ticket Types</h3>
            <p>General Admission: {gaCount}</p>
            <p>Reserved: {resCount}</p>
         </div>
      </div>
   );
};

export default WalkUpPurchases;
