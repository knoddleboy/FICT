import { FunctionalComponent as FC } from "preact";
import styled from "styled-components";
import styles from "./TreeView.module.scss";

type Tree = {
    data: {
        key: number;
        value: string;
    };
    height: number;
    left: Tree;
    right: Tree;
};

interface IStylesDataNode {
    isLeaf: boolean;
}

const StylesDataNode = styled.div<{ children: any } & IStylesDataNode>`
    position: relative;

    --gap: 12px;

    &::before {
        content: "";
        position: absolute;
        width: 0;
        height: calc(100% + var(--gap) / 2);
        top: calc(100% + var(--gap) / 2);
        left: var(--gap);

        display: ${(props) => (props.isLeaf ? "none" : "initial")};
    }
`;

const TreeViewRenderer: FC<{ tree: Tree; depth?: number }> = ({ tree, depth = 0 }) => {
    if (!tree) return null;

    return (
        <>
            <StylesDataNode
                style={{ marginLeft: 40 * depth + "px" }}
                className={styles.treeDataNode}
                isLeaf={tree.left === null && tree.right === null}
            >
                <div data-attr="key">{tree.data.key}:</div>
                <div data-attr="value">{tree.data.value}</div>
            </StylesDataNode>
            {/* <div style={{ marginLeft: 40 * depth + "px" }} className={styles.treeDataNode}>
                <div data-attr="key">{tree.data.key}:</div>
                <div data-attr="value">{tree.data.value}</div>
            </div> */}
            <div>{<TreeViewRenderer tree={tree.left} depth={depth + 1} />}</div>
            <div>{<TreeViewRenderer tree={tree.right} depth={depth + 1} />}</div>
        </>
    );
};

export const TreeView: FC<{ tree: Tree }> = ({ tree }) => {
    if (!tree) return null;

    return (
        <div className={styles.treeViewRoot}>
            <TreeViewRenderer tree={tree} depth={0} />
        </div>
    );
};
