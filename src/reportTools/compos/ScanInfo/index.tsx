import { useState } from "react";

const ScanInfo: React.FC<{ scanReportFileName: string; json: any[] }> = ({
   scanReportFileName,
   json,
}) => {
   const [supportStart, mainStart] = convertToMilitaryTime(scanReportFileName);

   const [openerStart, setOpenerStart] = useState<string>(supportStart);
   const [headlinerStart, setHeadlinerStart] = useState<string>(mainStart);

   if (!json || json.length === 0) {
      return null;
   }

   function convertToMilitaryTime(filename: string): [string, string] {
      // Extract the time portion using regex
      const timeMatch = filename.match(/(\d+)_(\d+)PM\.xls$/);

      if (!timeMatch) {
         return ["20:00", "21:00"];
      }

      let hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2];

      // Convert to 24-hour format
      if (hours !== 12) {
         hours += 12;
      }

      // Format with leading zeros
      const formattedHours = hours.toString().padStart(2, "0");
      const originalTime = `${formattedHours}:${minutes}`;

      // Calculate time + 1 hour
      const nextHour = (hours + 1) % 24;
      const incrementedTime = `${nextHour
         .toString()
         .padStart(2, "0")}:${minutes}`;

      return [originalTime, incrementedTime];
   }

   const matchTicketType = (row: any, type: string): boolean => {
      const ticketType = (row["TicketType"] || "").toString().toLowerCase();
      return ticketType.includes(type.toLowerCase());
   };

   const excelSerialToMinutes = (serial: number): number | null => {
      try {
         const time_part = serial % 1;
         const total_minutes = Math.round(time_part * 24 * 60) - 60;

         return total_minutes;
      } catch (error) {
         console.error("Error converting Excel serial:", serial, error);
         return null;
      }
   };

   const parseTimestamp = (timestamp: any): number | null => {
      try {
         // Handle Excel serial number
         if (typeof timestamp === "number") {
            return excelSerialToMinutes(timestamp);
         }
         return null;
      } catch (error) {
         console.error("Error parsing timestamp:", timestamp, error);
         return null;
      }
   };

   const countTypeBeforeTime = (data: any[], timeStr: string, type: string) => {
      if (!timeStr) return 0;
      const [hours, minutes] = timeStr.split(":").map(Number);
      const targetTime = hours * 60 + minutes;

      return data.filter((row) => {
         const timestamp = row["ScanTimestamp"];
         const rowTime = parseTimestamp(timestamp);

         if (rowTime === null) return false;

         // Compare minutes within the day
         const rowMinutesInDay = rowTime % (24 * 60);
         return rowMinutesInDay <= targetTime && matchTicketType(row, type);
      }).length;
   };

   const formatSection = (ga: number, res: number, vip: number) => {
      const parts = [];
      parts.push(`ga(${ga})`);
      if (res > 0) parts.push(`res(${res})`);
      if (vip > 0) parts.push(`vip(${vip})`);
      return parts.join(" ");
   };

   // Count totals
   const totalGa = json.filter((row) => matchTicketType(row, "general")).length;
   const totalRes = json.filter((row) =>
      matchTicketType(row, "reserved")
   ).length;
   const totalVip = json.filter((row) => matchTicketType(row, "vip")).length;
   // const totalScanned = totalGa + totalRes + totalVip;

   // Count at opener
   const openerGa = countTypeBeforeTime(json, openerStart, "general");
   const openerRes = countTypeBeforeTime(json, openerStart, "reserved");
   const openerVip = countTypeBeforeTime(json, openerStart, "vip");

   // Count at headliner
   const headlinerGa = countTypeBeforeTime(json, headlinerStart, "general");
   const headlinerRes = countTypeBeforeTime(json, headlinerStart, "reserved");
   const headlinerVip = countTypeBeforeTime(json, headlinerStart, "vip");

   return (
      <div className="card">
         <h2>TIX SCANNED</h2>
         <div className="mb-4 flex gap-4">
            <div>
               <label className="block text-sm font-medium mb-1">
                  Opener Start Time:
               </label>
               <input
                  type="time"
                  value={openerStart}
                  onChange={(e) => setOpenerStart(e.target.value)}
                  className="p-2 border rounded"
               />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1">
                  Headliner Start Time:
               </label>
               <input
                  type="time"
                  value={headlinerStart}
                  onChange={(e) => setHeadlinerStart(e.target.value)}
                  className="p-2 border rounded"
               />
            </div>
         </div>
         <pre style={{ whiteSpace: "pre-line" }}>
            {openerStart &&
               `AT SUPPORT: ${formatSection(openerGa, openerRes, openerVip)}\n`}
            {headlinerStart &&
               `AT MAIN: ${formatSection(
                  headlinerGa,
                  headlinerRes,
                  headlinerVip
               )}\n`}
            TOTAL SCANNED: {formatSection(totalGa, totalRes, totalVip)}
         </pre>
      </div>
   );
};

export default ScanInfo;
