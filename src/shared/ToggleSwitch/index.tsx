// ToggleSwitch.tsx
import React from "react";
import "./style.css";

interface ToggleSwitchProps {
   checked?: boolean;
   onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
   disabled?: boolean;
   id?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
   checked,
   onChange,
   disabled,
   id,
}) => {
   return (
      <label className="toggle-switch">
         <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            id={id}
         />
         <span className="slider" />
      </label>
   );
};

export default ToggleSwitch;
