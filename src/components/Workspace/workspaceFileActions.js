import {
    addFile,
    deleteFile as deleteMarkdownFile,
    importFile as importMarkdownFile,
    selectFile,
    updateFile
} from "../../services/fileService.js";

import { markdownFiles, currentFileId } from "../../state.js";

export function createWorkspaceFileActions({
    onFileSelect,
    onFileListRender,
    onCurrentFileClear
}) {
    // 新建文件
    function createFile() {
        const title = prompt("请输入笔记标题")?.trim();
        if (!title) return;

        const markdownFile = addFile(title);

        onFileListRender(markdownFiles);
        onFileSelect(markdownFile);
    }

    // 删除文件
    function deleteFile(id) {
        const isCurrentFile = currentFileId === id;

        deleteMarkdownFile(id);

        // 删除的是当前选中的文件
        if (isCurrentFile) {
            selectFile(null);
            onCurrentFileClear();
        }

        // render文件列表
        onFileListRender(markdownFiles, currentFileId);
    }

    // 外部导入文件
    async function importFile(sourceFile) {
        const content = await sourceFile.text();
        const markdownFile = importMarkdownFile(sourceFile.name, content);

        onFileListRender(markdownFiles);
        onFileSelect(markdownFile);
    }

    // 导出文件
    function exportFile(id) {
        const markdownFile = markdownFiles.find(
            file => file.id === id
        );
        if (!markdownFile) return;

        const blob = new Blob(
            [markdownFile.content],
            { type: "text/markdown;charset=utf-8" }
        );
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `${markdownFile.title || "未命名笔记"}.md`;
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 0);
    }

    function updateFileContent(content) {
        updateFile(currentFileId, content);
    }

    return {
        createFile,
        deleteFile,
        importFile,
        exportFile,
        updateFileContent
    };
}
