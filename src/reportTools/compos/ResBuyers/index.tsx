import React, { useState, ChangeEvent, useEffect } from "react";
import * as XLSX from "xlsx-js-style";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

declare module "jspdf" {
   interface jsPDF {
      autoTable: (options: any) => jsPDF;
   }
}

interface RowData {
   ID: string;
   First: string;
   Last: string;
   Email: string;
   Delivery: string;
   QTY: number;
}

const ResBuyers: React.FC<{
   json: any[];
   eventName: string;
   eventDate: Date;
}> = ({ json, eventName, eventDate }) => {
   if (json.length == 0) return <></>;

   const [data, setData] = useState<RowData[] | null>(null);

   useEffect(() => {
      setData(
         json
            .filter(
               (row) =>
                  row["Ticket Type"]?.toString().toLowerCase() === "reserved" &&
                  row["Status"]?.toString().toLowerCase() !== "cancelled"
            )
            .map((row) => ({
               ID: row["Order ID"]?.toString() ?? "",
               First: row["First"]?.toString() ?? "",
               Last: row["Last"]?.toString() ?? "",
               Email: row["Email"]?.toString() ?? "",
               Delivery: row["Delivery"]?.toString() ?? "",
               QTY: parseInt(row["QTY"]?.toString() ?? "0", 10) || 0,
            }))
      );
   }, [json]);

   const downloadPDF = () => {
      if (!data) return;

      const doc = new jsPDF({
         orientation: "portrait",
         unit: "mm",
         format: "a4",
      });

      doc.autoTable({
         head: [["Order ID", "First", "Last", "Email", "Delivery", "QTY"]],
         body: data.map((row) => [
            row.ID,
            row.First,
            row.Last,
            row.Email,
            row.Delivery,
            row.QTY,
         ]),
         styles: {
            fontSize: 10,
            cellPadding: 2,
            halign: "left",
         },
         headStyles: {
            fillColor: [200, 200, 200],
            textColor: 20,
            fontStyle: "bold",
            halign: "left",
         },
         margin: { top: 10, right: 10, bottom: 10, left: 10 },
         columnStyles: {
            0: { cellWidth: "auto" },
            1: { cellWidth: "auto" },
            2: { cellWidth: "auto" },
            3: { cellWidth: "auto" },
            4: { cellWidth: "auto" },
            5: { cellWidth: 20 },
         },
      });

      doc.save(`${eventName} - Buyers Report.pdf`);
   };

   const downloadXLSX = () => {
      if (!data) return;

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Reserved Tickets");
      XLSX.writeFile(workbook, `${eventName} - Buyers Report.xlsx`);
   };

   return (
      <>
         <div className="card">
            <h2>Reserved Buyers Report</h2>
            {data !== null &&
               (data.length > 0 ? (
                  <>
                     <p className="success">
                        {data.length} complete reserved purchases processed for:{" "}
                        {eventName} on {eventDate.toDateString()}
                     </p>
                     <div className="button-row">
                        <button onClick={downloadPDF}>Download PDF</button>
                        <button onClick={downloadXLSX}>Download XLSX</button>
                     </div>
                  </>
               ) : (
                  <p className="info">
                     No reserved tickets for this show. Is it an all GA event?
                  </p>
               ))}
         </div>
      </>
   );
};

export default ResBuyers;
