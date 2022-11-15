import { FunctionalComponent as FC } from "preact";
import { DBIcon } from "../../../assets/svg";
import Button from "../../Button";
import variables from "../../../styles/variables.module.scss";
import styles from "./SelectItem.module.scss";

interface ISelectItem {
    disabled?: boolean;
    selected?: boolean;
    onClick?(): void;
}

export const SelectItem: FC<ISelectItem> = ({
    disabled = false,
    selected = false,
    onClick,
    children,
}) => {
    return (
        <Button
            background={{
                color: variables.systemTertiaryDark,
                alpha: selected ? 26 : 32,
            }}
            disabled={disabled}
            className={styles.selectItemButton}
            onClick={onClick}
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
