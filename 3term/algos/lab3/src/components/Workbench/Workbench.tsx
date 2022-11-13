import { FunctionalComponent as FC } from "preact";
import { useState, useRef, useContext } from "preact/hooks";
import useOnClickOutside from "../../hooks/useOnClickOutside";

import { EditIcon } from "../../assets/svg";
import ContextMenu, { ContextItem } from "../ContextMenu";
import Button from "../Button";

import styles from "./Workbench.module.scss";
import variables from "../../styles/variables.module.scss";

import { AppState } from "../../App";

export const Workbench: FC<{ workState: boolean }> = ({ workState }) => {
    const { invokeCreateTable, invokeDeleteTable } = useContext(AppState);

    const [openContext, setOpenContext] = useState(false);

    // Close edit context when clicked outside
    const contextRef = useRef<HTMLDivElement>(null);
    const editButtonRef = useRef<HTMLButtonElement>(null);
    useOnClickOutside(contextRef, () => setOpenContext(false), editButtonRef);

    return (
        <>
            <div className={styles.workbenchRoot}>
                <ContextMenu top={42} left={42} active={openContext} contextRef={contextRef}>
                    <ContextItem
                        background={{
                            color: variables.systemTertiaryDark,
                            alpha: 32,
                        }}
                        onClick={() => (invokeCreateTable.value = true)}
                    >
                        Create
                    </ContextItem>
                    <ContextItem
                        background={{
                            color: variables.systemTertiaryDark,
                            alpha: 32,
                        }}
                        onClick={() => (invokeDeleteTable.value = !invokeDeleteTable.value)}
                    >
                        Delete
                    </ContextItem>
                </ContextMenu>
                <Button
                    background={{
                        color: variables.systemTertiaryDark,
                        alpha: 32,
                    }}
                    className={styles.editButton}
                    onClick={() => {
                        setOpenContext((prev) => !prev);
                    }}
                    buttonRef={editButtonRef}
                >
                    <EditIcon size={20} className={styles.editButtonIcon} />
                </Button>
                {workState ? (
                    <div></div>
                ) : (
                    <h4 className={styles.workbenchEmpty}>Select a table</h4>
                )}
            </div>
        </>
    );
};
