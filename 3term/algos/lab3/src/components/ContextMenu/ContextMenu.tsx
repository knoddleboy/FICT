import { toChildArray, FunctionalComponent as FC, Ref } from "preact";
import styled from "styled-components";
import Button from "../Button";
import styles from "./ContextMenu.module.scss";

import useDelayUnmount from "../../hooks/useDelayUnmount";
import { useState } from "preact/hooks";

interface IContextMenuItem extends FC {}

interface IContextMenu {
    active?: boolean;
    contextRef?: Ref<HTMLDivElement>;
    background?: {
        /** Color in hex */
        color: string;
        /** Alpha in percent */
        alpha?: number;
    };
    top?: number;
    left?: number;
}

interface IStyledContextMenu {
    bgcolor: string;
    bgalpha: number;
    mounted: boolean;
}

const StyledContextMenu = styled.div<{ children: any } & IStyledContextMenu>`
    position: absolute;
    border-radius: 12px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -2px;
    transform-origin: 0 0;
    animation: 100ms ease ${(props) => (props.mounted ? "contextIn" : "contextOut")} forwards;

    @keyframes contextIn {
        0% {
            transform: scale(0.5);
            opacity: 0;
        }
        60% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(1);
        }
    }

    @keyframes contextOut {
        100% {
            transform: scale(0.5);
            opacity: 0;
        }
    }
`;

export const ContextMenu: FC<IContextMenu> & { Item: IContextMenuItem } = ({
    active = false,
    contextRef,
    background,
    top,
    left,
    children,
}) => {
    let { color, alpha } = background ?? {};
    color = color || "transparent";
    alpha = alpha || 0;

    const shouldRender = useDelayUnmount(active, 100);

    return shouldRender ? (
        <StyledContextMenu
            bgcolor={color}
            bgalpha={alpha || 0}
            mounted={active}
            style={{ top, left }}
            ref={contextRef}
        >
            {toChildArray(children).map((child) => (
                <Button
                    background={{ color: color || "transparent", alpha: alpha || 0 }}
                    className={styles.contextMenuItem}
                >
                    {child}
                </Button>
            ))}
        </StyledContextMenu>
    ) : null;
};

const Item: FC = ({ children }) => <>{children}</>;
ContextMenu.Item = Item;
