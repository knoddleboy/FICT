import { FunctionalComponent as FC } from "preact";
import styles from "./Workbench.module.scss";

import { AppContext } from "../../App";
import { useContext } from "preact/hooks";

const data = [
    { key: 1, value: "value1" },
    { key: 2, value: "value2" },
    { key: 3, value: "value3" },
    { key: 4, value: "value4" },
    { key: 5, value: "value5" },
    { key: 6, value: "value6" },
    { key: 7, value: "value7" },
    { key: 8, value: "value8" },
];

export const Workbench: FC = () => {
    const { workingTable } = useContext(AppContext);

    return (
        <>
            <div className={styles.workbenchRoot}>
                {workingTable.value ? (
                    <div>
                        <div className={styles.table}>
                            <h4>{workingTable.value.name}</h4>

                            {data.map((d) => (
                                <div className={styles.row}>
                                    <span>{d.key}</span>
                                    <span>{d.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <h4 className={styles.workbenchEmpty}>Select a table</h4>
                )}
            </div>
        </>
    );
};
