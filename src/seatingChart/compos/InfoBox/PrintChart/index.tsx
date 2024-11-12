import "./style.css";

const PrintChart: React.FC<{}> = ({}) => {
   const printChart = () => {
      window.print();
   };

   return (
      <>
         <div className="print-chart" onClick={printChart}>
            <div className="print-chart-content">Print Chart</div>
         </div>
      </>
   );
};

export default PrintChart;
