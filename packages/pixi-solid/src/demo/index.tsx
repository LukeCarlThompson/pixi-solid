import { render } from "solid-js/web";
import { App } from "./demo-app";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No root element found");
}

render(() => <App />, rootElement);
