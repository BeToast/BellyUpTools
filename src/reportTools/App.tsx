import React, { useState, ChangeEvent } from "react";
import * as XLSX from "xlsx-js-style";
import "jspdf-autotable";
import "./App.css";
import "../shared/firebase";
import Pacing from "./compos/Pacing";
import ResBuyers from "./compos/ResBuyers";
import WalkUpPurchases from "./compos/WalkUpPurchases";
import BackButton from "../shared/BackButton";

declare module "jspdf" {
   interface jsPDF {
      autoTable: (options: any) => jsPDF;
   }
}

const App: React.FC = () => {
   // Separate states for buyers report
   const [buyersReportJson, setBuyersReportJson] = useState<any[]>([]);
   const [buyersReportLoading, setBuyersReportLoading] =
      useState<boolean>(false);
   const [buyersReportError, setBuyersReportError] = useState<string | null>(
      null
   );
   const [buyersReportFileName, setBuyersReportFileName] = useState<string>("");

   // Separate states for transactions report
   const [transactionsReportJson, setTransactionsReportJson] = useState<any[]>(
      []
   );
   const [transactionsReportLoading, setTransactionsReportLoading] =
      useState<boolean>(false);
   const [transactionsReportError, setTransactionsReportError] = useState<
      string | null
   >(null);
   const [transactionsReportFileName, setTransactionsReportFileName] =
      useState<string>("");

   // Shared states
   const [eventName, setEventName] = useState<string>("");
   const [eventDate, setEventDate] = useState<Date>(new Date());

   const extractEventName = (fileName: string): string => {
      const match = fileName.match(/BuyersReport_(.*?)\d{1,2}-\d{1,2}-\d{2,4}/);
      return match ? match[1].trim() : "Event";
   };

   const extractEventDate = (fileName: string): Date => {
      const match = fileName.match(/(\d{1,2})-(\d{1,2})-(\d{2,4})/);
      if (!match) {
         return new Date();
      }
      const [, month, day, year] = match;
      let dayNum = parseInt(day, 10);
      let monthNum = parseInt(month, 10) - 1;
      let yearNum = parseInt(year, 10);
      if (yearNum < 100) {
         yearNum += yearNum < 50 ? 2000 : 1900;
      }
      const date = new Date(yearNum, monthNum, dayNum);
      return isNaN(date.getTime()) ? new Date() : date;
   };

   const handleFileUpload =
      (fileType: "buyers" | "transactions") =>
      (e: ChangeEvent<HTMLInputElement>) => {
         const file = e.target.files?.[0];
         if (!file) return;

         const setLoading =
            fileType === "buyers"
               ? setBuyersReportLoading
               : setTransactionsReportLoading;
         const setError =
            fileType === "buyers"
               ? setBuyersReportError
               : setTransactionsReportError;
         const setFileName =
            fileType === "buyers"
               ? setBuyersReportFileName
               : setTransactionsReportFileName;
         const setJson =
            fileType === "buyers"
               ? setBuyersReportJson
               : setTransactionsReportJson;

         setLoading(true);
         setError(null);
         setFileName(file.name);

         // Only update event name and date for buyers report
         if (fileType === "buyers") {
            setEventName(extractEventName(file.name));
            setEventDate(extractEventDate(file.name));
         }

         const reader = new FileReader();

         reader.onload = (event: ProgressEvent<FileReader>) => {
            try {
               const bstr = event.target?.result;
               const workbook = XLSX.read(bstr, { type: "binary" });
               const sheetName = workbook.SheetNames[0];
               const worksheet = workbook.Sheets[sheetName];

               if (fileType === "transactions") {
                  // For transactions report, skip first two rows
                  const range = XLSX.utils.decode_range(
                     worksheet["!ref"] || "A1"
                  );
                  range.s.r = 2; // Start from row 3 (0-based index)
                  worksheet["!ref"] = XLSX.utils.encode_range(range);
               }

               setJson(XLSX.utils.sheet_to_json(worksheet) as any[]);
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

   return (
      <>
         <BackButton />
         <div className="horz-center">
            <div className="App">
               <div className="title-card">
                  <h1>BellyUp reportTools 📄</h1>
                  <p>
                     <span style={{ fontStyle: "italic" }}>instant </span>
                     Pacing, Res Buyers, and WalkUp Purchase Report
                  </p>
               </div>
               <div className="card">
                  <h2>Choose BuyersReport.xls to upload from your computer</h2>
                  <input
                     type="file"
                     accept=".xls,.xlsx"
                     onChange={handleFileUpload("buyers")}
                     className="file-input"
                  />
                  {buyersReportLoading && (
                     <p className="loading">Processing file...</p>
                  )}
                  {buyersReportError && (
                     <p className="error">{buyersReportError}</p>
                  )}
                  {buyersReportFileName && (
                     <p className="success">
                        Successfully Uploaded: {buyersReportFileName}
                     </p>
                  )}
               </div>
               <ResBuyers
                  json={buyersReportJson}
                  eventName={eventName}
                  eventDate={eventDate}
               />
               <Pacing
                  json={buyersReportJson}
                  eventName={eventName}
                  eventDate={eventDate}
               />

               <div className="card">
                  <h2>
                     Choose TransactionsReport.xls to upload from your computer
                  </h2>
                  <input
                     type="file"
                     accept=".xls,.xlsx"
                     onChange={handleFileUpload("transactions")}
                     className="file-input"
                  />
                  {transactionsReportLoading && (
                     <p className="loading">Processing file...</p>
                  )}
                  {transactionsReportError && (
                     <p className="error">{transactionsReportError}</p>
                  )}
                  {transactionsReportFileName && (
                     <p className="success">
                        Successfully Uploaded: {transactionsReportFileName}
                     </p>
                  )}
               </div>
               <WalkUpPurchases json={transactionsReportJson} />
            </div>
         </div>
      </>
   );
};

export default App;
