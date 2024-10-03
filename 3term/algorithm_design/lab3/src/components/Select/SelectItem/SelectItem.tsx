import { FunctionalComponent as FC } from "preact";
import { DBIcon, AddIcon } from "../../../assets/svg";
import Button from "../../Button";
import variables from "../../../styles/variables.module.scss";
import styles from "./SelectItem.module.scss";

interface ISelectItem {
    disabled?: boolean;
    toRemove?: boolean;
    selected?: boolean;
    onClick?(): void;
}

export const SelectItem: FC<ISelectItem> = ({
    disabled = false,
    selected = false,
    toRemove = false,
    onClick,
    children,
}) => {
    return (
        <Button
            background={{
                color: variables.systemTertiaryDark,
                alpha: toRemove ? 26 : selected ? 29 : 32,
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
                <div className={styles.selectItemChildren}>{children}</div>
            </div>
        </Button>
    );
};
