import SelectItem from "./SelectItem";
import styles from "./Select.module.scss";
import variables from "../../styles/variables.module.scss";

import Button from "../Button";
import { AddIcon } from "../../assets/svg";

import { writeTextFile, BaseDirectory, readDir, FileEntry } from "@tauri-apps/api/fs";
import { MAIN_DATA_DIR } from "../../constants";
import { useState, useRef, useEffect } from "preact/hooks";

import filenamify from "filenamify";

const initalTableEntries = await readDir(MAIN_DATA_DIR, {
    dir: BaseDirectory.AppData,
    recursive: true,
});

export const Select = () => {
    const [tableEntries, setTableEntries] = useState<FileEntry[]>(initalTableEntries);

    const updateTableEntries = async () => {
        const entries = await readDir(MAIN_DATA_DIR, {
            dir: BaseDirectory.AppData,
            recursive: true,
        });
        setTableEntries(entries);
    };

    const createTable = async (name: string) => {
        await writeTextFile(`${MAIN_DATA_DIR}/${name}.txt`, "", {
            dir: BaseDirectory.AppData,
        }).then(() => {
            updateTableEntries();
        });
    };

    const [finishNewTable, setFinishNewTable] = useState(false);

    const [tableCreatingTemplate, setTableCreatingTemplate] = useState(false);
    const tableCreatingTemplateInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (tableCreatingTemplate) {
            tableCreatingTemplateInputRef.current?.focus();
        }
    }, [tableCreatingTemplate]);

    const [newTableName, setNewTableName] = useState("");

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
        }
    };

    return (
        <div className={styles.selectRoot}>
            <h4 className={styles.title}>TABLES</h4>

            {tableEntries.length ? (
                // renders: when there are saved tables and return select list of them
                <ul>
                    {tableEntries.map((table) => (
                        <li>
                            <SelectItem>{table.name}</SelectItem>
                        </li>
                    ))}
                </ul>
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
                // renders: when no longer focused on table name input
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
