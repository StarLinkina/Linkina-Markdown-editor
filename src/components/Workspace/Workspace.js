import "./Workspace.css";

import { selectFile, addFile, updateFile, deleteFile, importFile } from "../../services/fileService.js";

import { markdownFiles, currentFileId } from "../../state.js";
import { createFileArea } from "../FileArea";
import { createDocumentArea } from "../DocumentArea";
import { createExtendArea } from "../ExtendArea";
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

export function createWorkspace() {
    // 0. 工作区整体容器
    const workspaceElement = document.createElement("div");
    workspaceElement.className = "workspace";

    // 左右侧区状态互相独立，后续的拖动和收起逻辑只修改这里。
    const sidebarLayoutState = {
        file: createSidebarLayoutState(SIDEBAR_LAYOUT_CONFIG.file),
        extend: createSidebarLayoutState(SIDEBAR_LAYOUT_CONFIG.extend)
    };

    workspaceElement.style.setProperty(
        "--file-area-current-width",
        `${sidebarLayoutState.file.width}px`
    );
    workspaceElement.style.setProperty(
        "--extend-area-current-width",
        `${sidebarLayoutState.extend.width}px`
    );
    workspaceElement.style.setProperty(
        "--resize-handle-width",
        `${SIDEBAR_LAYOUT_CONFIG.resizeHandleWidth}px`
    );
    workspaceElement.style.setProperty(
        "--resize-handle-line-width",
        `${SIDEBAR_LAYOUT_CONFIG.resizeHandleLineWidth}px`
    );

    // 左右侧区外壳由 Workspace 统一分配宽度。
    const fileSidebarShellElement = document.createElement("div");
    fileSidebarShellElement.className = "workspace-sidebar workspace-sidebar--file";

    const extendSidebarShellElement = document.createElement("div");
    extendSidebarShellElement.className = "workspace-sidebar workspace-sidebar--extend";

    // 第一阶段只建立分割条布局，拖动交互将在后续接入。
    const leftResizeHandleElement = document.createElement("div");
    leftResizeHandleElement.className = "workspace-resize-handle workspace-resize-handle--left";

    const rightResizeHandleElement = document.createElement("div");
    rightResizeHandleElement.className = "workspace-resize-handle workspace-resize-handle--right";

    function renderSidebarLayout() {
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

        fileArea.element.hidden = !isFileAreaExpanded;
        fileSidebarRailElement.hidden = isFileAreaExpanded;
        extendArea.hidden = !isExtendAreaExpanded;
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

    function collapseSidebar(side) {
        const sidebarState = sidebarLayoutState[side];
        const sidebarConfig = SIDEBAR_LAYOUT_CONFIG[side];

        if (!sidebarState || !sidebarConfig) return;
        if (sidebarState.mode === SIDEBAR_MODE.COLLAPSED) return;

        if (sidebarState.width >= sidebarConfig.minWidth) {
            sidebarState.lastExpandedWidth = sidebarState.width;
        }

        sidebarState.mode = SIDEBAR_MODE.COLLAPSED;
        renderSidebarLayout();
    }

    function expandSidebar(side) {
        const sidebarState = sidebarLayoutState[side];
        const sidebarConfig = SIDEBAR_LAYOUT_CONFIG[side];

        if (!sidebarState || !sidebarConfig) return;
        if (sidebarState.mode === SIDEBAR_MODE.EXPANDED) return;

        sidebarState.width = Math.min(
            sidebarConfig.maxWidth,
            Math.max(sidebarConfig.minWidth, sidebarState.lastExpandedWidth)
        );
        sidebarState.mode = SIDEBAR_MODE.EXPANDED;
        renderSidebarLayout();
    }

    // 1. 创建文件区组件，传入 Markdown 文件列表和业务函数
    const fileArea = createFileArea(markdownFiles, {
        onSelect: handleFileSelect,
        onCreate: handleFileCreate,
        onDelete: handleFileDelete,
        onImport: handleFileImport,
        onExport: handleFileExport,
        onCollapse: () => collapseSidebar("file")
    });
    const fileSidebarRailElement = createSidebarRail({
        side: "file",
        image: panelLeftOpen,
        alt: "展开文件区",
        onExpand: () => expandSidebar("file")
    });
    fileSidebarShellElement.append(fileArea.element, fileSidebarRailElement);

    // 1.1 选择文件并更新页面内容
    function handleFileSelect(markdownFile) {
        selectFile(markdownFile.id);
        fileArea.render(markdownFiles, currentFileId);
        documentArea.render(markdownFile);
    }
    // 添加文件
    function handleFileCreate() {
        const title = prompt("请输入笔记标题")?.trim();
        if (!title) return;
        const markdownFile = addFile(title);
        fileArea.render(markdownFiles);
        handleFileSelect(markdownFile);
    }
    // 删除文件
    function handleFileDelete(id) {
        const isCurrentFile = currentFileId === id;

        // 删除并重新渲染文件列表
        deleteFile(id);

        // 如果删除的是当前文件，则清空选中状态和编辑区
        if (isCurrentFile) {
            selectFile(null);
            documentArea.clear();
        }

        fileArea.render(markdownFiles,currentFileId);
    }

    // 从浏览器 File 对象导入文件
    async function handleFileImport(sourceFile) {
        const content = await sourceFile.text();
        const markdownFile = importFile(sourceFile.name, content);
        fileArea.render(markdownFiles);
        handleFileSelect(markdownFile);
    }

    // 导出 Markdown 文件
    function handleFileExport(id) {
        const markdownFile = markdownFiles.find(markdownFile => markdownFile.id === id);
        if (!markdownFile) return;

        const blob = new Blob([markdownFile.content], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${markdownFile.title || "未命名笔记"}.md`;
        document.body.append(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    // 创建文档区组件并传入内容更新业务
    const documentArea = createDocumentArea({
        onContentChange: handleContentChange
    });

    documentArea.clear();

    // 以下是文档区域相关业务
    // 更新当前 Markdown 文件的内容
    function handleContentChange(content) {
        updateFile(currentFileId, content);
    }

    const extendArea = createExtendArea({
        onCollapse: () => collapseSidebar("extend")
    });
    const extendSidebarRailElement = createSidebarRail({
        side: "extend",
        image: panelRightOpen,
        alt: "展开扩展区",
        onExpand: () => expandSidebar("extend")
    });
    extendSidebarShellElement.append(extendArea, extendSidebarRailElement);

    workspaceElement.append(
        fileSidebarShellElement,
        leftResizeHandleElement,
        documentArea.element,
        rightResizeHandleElement,
        extendSidebarShellElement
    );

    renderSidebarLayout();

    return workspaceElement;
}
