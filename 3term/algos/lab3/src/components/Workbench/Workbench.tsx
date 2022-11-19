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

const data = [
    { key: 927358934684283, value: "hlmcalwjet" },
    { key: 1, value: "ljhdvn" },
    { key: 2, value: "rghtop" },
    { key: 3, value: "ehrth" },
    { key: 4, value: "drthrth" },
    { key: 5, value: "vmnlske" },
];

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

    const handleInputEnd = (e: KeyboardEvent, idx: number, column: number) => {
        const input = templateInputRowRef.current;
        if (!input) return;

        if (e.key === "Escape") {
            input.blur();
        }

        let val = input.value;
        if (e.key === "Enter") {
            if (column === 0) {
                if (!val) {
                    input.style.border = "1px solid red";
                    input.style.backgroundColor = "#ffe6e6";
                    return;
                }

                data[idx].key = parseInt(val);
            } else if (column === 1) {
                data[idx].value = val;
            }

            input.blur();
        }
    };

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
                            {data.map((d, idx) => (
                                <div className={styles.dataRow} key={idx}>
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
                                                onKeyDown={(e) => handleInputEnd(e, idx, 0)}
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
                                                value={d.value ?? ""}
                                                onBlur={() => setTemplateInputRow([-1, -1])}
                                                ref={templateInputRowRef}
                                                onKeyDown={(e) => handleInputEnd(e, idx, 1)}
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
