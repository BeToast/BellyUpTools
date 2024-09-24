import "./style.css";
import { useSelected } from "../../context/SelectedContext";

const InfoContext: React.FC<{}> = ({}) => {
   const { state } = useSelected();

   const _DEBUG = false;

   if (_DEBUG)
      Object.entries(state).forEach(([key, value]) => console.log(key, value));

   return <></>;
};

export default InfoContext;
