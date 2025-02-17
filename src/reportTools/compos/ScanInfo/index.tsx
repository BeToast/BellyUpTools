import { useEffect, useState } from "react";

const ScanInfo: React.FC<{ scanReportFileName: string; json: any[] }> = ({
   scanReportFileName,
   json,
}) => {
   const [openerStart, setOpenerStart] = useState<string>("20:00");
   const [headlinerStart, setHeadlinerStart] = useState<string>("21:00");

   // Filter for scanned tickets only
   const scannedData = json.filter(row => row["Scanned"] == "1");
   const unscannedData = json.filter(row => row["Scanned"] == "0");

   useEffect(() => {
      const [supportStart, mainStart] =
         convertToMilitaryTime(scanReportFileName);
      setOpenerStart(supportStart);
      setHeadlinerStart(mainStart);
   }, [scanReportFileName]);

   if (!scannedData || scannedData.length === 0) {
      return null;
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
      const gaPercent = totalSoldGa > 0 ? Math.round((ga / totalSoldGa) * 100) : 0;
      const resPercent = totalSoldRes > 0 ? Math.round((res / totalSoldRes) * 100) : 0;
      const vipPercent = totalSoldVip > 0 ? Math.round((vip / totalSoldVip) * 100) : 0;

      parts.push(`ga(${ga}, ${gaPercent}%)`);
      if (res > 0) parts.push(`res(${res}, ${resPercent}%)`);
      if (vip > 0) parts.push(`vip(${vip}, ${vipPercent}%)`);
      return parts.join(" ");
   };

   // Count totals using scannedData
   const totalGa = scannedData.filter((row) => matchTicketType(row, "general")).length;
   const totalRes = scannedData.filter((row) =>
      matchTicketType(row, "reserved")
   ).length;
   const totalVip = scannedData.filter((row) => matchTicketType(row, "vip")).length;

   // Count at opener using scannedData
   const openerGa = countTypeBeforeTime(scannedData, openerStart, "general");
   const openerRes = countTypeBeforeTime(scannedData, openerStart, "reserved");
   const openerVip = countTypeBeforeTime(scannedData, openerStart, "vip");

   // Count at headliner using scannedData
   const headlinerGa = countTypeBeforeTime(scannedData, headlinerStart, "general");
   const headlinerRes = countTypeBeforeTime(scannedData, headlinerStart, "reserved");
   const headlinerVip = countTypeBeforeTime(scannedData, headlinerStart, "vip");

   // no show
   const noShowGa = unscannedData.filter((row) => matchTicketType(row, "general")).length;
   const noShowRes = unscannedData.filter((row) =>
      matchTicketType(row, "reserved")
   ).length;
   const noShowVip = unscannedData.filter((row) => matchTicketType(row, "vip")).length;

   // total sold
   const totalSoldGa = totalGa + noShowGa;
   const totalSoldRes = totalRes + noShowRes;
   const totalSoldVip = totalVip + noShowVip;

   return (
      <div className="card sub">
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
         <pre style={{ whiteSpace: "pre" }}>
            {openerStart &&
               `        AT SUPPORT: ${formatSection(openerGa, openerRes, openerVip)}\n`}
            {headlinerStart &&
               `                AT MAIN: ${formatSection(
                  headlinerGa,
                  headlinerRes,
                  headlinerVip
               )}\n`}
            {`TOTAL SCANNED: ${formatSection(totalGa, totalRes, totalVip) + "\n"}`}
            {`            NO SHOW: ${formatSection(noShowGa, noShowRes, noShowVip)}`}
         </pre>
      </div>
   );
};

export default ScanInfo;

function convertToMilitaryTime(filename: string): [string, string] {
   // Extract the time portion using regex
   const timeMatch = filename.match(/.*?(\d+)_(\d+)PM\.xls$/);

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
   const incrementedTime = `${nextHour.toString().padStart(2, "0")}:${minutes}`;

   return [originalTime, incrementedTime];
}