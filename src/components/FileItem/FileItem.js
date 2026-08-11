import "./FileItem.css";

import { createButton } from "../Button";

import exportFileIcon from "../../assets/export-file/download.svg";
import deleteFileIcon from "../../assets/delete-file/trash-2.svg";

export function createFileItem(markdownFile, { onSelect, onDelete, onExport, isActive = false} ) {

    const fileItemElement = document.createElement("li");
    fileItemElement.className = "file-item";

    //选中状态
    if (isActive) {
        fileItemElement.classList.add("file-item-active");
    }

    // 选择 Markdown 文件
    const selectFileButtonElement = document.createElement("button");
    selectFileButtonElement.type = "button";
    selectFileButtonElement.className = "file-item__select-button";
    selectFileButtonElement.title = markdownFile.title;

    if (isActive) {
        selectFileButtonElement.setAttribute("aria-current", "page");
    }

    const fileTitleElement = document.createElement("span");
    fileTitleElement.className = "file-item-title";
    fileTitleElement.textContent = markdownFile.title;
    selectFileButtonElement.append(fileTitleElement);

    selectFileButtonElement.addEventListener("click", () => {
        onSelect(markdownFile);
    });

    // 对 Markdown 文件的操作容器
    const fileActionsElement = document.createElement("div");
    fileActionsElement.className = "file-item-actions"

    // 删除操作
    const deleteButtonElement = createButton({ image: deleteFileIcon, alt: "删除文件"});
    deleteButtonElement.classList.add("file-item__delete-button");
    deleteButtonElement.addEventListener("click", () => {
        onDelete(markdownFile.id);
    });

    // 导出操作
    const exportButtonElement = createButton({ image: exportFileIcon, alt: "导出文件" });
    exportButtonElement.addEventListener("click", () => {
        onExport(markdownFile.id);
    });

    fileActionsElement.append(
        exportButtonElement,
        deleteButtonElement
    );
    fileItemElement.append(
        selectFileButtonElement,
        fileActionsElement
    );

    return fileItemElement;
}
