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

    const emptyStateElement = document.createElement("section");  //空状态对象
    emptyStateElement.className = "document-empty-state";

    const emptyStateContentElement = document.createElement("div");
    emptyStateContentElement.className = "document-empty-state__content";

    const emptyStateTitleElement = document.createElement("h2");
    emptyStateTitleElement.className = "document-empty-state__title";
    emptyStateTitleElement.textContent = "尚未打开文件";

    const emptyStateDescriptionElement = document.createElement("p");
    emptyStateDescriptionElement.className = "document-empty-state__description";
    emptyStateDescriptionElement.textContent = "从左侧选择一个 Markdown 文件，或新建、导入文件后开始编辑。";

    emptyStateContentElement.append(
        emptyStateTitleElement,
        emptyStateDescriptionElement
    );
    emptyStateElement.append(emptyStateContentElement);

    documentAreaElement.append(
        toolbarElement,
        emptyStateElement,
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
        emptyStateElement.hidden = hasSelectedFile;

        //若未选中任何文件重载
        if (!hasSelectedFile) {
            editArea.element.hidden = true;
            previewArea.element.hidden = true;
            return;
        }

        setMode(mode);
    }

    function clear() {
        mode = "edit";
        render(null);
    }

    render(null);
    return {
        element: documentAreaElement,
        render,
        clear,
        setMode
    };
}
