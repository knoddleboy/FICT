import { FunctionalComponent as FC } from "preact";
import { useContext } from "preact/hooks";
import { EditIcon } from "../../assets/svg";
import Button from "../Button";
import styles from "./Workbench.module.scss";
import variables from "../../styles/variables.module.scss";

import { AppContext } from "../../App";
import ContextMenu from "../ContextMenu";

export const Workbench: FC<{ workState: boolean }> = ({ workState }) => {
    const { setActivateTableEditing } = useContext(AppContext);

    return (
        <>
            <div className={styles.workbenchRoot}>
                {/* <ContextMenu
                    background={{
                        color: variables.systemTertiaryDark,
                        alpha: 32,
                    }}
                >
                    <ContextMenu.Item>Create</ContextMenu.Item>
                    <ContextMenu.Item>Delete</ContextMenu.Item>
                </ContextMenu> */}
                <Button
                    background={{
                        color: variables.systemTertiaryDark,
                        alpha: 32,
                    }}
                    className={styles.editButton}
                    onClick={() => {
                        setActivateTableEditing((prev) => !prev);
                    }}
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
