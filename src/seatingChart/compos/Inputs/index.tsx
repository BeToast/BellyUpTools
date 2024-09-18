import React, { useState, useRef } from "react";
import "./style.css";
import { useSelected } from "../../context/SelectedContext";

const Inputs: React.FC = () => {
   const { extraChairs } = useSelected();

   const [show, setShow] = useState("");
   const [date, setDate] = useState("");
   const [doors, setDoors] = useState("");
   const [supportTime, setSupportTime] = useState("");
   const [mainTime, setMainTime] = useState("");
   const [approxEnd, setApproxEnd] = useState("");
   const [notes, setNotes] = useState("");

   const showInputRef = useRef<HTMLInputElement>(null);
   const dateInputRef = useRef<HTMLInputElement>(null);
   const doorsInputRef = useRef<HTMLInputElement>(null);
   const supportInputRef = useRef<HTMLInputElement>(null);
   const mainInputRef = useRef<HTMLInputElement>(null);
   const approxEndInputRef = useRef<HTMLInputElement>(null);
   const notesInputRef = useRef<HTMLTextAreaElement>(null);

   const handleChange =
      (setter: React.Dispatch<React.SetStateAction<string>>) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
         setter(event.target.value);
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
            value={show}
            onChange={handleChange(setShow)}
            onKeyDown={handleKeyDown}
            placeholder="Show Name"
            className="input show"
         />
         <input
            ref={dateInputRef}
            type="text"
            value={date}
            onChange={handleChange(setDate)}
            onKeyDown={handleKeyDown}
            placeholder="Date"
            className="input"
         />
         {renderLabeledInput(
            "Doors:",
            doors,
            handleChange(setDoors),
            doorsInputRef,
            "7:30pm"
         )}
         {renderLabeledInput(
            "Support:",
            supportTime,
            handleChange(setSupportTime),
            supportInputRef,
            "8:30pm"
         )}
         {renderLabeledInput(
            "Main:",
            mainTime,
            handleChange(setMainTime),
            mainInputRef,
            "9:30pm"
         )}
         {renderLabeledInput(
            "Approx End:",
            approxEnd,
            handleChange(setApproxEnd),
            approxEndInputRef,
            "11:00pm"
         )}
         {renderLabel("Seater 1:")}
         {renderLabel("Seater 2:")}

         <div className="extra-chairs-wrapper">
            <div className="extra-chairs">
               {extraChairs > 0
                  ? `${extraChairs} Extra Chairs`
                  : "No Extra Chairs"}
            </div>
         </div>

         <div className="label-wrapper notes-wrapper">
            <textarea
               ref={notesInputRef}
               value={notes}
               onChange={handleChange(setNotes)}
               placeholder="Additional notes..."
               className="input notes"
            />
         </div>
      </div>
   );
};

export default Inputs;
