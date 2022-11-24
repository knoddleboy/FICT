import { writeTextFile, readDir, FileEntry, BaseDirectory } from "@tauri-apps/api/fs";
import { useState, useRef, useEffect, useContext } from "preact/hooks";
import filenamify from "filenamify";

import useOnClickOutside from "../../hooks/useOnClickOutside";
import { MAIN_DATA_DIR, EXTENSION } from "../../constants";
import { AppContext } from "../../App";

import Button from "../Button";
import SelectItem from "./SelectItem";
import { AddIcon, AddIconThin, RemoveIcon } from "../../assets/svg";

import styles from "./Select.module.scss";
import variables from "../../styles/variables.module.scss";

import { register, unregister } from "@tauri-apps/api/globalShortcut";
import { invoke } from "@tauri-apps/api";

/********************
 *      GLOBALS     *
 ********************/

const invokeCtrlA = async (reg: boolean, callback?: () => void) => {
    if (reg) {
        await register("CommandOrControl+A", callback || (() => {}));
        return;
    }

    await unregister("CommandOrControl+A");
};

// Get tables on open
const initalTableEntries = await readDir(MAIN_DATA_DIR, {
    dir: BaseDirectory.AppData,
    recursive: true,
});

export const Select = () => {
    /********************
     *      CONTEXT     *
     ********************/

    const { workingTable } = useContext(AppContext);

    /********************
     *      STATES      *
     ********************/

    const [invokeCreateTable, setInvokeCreateTable] = useState(false);
    const [invokeDeleteTable, setInvokeDeleteTable] = useState(false);

    // array of saved tables
    const [tableEntries, setTableEntries] = useState<FileEntry[]>(initalTableEntries);

    // when `true` show creating template (with input)
    const [tableCreatingTemplate, setTableCreatingTemplate] = useState(false);

    // set of clicked tables while deleting
    const [tableClicked, setTableClicked] = useState<Set<number>>(new Set());

    // current working table. holds `string` aka file name
    const [currentTable, setCurrentTable] = useState<string>("");

    const [registerDelete, setRegisterDelete] = useState(false);

    /********************
     *       REFS       *
     ********************/

    const tableCreatingTemplateInputRef = useRef<HTMLInputElement>(null);

    const tablesListRef = useRef<HTMLUListElement>(null);

    const deleteButtonRef = useRef<HTMLButtonElement>(null);

    /********************
     *     FUNCTIONS    *
     ********************/

    // Invoke to update tables state
    const updateTableEntries = async () => {
        const entries = await readDir(MAIN_DATA_DIR, {
            dir: BaseDirectory.AppData,
            recursive: true,
        });
        setTableEntries(entries);
    };

    // Create a new table and save to `$APPDATA/databases`
    const createTable = async (name: string) => {
        await writeTextFile(`${MAIN_DATA_DIR}/${name}.${EXTENSION}`, "", {
            dir: BaseDirectory.AppData,
        }).then(() => {
            updateTableEntries();
        });
    };

    const resetTemplate = () => {
        setTableCreatingTemplate(false);
        setInvokeCreateTable(false);
    };

    const handleInputEnd = (e: KeyboardEvent) => {
        const input = tableCreatingTemplateInputRef.current;
        if (!input) return;

        if (e.key === "Escape") {
            input.blur();
        }

        let val = input.value;
        if (e.key === "Enter" && val) {
            // ensure entered name does not exists yet
            for (const t of tableEntries) {
                const fname = removeExtension(t.name);
                if (fname === val) {
                    input.style.borderColor = variables.systemPrimaryRed;
                    return;
                }
            }

            val = filenamify(val); // convert to a valid filename
            createTable(val);

            resetTemplate();
        }
    };

    const deleteTables = (tables: Set<number>) => {
        if (!tables.size) return;

        setRegisterDelete(false);

        // remove tables from disk and from entries
        tables.forEach((t) => {
            invoke("remove_table", { path: tableEntries[t].path });

            // unset workbench if delete current table
            if (tableEntries[t] === workingTable.value) {
                workingTable.value = undefined;
                setCurrentTable("");
            }
        });

        setTableEntries((prev) => [...prev].filter((_, i) => !tables.has(i)));

        setTableClicked(new Set()); // remove selection
        setInvokeDeleteTable(false); // reset delete invoke
    };

    function removeExtension(filename: string | undefined) {
        if (!filename || !filename.length) return "";
        return filename.split(".").slice(0, -1).join(".");
    }

    /********************
     *      EFFECTS     *
     ********************/

    // Focus table name input when creating a new table
    useEffect(() => {
        if (tableCreatingTemplate) {
            tableCreatingTemplateInputRef.current?.focus();
        }
    }, [tableCreatingTemplate]);

    useEffect(() => {
        if (invokeCreateTable) {
            setTableCreatingTemplate(true);
        }
    }, [invokeCreateTable]);

    useEffect(() => {
        if (invokeDeleteTable) {
            invokeCtrlA(true, () => {
                setTableClicked(new Set(tableEntries.map((_, idx) => idx)));
            });
        } else {
            invokeCtrlA(false);
        }
    }, [invokeDeleteTable]);

    useOnClickOutside(
        deleteButtonRef,
        () => {
            setInvokeDeleteTable(false); // reset invoke
            setTableClicked(new Set()); // remove selection from tables
        },
        [tablesListRef]
    );

    useEffect(() => {
        if (!registerDelete) return;

        const handleDelete = (e: KeyboardEvent) => {
            if (e.key === "Backspace" || e.key === "Delete") {
                deleteTables(tableClicked);
            }
        };

        document.addEventListener("keydown", handleDelete);

        return () => document.removeEventListener("keydown", handleDelete);
    }, [registerDelete, tableClicked]);

    return (
        <>
            <div className={styles.selectRoot}>
                <h4 className={styles.title}>
                    {invokeDeleteTable ? "Choose to delete" : "Tables"}
                </h4>

                <div className={styles.tablesContainer}>
                    {tableEntries.length || tableCreatingTemplate ? (
                        // renders: when there are saved tables and return select list of them
                        <>
                            <ul ref={tablesListRef}>
                                {tableEntries
                                    .sort((a, b) => (a.name ?? "")?.localeCompare(b.name ?? ""))
                                    .map((table, idx) => {
                                        return (
                                            <li key={idx}>
                                                <SelectItem
                                                    toRemove={tableClicked.has(idx)}
                                                    selected={currentTable === table.name}
                                                    onClick={() => {
                                                        if (invokeDeleteTable) {
                                                            // if `idx` table was already clicked, remove its index ...
                                                            if (tableClicked.has(idx)) {
                                                                setTableClicked(
                                                                    (prev) =>
                                                                        new Set(
                                                                            [...prev].filter(
                                                                                (i) => i !== idx
                                                                            )
                                                                        )
                                                                );
                                                                // ... otherwise add its index
                                                            } else {
                                                                setTableClicked(
                                                                    (prev) => new Set(prev.add(idx))
                                                                );
                                                            }
                                                            return;
                                                        }

                                                        if (
                                                            !workingTable.value ||
                                                            workingTable.value !== tableEntries[idx]
                                                        ) {
                                                            setCurrentTable(table.name!);
                                                            workingTable.value = tableEntries[idx];
                                                        } else {
                                                            setCurrentTable("");
                                                            workingTable.value = undefined;
                                                        }
                                                    }}
                                                >
                                                    {removeExtension(table.name)}
                                                </SelectItem>
                                            </li>
                                        );
                                    })}
                            </ul>
                            {tableCreatingTemplate && (
                                <SelectItem disabled>
                                    <input
                                        type="text"
                                        className={styles.templateInput}
                                        ref={tableCreatingTemplateInputRef}
                                        onBlur={resetTemplate}
                                        onKeyDown={handleInputEnd}
                                    />
                                </SelectItem>
                            )}
                        </>
                    ) : (
                        // -- Add Table Button --
                        // renders: when there is no tables
                        <Button
                            background={{
                                color: variables.systemTertiaryDark,
                                alpha: 30,
                            }}
                            className={styles.selectEmptyIconWrapper}
                            onClick={() => {
                                setTableCreatingTemplate(true);
                            }}
                        >
                            <AddIcon size={36} className={styles.selectEmptyIcon} />
                        </Button>
                    )}
                </div>

                <div className={styles.editPanel}>
                    <Button
                        background={{
                            color: variables.systemTertiaryDark,
                            alpha: 28,
                        }}
                        onClick={() => {
                            //  no need to delete when there are no tables
                            if (!tableEntries.length) {
                                return;
                            }

                            // on second click: delete selected tables (if any)
                            if (invokeDeleteTable && tableClicked.size) {
                                deleteTables(tableClicked);
                                return;
                            }

                            setRegisterDelete(true);

                            setInvokeDeleteTable(true);

                            // set false to ensure that when deleting tables,
                            // creation does not occur
                            setInvokeCreateTable(false);
                        }}
                        buttonRef={deleteButtonRef}
                    >
                        <RemoveIcon size={20} fill={variables.systemSecondaryDark} />
                        Table
                    </Button>
                    <Button
                        background={{
                            color: variables.systemTertiaryDark,
                            alpha: 28,
                        }}
                        onClick={() => {
                            setInvokeCreateTable(true);

                            // set false to ensure that when creating a new table,
                            // delition does not occur
                            setInvokeDeleteTable(false);
                        }}
                    >
                        <AddIconThin size={20} fill={variables.systemSecondaryDark} />
                        Table
                    </Button>
                </div>
            </div>
        </>
    );
};
