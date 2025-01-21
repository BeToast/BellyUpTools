import "./style.css";
import React, { useState, useEffect } from "react";
import {
   getAuth,
   signInWithPopup,
   UserCredential,
   sendSignInLinkToEmail,
   isSignInWithEmailLink,
   signInWithEmailLink,
} from "firebase/auth";
import { providerMicrosoft } from "../firebase";
import Modal from "../../seatingChart/compos/Modal";

interface MicrosoftOAuthProps {
   setStoredCredential: React.Dispatch<
      React.SetStateAction<UserCredential | null>
   >;
}

const MicrosoftOAuth: React.FC<MicrosoftOAuthProps> = ({
   setStoredCredential,
}) => {
   const michaelEmailAddress = "mag@aerolease.com";
   const [error, setError] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [showConfirmation, setShowConfirmation] = useState(false);
   const auth = getAuth();

   useEffect(() => {
      const completeSignIn = async () => {
         if (isSignInWithEmailLink(auth, window.location.href)) {
            try {
               const result = await signInWithEmailLink(
                  auth,
                  michaelEmailAddress,
                  window.location.href
               );
               setStoredCredential(result);
            } catch (error) {
               console.error("Error signing in with email link:", error);
               setError("Failed to sign in with email link. Please try again.");
            }
         }
      };

      completeSignIn();
   }, [auth, setStoredCredential]);

   const handleMicrosoftSignIn = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
         const credential = await signInWithPopup(auth, providerMicrosoft);
         const email = credential.user.email;

         if (!email?.endsWith("@bellyupaspen.com")) {
            await auth.signOut();
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

   const handleMichaelLogin = async () => {
      setIsLoading(true);
      setError(null);

      try {
         const actionCodeSettings = {
            url: window.location.href,
            handleCodeInApp: true,
         };

         await sendSignInLinkToEmail(
            auth,
            michaelEmailAddress,
            actionCodeSettings
         );
         setError("Check your email for the login link!");
         setShowConfirmation(false); // Return to main screen after sending
      } catch (error) {
         console.error("Error sending email link:", error);
         setError(
            error instanceof Error
               ? error.message
               : "An error occurred sending the login link"
         );
      } finally {
         setIsLoading(false);
      }
   };

   if (isSignInWithEmailLink(auth, window.location.href)) {
      return (
         <Modal isOpen={true} onClose={() => {}}>
            <h2>Completing sign in...</h2>
            {error && (
               <div
                  className="error-message"
                  style={{ color: "red", marginBottom: "1rem" }}
               >
                  {error}
               </div>
            )}
         </Modal>
      );
   }

   if (showConfirmation) {
      return (
         <Modal isOpen={true} onClose={() => {}}>
            <h2>Michael's Login</h2>
            <p>Would you like to send a login link to {michaelEmailAddress}?</p>

            {error && (
               <div
                  className="error-message"
                  style={{ color: "red", marginBottom: "1rem" }}
               >
                  {error}
               </div>
            )}

            <div style={{ display: "flex", flexDirection: "column" }}>
               <button
                  onClick={handleMichaelLogin}
                  className="confirm-action"
                  disabled={isLoading}
                  style={{ width: "100%" }}
               >
                  {isLoading ? "Sending..." : "Send Login Link"}
               </button>

               <button
                  onClick={() => setShowConfirmation(false)}
                  className="login-microsoft"
                  disabled={isLoading}
                  style={{ width: "100%" }}
               >
                  Back
               </button>
            </div>
         </Modal>
      );
   }

   return (
      <Modal isOpen={true} onClose={() => {}}>
         <h2>Login to Seating Chart</h2>
         <p>
            Login to your{" "}
            <span style={{ fontStyle: "italic" }}>@bellyupaspen.com</span> email
            to access the seating chart.
         </p>

         {error && (
            <div
               className="error-message"
               style={{ color: "red", marginBottom: "1rem" }}
            >
               {error}
            </div>
         )}

         <div style={{ display: "flex", flexDirection: "column" }}>
            <button
               onClick={handleMicrosoftSignIn}
               className="login-microsoft"
               disabled={isLoading}
               style={{ width: "100%" }}
            >
               {isLoading ? "Signing in..." : "Login with Microsoft"}
            </button>

            <button
               onClick={() => setShowConfirmation(true)}
               className="login-microsoft"
               disabled={isLoading}
               style={{ width: "100%" }}
            >
               Michael's Login
            </button>
         </div>
      </Modal>
   );
};

export default MicrosoftOAuth;
