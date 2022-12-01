import { readTextFile, BaseDirectory, FileEntry } from "@tauri-apps/api/fs";
import { register, unregister } from "@tauri-apps/api/globalShortcut";
import { invoke } from "@tauri-apps/api";
import { useContext, useEffect, useRef, useState } from "preact/hooks";

import useOnClickOutside from "../../hooks/useOnClickOutside";
import { MAIN_DATA_DIR } from "../../constants";
import { AppContext } from "../../App";

import Button from "../Button";
import TreeView from "../TreeView";
import { AddIconThin, RemoveIcon, SearchIcon, SettingsIcon } from "../../assets/svg";

import styles from "./Workbench.module.scss";
import variables from "../../styles/variables.module.scss";

/********************
 *      GLOBALS     *
 ********************/

type TableData = {
    key: number | null;
    value: string | null;
};

type TableDataObject = {
    data: {
        key: number;
        value: string;
    };
    left: TableDataObject;
    right: TableDataObject;
};

enum TColumn {
    Key = "Key",
    Value = "Value",
    NA = "NA",
}

enum DataDisplay {
    Tabular = "Tabular",
    TreeLike = "TreeLike",
}

const invokeCtrlA = async (reg: boolean, callback?: () => void) => {
    if (reg) {
        await register("CommandOrControl+A", callback || (() => {}));
        return;
    }

    await unregister("CommandOrControl+A");
};

const readTable = async (filename: string) => {
    const res = await readTextFile(`${MAIN_DATA_DIR}/${filename}`, { dir: BaseDirectory.AppData });
    return res;
};

