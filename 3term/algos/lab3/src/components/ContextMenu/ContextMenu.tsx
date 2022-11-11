import { toChildArray, FunctionalComponent as FC } from "preact";
import styled from "styled-components";
import Button from "../Button";
import styles from "./ContextMenu.module.scss";

interface IContextMenuItem extends FC {}

interface IContextMenu {
    background?: {
        /** Color in hex */
        color: string;
        /** Alpha in percent */
        alpha?: number;
    };
}

interface IStyledContextMenu {
    bgcolor: string;
    bgalpha: number;
}

const StyledContextMenu = styled.div<{ children: any } & IStyledContextMenu>`
    position: absolute;
    border-radius: 12px;
`;

export const ContextMenu: FC<IContextMenu> & { Item: IContextMenuItem } = ({
    children,
    background,
}) => {
    let { color, alpha } = background ?? {};
    color = color || "transparent";
    alpha = alpha || 0;

    return (
        <StyledContextMenu bgcolor={color} bgalpha={alpha || 0}>
            {toChildArray(children).map((child) => (
                <Button
                    background={{ color: color || "transparent", alpha: alpha || 0 }}
                    className={styles.contextMenuItem}
                >
                    {child}
                </Button>
            ))}
        </StyledContextMenu>
    );
};

const Item: FC = ({ children }) => <>{children}</>;
ContextMenu.Item = Item;
