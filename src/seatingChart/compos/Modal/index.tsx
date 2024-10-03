import React, { ReactNode } from "react";
import "./style.css";

const Modal: React.FC<{
   children: ReactNode;
   isOpen: boolean;
   onClose: (e: React.MouseEvent) => void;
}> = ({ children, isOpen, onClose }) => {
   if (!isOpen) return null;

   return (
      <div className="modal-overlay">
         <div className="modal-backdrop" onClick={onClose}></div>
         <div className="modal-content">{children}</div>
      </div>
   );
};

export default Modal;
