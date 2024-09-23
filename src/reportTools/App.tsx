import React, { useState, ChangeEvent } from "react";
import * as XLSX from "xlsx-js-style";
import "jspdf-autotable";
import "./App.css";
import "../shared/firebase";
import Pacing from "./compos/Pacing";
import ResBuyers from "./compos/ResBuyers";
import { dateFromString } from "./compos/Pacing/utils";

declare module "jspdf" {
   interface jsPDF {
      autoTable: (options: any) => jsPDF;
   }
}

const App: React.FC = () => {
   const [json, setJson] = useState<any[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);
   const [fileName, setFileName] = useState<string>("");
   const [eventName, setEventName] = useState<string>("");
   const [eventDate, setEventDate] = useState<Date>(new Date());

   const extractEventName = (fileName: string): string => {
      const match = fileName.match(/BuyersReport_(.*?)\d{1,2}-\d{1,2}-\d{2,4}/);
      return match ? match[1].trim() : "Event";
   };

   const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      //set App state
      setLoading(true);
      setError(null);
      setFileName(file.name);
      setEventName(extractEventName(file.name));
      setEventDate(dateFromString(file.name));

      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
         try {
            const bstr = event.target?.result;
            const workbook = XLSX.read(bstr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            setJson(
               XLSX.utils.sheet_to_json(worksheet, { raw: false }) as any[]
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

   return (
      <div className="horz-center">
         <div className="App">
            <div className="title-card">
               <h1>BellyUp reportTools 📄🛠️</h1>
               <p>
                  <span style={{ fontStyle: "italic" }}>instant </span>Pacing
                  and Res Buyers
               </p>
            </div>
            <div className="card">
               <h2>Choose BuyersReport.xls to upload from your computer</h2>
               <input
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={handleFileUpload}
                  className="file-input"
               />
               {loading && <p className="loading">Processing file...</p>}
               {error && <p className="error">{error}</p>}
               {fileName && (
                  <p className="success">Successfully Uploaded: {fileName}</p>
               )}
            </div>
            <ResBuyers
               json={json}
               eventName={eventName}
               eventDate={eventDate}
            />
            <Pacing json={json} eventName={eventName} eventDate={eventDate} />
         </div>
      </div>
   );
};

export default App;
