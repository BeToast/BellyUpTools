import React, { useState, ChangeEvent } from "react";
import * as XLSX from "xlsx-js-style";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "./App.css";
import "../shared/firebase";

declare module "jspdf" {
   interface jsPDF {
      autoTable: (options: any) => jsPDF;
   }
}

interface RowData {
   First: string;
   Last: string;
   Delivery: string;
   QTY: number;
}

const App: React.FC = () => {
   const [data, setData] = useState<RowData[] | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);
   const [eventName, setEventName] = useState<string>("");
   const [fileName, setFileName] = useState<string>("");
   const [salesPacingText, setSalesPacingText] = useState<string>("");

   const extractEventName = (fileName: string): string => {
      const match = fileName.match(/BuyersReport_(.*?)\d{1,2}-\d{1,2}-\d{2,4}/);
      return match ? match[1].trim() : "Event";
   };

   const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setLoading(true);
      setError(null);
      setFileName(file.name);

      const extractedEventName = extractEventName(file.name);
      setEventName(extractedEventName);

      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
         try {
            const bstr = event.target?.result;
            const workbook = XLSX.read(bstr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet) as any[];

            const processedData: RowData[] = json
               .filter(
                  (row) =>
                     row["Ticket Type"]?.toString().toLowerCase() === "reserved"
               )
               .map((row) => ({
                  First: row.First?.toString() ?? "",
                  Last: row.Last?.toString() ?? "",
                  Delivery: row.Delivery?.toString() ?? "",
                  QTY: parseInt(row.QTY?.toString() ?? "0", 10) || 0,
               }));

            setData(processedData);
            setSalesPacingText(
               `Sales pacing information for ${extractedEventName}:\n[Your sales pacing logic here]`
            );
            setLoading(false);
         } catch (err) {
            console.error("Error processing file:", err);
            setError(
               "Error processing file. Please make sure it's a valid Excel file."
            );
            setLoading(false);
         }
      };

      reader.onerror = () => {
         setError("Error reading file. Please try again.");
         setLoading(false);
      };

      reader.readAsBinaryString(file);
   };

   const downloadPDF = () => {
      if (!data) return;

      const doc = new jsPDF({
         orientation: "portrait",
         unit: "mm",
         format: "a4",
      });

      doc.autoTable({
         head: [["First", "Last", "Delivery", "QTY"]],
         body: data.map((row) => [row.First, row.Last, row.Delivery, row.QTY]),
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
            3: { cellWidth: 20 },
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
      <div className="App">
         <h1>reportTools</h1>
         <div className="card">
            <h2>Res Buyers Report</h2>
            <input
               type="file"
               accept=".xls,.xlsx"
               onChange={handleFileUpload}
               className="file-input"
            />
            {fileName && <div className="file-name">File: {fileName}</div>}
            {loading && <p className="loading">Processing file...</p>}
            {error && <p className="error">{error}</p>}
            {data !== null && (
               <div>
                  {data.length > 0 ? (
                     <>
                        <p className="success">
                           {data.length} reserved tickets processed for:{" "}
                           {eventName}
                        </p>
                        <button onClick={downloadPDF}>Download PDF</button>
                        <button onClick={downloadXLSX}>Download XLSX</button>
                     </>
                  ) : (
                     <p className="info">
                        No reserved tickets for this show. Is it an all GA
                        event?
                     </p>
                  )}
               </div>
            )}
         </div>
         {salesPacingText && (
            <div className="sales-pacing">
               <h3>Sales Pacing</h3>
               <pre>{salesPacingText}</pre>
            </div>
         )}
      </div>
   );
};

export default App;
