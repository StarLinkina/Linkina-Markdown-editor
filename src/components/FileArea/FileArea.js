import "./FileArea.css";

import { createButton } from "../Button";
import { createFileItem } from "../FileItem";

import newFileIcon from "../../assets/new-file/file-plus.svg";
import importFileIcon from "../../assets/import-file/import.svg";
import panelLeftClose from "../../assets/left-sidebar/panel-left-close.svg";

export function createFileArea(
    markdownFiles,
    { onSelect, onCreate, onDelete, onImport, onExport, onCollapse }
) {
    const fileAreaElement = document.createElement("aside");
    fileAreaElement.className = "file-area";

    // 1. 文件功能栏容器
    const fileToolbarElement = document.createElement("nav");
    fileToolbarElement.className = "file-toolbar";

    // 1.1 新建文件按钮
    const createFileButtonElement = createButton({ image: newFileIcon, alt: "新建文件" });
    fileToolbarElement.append(createFileButtonElement);
    createFileButtonElement.addEventListener("click", () => { onCreate(); });

    // 1.2.tool 隐藏的外部文件输入框
    const fileInputElement = document.createElement("input");
    fileInputElement.type = "file";
    fileInputElement.accept = ".md,.markdown,text/markdown,text/plain";
    fileInputElement.hidden = true;
    fileAreaElement.append(fileInputElement);

    fileInputElement.addEventListener("change", async () => {
        const [sourceFile] = fileInputElement.files;
        if (!sourceFile) return;

        try {
            await onImport(sourceFile);
        } finally {
            fileInputElement.value = "";
        }
    });

    // 1.2 外部导入文件按钮
    const importFileButtonElement = createButton({ image: importFileIcon, alt: "导入文件" });
    fileToolbarElement.append(importFileButtonElement);
    importFileButtonElement.addEventListener("click", () => { fileInputElement.click(); });

    // 1.3 收起文件区按钮
    const collapseFileAreaButtonElement = createButton({
        image: panelLeftClose,
        alt: "收起文件区"
    });
    collapseFileAreaButtonElement.classList.add("file-toolbar__collapse-button");
    collapseFileAreaButtonElement.addEventListener("click", onCollapse);
    fileToolbarElement.append(collapseFileAreaButtonElement);

    fileAreaElement.append(fileToolbarElement);


    // 2. 文件展示列表
    const fileListElement = document.createElement("div");
    fileListElement.className = "file-list";

    // 首次渲染文件列表
    markdownFiles.forEach(markdownFile => {
        fileListElement.append(createFileItem(markdownFile, { onSelect, onDelete, onExport }));
    });
    fileAreaElement.append(fileListElement);

    // 重新渲染文件列表
    function render(nextMarkdownFiles, currentFileId = null) {
        fileListElement.replaceChildren();
        nextMarkdownFiles.forEach(markdownFile => {
            fileListElement.append(
                createFileItem(
                    markdownFile, 
                    { onSelect, onDelete, onExport, isActive: markdownFile.id === currentFileId }
                )
            );
        });
    }

    return {
        element: fileAreaElement,
        render
    };
}
