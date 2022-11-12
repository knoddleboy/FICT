import { FunctionalComponent as FC } from "preact";
import { DBIcon } from "../../../assets/svg";
import Button from "../../Button";
import variables from "../../../styles/variables.module.scss";
import styles from "./SelectItem.module.scss";

export const SelectItem: FC<{ disabled?: boolean }> = ({ disabled = false, children }) => {
    return (
        <Button
            background={{
                color: variables.systemTertiaryDark,
                alpha: 32,
            }}
            disabled={disabled}
            className={styles.selectItemButton}
        >
            <div className={styles.selectItemWrapper}>
                <div>
                    <DBIcon
                        fill={variables.systemSecondaryDark}
                        style={{ verticalAlign: "middle" }}
                    />
                </div>
                <div className={styles.selectItemName}>{children}</div>
            </div>
        </Button>
    );
};
