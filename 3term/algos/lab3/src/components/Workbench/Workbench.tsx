import { FunctionalComponent as FC } from "preact";
import styles from "./Workbench.module.scss";
import variables from "../../styles/variables.module.scss";

import { AddIconThin, RemoveIcon, SearchIcon } from "../../assets/svg";

import { AppContext } from "../../App";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import Button from "../Button";

type TableData = {
    key: number | null;
    value: string | null;
};

export const Workbench: FC = () => {
    const { workingTable } = useContext(AppContext);

    const [activeViewButton, setActiveViewButton] = useState(0);

    const sceletonData = new Array<TableData>(30).fill({
        key: null,
        value: null,
    });

    const templateInputRowRef = useRef<HTMLInputElement>(null);
    const [templateInputRow, setTemplateInputRow] = useState([-1, -1]);

    useEffect(() => {
        if (templateInputRow[1] > -1) {
            templateInputRowRef.current?.focus();
        }
    }, [templateInputRow]);

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
                            {sceletonData.map((d, idx) => (
                                <div className={styles.dataRow}>
                                    <div
                                        className={styles.dataKeyField}
                                        onDblClick={() => setTemplateInputRow([0, idx])}
                                    >
                                        {templateInputRow[0] === 0 &&
                                        templateInputRow[1] === idx ? (
                                            <input
                                                type="text"
                                                value={d.key ?? ""}
                                                onBlur={() => setTemplateInputRow([-1, -1])}
                                                ref={templateInputRowRef}
                                            />
                                        ) : (
                                            <span>{d.key}</span>
                                        )}
                                    </div>
                                    <div
                                        className={styles.dataValueField}
                                        onDblClick={() => setTemplateInputRow([1, idx])}
                                    >
                                        {templateInputRow[0] === 1 &&
                                        templateInputRow[1] === idx ? (
                                            <input
                                                type="text"
                                                value={d.key ?? ""}
                                                onBlur={() => setTemplateInputRow([-1, -1])}
                                                ref={templateInputRowRef}
                                            />
                                        ) : (
                                            <span>{d.value}</span>
                                        )}
                                    </div>
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
                                <span>~{sceletonData.length} rows</span>
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
