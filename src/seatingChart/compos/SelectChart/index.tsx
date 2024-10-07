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
   const [filteredChartIds, setFilteredChartIds] = useState<string[]>([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchChartIds = async () => {
         try {
            const snapshot = await getDocs(chartCollection);
            const ids = snapshot.docs.map((doc) => doc.id);
            setChartIds(ids);
            setFilteredChartIds(sortChartIds(ids));
         } catch (err) {
            setError("Failed to fetch charts. Please try again.");
            console.error("Error fetching charts:", err);
         } finally {
            setIsLoading(false);
         }
      };

      fetchChartIds();
   }, [chartCollection]);

   useEffect(() => {
      const filtered = chartIds.filter((id) =>
         id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredChartIds(sortChartIds(filtered));
   }, [searchTerm, chartIds]);

   const sortChartIds = (ids: string[]): string[] => {
      return ids.sort((a, b) => {
         const dateA = extractDate(a);
         const dateB = extractDate(b);
         return dateB.getTime() - dateA.getTime();
      });
   };

   const extractDate = (id: string): Date => {
      const match = id.match(/(\d{1,2})-(\d{1,2})-(\d{2,4})$/);
      if (match) {
         const [, month, day, year] = match;
         return new Date(
            parseInt(year) < 100 ? parseInt(year) + 2000 : parseInt(year),
            parseInt(month) - 1,
            parseInt(day)
         );
      }
      return new Date(0); // Default to epoch if no date found
   };

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
               <div className="static-top">
                  <div className="chart-select-header">
                     <h1>Choose a chart</h1>
                     <NewChart handleChartSelect={handleChartSelect} />
                  </div>
                  <input
                     type="text"
                     placeholder="Search charts..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="search-input"
                  />
               </div>
               <div className="chart-card-flex">
                  {filteredChartIds.length > 0 ? (
                     <>
                        {filteredChartIds.map((id) => (
                           <ChartLink
                              key={id}
                              name={id}
                              onClickHandler={() => handleChartSelect(id)}
                           />
                        ))}
                     </>
                  ) : (
                     <p>No charts found.</p>
                  )}
               </div>
            </div>
         </div>
      </>
   );
};

export default SelectChart;
