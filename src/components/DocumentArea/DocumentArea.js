import "./DocumentArea.css";

import { createEditArea } from "../EditArea";
import { createPreviewArea } from "../PreviewArea";
import { createButton } from "../Button";

export function createDocumentArea({ onContentChange }) {
    const documentAreaElement = document.createElement("main");
    documentAreaElement.className = "document-area";

    const toolbarElement = document.createElement("div");
    toolbarElement.className = "document-toolbar";

    const editButtonElement = createButton({ text: "编辑" });
    const previewButtonElement = createButton({ text: "阅读" });

    toolbarElement.append(editButtonElement, previewButtonElement);

    const editArea = createEditArea(handleInput);
    const previewArea = createPreviewArea();

    documentAreaElement.append(
        toolbarElement,
        editArea.element,
        previewArea.element
    );

    //内部状态变量，用于切换编辑/阅读模式
    let mode = "edit";
    let content = "";
    let hasSelectedFile = false;

    //处理编辑区输入的函数
    function handleInput(newContent) {
        content = newContent;
        onContentChange(content);
    }

    //切换模式的函数
    function setMode(newMode) {
        if (!hasSelectedFile) return;

        mode = newMode;

        //判断是否是编辑模式
        const isEditMode = mode === "edit";

        editArea.element.hidden = !isEditMode;
        previewArea.element.hidden = isEditMode;

        //重载阅读区
        if (!isEditMode) {
            previewArea.render(content);
        }

        //禁用按钮
        editButtonElement.disabled = isEditMode;
        previewButtonElement.disabled = !isEditMode;
    }

    //赋予按钮改变状态
    editButtonElement.addEventListener("click", () => {
        setMode("edit");
    });

    previewButtonElement.addEventListener("click", () => {
        setMode("preview");
    });

    function render(markdownFile) {
        hasSelectedFile = Boolean(markdownFile);
        content = markdownFile?.content ?? "";

        editArea.render(markdownFile);
        previewArea.render(content);

        editButtonElement.disabled = !hasSelectedFile;
        previewButtonElement.disabled = !hasSelectedFile;

        //若未选中任何文件重载
        if (!hasSelectedFile) {
            editArea.element.hidden = false;
            previewArea.element.hidden = true;
            return;
        }

        setMode(mode);
    }

    function clear() {
        render(null);
    }

    return {
        element: documentAreaElement,
        render,
        clear,
        setMode
    };
}
