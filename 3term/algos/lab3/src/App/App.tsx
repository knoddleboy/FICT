import { createDir, BaseDirectory, exists, FileEntry } from "@tauri-apps/api/fs";
import { createContext } from "preact";
import { useEffect } from "preact/hooks";

import Select from "../components/Select";
import Workbench from "../components/Workbench";
import { MAIN_DATA_DIR } from "../constants";

import { signal } from "@preact/signals";

const workingTable = signal<FileEntry | undefined>(undefined);
export const AppContext = createContext({ workingTable });

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
        <AppContext.Provider value={{ workingTable }}>
            <Select />
            <Workbench />
        </AppContext.Provider>
    );
}
