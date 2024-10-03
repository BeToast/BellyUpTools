// import { arrowRight } from "../../../../landing/svg";
import DeleteChart from "./DeleteChart";
import RenameChart from "./RenameChart";
import "./style.css";

const ChartLink: React.FC<{ name: string; onClickHandler: () => void }> = ({
   name,
   onClickHandler,
}) => {
   return (
      <>
         <div id={name} className="chart-card-wrapper">
            <div className="chart-card" onClick={onClickHandler}>
               <h3>{name}</h3>
               <div
                  onClick={(e) => {
                     e.stopPropagation();
                  }}
                  className="chart-card-buttons"
               >
                  <RenameChart name={name} />
                  <DeleteChart name={name} />
                  {/* <div className="chart-icon">{arrowRight}</div> */}
               </div>
            </div>
         </div>
      </>
   );
};

export default ChartLink;
