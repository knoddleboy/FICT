import { FunctionalComponent as FC } from "preact";
import styles from "./Workbench.module.scss";
import variables from "../../styles/variables.module.scss";

import { AddIconThin, RemoveIcon, SearchIcon } from "../../assets/svg";

import { AppContext } from "../../App";
import { useContext, useState } from "preact/hooks";
import Button from "../Button";

const data = [
    { key: 1, value: "value1", left: 2, right: 3 },
    { key: 2, value: "value2", left: 4, right: 5 },
    { key: 3, value: "value3", left: 6, right: 7 },
    { key: 4, value: "value4", left: null, right: null },
    { key: 5, value: "value5", left: null, right: null },
    { key: 6, value: "value6", left: null, right: null },
    { key: 7, value: "value7", left: null, right: 8 },
    { key: 8, value: "value8", left: null, right: null },
    { key: 9, value: "value8", left: null, right: null },
    { key: 10, value: "value8", left: null, right: null },
    { key: 11, value: "value8", left: null, right: null },
    { key: 12, value: "value8", left: null, right: null },
    { key: 13, value: "value8", left: null, right: null },
    { key: 14, value: "value8", left: null, right: null },
    { key: 15, value: "value8", left: null, right: null },
    { key: 16, value: "value8", left: null, right: null },
    { key: 17, value: "value8", left: null, right: null },
    { key: 18, value: "value8", left: null, right: null },
    { key: 19, value: "value8", left: null, right: null },
    { key: 20, value: "value8", left: null, right: null },
    { key: 21, value: "value8", left: null, right: null },
    { key: 22, value: "value8", left: null, right: null },
    { key: 23, value: "value8", left: null, right: null },
    { key: 24, value: "value8", left: null, right: null },
    { key: 25, value: "value8", left: null, right: null },
    { key: 26, value: "value8", left: null, right: null },
    { key: 27, value: "value8", left: null, right: null },
    { key: 28, value: "value8", left: null, right: null },
    { key: 29, value: "value8", left: null, right: null },
    { key: 30, value: "value8", left: null, right: null },
    { key: 31, value: "value8", left: null, right: null },
];

export const Workbench: FC = () => {
    const { workingTable } = useContext(AppContext);

    const [activeViewButton, setActiveViewButton] = useState(0);

    return (
        <>
            <div className={styles.workbenchRoot}>
                {workingTable.value ? (
                    <>
                        <div className={styles.working}>
                            <div className={styles.searchInput}>
                                <label for={"searchTable"}>
                                    <SearchIcon size={20} fill={variables.systemSecondaryDark} />
                                </label>
                                <input id={"searchTable"} type="text" placeholder={"Search"} />
                            </div>
                        </div>
                        <div className={styles.dataRowHead}>
                            <div className={styles.dataKeyField}>id</div>
                            <div className={styles.dataValueField}>value</div>
                        </div>
                        <div className={styles.displayTableRoot}>
                            {data.map((d) => (
                                <div className={styles.dataRow}>
                                    <div className={styles.dataKeyField}>{d.key}</div>
                                    <div className={styles.dataValueField}>{d.value}</div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.bottomPanel}>
                            <div className={styles.dataView}>
                                <Button
                                    background={{
                                        color:
                                            activeViewButton === 0
                                                ? variables.systemSecondaryDark
                                                : variables.systemTertiaryDark,
                                        alpha: activeViewButton === 0 ? 8 : 32,
                                    }}
                                    foregraund={{
                                        color: activeViewButton === 0 ? "white" : "",
                                    }}
                                    onClick={() => {
                                        setActiveViewButton(0);
                                    }}
                                >
                                    Tabular
                                </Button>
                                <Button
                                    background={{
                                        color:
                                            activeViewButton === 1
                                                ? variables.systemSecondaryDark
                                                : variables.systemTertiaryDark,
                                        alpha: activeViewButton === 1 ? 8 : 32,
                                    }}
                                    foregraund={{
                                        color: activeViewButton === 1 ? "white" : "",
                                    }}
                                    onClick={() => {
                                        setActiveViewButton(1);
                                    }}
                                >
                                    Treelike
                                </Button>
                            </div>
                            <div className={styles.info}>
                                <span>~31 rows</span>
                            </div>
                            <div className={styles.rowsEdit}>
                                <Button
                                    background={{
                                        color: variables.systemTertiaryDark,
                                        alpha: 32,
                                    }}
                                >
                                    <RemoveIcon size={20} fill={variables.systemSecondaryDark} />
                                    Row
                                </Button>
                                <Button
                                    background={{
                                        color: variables.systemTertiaryDark,
                                        alpha: 32,
                                    }}
                                >
                                    <AddIconThin size={20} fill={variables.systemSecondaryDark} />
                                    Row
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <h4 className={styles.workbenchEmpty}>Select a table</h4>
                )}
            </div>
        </>
    );
};
