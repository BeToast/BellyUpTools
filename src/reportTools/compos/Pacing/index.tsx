import { calculateSalesPacing } from "./utils";
import { useEffect, useState } from "react";

const Pacing: React.FC<{ json: any[]; eventName: string; eventDate: Date }> = ({
   json,
   eventName,
   eventDate,
}) => {
   if (json.length == 0) return <></>;

   const [salesPacingText, setSalesPacingText] = useState<string>("");

   useEffect(() => {
      setSalesPacingText(calculateSalesPacing(json, eventName, eventDate));
   }, [json]);

   return (
      <>
         {salesPacingText && (
            <div className="card sub">
               <h2>Sales Pacing</h2>
               <pre>{salesPacingText}</pre>
            </div>
         )}
      </>
   );
};

export default Pacing;
