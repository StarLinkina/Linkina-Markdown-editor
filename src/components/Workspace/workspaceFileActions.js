import {
    addFile,
    deleteFile as removeFile,
    importFile as addImportedFile,
    selectFile,
    updateFile
} from "../../services/fileService.js";

import { markdownFiles, currentFileId } from "../../state.js";

export function createWorkspaceFileActions({
    onFileSelect,
    onFileListRender,
    onCurrentFileClear
}) {
    function createFile() {
        const title = prompt("请输入笔记标题")?.trim();
        if (!title) return;

        const markdownFile = addFile(title);
        onFileListRender(markdownFiles);
        onFileSelect(markdownFile);
    }

    function deleteFile(id) {
        const isCurrentFile = currentFileId === id;

        removeFile(id);

        if (isCurrentFile) {
            selectFile(null);
            onCurrentFileClear();
        }

        onFileListRender(markdownFiles, currentFileId);
    }

    async function importFile(sourceFile) {
        const content = await sourceFile.text();
        const markdownFile = addImportedFile(sourceFile.name, content);

        onFileListRender(markdownFiles);
        onFileSelect(markdownFile);
    }

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
        URL.revokeObjectURL(url);
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
