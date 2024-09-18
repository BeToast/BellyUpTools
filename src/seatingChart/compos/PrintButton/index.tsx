import "./styles.css";

const PrintButton: React.FC = () => {
   const handlePrint = () => {
      window.print();
   };

   return (
      <div className="no-print print-button">
         <button onClick={handlePrint}>Print</button>
      </div>
   );
};

export default PrintButton;
