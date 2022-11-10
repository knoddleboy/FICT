import { render } from "preact";
import App from "./App";
import "./index.scss";

render(<App />, document.getElementById("app") as HTMLElement);
