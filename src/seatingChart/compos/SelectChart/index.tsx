import React, { useEffect, useState } from "react";
import { CollectionReference, getDocs } from "firebase/firestore";
import { addChartToUrl } from "../../utils/chartUrl";
import NewChart from "./NewChart";

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
         <h1>Choose a chart</h1>
         <NewChart handleChartSelect={handleChartSelect} />
         {chartIds.length > 0 ? (
            <ul>
               {chartIds.map((id) => (
                  <li key={id}>
                     <button onClick={() => handleChartSelect(id)}>{id}</button>
                  </li>
               ))}
            </ul>
         ) : (
            <p>No charts available.</p>
         )}
      </>
   );
};

export default SelectChart;
