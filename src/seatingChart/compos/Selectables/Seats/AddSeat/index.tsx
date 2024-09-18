import Tooltip from "../../../Tooltip";
import "./style.css";

const AddSeat: React.FC<{
   addHandler: () => void;
}> = ({ addHandler }) => {
   return (
      <>
         <div>
            <Tooltip content="Add Rail Seat 🪑" direction="top">
               <div className="add-seat no-print" onClick={addHandler}>
                  <img src="plus.webp" width={"16px"} />
               </div>
            </Tooltip>
         </div>
      </>
   );
};

export default AddSeat;
