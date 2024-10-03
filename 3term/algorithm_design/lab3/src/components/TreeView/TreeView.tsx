/*
THIS COMPONENT IS UNOPTIMIZED FOR LARGE BUNDLES OF DATA
*/

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
    height: number;
}

const StylesDataNode = styled.div<{ children: any } & IStylesDataNode>`
    position: relative;

    --gap: 6px;
    --marker: calc(28px - var(--gap));

    &::before {
        content: "";
        position: absolute;
        width: 1px;
        height: ${(props) => {
            const h = props.height;
            const cgap = 1 + 2 * (h - 1);
            return `calc( ${h} * 100% + ${cgap} * var(--gap) - 50%)`;
        }};
        top: calc(100% + var(--gap));
        left: calc(2 * var(--gap));

        display: ${(props) => (props.isLeaf ? "none" : "initial")};
    }

    &::after {
        content: "";
        position: absolute;
        width: var(--marker);
        height: 1px;
        top: 50%;
        transform: translateY(-50%);
        left: calc(-1 * var(--marker) - var(--gap));
    }
`;

const TreeViewRenderer: FC<{ tree: Tree; depth?: number; label: "l" | "r" }> = ({
    tree,
    depth = 0,
    label,
}) => {
    if (!tree) return null;

    // heavy shit goes here...
    function getChilds(tree: Tree) {
        if (!tree) return 1;

        let result = 0;
        function traverse(node: Tree) {
            if (node.left) traverse(node.left);
            result += 1;
            if (node.right) traverse(node.right);
        }

        traverse(tree);

        return result;
    }

    return (
        <>
            <StylesDataNode
                style={{ marginLeft: 40 * depth + "px" }}
                className={styles.treeDataNode}
                isLeaf={tree.left === null && tree.right === null}
                height={getChilds(tree.left) + (tree.left && tree.right ? 1 : 0)}
            >
                <div data-attr="key">
                    <b>{label}</b>
                    {tree.data.key}:
                </div>
                <div data-attr="value">{tree.data.value}</div>
            </StylesDataNode>
            <div>{<TreeViewRenderer tree={tree.left} depth={depth + 1} label="l" />}</div>
            <div>{<TreeViewRenderer tree={tree.right} depth={depth + 1} label="r" />}</div>
        </>
    );
};

export const TreeView: FC<{ tree: Tree }> = ({ tree }) => {
    if (!tree) return null;

    return (
        <div className={styles.treeViewRoot}>
            <TreeViewRenderer tree={tree} depth={0} label="l" />
        </div>
    );
};
