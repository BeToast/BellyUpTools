import "./style.css";

const BackButton: React.FC<{}> = ({}) => {
   const goBack = () => {
      // Get the current URL
      const currentURL = window.location.href;

      // Remove trailing slash if it exists
      const urlWithoutTrailingSlash = currentURL.replace(/\/$/, "");

      // Find the last occurrence of '/'
      const lastSlashIndex = urlWithoutTrailingSlash.lastIndexOf("/");

      // If there's no slash or it's just the protocol slashes (http://), don't modify
      if (lastSlashIndex <= 7) {
         return;
      }

      // Get the URL without the last segment
      const newURL = urlWithoutTrailingSlash.substring(0, lastSlashIndex);

      // Update the URL and add to browser history
      window.history.pushState({}, "", newURL);
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
