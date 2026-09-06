import Routers from "./routes/Routers";
import "./index.css";
import { SnackbarProvider } from "notistack";
import AIChatWidget from "./components/AIChat/AIChatWidget";

function App() {
     return (
          <SnackbarProvider
               maxSnack={3}
               anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
               }}
               autoHideDuration={2000}
          >
               <Routers />

               <AIChatWidget />
          </SnackbarProvider>
     );
}

export default App;