import { writeTextFile, removeFile, readDir, FileEntry, BaseDirectory } from "@tauri-apps/api/fs";
import { useState, useRef, useEffect } from "preact/hooks";
import filenamify from "filenamify";

import useOnClickOutside from "../../hooks/useOnClickOutside";
import { MAIN_DATA_DIR, EXTENSION } from "../../constants";

import Button from "../Button";
import SelectItem from "./SelectItem";
import ContextMenu, { ContextItem } from "../ContextMenu";
import { AddIcon, EditIcon } from "../../assets/svg";

import styles from "./Select.module.scss";
import variables from "../../styles/variables.module.scss";

// Get tables on open
const initalTableEntries = await readDir(MAIN_DATA_DIR, {
    dir: BaseDirectory.AppData,
    recursive: true,
});

export const Select = () => {
    /********************
     *      STATES      *
     ********************/

    const [invokeCreateTable, setInvokeCreateTable] = useState(false);
    const [invokeDeleteTable, setInvokeDeleteTable] = useState(false);

    // Array of saved tables
    const [tableEntries, setTableEntries] = useState<FileEntry[]>(initalTableEntries);

    // When `true` show creating template (with input)
    const [tableCreatingTemplate, setTableCreatingTemplate] = useState(false);

    // Name of newly create table to display in `Select`
    const [newTableName, setNewTableName] = useState("");

    // Whether user save a new table (clicked Enter) to replace template with the table
    const [finishNewTable, setFinishNewTable] = useState(false);

    // open-close context menu
    const [openContext, setOpenContext] = useState(false);

    // set of clicked tables while deleting
    const [tableClicked, setTableClicked] = useState<Set<number>>(new Set());

    /********************
     *       REFS       *
     ********************/

    const tableCreatingTemplateInputRef = useRef<HTMLInputElement>(null);

    const tablesListRef = useRef<HTMLUListElement>(null);

    // Close edit context when clicked outside
    const contextRef = useRef<HTMLDivElement>(null);

    const editButtonRef = useRef<HTMLButtonElement>(null);

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
        setNewTableName("");
        setFinishNewTable(false);
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
                const fname = t.name?.split(".").slice(0, -1).join(".");
                if (fname === val) {
                    input.style.borderColor = variables.systemPrimaryRed;
                    return;
                }
            }

            val = filenamify(val); // convert to a valid filename
            setNewTableName(val);
            setFinishNewTable(true);
            createTable(val);

            resetTemplate();
            setOpenContext(false); // close context when finished
        }
    };

    const deleteTables = (tables: Set<number>) => {
        if (!tables.size) return;

        // remove tables from enties ...
        setTableEntries((prev) => [...prev].filter((_, i) => !tables.has(i)));

        // ... as well as from disk
        tables.forEach((t) => {
            removeFile(`${MAIN_DATA_DIR}/${tableEntries[t].name}`, { dir: BaseDirectory.AppData });
        });

        setTableClicked(new Set()); // remove selection
        setInvokeDeleteTable(false); // reset delete invoke

        setOpenContext(false); // close context after deletion
    };

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

    useOnClickOutside(
        contextRef,
        () => {
            setOpenContext(false); // close context menu

            setInvokeCreateTable(false); // reset invokes
            setInvokeDeleteTable(false); // ..

            setTableClicked(new Set()); // remove selection from tables
        },
        invokeDeleteTable ? [editButtonRef, tablesListRef] : [editButtonRef]
    );

    return (
        <>
            <ContextMenu
                top={"calc(2% + 36px)"}
                left={"calc(27% + 36px)"}
                active={openContext}
                contextRef={contextRef}
            >
                <ContextItem
                    background={{
                        color: variables.systemTertiaryDark,
                        alpha: 32,
                    }}
                    onClick={() => {
                        setInvokeCreateTable(true);

                        // set false to ensure that when creating a new table,
                        // delition does not occur
                        setInvokeDeleteTable(false);
                    }}
                >
                    Create
                </ContextItem>
                <ContextItem
                    background={{
                        color: variables.systemTertiaryDark,
                        alpha: 32,
                    }}
                    onClick={() => {
                        // on second click: delete selected tables (if any)
                        if (invokeDeleteTable && tableClicked.size) {
                            deleteTables(tableClicked);
                            return;
                        }

                        // TODO: display deletion msg
                        //  no need to delete when there are no tables
                        if (!tableEntries.length) {
                            return;
                        }

                        setInvokeDeleteTable(true);

                        // set false to ensure that when deleting tables,
                        // creation does not occur
                        setInvokeCreateTable(false);
                    }}
                >
                    Delete
                </ContextItem>
            </ContextMenu>
            <Button
                background={{
                    color: variables.systemTertiaryDark,
                    alpha: 32,
                }}
                className={styles.editButton}
                onClick={() => setOpenContext((prev) => !prev)}
                buttonRef={editButtonRef}
            >
                <EditIcon size={20} className={styles.editButtonIcon} />
            </Button>

            <div className={styles.selectRoot}>
                <h4 className={styles.title}>
                    {invokeDeleteTable ? "Choose to delete" : "Tables"}
                </h4>

                {tableEntries.length || tableCreatingTemplate ? (
                    // renders: when there are saved tables and return select list of them
                    <>
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
                        <ul ref={tablesListRef}>
                            {tableEntries.map((table, idx) => {
                                return (
                                    <li key={idx}>
                                        <SelectItem
                                            selected={tableClicked.has(idx)}
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
                                                }
                                            }}
                                        >
                                            {table.name}
                                        </SelectItem>
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                ) : (
                    // -- Add Table Button --
                    // renders: when there is no tables
                    <div className={styles.selectEmpty}>
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
                    </div>
                )}
            </div>
        </>
    );
};
