import { useSelected } from "../../../context/SelectedContext";
import "./style.css";

const WritingStatus: React.FC<{}> = ({}) => {
   const { writing } = useSelected();

   return writing ? (
      <>
         <div className="writing-status writing">
            <div className="writing-status-content">Saving...</div>
         </div>
      </>
   ) : (
      <>
         <div className="writing-status saved">
            <div className="writing-status-content">All changes saved</div>
         </div>
      </>
   );
};

export default WritingStatus;
