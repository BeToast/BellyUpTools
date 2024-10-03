import "./style.css";

import React, { useEffect, useState } from "react";
import { CollectionReference, getDocs } from "firebase/firestore";
import { addChartToUrl } from "../../utils/chartUrl";
import NewChart from "./NewChart";
import ChartLink from "./ChartLink";

const SelectChart: React.FC<{
   chartCollection: CollectionReference;
   setChartKey: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ chartCollection, setChartKey }) => {
   const [chartIds, setChartIds] = useState<string[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchChartIds = async () => {
         try {
            const snapshot = await getDocs(chartCollection);
            const ids = snapshot.docs.map((doc) => doc.id);
            setChartIds(ids);
         } catch (err) {
            setError("Failed to fetch charts. Please try again.");
            console.error("Error fetching charts:", err);
         } finally {
            setIsLoading(false);
         }
      };

      fetchChartIds();
   }, [chartCollection]);

   const handleChartSelect = (chartId: string) => {
      addChartToUrl(chartId);
      setChartKey(chartId);
   };

   if (isLoading) return <div>Loading charts...</div>;
   if (error) return <div>Error: {error}</div>;

   return (
      <>
         <div className="horz-center">
            <div className="vert-flex">
               <div className="chart-select-header">
                  <h1>Choose a chart</h1>
                  <NewChart handleChartSelect={handleChartSelect} />
               </div>
               <div className="chart-card-flex">
                  {chartIds.length > 0 ? (
                     <>
                        {chartIds.map((id) => (
                           <ChartLink
                              key={id}
                              name={id}
                              onClickHandler={() => handleChartSelect(id)}
                           />
                        ))}
                     </>
                  ) : (
                     <p>No charts available.</p>
                  )}
               </div>
            </div>
         </div>
      </>
   );
};

export default SelectChart;
