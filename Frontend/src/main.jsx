import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "./store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {/* <BrowserRoute> */}
    <App />
    <ToastContainer
      position="top-center"
      autoClose={3000}
      newestOnTop={true}
      closeOnClick
      pauseOnFocusLoss
      draggable
    />
    {/* </BrowserRoute> */}
  </Provider>
);