export const Workbench = () => {
    /********************
     *      CONTEXT     *
     ********************/

    const { workingTable } = useContext(AppContext);

    /********************
     *      STATES      *
     ********************/

    // change table data display look: tabular or treelike
    const [activeViewButton, setActiveViewButton] = useState<DataDisplay>(DataDisplay.Tabular);

    // actual data from a table
    const [data, setData] = useState<TableData[]>([]);
    const [dataObject, setDataObject] = useState<any>();

    const [templateInputRow, setTemplateInputRow] = useState<[TColumn, TableData | null]>([
        TColumn.NA,
        null,
    ]);

    // row action: insert or modify
    const [actionRow, setActionRow] = useState<(TableData & { prev_key: number | null }) | null>(
        null
    );

    // holds all clicked rows when deleting
    const [rowClicked, setRowClicked] = useState<Set<TableData>>(new Set());

    const [invokeAddRow, setInvokeAddRow] = useState(false);
    const [invokeDeleteRow, setInvokeDeleteRow] = useState(false);

    const [registerDelete, setRegisterDelete] = useState(false);

    /********************
     *       REFS       *
     ********************/

    const prevTable = useRef<FileEntry | undefined>(undefined);
    const templateInputRowRef = useRef<HTMLInputElement>(null);
    const searchFieldRef = useRef<HTMLInputElement>(null);
    const deleteButtonRef = useRef<HTMLButtonElement>(null);
    const rowsListRef = useRef<HTMLUListElement>(null);

    /********************
     *     FUNCTIONS    *
     ********************/

    // parse table from file to array
    const parseTable = (tname: string) => {
        setData([]);

        const temp_table: TableData[] = [];

        readTable(tname)
            .then((res) => {
                res.split("\n").map((d) => {
                    if (!d) return setData([]);

                    const [dk, dv] = d.split(",");
                    const obj = {
                        key: parseInt(dk),
                        value: dv,
                    };
                    temp_table.push(obj);
                });
            })
            .then(() => {
                setData(temp_table);
            });
    };

    const handleInputEnd = (e: KeyboardEvent, idx: TableData, column: number) => {
        const input = templateInputRowRef.current;
        if (!input) return;

        if (e.key === "Escape") {
            input.blur();
        }

        let val = input.value;
        if (e.key === "Enter") {
            if (column === 0) {
                const parsedVal = parseInt(val);

                if (isNaN(parsedVal)) {
                    input.style.border = "1px solid red";
                    input.style.backgroundColor = "#ffe6e6";
                    return;
                }

                // ensure entered key is not already in the tree
                invoke<boolean>("contains_item", { key: parsedVal }).then((res) => {
                    if (res) {
                        alert(`Item with key ${parsedVal} already exists.`);
                    } else {
                        setActionRow({
                            prev_key: idx.key,
                            key: parsedVal,
                            value: idx.value,
                        });

                        setData((prev) => {
                            let item = idx;
                            item.key = parsedVal;
                            prev[prev.indexOf(idx)] = item;
                            return prev;
                        });
                    }
                });
            } else if (column === 1) {
                setActionRow({
                    prev_key: idx.key,
                    key: idx.key,
                    value: val,
                });

                setData((prev) => {
                    let item = idx;
                    item.value = val;
                    prev[prev.indexOf(idx)] = item;
                    return prev;
                });
            }

            input.blur();
        }
    };

    const deleteRows = (rows: Set<TableData>) => {
        if (!rows.size) return;

        setRegisterDelete(false);

        setData((prev) => [...prev].filter((i) => !rows.has(i)));

        invoke("remove_rows", { keys: [...rows].map((t) => t.key) });

        setRowClicked(new Set()); // remove selection
        setInvokeDeleteRow(false); // reset delete invoke
    };

    const handleInvokeDeleteRows = () => {
        //  no need to delete when there are no rows
        if (!data.length) {
            return;
        }

        // on second click: delete selected rows (if any)
        if (invokeDeleteRow && rowClicked.size) {
            deleteRows(rowClicked);
            return;
        }

        setRegisterDelete(true);

        setInvokeDeleteRow(true);

        // set false to ensure that when deleting rows,
        // creation does not occur
        setInvokeAddRow(false);
    };

    const handleDeleteRows = (idx: TableData) => {
        if (invokeDeleteRow) {
            // if `idx` table was already clicked, remove its index ...
            if (rowClicked.has(idx)) {
                setRowClicked((prev) => new Set([...prev].filter((i) => i !== idx)));
                // ... otherwise add its index
            } else {
                setRowClicked((prev) => new Set(prev.add(idx)));
            }
            return;
        }
    };

    const handleGenerateTable = () => {
        const t = workingTable.value;
        if (!t) return;

        invoke("generate_table", { path: t.path }).then((res) => {
            if (res && t.name) {
                parseTable(t.name);
            }
        });
    };

    const handleSearch = (e: KeyboardEvent) => {
        const input = searchFieldRef.current;
        if (!input || e.key !== "Enter") return;

        let val = parseInt(input.value);

        if ((!val && val !== 0) || val < 0) {
            alert("Incorrect key.");
            return;
        }

        invoke<TableData>("search_item", { key: val }).then((res) => {
            if (res) {
                let rv = res.value,
                    rvSlice = rv,
                    lim = 200;
                if (rv && rv.length > lim)
                    rvSlice = rv.slice(0, lim) + ` <...${rv.length - lim} more...>`;
                alert(`Found item with:\n[key]\n${res.key}\n\n[value]\n${rvSlice}`);
            } else {
                alert("Item not found.");
            }
        });
    };

    const getAvlObject = () => {
        invoke<Record<"root", TableDataObject>>("get_avl").then((res) => {
            setDataObject(res.root);
        });
    };

    /********************
     *      EFFECTS     *
     ********************/

    // update current working table (also used in saving avl tree)
    useEffect(() => {
        invoke("set_working_table", { path: workingTable.value?.path || "" });

        if (activeViewButton === DataDisplay.TreeLike) {
            getAvlObject();
        }
    }, [workingTable.value]);

    // prevent from parsing the same table as previous
    useEffect(() => {
        if (!workingTable.value) return;

        // no parsing table if is in treelike view
        if (activeViewButton === DataDisplay.TreeLike) return;

        if (prevTable.current === undefined) {
            prevTable.current = {
                name: "?", // just arbitrary value to satisfy if stmt below
                path: "",
            };
        }

        const tname = workingTable.value?.name;
        const prevtname = prevTable.current?.name;

        if (tname && prevtname && tname !== prevtname) {
            parseTable(tname);
        }

        prevTable.current = workingTable.value;
    }, [workingTable.value, activeViewButton]);

    // focus input on a clicked row
    useEffect(() => {
        if (templateInputRow[1]) {
            templateInputRowRef.current?.focus();
        }
    }, [templateInputRow]);

    // update avl tree when a row modified
    useEffect(() => {
        if (!actionRow) return;

        if (actionRow.prev_key !== null) {
            invoke("modify_row", {
                prevKey: actionRow.prev_key,
                key: actionRow.key,
                value: actionRow.value,
            });

            setActionRow(null);

            return;
        }

        if (actionRow.key !== null) {
            invoke("insert_row", {
                key: actionRow.key,
                value: actionRow.value ?? "",
            });

            setActionRow(null);
        }
    }, [actionRow]);

    // display input after adding new row (so user can begin inputing)
    useEffect(() => {
        if (data && invokeAddRow) {
            setTemplateInputRow([TColumn.Key, data.at(-1)!]);
            setInvokeAddRow(false);
        }
    }, [data, invokeAddRow]);

    // register select all for rows
    useEffect(() => {
        if (invokeDeleteRow) {
            invokeCtrlA(true, () => {
                setRowClicked(new Set(data.map((d) => d)));
            });
        } else {
            invokeCtrlA(false);
        }
    }, [invokeDeleteRow]);

    useOnClickOutside(
        deleteButtonRef,
        () => {
            setInvokeDeleteRow(false); // reset invoke
            setRowClicked(new Set()); // remove selection from rows
        },
        [rowsListRef]
    );

    useEffect(() => {
        if (!registerDelete) return;

        const handleDelete = (e: KeyboardEvent) => {
            if (e.key === "Backspace" || e.key === "Delete") {
                deleteRows(rowClicked);
            }
        };

        document.addEventListener("keydown", handleDelete);

        return () => document.removeEventListener("keydown", handleDelete);
    }, [registerDelete, rowClicked]);

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
                                <input
                                    id={"searchTable"}
                                    type="text"
                                    placeholder={"Search"}
                                    onKeyDown={handleSearch}
                                    ref={searchFieldRef}
                                />
                            </div>
                        </div>
                        <div className={styles.dataRowHead}>
                            <div className={styles.dataKeyField}>id</div>
                            <div className={styles.dataValueField}>value</div>
                        </div>
                        <ul className={styles.displayTableRoot} ref={rowsListRef}>
                            {activeViewButton === DataDisplay.Tabular ? (
                                data.map((d) => {
                                    const idx = d;
                                    return (
                                        <li
                                            className={`${styles.dataRow} ${
                                                rowClicked.has(idx) ? styles.dataRowSelected : ""
                                            }`}
                                            key={idx}
                                            onClick={() => handleDeleteRows(idx)}
                                        >
                                            <div
                                                className={styles.dataKeyField}
                                                onDblClick={() =>
                                                    setTemplateInputRow([TColumn.Key, idx])
                                                }
                                            >
                                                {templateInputRow[0] === TColumn.Key &&
                                                templateInputRow[1] === idx ? (
                                                    <input
                                                        type="text"
                                                        value={d.key ?? ""}
                                                        onBlur={() =>
                                                            setTemplateInputRow([TColumn.NA, null])
                                                        }
                                                        ref={templateInputRowRef}
                                                        onKeyDown={(e) => handleInputEnd(e, idx, 0)}
                                                    />
                                                ) : (
                                                    <span>{d.key}</span>
                                                )}
                                            </div>
                                            <div
                                                className={styles.dataValueField}
                                                onDblClick={() =>
                                                    setTemplateInputRow([TColumn.Value, idx])
                                                }
                                            >
                                                {templateInputRow[0] === TColumn.Value &&
                                                templateInputRow[1] === idx ? (
                                                    <input
                                                        type="text"
                                                        value={d.value ?? ""}
                                                        onBlur={() =>
                                                            setTemplateInputRow([TColumn.NA, null])
                                                        }
                                                        ref={templateInputRowRef}
                                                        onKeyDown={(e) => handleInputEnd(e, idx, 1)}
                                                    />
                                                ) : (
                                                    <span>{d.value}</span>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })
                            ) : (
                                <TreeView tree={dataObject} />
                            )}
                        </ul>
                        <div className={styles.bottomPanel}>
                            <div className={styles.dataView}>
                                <Button
                                    background={{
                                        color:
                                            activeViewButton === DataDisplay.Tabular
                                                ? variables.systemSecondaryDark
                                                : variables.systemTertiaryDark,
                                        alpha: activeViewButton === DataDisplay.Tabular ? 8 : 32,
                                    }}
                                    foregraund={{
                                        color:
                                            activeViewButton === DataDisplay.Tabular ? "white" : "",
                                    }}
                                    onClick={() => setActiveViewButton(DataDisplay.Tabular)}
                                >
                                    Tabular
                                </Button>
                                <Button
                                    background={{
                                        color:
                                            activeViewButton === DataDisplay.TreeLike
                                                ? variables.systemSecondaryDark
                                                : variables.systemTertiaryDark,
                                        alpha: activeViewButton === DataDisplay.TreeLike ? 8 : 32,
                                    }}
                                    foregraund={{
                                        color:
                                            activeViewButton === DataDisplay.TreeLike
                                                ? "white"
                                                : "",
                                    }}
                                    onClick={() => {
                                        setActiveViewButton(DataDisplay.TreeLike);
                                        getAvlObject();
                                    }}
                                >
                                    Treelike
                                </Button>
                            </div>
                            <div className={styles.info}>
                                <span>
                                    {invokeDeleteRow ? (
                                        <span style={{ fontWeight: 500 }}>SELECT ROWS</span>
                                    ) : (
                                        `~${data.length} rows`
                                    )}
                                </span>
                            </div>
                            <div className={styles.rowsEdit}>
                                <Button
                                    background={{
                                        color: variables.systemTertiaryDark,
                                        alpha: 32,
                                    }}
                                    onClick={handleInvokeDeleteRows}
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
                                <Button
                                    background={{
                                        color: variables.systemTertiaryDark,
                                        alpha: 32,
                                    }}
                                    className={styles.actionButton}
                                    onClick={handleGenerateTable}
                                >
                                    <SettingsIcon fill={variables.systemSecondaryDark} />
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
