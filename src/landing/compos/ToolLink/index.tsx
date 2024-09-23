import { arrowRight } from "../../svg";
import "./style.css";

const ToolLink: React.FC<{ name: string; href: string }> = ({ name, href }) => {
   return (
      <>
         <a href={href}>
            <div className="tool-card">
               <h2>{name}</h2>
               <div className="arrow-right">{arrowRight}</div>
            </div>
         </a>
      </>
   );
};

export default ToolLink;
