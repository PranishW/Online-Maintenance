import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from './Components/Home'
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import AdminState from "./Components/Login/AdminState";
import { createContext, useState } from "react";
import Popup from "./Popup";
export const PopupContext = createContext();
function App() {
  const [popup, setPopup] = useState(null);
  const showPopup = (message, type) => {
    setPopup({
      message: message,
      type: type
    })
    setTimeout(() => {
      setPopup(null);
    }, 3000);
  }
  return (
    <>
      <AdminState>
        <BrowserRouter>
          <PopupContext.Provider value={{showPopup}} >
            <Navbar />
            <Popup popup={popup} />
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
            <Footer />
          </PopupContext.Provider>
        </BrowserRouter>
      </AdminState>
    </>
  );
}

export default App;
