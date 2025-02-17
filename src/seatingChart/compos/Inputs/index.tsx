import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import { useSelected } from "../../context/SelectedContext";
import { setDoc } from "firebase/firestore";

export interface InputsState {
   show: string;
   date: string;
   doors: string;
   supportTime: string;
   mainTime: string;
   approxEnd: string;
   notes: string;
}

const Inputs: React.FC = () => {
   const { docInputs, extraChairs, docRef } = useSelected();

   if (!docInputs) {
      return null;
   }

   const [inputs, setInputs] = useState<InputsState>(docInputs);

   const showInputRef = useRef<HTMLInputElement>(null);
   const dateInputRef = useRef<HTMLInputElement>(null);
   const doorsInputRef = useRef<HTMLInputElement>(null);
   const supportInputRef = useRef<HTMLInputElement>(null);
   const mainInputRef = useRef<HTMLInputElement>(null);
   const approxEndInputRef = useRef<HTMLInputElement>(null);
   const notesInputRef = useRef<HTMLTextAreaElement>(null);

   const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

   useEffect(() => {
      if (docInputs) {
         setInputs(docInputs);
      }
   }, [docInputs]);

   useEffect(() => {
      return () => {
         if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
         }
      };
   }, []);

   const updateFirestore = (newInputs: InputsState) => {
      if (updateTimeoutRef.current) {
         clearTimeout(updateTimeoutRef.current);
      }

      updateTimeoutRef.current = setTimeout(async () => {
         await setDoc(docRef, { inputs: newInputs }, { merge: true });
      }, 1000);
   };

   const handleChange =
      (field: keyof InputsState) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
         const newValue = event.target.value;
         const newInputs = { ...inputs, [field]: newValue };
         setInputs(newInputs);
         updateFirestore(newInputs);
      };

   const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
         event.preventDefault();
         const inputRefs = [
            showInputRef,
            dateInputRef,
            doorsInputRef,
            supportInputRef,
            mainInputRef,
            approxEndInputRef,
            notesInputRef,
         ];
         const currentIndex = inputRefs.findIndex(
            (ref) => ref.current === event.currentTarget
         );
         if (currentIndex < inputRefs.length - 1) {
            inputRefs[currentIndex + 1].current?.focus();
         } else {
            inputRefs[0].current?.focus();
         }
      }
   };

   const renderLabeledInput = (
      label: string,
      value: string,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
      ref: React.RefObject<HTMLInputElement>,
      placeholder: string
   ) => (
      <div className="label-wrapper">
         <div className="label">{label}</div>
         <input
            ref={ref}
            type="text"
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="input time"
         />
      </div>
   );

   const renderLabel = (label: string) => (
      <div className="label-wrapper">
         <div className="label">{label}</div>
         <div style={{ width: "128px" }}></div>
      </div>
   );

   return (
      <div className="inputs-wrapper">
         <input
            ref={showInputRef}
            type="text"
            value={inputs.show}
            onChange={handleChange("show")}
            onKeyDown={handleKeyDown}
            placeholder="Show Name"
            className="input show"
         />
         <input
            ref={dateInputRef}
            type="text"
            value={inputs.date}
            onChange={handleChange("date")}
            onKeyDown={handleKeyDown}
            placeholder="Date"
            className="input"
         />
         {renderLabeledInput(
            "Doors:",
            inputs.doors,
            handleChange("doors"),
            doorsInputRef,
            "7:30pm"
         )}
         {renderLabeledInput(
            "Support:",
            inputs.supportTime,
            handleChange("supportTime"),
            supportInputRef,
            "8:30pm"
         )}
         {renderLabeledInput(
            "Main:",
            inputs.mainTime,
            handleChange("mainTime"),
            mainInputRef,
            "9:30pm"
         )}
         {renderLabeledInput(
            "Approx End:",
            inputs.approxEnd,
            handleChange("approxEnd"),
            approxEndInputRef,
            "11:00pm"
         )}
         {renderLabel("Seater 1:")}
         {renderLabel("Seater 2:")}

         <div className="extra-chairs-wrapper">
            <div className="extra-chairs">
               {extraChairs > 0
                  ? `${extraChairs} Extra Chair${extraChairs > 1 ? "s" : ""}`
                  : "No Extra Chairs"}
            </div>
         </div>

         <div className="label-wrapper notes-wrapper">
            <textarea
               ref={notesInputRef}
               value={inputs.notes}
               onChange={handleChange("notes")}
               placeholder="Additional notes..."
               className="input notes"
            />
         </div>
      </div>
   );
};

export default Inputs;
