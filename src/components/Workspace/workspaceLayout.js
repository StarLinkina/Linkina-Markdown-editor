import { createSidebarRail } from "../SidebarRail";
import { createResizeHandle } from "../ResizeHandle";
import {
    WORKSPACE_LAYOUT_CONFIG,
    getSidebarDynamicMaxWidth,
    resolveResponsiveSidebarViews
} from "./workspaceLayoutConstraints.js";

import panelLeftOpen from "../../assets/left-sidebar/panel-left-open.svg";
import panelRightOpen from "../../assets/right-sidebar/panel-right-open.svg";

const SIDEBAR_MODE = Object.freeze({
    EXPANDED: "expanded",
    COLLAPSED: "collapsed"
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

export function createWorkspaceLayout(workspaceElement) {
    const sidebarLayoutState = {
        file: createSidebarLayoutState(WORKSPACE_LAYOUT_CONFIG.file),
        extend: createSidebarLayoutState(WORKSPACE_LAYOUT_CONFIG.extend)
    };

    workspaceElement.style.setProperty(
        "--resize-handle-width",
        `${WORKSPACE_LAYOUT_CONFIG.resizeHandleWidth}px`
    );
    workspaceElement.style.setProperty(
        "--resize-handle-line-width",
        `${WORKSPACE_LAYOUT_CONFIG.resizeHandleLineWidth}px`
    );
    workspaceElement.style.setProperty(
        "--document-area-min-width",
        `${WORKSPACE_LAYOUT_CONFIG.documentMinWidth}px`
    );

    const fileSidebarShellElement = createSidebarShell("file");
    const extendSidebarShellElement = createSidebarShell("extend");
    const leftResizeHandle = createResizeHandle({
        side: "left",
        label: "调整文件区宽度",
        onResizeStart: clientX => startResize("file", clientX),
        onResize: clientX => updateResize("file", clientX),
        onResizeEnd: clientX => finishResize("file", clientX),
        onResizeCancel: () => cancelResize("file"),
        onReset: () => resetSidebar("file")
    });
    const rightResizeHandle = createResizeHandle({
        side: "right",
        label: "调整扩展区宽度",
        onResizeStart: clientX => startResize("extend", clientX),
        onResize: clientX => updateResize("extend", clientX),
        onResizeEnd: clientX => finishResize("extend", clientX),
        onResizeCancel: () => cancelResize("extend"),
        onReset: () => resetSidebar("extend")
    });

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
    let resizeSession = null;
    let lastWorkspaceWidth = null;

    function getPreferredSidebarView(side, widthOverride = null) {
        const sidebarState = sidebarLayoutState[side];
        const sidebarConfig = WORKSPACE_LAYOUT_CONFIG[side];
        const resizeWidth = widthOverride
            ?? (
                resizeSession?.side === side
                    ? resizeSession.currentWidth
                    : null
            );

        if (resizeWidth !== null) {
            const isExpanded =
                resizeWidth > sidebarConfig.collapseThreshold;

            return {
                isExpanded,
                width: resizeWidth,
                isCollapsePreview: !isExpanded
            };
        }

        const isExpanded = sidebarState.mode === SIDEBAR_MODE.EXPANDED;

        return {
            isExpanded,
            width: isExpanded
                ? sidebarState.width
                : WORKSPACE_LAYOUT_CONFIG.collapsedWidth,
            isCollapsePreview: false
        };
    }

    function getResponsiveSidebarViews(widthOverrides = {}) {
        return resolveResponsiveSidebarViews({
            workspaceWidth: workspaceElement.clientWidth,
            fileView: getPreferredSidebarView(
                "file",
                widthOverrides.file ?? null
            ),
            extendView: getPreferredSidebarView(
                "extend",
                widthOverrides.extend ?? null
            )
        });
    }

    function render() {
        if (!fileAreaElement || !extendAreaElement) return;

        const {
            file: fileSidebarView,
            extend: extendSidebarView
        } = getResponsiveSidebarViews();

        workspaceElement.style.setProperty(
            "--file-area-current-width",
            `${fileSidebarView.width}px`
        );
        workspaceElement.style.setProperty(
            "--extend-area-current-width",
            `${extendSidebarView.width}px`
        );

        fileAreaElement.hidden = !fileSidebarView.isExpanded;
        fileSidebarRailElement.hidden = fileSidebarView.isExpanded;
        extendAreaElement.hidden = !extendSidebarView.isExpanded;
        extendSidebarRailElement.hidden = extendSidebarView.isExpanded;

        fileSidebarShellElement.classList.toggle(
            "workspace-sidebar--collapsed",
            !fileSidebarView.isExpanded
        );
        extendSidebarShellElement.classList.toggle(
            "workspace-sidebar--collapsed",
            !extendSidebarView.isExpanded
        );

        fileSidebarShellElement.classList.toggle(
            "workspace-sidebar--collapse-preview",
            fileSidebarView.isCollapsePreview
        );
        extendSidebarShellElement.classList.toggle(
            "workspace-sidebar--collapse-preview",
            extendSidebarView.isCollapsePreview
        );

        fileSidebarShellElement.classList.toggle(
            "workspace-sidebar--responsive-collapsed",
            fileSidebarView.isResponsiveCollapsed
        );
        extendSidebarShellElement.classList.toggle(
            "workspace-sidebar--responsive-collapsed",
            extendSidebarView.isResponsiveCollapsed
        );

        leftResizeHandle.setSnapPreview(
            fileSidebarView.isCollapsePreview
        );
        rightResizeHandle.setSnapPreview(
            extendSidebarView.isCollapsePreview
        );
    }

    function calculateResizeWidth(side, clientX) {
        if (resizeSession?.side !== side) return null;

        const pointerDelta = clientX - resizeSession.startX;
        const directionalDelta = side === "file"
            ? pointerDelta
            : -pointerDelta;
        const proposedWidth =
            resizeSession.startWidth + directionalDelta;
        const otherSide = side === "file" ? "extend" : "file";
        const sidebarViews = getResponsiveSidebarViews({
            [side]: proposedWidth
        });
        const dynamicMaxWidth = getSidebarDynamicMaxWidth({
            side,
            workspaceWidth: workspaceElement.clientWidth,
            otherSidebarWidth: sidebarViews[otherSide].width
        });

        return Math.min(
            dynamicMaxWidth,
            Math.max(
                WORKSPACE_LAYOUT_CONFIG.collapsedWidth,
                proposedWidth
            )
        );
    }

    function startResize(side, clientX) {
        const sidebarState = sidebarLayoutState[side];
        if (!sidebarState || resizeSession) return;

        const currentSidebarView = getResponsiveSidebarViews()[side];
        const startWidth = currentSidebarView.width;

        resizeSession = {
            side,
            startX: clientX,
            startWidth,
            currentWidth: startWidth,
            startedResponsiveCollapsed:
                currentSidebarView.isResponsiveCollapsed
        };

        render();
    }

    function updateResize(side, clientX) {
        const nextWidth = calculateResizeWidth(side, clientX);
        if (nextWidth === null) return;

        resizeSession.currentWidth = nextWidth;
        render();
    }

    function finishResize(side, clientX) {
        if (resizeSession?.side !== side) return;

        updateResize(side, clientX);

        const sidebarState = sidebarLayoutState[side];
        const sidebarConfig = WORKSPACE_LAYOUT_CONFIG[side];
        const finalWidth = resizeSession.currentWidth;

        if (finalWidth <= sidebarConfig.collapseThreshold) {
            if (resizeSession.startedResponsiveCollapsed) {
                resizeSession = null;
                render();
                return;
            }

            if (sidebarState.width >= sidebarConfig.minWidth) {
                sidebarState.lastExpandedWidth = sidebarState.width;
            }
            sidebarState.mode = SIDEBAR_MODE.COLLAPSED;
        } else {
            const expandedWidth = Math.min(
                sidebarConfig.maxWidth,
                Math.max(sidebarConfig.minWidth, finalWidth)
            );

            sidebarState.mode = SIDEBAR_MODE.EXPANDED;
            sidebarState.width = expandedWidth;
            sidebarState.lastExpandedWidth = expandedWidth;
        }

        resizeSession = null;
        render();
    }

    function cancelResize(side) {
        if (resizeSession?.side !== side) return;

        resizeSession = null;
        render();
    }

    function resetSidebar(side) {
        const sidebarState = sidebarLayoutState[side];
        const sidebarConfig = WORKSPACE_LAYOUT_CONFIG[side];
        if (!sidebarState || !sidebarConfig) return;

        if (resizeSession?.side === side) {
            resizeSession = null;
        }

        sidebarState.mode = SIDEBAR_MODE.EXPANDED;
        sidebarState.width = sidebarConfig.defaultWidth;
        sidebarState.lastExpandedWidth = sidebarConfig.defaultWidth;
        render();
    }

    function collapse(side) {
        const sidebarState = sidebarLayoutState[side];
        const sidebarConfig = WORKSPACE_LAYOUT_CONFIG[side];

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
        const sidebarConfig = WORKSPACE_LAYOUT_CONFIG[side];

        if (!sidebarState || !sidebarConfig) return;
        if (sidebarState.mode === SIDEBAR_MODE.EXPANDED) return;

        sidebarState.width = Math.min(
            sidebarConfig.maxWidth,
            Math.max(sidebarConfig.minWidth, sidebarState.lastExpandedWidth)
        );
        sidebarState.mode = SIDEBAR_MODE.EXPANDED;
        render();
    }

    function observeWorkspaceSize() {
        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", render);
            return;
        }

        const workspaceResizeObserver = new ResizeObserver(entries => {
            const workspaceWidth = entries[0]?.contentRect.width;
            if (workspaceWidth === lastWorkspaceWidth) return;

            lastWorkspaceWidth = workspaceWidth;
            render();
        });

        workspaceResizeObserver.observe(workspaceElement);
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
            leftResizeHandle.element,
            documentArea,
            rightResizeHandle.element,
            extendSidebarShellElement
        );

        render();
        observeWorkspaceSize();
    }

    return {
        mount,
        collapse,
        expand
    };
}
