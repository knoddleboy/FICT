import { FunctionalComponent as FC, Ref } from "preact";
import useDelayUnmount from "../../hooks/useDelayUnmount";
import Button from "../Button";
import styled from "styled-components";
import styles from "./ContextMenu.module.scss";

interface IContextMenu {
    active?: boolean;
    contextRef?: Ref<HTMLDivElement>;
    background?: {
        /** Color in hex */
        color: string;
        /** Alpha in percent */
        alpha?: number;
    };
    top?: number | string;
    left?: number | string;
}

const StyledContextMenu = styled.div<{ children: any } & { mounted: boolean }>`
    position: absolute;
    z-index: 999;
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

export const ContextMenu: FC<IContextMenu> = ({
    active = false,
    contextRef,
    top,
    left,
    children,
}) => {
    const shouldRender = useDelayUnmount(active, 100);

    return shouldRender ? (
        <StyledContextMenu mounted={active} style={{ top, left }} ref={contextRef}>
            {children}
        </StyledContextMenu>
    ) : null;
};

interface IContextItem {
    background?: {
        /** Color in hex */
        color: string;
        /** Alpha in percent */
        alpha?: number;
    };
    onClick?(): void;
}

export const ContextItem: FC<IContextItem> = ({ background, onClick, children }) => {
    return (
        <Button background={background} className={styles.contextMenuItem} onClick={onClick}>
            {children}
        </Button>
    );
};
