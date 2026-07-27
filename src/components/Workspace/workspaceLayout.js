import { createSidebarRail } from "../SidebarRail";

import panelLeftOpen from "../../assets/left-sidebar/panel-left-open.svg";
import panelRightOpen from "../../assets/right-sidebar/panel-right-open.svg";

const SIDEBAR_MODE = Object.freeze({
    EXPANDED: "expanded",
    COLLAPSED: "collapsed"
});

const SIDEBAR_LAYOUT_CONFIG = Object.freeze({
    file: Object.freeze({
        defaultWidth: 260,
        minWidth: 200,
        maxWidth: 420,
        collapseThreshold: 176
    }),
    extend: Object.freeze({
        defaultWidth: 320,
        minWidth: 240,
        maxWidth: 480,
        collapseThreshold: 216
    }),
    collapsedWidth: 48,
    resizeHandleWidth: 6,
    resizeHandleLineWidth: 1
});

function createSidebarLayoutState(sidebarConfig) {
    return {
        mode: SIDEBAR_MODE.EXPANDED,
        width: sidebarConfig.defaultWidth,
        lastExpandedWidth: sidebarConfig.defaultWidth
    };
}

function createSidebarShell(side) {
    const sidebarShellElement = document.createElement("div");
    sidebarShellElement.className = `workspace-sidebar workspace-sidebar--${side}`;
    return sidebarShellElement;
}

function createResizeHandle(side) {
    const resizeHandleElement = document.createElement("div");
    resizeHandleElement.className =
        `workspace-resize-handle workspace-resize-handle--${side}`;
    return resizeHandleElement;
}

export function createWorkspaceLayout(workspaceElement) {
    const sidebarLayoutState = {
        file: createSidebarLayoutState(SIDEBAR_LAYOUT_CONFIG.file),
        extend: createSidebarLayoutState(SIDEBAR_LAYOUT_CONFIG.extend)
    };

    workspaceElement.style.setProperty(
        "--resize-handle-width",
        `${SIDEBAR_LAYOUT_CONFIG.resizeHandleWidth}px`
    );
    workspaceElement.style.setProperty(
        "--resize-handle-line-width",
        `${SIDEBAR_LAYOUT_CONFIG.resizeHandleLineWidth}px`
    );

    const fileSidebarShellElement = createSidebarShell("file");
    const extendSidebarShellElement = createSidebarShell("extend");
    const leftResizeHandleElement = createResizeHandle("left");
    const rightResizeHandleElement = createResizeHandle("right");

    const fileSidebarRailElement = createSidebarRail({
        side: "file",
        image: panelLeftOpen,
        alt: "展开文件区",
        onExpand: () => expand("file")
    });
    const extendSidebarRailElement = createSidebarRail({
        side: "extend",
        image: panelRightOpen,
        alt: "展开扩展区",
        onExpand: () => expand("extend")
    });

    let fileAreaElement = null;
    let extendAreaElement = null;

    function render() {
        if (!fileAreaElement || !extendAreaElement) return;

        const isFileAreaExpanded =
            sidebarLayoutState.file.mode === SIDEBAR_MODE.EXPANDED;
        const isExtendAreaExpanded =
            sidebarLayoutState.extend.mode === SIDEBAR_MODE.EXPANDED;

        const fileAreaWidth = isFileAreaExpanded
            ? sidebarLayoutState.file.width
            : SIDEBAR_LAYOUT_CONFIG.collapsedWidth;
        const extendAreaWidth = isExtendAreaExpanded
            ? sidebarLayoutState.extend.width
            : SIDEBAR_LAYOUT_CONFIG.collapsedWidth;

        workspaceElement.style.setProperty(
            "--file-area-current-width",
            `${fileAreaWidth}px`
        );
        workspaceElement.style.setProperty(
            "--extend-area-current-width",
            `${extendAreaWidth}px`
        );

        fileAreaElement.hidden = !isFileAreaExpanded;
        fileSidebarRailElement.hidden = isFileAreaExpanded;
        extendAreaElement.hidden = !isExtendAreaExpanded;
        extendSidebarRailElement.hidden = isExtendAreaExpanded;

        fileSidebarShellElement.classList.toggle(
            "workspace-sidebar--collapsed",
            !isFileAreaExpanded
        );
        extendSidebarShellElement.classList.toggle(
            "workspace-sidebar--collapsed",
            !isExtendAreaExpanded
        );
    }

    function collapse(side) {
        const sidebarState = sidebarLayoutState[side];
        const sidebarConfig = SIDEBAR_LAYOUT_CONFIG[side];

        if (!sidebarState || !sidebarConfig) return;
        if (sidebarState.mode === SIDEBAR_MODE.COLLAPSED) return;

        if (sidebarState.width >= sidebarConfig.minWidth) {
            sidebarState.lastExpandedWidth = sidebarState.width;
        }

        sidebarState.mode = SIDEBAR_MODE.COLLAPSED;
        render();
    }

    function expand(side) {
        const sidebarState = sidebarLayoutState[side];
        const sidebarConfig = SIDEBAR_LAYOUT_CONFIG[side];

        if (!sidebarState || !sidebarConfig) return;
        if (sidebarState.mode === SIDEBAR_MODE.EXPANDED) return;

        sidebarState.width = Math.min(
            sidebarConfig.maxWidth,
            Math.max(sidebarConfig.minWidth, sidebarState.lastExpandedWidth)
        );
        sidebarState.mode = SIDEBAR_MODE.EXPANDED;
        render();
    }

    function mount({
        fileArea,
        documentArea,
        extendArea
    }) {
        fileAreaElement = fileArea;
        extendAreaElement = extendArea;

        fileSidebarShellElement.append(
            fileAreaElement,
            fileSidebarRailElement
        );
        extendSidebarShellElement.append(
            extendAreaElement,
            extendSidebarRailElement
        );

        workspaceElement.append(
            fileSidebarShellElement,
            leftResizeHandleElement,
            documentArea,
            rightResizeHandleElement,
            extendSidebarShellElement
        );

        render();
    }

    return {
        mount,
        collapse,
        expand
    };
}
