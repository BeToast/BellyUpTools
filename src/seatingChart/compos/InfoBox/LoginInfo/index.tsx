import { UserCredential } from "firebase/auth";
import "./style.css";

const LoginInfo: React.FC<{ storedCredential: UserCredential }> = ({
   storedCredential,
}) => {
   return (
      <>
         <div className="user-details">
            <div className="user-details-content">
               User: {storedCredential.user.email}
            </div>
         </div>
      </>
   );
};

export default LoginInfo;
