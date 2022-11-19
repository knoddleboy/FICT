import { FunctionalComponent as FC } from "preact";
import styles from "./Workbench.module.scss";
import variables from "../../styles/variables.module.scss";

import { AddIconThin, RemoveIcon, SearchIcon } from "../../assets/svg";

import { AppContext } from "../../App";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import Button from "../Button";

import { readTextFile, BaseDirectory, FileEntry } from "@tauri-apps/api/fs";
import { MAIN_DATA_DIR } from "../../constants";
import { effect, signal } from "@preact/signals";
import useOnClickOutside from "../../hooks/useOnClickOutside";

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

const readTable = async (filename: string) => {
    const res = await readTextFile(`${MAIN_DATA_DIR}/${filename}`, { dir: BaseDirectory.AppData });
    return res;
};

export const Workbench: FC = () => {
    const { workingTable } = useContext(AppContext);

    const [activeViewButton, setActiveViewButton] = useState(0);

    const [data, setData] = useState<TableData[]>([]);

    const prevTable = useRef<FileEntry | undefined>(undefined);
    useEffect(() => {
        if (!workingTable.value) return;

        if (prevTable.current === undefined) {
            prevTable.current = {
                name: "?", // just arbitrary value to satisfy if below
                path: "",
            };
        }

        const tname = workingTable.value?.name;
        const prevtname = prevTable.current?.name;

        if (tname && prevtname && tname !== prevtname) {
            setData([]);
            readTable(tname).then((res) => {
                res.split("\n").map((d) => {
                    if (!d) return setData([]);

                    const [dk, dv] = d.split(",");
                    const obj = {
                        key: parseInt(dk),
                        value: dv,
                    };
                    setData((prev) => [...prev, obj]);
                });
            });
        }

        prevTable.current = workingTable.value;
    }, [workingTable.value]);

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

        // if (e.key === "Tab" && templateInputRow[0] === 0) {
        //     input.blur();
        //     setTemplateInputRow([1, idx]);
        // }

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

    const [invokeAddRow, setInvokeAddRow] = useState(false);

    // display input after adding new row (so user can begin inputing)
    useEffect(() => {
        if (data && invokeAddRow) {
            setTemplateInputRow([0, data.length - 1]);
            setInvokeAddRow(false);
        }
    }, [data, invokeAddRow]);

    const [invokeDeleteRow, setInvokeDeleteRow] = useState(false);
    const [rowClicked, setRowClicked] = useState<Set<number>>(new Set());

    const deleteRows = (rows: Set<number>) => {
        if (!rows.size) return;

        // remove rows from disk ...
        // rows.forEach((r) => {
        //     removeFile(`${MAIN_DATA_DIR}/${tableEntries[r].name}`, { dir: BaseDirectory.AppData });
        //     if (tableEntries[t] === workingTable.value) {
        //         workingTable.value = undefined;
        //         setCurrentTable("");
        //     }
        // });

        // .. as well as from enties
        setData((prev) => [...prev].filter((_, i) => !rows.has(i)));

        setRowClicked(new Set()); // remove selection
        setInvokeDeleteRow(false); // reset delete invoke
    };

    const deleteButtonRef = useRef<HTMLButtonElement>(null);
    const rowsListRef = useRef<HTMLUListElement>(null);

    useOnClickOutside(
        deleteButtonRef,
        () => {
            console.log(214);

            setInvokeDeleteRow(false); // reset invoke
            setRowClicked(new Set()); // remove selection from rows
        },
        [rowsListRef]
    );

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
                        <ul className={styles.displayTableRoot} ref={rowsListRef}>
                            {data.map((d, idx) => (
                                <li
                                    className={`${styles.dataRow} ${
                                        rowClicked.has(idx) ? styles.dataRowSelected : ""
                                    }`}
                                    key={idx}
                                    onClick={() => {
                                        if (invokeDeleteRow) {
                                            // if `idx` table was already clicked, remove its index ...
                                            if (rowClicked.has(idx)) {
                                                setRowClicked(
                                                    (prev) =>
                                                        new Set([...prev].filter((i) => i !== idx))
                                                );
                                                // ... otherwise add its index
                                            } else {
                                                setRowClicked((prev) => new Set(prev.add(idx)));
                                            }
                                            return;
                                        }
                                    }}
                                >
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
                                </li>
                            ))}
                        </ul>
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
                                <span>~{data.length} rows</span>
                            </div>
                            <div className={styles.rowsEdit}>
                                <Button
                                    background={{
                                        color: variables.systemTertiaryDark,
                                        alpha: 32,
                                    }}
                                    onClick={() => {
                                        //  no need to delete when there are no rows
                                        if (!data.length) {
                                            return;
                                        }

                                        // on second click: delete selected rows (if any)
                                        if (invokeDeleteRow && rowClicked.size) {
                                            deleteRows(rowClicked);
                                            return;
                                        }

                                        setInvokeDeleteRow(true);

                                        // set false to ensure that when deleting rows,
                                        // creation does not occur
                                        setInvokeAddRow(false);
                                    }}
                                    buttonRef={deleteButtonRef}
                                >
                                    <RemoveIcon size={20} fill={variables.systemSecondaryDark} />
                                    Row
                                </Button>
                                <Button
                                    background={{
                                        color: variables.systemTertiaryDark,
                                        alpha: 32,
                                    }}
                                    onClick={() => {
                                        if (invokeDeleteRow) return;
                                        setData((prev) => [...prev, { key: null, value: null }]);
                                        setInvokeAddRow(true);
                                    }}
                                >
                                    <AddIconThin size={20} fill={variables.systemSecondaryDark} />
                                    Row
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    // renders: when no table selected
                    <h4 className={styles.workbenchEmpty}>Select a table</h4>
                )}
            </div>
        </>
    );
};
