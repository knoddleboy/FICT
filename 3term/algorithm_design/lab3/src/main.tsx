import { render } from "preact";
import App from "./App";
import "./index.scss";

import { window, invoke } from "@tauri-apps/api";
import { TauriEvent } from "@tauri-apps/api/event";

// save last table on app exit
window.getCurrent().listen(TauriEvent.WINDOW_CLOSE_REQUESTED, () => {
    invoke("set_working_table", { path: "" }).then(() => {
        window.getCurrent().close();
    });
});

render(<App />, document.getElementById("app") as HTMLElement);
