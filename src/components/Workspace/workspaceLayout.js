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
    const sidebarShellElement = document.createElement("div");
    sidebarShellElement.className = `workspace-sidebar workspace-sidebar--${side}`;
    return sidebarShellElement;
}

export function createWorkspaceLayout(workspaceElement) {
    // 装载布局状态
    const sidebarLayoutState = loadWorkspaceLayoutState();

    // 设置workspaceElement的宽度参数
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

    // 左右拖动条
    const leftResizeHandle = createResizeHandle({
        side: "left",
        onResizeStart: clientX => startResize("file", clientX),
        onResize: clientX => updateResize("file", clientX),
        onResizeEnd: clientX => finishResize("file", clientX),
        onResizeCancel: () => cancelResize("file"),
    });
    const rightResizeHandle = createResizeHandle({
        side: "right",
        onResizeStart: clientX => startResize("extend", clientX),
        onResize: clientX => updateResize("extend", clientX),
        onResizeEnd: clientX => finishResize("extend", clientX),
        onResizeCancel: () => cancelResize("extend"),
    });

    // 左右边栏
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
    let resizeSession = null; //存储当前拖动过程
    let lastWorkspaceWidth = null; //上次响应式计算的宽度

    // 在不考虑响应式情况下，侧栏的期望展示形式
    function getPreferredSidebarView(side, temporaryWidth = null) {
        // 获取状态和宽度配置
        const sidebarState = sidebarLayoutState[side];
        const sidebarConfig = WORKSPACE_LAYOUT_CONFIG[side];

        // 宽度来源
        const resizeWidth = temporaryWidth // 1. 尝试使用即将采用的新宽度
            ?? (
                resizeSession?.side === side
                    ? resizeSession.currentWidth // 2. 在拖动中，拖动时的当前宽度
                    : null // 3. 使用持久化的宽度
            );

        // 若存在临时宽度
        if (resizeWidth !== null) {
            // 计算是否需要展开
            const isExpanded =
                resizeWidth > sidebarConfig.collapseThreshold;

            return {
                isExpanded,
                width: resizeWidth,
                isCollapsePreview: !isExpanded
            };
        }

        // 若处于一个持久的状态
        const isExpanded = sidebarState.mode === SIDEBAR_MODE.EXPANDED;

        return {
            isExpanded,
            width: isExpanded
                ? sidebarState.width
                : WORKSPACE_LAYOUT_CONFIG.collapsedWidth,
            isCollapsePreview: false
        };
    }

    // 交给约束文件计算约束
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
        // 放mount前渲染
        if (!fileAreaElement || !extendAreaElement) return;

        // 当前真正该显示的左右状态
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

        // 切换area和rail
        fileAreaElement.hidden = !fileSidebarView.isExpanded;
        fileSidebarRailElement.hidden = fileSidebarView.isExpanded;
        extendAreaElement.hidden = !extendSidebarView.isExpanded;
        extendSidebarRailElement.hidden = extendSidebarView.isExpanded;

        // 切换样式类
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

    // 把鼠标左边转换成宽度
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

    // 开始拖动
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
        saveWorkspaceLayoutState(sidebarLayoutState);
        render();
    }

    function cancelResize(side) {
        if (resizeSession?.side !== side) return;

        resizeSession = null;
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
        saveWorkspaceLayoutState(sidebarLayoutState);
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
        saveWorkspaceLayoutState(sidebarLayoutState);
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
