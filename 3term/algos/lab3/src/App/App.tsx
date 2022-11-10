import { createContext } from "preact";
import { useState, useMemo, StateUpdater } from "preact/hooks";
import Select from "../components/Select";
import Workbench from "../components/Workbench";

interface IAppContext {
    activateTableRemoval: boolean;
    setActivateTableRemoval: StateUpdater<boolean>;
}

export const AppContext = createContext<IAppContext>({
    activateTableRemoval: false,
    setActivateTableRemoval: () => {},
});

export function App() {
    const [activateTableRemoval, setActivateTableRemoval] = useState(false);
    const val = useMemo(
        () => ({ activateTableRemoval, setActivateTableRemoval }),
        [activateTableRemoval]
    );

    return (
        <>
            <AppContext.Provider value={val}>
                <Select />
                <Workbench workState={false} />
            </AppContext.Provider>
        </>
    );
}
