import React, { useState } from "react";
import "./style.css";

interface TooltipProps {
   delay?: number;
   direction?: "top" | "right" | "bottom" | "left";
   content: React.ReactNode;
   children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({
   delay,
   direction,
   content,
   children,
}) => {
   let timeout: NodeJS.Timeout;
   const [active, setActive] = useState(false);

   const showTip = () => {
      timeout = setTimeout(() => {
         setActive(true);
      }, delay || 400);
   };

   const hideTip = () => {
      clearTimeout(timeout);
      setActive(false);
   };

   return (
      <div
         className="Tooltip-Wrapper no-print"
         onMouseEnter={showTip}
         onMouseLeave={hideTip}
      >
         {children}
         {active && (
            <div className={`Tooltip-Tip ${direction || "top"}`}>{content}</div>
         )}
      </div>
   );
};

export default Tooltip;
