//Punto de entrada de la aplicación

//Librerías
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
//Puente entre React y DOM, ayuda a detectar problemas en el código
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);