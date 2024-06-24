import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { Providers } from "@microsoft/mgt-element";
import { Msal2Provider } from "@microsoft/mgt-msal2-provider";
import { applyTheme } from "@microsoft/mgt-react";

Providers.globalProvider = new Msal2Provider({
  clientId: import.meta.env.VITE_CLIENT_ID,
  scopes: ["OnlineMeetings.ReadWrite"],
});

applyTheme("contrast");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
