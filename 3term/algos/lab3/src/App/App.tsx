import { createDir, BaseDirectory, exists } from "@tauri-apps/api/fs";
import { createContext } from "preact";
import { useEffect } from "preact/hooks";
import { signal } from "@preact/signals";

import Select from "../components/Select";
import Workbench from "../components/Workbench";

import { MAIN_DATA_DIR } from "../constants";

function tablesEditState() {
    const invokeCreateTable = signal(false);
    const invokeDeleteTable = signal(false);

    return { invokeCreateTable, invokeDeleteTable };
}

export const AppState = createContext(tablesEditState());

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
            <AppState.Provider value={tablesEditState()}>
                <Select />
                <Workbench workState={false} />
            </AppState.Provider>
        </>
    );
}
