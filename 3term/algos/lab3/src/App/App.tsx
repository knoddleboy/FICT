import { createContext } from "preact";
import { useState, useMemo, StateUpdater, useEffect } from "preact/hooks";
import Select from "../components/Select";
import Workbench from "../components/Workbench";

import { createDir, BaseDirectory, exists } from "@tauri-apps/api/fs";
import { MAIN_DATA_DIR } from "../constants";

interface IAppContext {
    activateTableEditing: boolean;
    setActivateTableEditing: StateUpdater<boolean>;
}

export const AppContext = createContext<IAppContext>({
    activateTableEditing: false,
    setActivateTableEditing: () => {},
});

export function App() {
    const [activateTableEditing, setActivateTableEditing] = useState(false);
    const val = useMemo(
        () => ({ activateTableEditing, setActivateTableEditing }),
        [activateTableEditing]
    );

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
            <AppContext.Provider value={val}>
                <Select />
                <Workbench workState={false} />
            </AppContext.Provider>
        </>
    );
}
