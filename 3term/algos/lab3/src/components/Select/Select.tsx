import SelectItem from "./SelectItem";
import styles from "./Select.module.scss";
import variables from "../../styles/variables.module.scss";

import Button from "../Button";
import { AddIcon } from "../../assets/svg";

import { writeTextFile, BaseDirectory, readDir, FileEntry } from "@tauri-apps/api/fs";
import { MAIN_DATA_DIR } from "../../constants";
import { useState } from "preact/hooks";

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

    const createTable = async () => {
        await writeTextFile(`${MAIN_DATA_DIR}/db${tableEntries.length}.txt`, "", {
            dir: BaseDirectory.AppData,
        }).then(() => {
            updateTableEntries();
        });
    };

    return (
        <div className={styles.selectRoot}>
            <h4 className={styles.title}>TABLES</h4>
            {tableEntries.length ? (
                <ul>
                    {tableEntries.map((table) => (
                        <li>
                            <SelectItem>{table.name}</SelectItem>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className={styles.selectEmpty}>
                    <Button
                        background={{
                            color: variables.systemTertiaryDark,
                            alpha: 30,
                        }}
                        className={styles.selectEmptyIconWrapper}
                        onClick={createTable}
                    >
                        <AddIcon size={36} className={styles.selectEmptyIcon} />
                    </Button>
                </div>
            )}
        </div>
        // <div className={styles.selectRoot}>
        //     <h4 className={styles.title}>TABLES</h4>
        //     <ul>
        //         {tableEntries.map((table) => (
        //             <li>
        //                 <SelectItem name={table.name} />
        //             </li>
        //         ))}
        //     </ul>
        //     <div className={styles.selectEmpty}>
        //         <Button
        //             background={{
        //                 color: variables.systemTertiaryDark,
        //                 alpha: 30,
        //             }}
        //             className={styles.selectEmptyIconWrapper}
        //             onClick={createTable}
        //         >
        //             <AddIcon size={36} className={styles.selectEmptyIcon} />
        //         </Button>
        //     </div>
        // </div>
    );
};
