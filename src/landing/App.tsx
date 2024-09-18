import React from "react";
import "./App.css";

function App() {
   return (
      <div className="App">
         <header className="App-header">
            <h1>Welcome to BellyUpTools</h1>
            <nav>
               <ul>
                  <li>
                     <a href="/reportTools/">Go to Report Tools</a>
                  </li>
                  <li>
                     <a href="/seatingChart/">Go to Seating Chart</a>
                  </li>
               </ul>
            </nav>
         </header>
         {/* Rest of your landing page content */}
      </div>
   );
}

export default App;
