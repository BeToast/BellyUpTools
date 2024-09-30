import { arrowRight } from "../../../../landing/svg";
import "./style.css";

const ChartLink: React.FC<{ name: string; onClickHandler: () => void }> = ({
   name,
   onClickHandler,
}) => {
   return (
      <>
         <div className="chart-card" onClick={onClickHandler}>
            <h3>{name}</h3>
            <div className="chart-arrow-right">{arrowRight}</div>
         </div>
      </>
   );
};

export default ChartLink;
