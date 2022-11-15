import { createDir, BaseDirectory, exists } from "@tauri-apps/api/fs";
import { useEffect } from "preact/hooks";

import Select from "../components/Select";
import Workbench from "../components/Workbench";

import { MAIN_DATA_DIR } from "../constants";

export function App() {
    // Create `$APPDATA/databases` directory on startup
    useEffect(() => {
        async function direxist() {
            return await exists(MAIN_DATA_DIR, { dir: BaseDirectory.AppData });
        }

        (async () => {
            if (!(await direxist())) {
                await createDir(MAIN_DATA_DIR, {
                    dir: BaseDirectory.AppData,
                    recursive: true,
                });
            }
        })();
    }, []);

    return (
        <>
            <Select />
            <Workbench workState={false} />
        </>
    );
}
