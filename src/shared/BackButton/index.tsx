import "./style.css";

const BackButton: React.FC<{}> = ({}) => {
   const goBack = () => {
      const currentURL = window.location.href;
      const urlWithoutTrailingSlash = currentURL.replace(/\/$/, "");
      const lastSlashIndex = urlWithoutTrailingSlash.lastIndexOf("/");

      if (lastSlashIndex <= 7) {
         return;
      }

      const newURL = urlWithoutTrailingSlash.substring(0, lastSlashIndex);

      // Update URL in browser history
      window.history.pushState({}, "", newURL);

      // Dispatch a popstate event to trigger route handling
      window.dispatchEvent(new PopStateEvent("popstate"));
   };

   return (
      <>
         <div className="back-button" onClick={goBack}>
            <svg
               xmlns="http://www.w3.org/2000/svg"
               width="40"
               height="40"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               stroke-width="2"
               stroke-linecap="round"
               stroke-linejoin="round"
               className="lucide lucide-arrow-left"
            >
               <path d="m12 19-7-7 7-7" />
               <path d="M19 12H5" />
            </svg>
         </div>
      </>
   );
};

export default BackButton;
