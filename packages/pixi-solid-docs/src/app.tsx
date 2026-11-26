import type { JSX } from "@solidjs/web";

import { Router } from "./router";

import "@fontsource-variable/outfit";
import "@fontsource-variable/roboto";
import "@fontsource-variable/roboto-mono";

import "./styles/base.scss";

export default function App(): JSX.Element {
  return <Router>{(props) => <>{props.children}</>}</Router>;
}
