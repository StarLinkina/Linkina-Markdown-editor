import { markdownFiles, setCurrentFileId } from "../state.js";
import { saveFiles } from "../utils/storage.js";
import { createMarkdownFile } from "../models/markdownFile.js";

export function addFile(title) {
    // 创建 Markdown 文件实例
    const markdownFile = createMarkdownFile(title);
    markdownFiles.push(markdownFile);
    saveFiles(markdownFiles);
    return markdownFile;
}

export function deleteFile(id) {
    // 查找目标 Markdown 文件的位置
    const index = markdownFiles.findIndex(markdownFile => markdownFile.id === id);
    if (index === -1) return;

    markdownFiles.splice(index, 1);
    saveFiles(markdownFiles);
}

export function importFile(name, content) {
    // 移除外部文件名中的 Markdown 或文本文件扩展名
    const title = name.replace(/\.(md|markdown|txt)$/i, "") || "未命名笔记";
    const markdownFile = createMarkdownFile(title);
    markdownFile.content = content;
    markdownFiles.push(markdownFile);
    saveFiles(markdownFiles);
    return markdownFile;
}

export function selectFile(id) {
    setCurrentFileId(id);
}

export function updateFile(id, content) {
    // 查找目标 Markdown 文件
    const markdownFile = markdownFiles.find(markdownFile => markdownFile.id === id);
    if (!markdownFile) return;

    markdownFile.content = content;
    markdownFile.updateTime = new Date().toISOString();

    // 长期化存储
    saveFiles(markdownFiles);
}
