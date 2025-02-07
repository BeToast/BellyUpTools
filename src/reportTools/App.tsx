import React, { useState, ChangeEvent, DragEvent } from "react";
import * as XLSX from "xlsx-js-style";
import "jspdf-autotable";
import "./App.css";
import "../shared/firebase";
import Pacing from "./compos/Pacing";
import ResBuyers from "./compos/ResBuyers";
import WalkUpPurchases from "./compos/WalkUpPurchases";
import BackButton from "../shared/BackButton";
import ScanInfo from "./compos/ScanInfo";

declare module "jspdf" {
   interface jsPDF {
      autoTable: (options: any) => jsPDF;
   }
}

const App: React.FC = () => {
   // Buyers report states
   const [buyersReportJson, setBuyersReportJson] = useState<any[]>([]);
   const [buyersReportLoading, setBuyersReportLoading] =
      useState<boolean>(false);
   const [buyersReportError, setBuyersReportError] = useState<string | null>(
      null
   );
   const [buyersReportFileName, setBuyersReportFileName] = useState<string>("");

   // Transactions report states
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

   // Scan report states
   const [scanReportJson, setScanReportJson] = useState<any[]>([]);
   const [scanReportLoading, setScanReportLoading] = useState<boolean>(false);
   const [scanReportError, setScanReportError] = useState<string | null>(null);
   const [scanReportFileName, setScanReportFileName] = useState<string>("");

   // Shared states
   const [eventName, setEventName] = useState<string>("");
   const [eventDate, setEventDate] = useState<Date>(new Date());

   const extractEventName = (fileName: string): string => {
      const match = fileName.match(/BuyersReport_(.*?)\d{1,2}-\d{1,2}-\d{2,4}/);
      return match ? match[1].trim() : "Event";
   };

   const extractEventDate = (fileName: string): Date => {
      const match = fileName.match(/(\d{1,2})-(\d{1,2})-(\d{2,4})/);
      if (!match) return new Date();

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

   const processFile = (
      file: File,
      fileType: "buyers" | "transactions" | "scan"
   ) => {
      const setLoading = {
         buyers: setBuyersReportLoading,
         transactions: setTransactionsReportLoading,
         scan: setScanReportLoading,
      }[fileType];

      const setError = {
         buyers: setBuyersReportError,
         transactions: setTransactionsReportError,
         scan: setScanReportError,
      }[fileType];

      const setFileName = {
         buyers: setBuyersReportFileName,
         transactions: setTransactionsReportFileName,
         scan: setScanReportFileName,
      }[fileType];

      const setJson = {
         buyers: setBuyersReportJson,
         transactions: setTransactionsReportJson,
         scan: setScanReportJson,
      }[fileType];

      setLoading(true);
      setError(null);
      setFileName(file.name);

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
               const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
               range.s.r = 2;
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

   const handleFileUpload =
      (fileType: "buyers" | "transactions" | "scan") =>
      (e: ChangeEvent<HTMLInputElement>) => {
         const file = e.target.files?.[0];
         if (file) processFile(file, fileType);
      };

   const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.currentTarget.classList.add("drag-over");
   };

   const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.currentTarget.classList.remove("drag-over");
   };

   const handleDrop =
      (fileType: "buyers" | "transactions" | "scan") =>
      (e: DragEvent<HTMLDivElement>) => {
         e.preventDefault();
         e.currentTarget.classList.remove("drag-over");

         const file = e.dataTransfer.files[0];
         if (
            file &&
            (file.name.endsWith(".xls") || file.name.endsWith(".xlsx"))
         ) {
            processFile(file, fileType);
         } else {
            const setError = {
               buyers: setBuyersReportError,
               transactions: setTransactionsReportError,
               scan: setScanReportError,
            }[fileType];
            setError("Please upload only Excel files (.xls or .xlsx)");
         }
      };

   const FileUploadCard = ({
      title,
      fileType,
      loading,
      error,
      fileName,
   }: {
      title: string;
      fileType: "buyers" | "transactions" | "scan";
      loading: boolean;
      error: string | null;
      fileName: string;
   }) => (
      <div
         className="card"
         onDragOver={handleDragOver}
         onDragLeave={handleDragLeave}
         onDrop={handleDrop(fileType)}
      >
         <h2>{title}</h2>
         <div className="drop-zone">
            <input
               type="file"
               accept=".xls,.xlsx"
               onChange={handleFileUpload(fileType)}
               className="file-input"
            />
            <p>Drag & drop your file here or click to browse</p>
         </div>
         {loading && <p className="loading">Processing file...</p>}
         {error && <p className="error">{error}</p>}
         {fileName && (
            <p className="success">Successfully Uploaded: {fileName}</p>
         )}
      </div>
   );

   return (
      <>
         <BackButton />
         <div className="horz-center">
            <div className="App">
               <div className="title-card">
                  <h1>BellyUp reportTools 📄</h1>
                  <p>
                     <span style={{ fontStyle: "italic" }}>instant </span>
                     Pacing, Res Buyers, WalkUp Purchases, and Scan Counts
                  </p>
               </div>

               <FileUploadCard
                  title="Choose BuyersReport.xls to upload from your computer"
                  fileType="buyers"
                  loading={buyersReportLoading}
                  error={buyersReportError}
                  fileName={buyersReportFileName}
               />

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

               <FileUploadCard
                  title="Choose TransactionsReport.xls to upload from your computer"
                  fileType="transactions"
                  loading={transactionsReportLoading}
                  error={transactionsReportError}
                  fileName={transactionsReportFileName}
               />

               <WalkUpPurchases json={transactionsReportJson} />

               <FileUploadCard
                  title="Choose ScanReport.xls to upload from your computer"
                  fileType="scan"
                  loading={scanReportLoading}
                  error={scanReportError}
                  fileName={scanReportFileName}
               />

               <ScanInfo
                  scanReportFileName={scanReportFileName}
                  json={scanReportJson}
               />
            </div>
         </div>
      </>
   );
};

export default App;
