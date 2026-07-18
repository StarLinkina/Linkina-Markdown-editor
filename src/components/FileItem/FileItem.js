import "./FileItem.css";

import { createButton } from "../Button";

export function createFileItem(markdownFile, { onSelect, onDelete, onExport }) {
    // 文件项的最外部容器
    const fileItemElement = document.createElement("div");
    fileItemElement.className = "file-item";

    // Markdown 文件标题
    const fileTitleElement = document.createElement("p");
    fileTitleElement.className = "file-item__title";
    fileTitleElement.textContent = markdownFile.title;
    fileItemElement.append(fileTitleElement);

    // 点击文件项时选中对应的 Markdown 文件
    fileItemElement.addEventListener("click", () => {
        onSelect(markdownFile);
    });

    const deleteButtonElement = createButton({ text: "delete" });
    deleteButtonElement.addEventListener("click", (event) => {
        event.stopPropagation();
        onDelete(markdownFile.id);
    });
    fileItemElement.append(deleteButtonElement);

    const exportButtonElement = createButton({ text: "export" });
    exportButtonElement.addEventListener("click", (event) => {
        event.stopPropagation();
        onExport(markdownFile.id);
    });
    fileItemElement.append(exportButtonElement);

    return fileItemElement;
}
