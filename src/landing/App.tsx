import "./App.css";
import ToolLink from "./compos/ToolLink";

function App() {
   return (
      <div className="horz-center">
         <div className="App">
            <div className="title-card">
               <h1>Welcome to BellyUpTools</h1>
            </div>
            <ToolLink name={"Report Tools 📈"} href={"/reportTools/"} />
            <ToolLink
               name={"Seating Chart Builder 🪑"}
               href={"/seatingChart/"}
            />
            {/* <nav>
                  <ul>
                     <li>
                        <a href="/reportTools/">Go to Report Tools</a>
                     </li>
                     <li>
                        <a href="/seatingChart/">Go to Seating Chart</a>
                     </li>
                  </ul>
               </nav> */}
            {/* Rest of your landing page content */}
         </div>
      </div>
   );
}

export default App;
