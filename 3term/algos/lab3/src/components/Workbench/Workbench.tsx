import { FunctionalComponent as FC } from "preact";
import { useContext } from "preact/hooks";
import { EditIcon } from "../../assets/svg";
import Button from "../Button";
import styles from "./Workbench.module.scss";
import variables from "../../styles/variables.module.scss";

import { AppContext } from "../../App";

export const Workbench: FC<{ workState: boolean }> = ({ workState }) => {
    const { setActivateTableRemoval } = useContext(AppContext);

    return (
        <>
            <div className={styles.workbenchRoot}>
                <Button
                    background={{
                        color: variables.systemTertiaryDark,
                        alpha: 32,
                    }}
                    className={styles.editButton}
                    onClick={() => {
                        setActivateTableRemoval((prev) => !prev);
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
