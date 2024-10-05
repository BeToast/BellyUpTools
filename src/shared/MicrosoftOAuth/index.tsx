import "./style.css";

import React from "react";
import { providerMicrosoft } from "../firebase";
import { getAuth, signInWithPopup, UserCredential } from "firebase/auth";

import Modal from "../../seatingChart/compos/Modal";

const MicrosoftOAuth: React.FC<{
   setStoredCredential: React.Dispatch<
      React.SetStateAction<UserCredential | null>
   >;
}> = ({ setStoredCredential }) => {
   const auth = getAuth();

   const handleSignIn = async (): Promise<void> => {
      try {
         const credential: UserCredential = await signInWithPopup(
            auth,
            providerMicrosoft
         );
         if (credential) {
            setStoredCredential(credential);
            localStorage.setItem(
               "microsoftUserCredential",
               JSON.stringify({
                  results: credential,
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
