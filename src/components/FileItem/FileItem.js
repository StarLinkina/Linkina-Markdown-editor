import "./FileItem.css";

import { createButton } from "../Button";

import exportFileIcon from "../../assets/export-file/download.svg";
import deleteFileIcon from "../../assets/delete-file/trash-2.svg";

export function createFileItem(markdownFile, { onSelect, onDelete, onExport, isActive = false} ) {
    // 文件项的最外部容器
    const fileItemElement = document.createElement("div");
    fileItemElement.className = "file-item";

    if (isActive) {
        fileItemElement.classList.add("file-item-active");
    }
    // Markdown 文件标题
    const fileTitleElement = document.createElement("p");
    fileTitleElement.className = "file-item-title";
    fileTitleElement.textContent = markdownFile.title;
    fileTitleElement.title = markdownFile.title;
    fileItemElement.append(fileTitleElement);

    // 点击文件项时选中对应的 Markdown 文件
    fileItemElement.addEventListener("click", () => {
        onSelect(markdownFile);
    });

    // 对 Markdown 文件的操作容器
    const fileActionsElement = document.createElement("div");
    fileActionsElement.className = "file-item-actions"

    // 删除操作
    const deleteButtonElement = createButton({ image: deleteFileIcon, alt: "删除文件"});
    deleteButtonElement.addEventListener("click", (event) => {
        event.stopPropagation();
        onDelete(markdownFile.id);
    });

    // 导出操作
    const exportButtonElement = createButton({ image: exportFileIcon, alt: "导出文件" });
    exportButtonElement.addEventListener("click", (event) => {
        event.stopPropagation();
        onExport(markdownFile.id);
    });

    fileActionsElement.append(
        exportButtonElement,
        deleteButtonElement
    );
    fileItemElement.append(fileActionsElement);

    return fileItemElement;
}
