import { FunctionalComponent as FC } from "preact";
import styled from "styled-components";
import { lighten } from "polished";

interface IButton {
    background?: {
        /** Color in hex */
        color: string;
        /** Alpha in percent */
        alpha?: number;
    };
    foregraund?: {
        color: string;
    };
    disabled?: boolean;
    /** Classname for customization via sass module */
    className?: string;
    onClick?(): void;
}

interface IStyledButton {
    bgcolor: string;
    bgalpha: number;
    fgcolor: string;
    disabled: boolean;
}

const StyledButton = styled.button<{ children: any } & IStyledButton>`
    display: flex;
    align-items: center;
    background-color: ${(props) => lighten(props.bgalpha / 100, props.bgcolor)};
    transition: background-color 100ms cubic-bezier(0, 0, 0.5, 1);
    cursor: ${(props) => (props.disabled ? "default" : "pointer")};

    :hover {
        background-color: ${(props) => lighten((props.bgalpha * 7) / 8 / 100, props.bgcolor)};
    }

    :active {
        background-color: ${(props) => {
            if (!props.disabled) return lighten((props.bgalpha * 13) / 16 / 100, props.bgcolor);
            else return;
        }};
    }
`;

export const Button: FC<IButton> = ({
    background,
    foregraund,
    disabled,
    className,
    children,
    onClick,
}) => {
    const { color, alpha } = background ?? {};

    return (
        <StyledButton
            className={className}
            bgcolor={color || "transparent"}
            bgalpha={alpha || 0}
            fgcolor={foregraund?.color ?? "black"}
            disabled={disabled || false}
            onClick={!disabled ? onClick : undefined}
        >
            {children}
        </StyledButton>
    );
};
