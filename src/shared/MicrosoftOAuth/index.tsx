import "./style.css";

import React from "react";
import { providerMicrosoft } from "../firebase";
import {
   getAuth,
   signInWithPopup,
   OAuthProvider,
   UserCredential,
} from "firebase/auth";

import Modal from "../../seatingChart/compos/Modal";

const MicrosoftOAuth: React.FC<{
   setStoredToken: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ setStoredToken }) => {
   const auth = getAuth();

   const handleSignIn = async (): Promise<void> => {
      try {
         const result: UserCredential = await signInWithPopup(
            auth,
            providerMicrosoft
         );
         const credential = OAuthProvider.credentialFromResult(result);
         console.log(credential);
         if (credential && credential.idToken) {
            setStoredToken(credential.idToken);
            localStorage.setItem(
               "microsoftOAuthToken",
               JSON.stringify({
                  token: credential.idToken,
                  timestamp: new Date().getTime(),
               })
            );
         }
      } catch (error) {
         console.error("Error during sign in:", error);
      }
   };

   return (
      <Modal isOpen={true} onClose={() => {}}>
         <h2>Login to bellyupaspen.com</h2>
         <p>
            Login to your{" "}
            <span style={{ fontStyle: "italic" }}>@bellyupaspen.com</span> email
            to access the seating chart.
         </p>
         <div onClick={handleSignIn} className="login-microsoft">
            Login with Microsoft
         </div>
      </Modal>
   );
};

export default MicrosoftOAuth;
