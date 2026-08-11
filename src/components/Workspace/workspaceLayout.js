import { createSidebarRail } from "../SidebarRail";
import { createResizeHandle } from "../ResizeHandle";
import {
    SIDEBAR_MODE,
    WORKSPACE_LAYOUT_CONFIG,
    getSidebarDynamicMaxWidth,
    resolveResponsiveSidebarViews
} from "./workspaceLayoutConstraints.js";
import {
    loadWorkspaceLayoutState,
    saveWorkspaceLayoutState
} from "./workspaceLayoutStorage.js";

import panelLeftOpen from "../../assets/left-sidebar/panel-left-open.svg";
import panelRightOpen from "../../assets/right-sidebar/panel-right-open.svg";

function createSidebarShell(side) {
    const element = document.createElement("div");
    element.className = `workspace-sidebar workspace-sidebar--${side}`;
    return element;
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

export function createWorkspaceLayout(workspaceElement) {
    const sidebarLayoutState = loadWorkspaceLayoutState();

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
        onResizeStart: clientX => startResize("file", clientX),
        onResize: clientX => updateResize("file", clientX),
        onResizeEnd: clientX => finishResize("file", clientX),
        onResizeCancel: () => cancelResize("file")
    });
    const rightResizeHandle = createResizeHandle({
        side: "right",
        onResizeStart: clientX => startResize("extend", clientX),
        onResize: clientX => updateResize("extend", clientX),
        onResizeEnd: clientX => finishResize("extend", clientX),
        onResizeCancel: () => cancelResize("extend")
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

    let fileAreaElement;
    let extendAreaElement;
    let resizeSession = null;

    // 返回侧栏的持久状态，或拖动期间的临时状态。
    function getPreferredSidebarView(side, temporaryWidth = null) {
        const sidebarState = sidebarLayoutState[side];
        const sidebarConfig = WORKSPACE_LAYOUT_CONFIG[side];
        const dragWidth = resizeSession?.side === side
            ? resizeSession.currentWidth
            : null;
        const previewWidth = temporaryWidth ?? dragWidth;

        if (previewWidth !== null) {
            const isExpanded =
                previewWidth > sidebarConfig.collapseThreshold;

            return {
                isExpanded,
                width: previewWidth,
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

    // 根据工作区宽度计算最终显示状态。
    function getResponsiveSidebarViews(temporaryWidths = {}) {
        return resolveResponsiveSidebarViews({
            workspaceWidth: workspaceElement.clientWidth,
            fileView: getPreferredSidebarView(
                "file",
                temporaryWidths.file ?? null
            ),
            extendView: getPreferredSidebarView(
                "extend",
                temporaryWidths.extend ?? null
            )
        });
    }

    function render() {
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
            "workspace-sidebar--collapse-preview",
            fileSidebarView.isCollapsePreview
        );
        extendSidebarShellElement.classList.toggle(
            "workspace-sidebar--collapse-preview",
            extendSidebarView.isCollapsePreview
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
        const proposedWidth = resizeSession.startWidth + directionalDelta;
        const otherSide = side === "file" ? "extend" : "file";
        const sidebarViews = getResponsiveSidebarViews({
            [side]: proposedWidth
        });
        const dynamicMaxWidth = getSidebarDynamicMaxWidth({
            side,
            workspaceWidth: workspaceElement.clientWidth,
            otherSidebarWidth: sidebarViews[otherSide].width
        });

        return clamp(
            proposedWidth,
            WORKSPACE_LAYOUT_CONFIG.collapsedWidth,
            dynamicMaxWidth
        );
    }

    function startResize(side, clientX) {
        if (resizeSession) return;

        const currentView = getResponsiveSidebarViews()[side];

        resizeSession = {
            side,
            startX: clientX,
            startWidth: currentView.width,
            currentWidth: currentView.width,
            wasResponsiveCollapsed: currentView.isResponsiveCollapsed
        };
    }

    function updateResize(side, clientX) {
        const nextWidth = calculateResizeWidth(side, clientX);
        if (nextWidth === null) return;

        resizeSession.currentWidth = nextWidth;
        render();
    }

    function saveAndRender() {
        saveWorkspaceLayoutState(sidebarLayoutState);
        render();
    }

    function finishResize(side, clientX) {
        if (resizeSession?.side !== side) return;

        updateResize(side, clientX);

        const sidebarState = sidebarLayoutState[side];
        const sidebarConfig = WORKSPACE_LAYOUT_CONFIG[side];
        const finalWidth = resizeSession.currentWidth;

        if (finalWidth <= sidebarConfig.collapseThreshold) {
            if (resizeSession.wasResponsiveCollapsed) {
                cancelResize(side);
                return;
            }

            sidebarState.mode = SIDEBAR_MODE.COLLAPSED;
        } else {
            sidebarState.mode = SIDEBAR_MODE.EXPANDED;
            sidebarState.width = clamp(
                finalWidth,
                sidebarConfig.minWidth,
                sidebarConfig.maxWidth
            );
        }

        resizeSession = null;
        saveAndRender();
    }

    function cancelResize(side) {
        if (resizeSession?.side !== side) return;

        resizeSession = null;
        render();
    }

    function collapse(side) {
        const sidebarState = sidebarLayoutState[side];
        if (sidebarState.mode === SIDEBAR_MODE.COLLAPSED) return;

        sidebarState.mode = SIDEBAR_MODE.COLLAPSED;
        saveAndRender();
    }

    function expand(side) {
        const sidebarState = sidebarLayoutState[side];
        if (sidebarState.mode === SIDEBAR_MODE.EXPANDED) return;

        sidebarState.mode = SIDEBAR_MODE.EXPANDED;
        saveAndRender();
    }

    function observeWorkspaceSize() {
        const observer = new ResizeObserver(render);
        observer.observe(workspaceElement);
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
