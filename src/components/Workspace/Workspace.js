import "./Workspace.css";

import { selectFile, addFile, updateFile, deleteFile, importFile } from "../../services/fileService.js";

import { markdownFiles, currentFileId } from "../../state.js";
import { createFileArea } from "../FileArea";
import { createDocumentArea } from "../DocumentArea";
import { createExtendArea } from "../ExtendArea";

export function createWorkspace() {
    // 创建工作区组件作为整体容器
    const workspaceElement = document.createElement("div");
    workspaceElement.className = "workspace";

    // 创建文件区组件，传入 Markdown 文件列表和业务函数
    const fileArea = createFileArea(markdownFiles, {
        onSelect: handleFileSelect,
        onCreate: handleFileCreate,
        onDelete: handleFileDelete,
        onImport: handleFileImport,
        onExport: handleFileExport
    });
    workspaceElement.append(fileArea.element);


    // 以下是文件区相关业务
    // 选择文件并更新页面内容
    function handleFileSelect(markdownFile) {
        selectFile(markdownFile.id);
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
        fileArea.render(markdownFiles);

        // 如果删除的是当前文件，则清空选中状态和编辑区
        if (isCurrentFile) {
            selectFile(null);
            documentArea.clear();
        }
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

    workspaceElement.append(documentArea.element);

    // 以下是文档区域相关业务
    // 更新当前 Markdown 文件的内容
    function handleContentChange(content) {
        updateFile(currentFileId, content);
    }
    workspaceElement.append(createExtendArea());

    return workspaceElement;
}
