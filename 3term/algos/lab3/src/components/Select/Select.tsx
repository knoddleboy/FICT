import SelectItem from "./SelectItem";
import styles from "./Select.module.scss";

export const Select = () => {
    const a: string[] = [];
    for (let i = 0; i < 15; i++) {
        a.push((Math.random() + 1).toString(36).substring(2));
    }

    return (
        <div className={styles.selectRoot}>
            <h4 className={styles.title}>TABLES</h4>
            <ul>
                {a.map((el) => (
                    <li>
                        <SelectItem name={el} />
                    </li>
                ))}
            </ul>
        </div>
    );
};
