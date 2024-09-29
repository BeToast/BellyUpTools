import Modal from "../../../compos/Modal";
import React, { useState } from "react";
import "./style.css";
import { isValidDate } from "../../../utils/generic";
import { newChartDoc } from "./newChartDoc";

const NewChart: React.FC<{
   handleChartSelect: (chartId: string) => void;
}> = ({ handleChartSelect }) => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [showName, setShowName] = useState("");
   const [date, setDate] = useState("");
   const [error, setError] = useState("");

   const createChartHandler = () => {
      setIsModalOpen(true);
      setError(""); // Clear any previous errors
   };

   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDate(e.target.value);
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError(""); // Clear any previous errors

      //trim name
      const trimmedName = showName.trim();
      // Validate show name
      if (trimmedName === "") {
         setError("Show name cannot be empty");
         return;
      }

      // Convert date format from yyyy-mm-dd to mm-dd-yyyy
      const parts = date.split("-");
      const mmddyyyy = `${parts[1]}-${parts[2]}-${parts[0]}`;

      // Validate date format
      if (!isValidDate(mmddyyyy)) {
         setError("Date must be in the format mm-dd-yyyy");
         return;
      }

      // If we pass all validations, proceed with creating the chart
      console.log(
         `Creating new chart for show "${trimmedName}" on ${mmddyyyy}`
      );
      newChartDoc(trimmedName, mmddyyyy)
         .then((chartId) => {
            handleChartSelect(chartId);
            //close modal
            setIsModalOpen(false);
            // Reset form fields
            setShowName("");
            setDate("");
         })
         .catch((error) => {
            setError("Error creating chart. Please try again.");
            console.error(error);
         });
   };

   return (
      <>
         <button onClick={createChartHandler}>New Seating Chart</button>
         <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <h2>Create New Seating Chart</h2>
            <form onSubmit={handleSubmit}>
               {error && <div className="error-message">{error}</div>}
               <div className="input-group">
                  <input
                     type="text"
                     className="name-input"
                     placeholder="Show name"
                     value={showName}
                     onChange={(e) => setShowName(e.target.value)}
                  />
               </div>
               <div className="input-group">
                  <input
                     type="date"
                     className={`date-input ${!date ? "empty" : ""}`}
                     value={date}
                     onChange={handleDateChange}
                  />
               </div>
               <button type="submit">Create Chart</button>
            </form>
         </Modal>
      </>
   );
};

export default NewChart;
