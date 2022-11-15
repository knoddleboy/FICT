import { FunctionalComponent as FC } from "preact";
import styles from "./Workbench.module.scss";

export const Workbench: FC<{ workState: boolean }> = ({ workState }) => {
    return (
        <>
            <div className={styles.workbenchRoot}>
                {workState ? (
                    <div></div>
                ) : (
                    <h4 className={styles.workbenchEmpty}>Select a table</h4>
                )}
            </div>
        </>
    );
};
