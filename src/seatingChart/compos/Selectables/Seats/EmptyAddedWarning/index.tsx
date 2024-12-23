import React from "react";
import "./style.css";

const EmptyAddedWarning: React.FC = () => {
   return (
      <div className="relative">
         <div className="warning-wrapper">
            <svg
               xmlns="http://www.w3.org/2000/svg"
               width="16"
               height="16"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
            >
               <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
               <path d="M12 9v4" />
               <path d="M12 17h.01" />
            </svg>
            <span className="text-sm">empty added seat!</span>
         </div>
      </div>
   );
};

export default EmptyAddedWarning;
