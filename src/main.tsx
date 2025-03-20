import ReactDOM from "react-dom/client";

import "primeflex/primeflex.css";
import "primereact/resources/primereact.min.css";

import "./styles/styles.css";

import App from "./App";
import Loader from "./components/loader";

import { setAuthorizationToken } from "./services/auth.service";

setAuthorizationToken();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <>
    <Loader />
    <App></App>
  </>
);
