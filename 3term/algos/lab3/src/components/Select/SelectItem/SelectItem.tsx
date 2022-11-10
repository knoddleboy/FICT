import { FunctionalComponent as FC } from "preact";
import { DBIcon } from "../../../assets/svg";
import Button from "../../Button";
import variables from "../../../styles/variables.module.scss";
import styles from "./SelectItem.module.scss";

export const SelectItem: FC<{ name?: string }> = ({ name }) => {
    return (
        <Button
            background={{
                color: variables.systemTertiaryDark,
                alpha: 32,
            }}
            className={styles.selectItemButton}
        >
            <div className={styles.selectItemWrapper}>
                <DBIcon fill={variables.systemSecondaryDark} />
                <div style={{ marginLeft: "8px" }}>{name}</div>
            </div>
        </Button>
    );
};
