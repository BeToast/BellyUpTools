import "./style.css";

import React, { useState } from "react";
import { providerMicrosoft } from "../firebase";
import { getAuth, signInWithPopup, UserCredential } from "firebase/auth";

import Modal from "../../seatingChart/compos/Modal";

interface MicrosoftOAuthProps {
   setStoredCredential: React.Dispatch<
      React.SetStateAction<UserCredential | null>
   >;
}

const MicrosoftOAuth: React.FC<MicrosoftOAuthProps> = ({
   setStoredCredential,
}) => {
   const [error, setError] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const auth = getAuth();

   const handleSignIn = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
         const credential = await signInWithPopup(auth, providerMicrosoft);

         // Verify the email domain
         const email = credential.user.email;
         if (!email?.endsWith("@bellyupaspen.com")) {
            await auth.signOut(); // Sign out if not the correct domain
            setError("Please use your @bellyupaspen.com email address");
            setStoredCredential(null);
            return;
         }

         setStoredCredential(credential);
      } catch (error) {
         console.error("Error during sign in:", error);
         setError(
            error instanceof Error
               ? error.message
               : "An error occurred during sign in"
         );
         setStoredCredential(null);
      } finally {
         setIsLoading(false);
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

         {error && (
            <div
               className="error-message"
               style={{
                  color: "red",
                  marginBottom: "1rem",
               }}
            >
               {error}
            </div>
         )}

         <button
            onClick={handleSignIn}
            className="login-microsoft"
            disabled={isLoading}
         >
            {isLoading ? "Signing in..." : "Login with Microsoft"}
         </button>
      </Modal>
   );
};

export default MicrosoftOAuth;
