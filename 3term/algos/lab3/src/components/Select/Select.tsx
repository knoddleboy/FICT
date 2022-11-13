import { writeTextFile, BaseDirectory, readDir, FileEntry } from "@tauri-apps/api/fs";
import { useState, useRef, useEffect, useContext } from "preact/hooks";
import filenamify from "filenamify";

import Button from "../Button";
import SelectItem from "./SelectItem";
import { AddIcon } from "../../assets/svg";
import { MAIN_DATA_DIR } from "../../constants";

import styles from "./Select.module.scss";
import variables from "../../styles/variables.module.scss";

import { AppState } from "../../App";
import { effect } from "@preact/signals";

// Get tables on open
const initalTableEntries = await readDir(MAIN_DATA_DIR, {
    dir: BaseDirectory.AppData,
    recursive: true,
});

export const Select = () => {
    const { invokeCreateTable, invokeDeleteTable } = useContext(AppState);

    // Array of saved tables
    const [tableEntries, setTableEntries] = useState<FileEntry[]>(initalTableEntries);

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
        await writeTextFile(`${MAIN_DATA_DIR}/${name}.txt`, "", {
            dir: BaseDirectory.AppData,
        }).then(() => {
            updateTableEntries();
        });
    };

    // When `true` show creating template (with input)
    const [tableCreatingTemplate, setTableCreatingTemplate] = useState(false);
    const tableCreatingTemplateInputRef = useRef<HTMLInputElement>(null);

    // Focus table name input when creating a new table
    useEffect(() => {
        if (tableCreatingTemplate) {
            tableCreatingTemplateInputRef.current?.focus();
        }
    }, [tableCreatingTemplate]);

    effect(() => {
        if (invokeCreateTable.value === true) {
            setTableCreatingTemplate(true);
        }
    });

    // Name of newly create table to display in `Select`
    const [newTableName, setNewTableName] = useState("");

    // Whether user save a new table (clicked Enter) to replace template with the table
    const [finishNewTable, setFinishNewTable] = useState(false);

    const resetTemplate = () => {
        setTableCreatingTemplate(false);
        invokeCreateTable.value = false;
    };

    const handleInputEnd = (e: KeyboardEvent) => {
        const input = tableCreatingTemplateInputRef.current;
        if (!input) return;

        if (e.key === "Escape") {
            input.blur();
        }

        let val = input.value;
        if (e.key === "Enter" && val) {
            val = filenamify(val); // convert to a valid filename
            setNewTableName(val);
            setFinishNewTable(true);
            createTable(val);

            resetTemplate();
        }
    };

    return (
        <div className={styles.selectRoot}>
            <h4 className={styles.title}>
                {invokeDeleteTable.value ? "Choose to delete" : "Tables"}
            </h4>

            {tableEntries.length ? (
                // renders: when there are saved tables and return select list of them
                <>
                    {tableCreatingTemplate && (
                        <SelectItem disabled>
                            <input
                                type="text"
                                className={styles.inp}
                                ref={tableCreatingTemplateInputRef}
                                onBlur={resetTemplate}
                                onKeyDown={handleInputEnd}
                            />
                        </SelectItem>
                    )}
                    <ul>
                        {tableEntries.map((table) => (
                            <li>
                                <SelectItem>{table.name}</SelectItem>
                            </li>
                        ))}
                    </ul>
                </>
            ) : tableCreatingTemplate ? (
                // renders: when clicked on "+" (add) button
                tableCreatingTemplate && !finishNewTable ? (
                    // renders: when focused on table name input
                    <SelectItem disabled>
                        <input
                            type="text"
                            className={styles.inp}
                            ref={tableCreatingTemplateInputRef}
                            onBlur={() => setTableCreatingTemplate(false)}
                            onKeyDown={handleInputEnd}
                        />
                    </SelectItem>
                ) : (
                    // renders: when confirmed table name input with "Enter" (aka save table)
                    <SelectItem>{newTableName}</SelectItem>
                )
            ) : (
                // renders: renders when there is no tables
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
    );
};
