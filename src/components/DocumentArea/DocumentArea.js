import "./DocumentArea.css";

import { createEditArea } from "../EditArea";
import { createPreviewArea } from "../PreviewArea";
import { createButton } from "../Button";

export function createDocumentArea({ onContentChange }) {

    const documentAreaElement = document.createElement("main");
    documentAreaElement.className = "document-area";

    const toolbarElement = document.createElement("div");
    toolbarElement.className = "document-toolbar";

    //两个按钮，切换编辑/阅读状态。
    const editButtonElement = createButton({ text: "编辑" });
    const previewButtonElement = createButton({ text: "阅读" });
    editButtonElement.classList.add("document-mode-button");
    previewButtonElement.classList.add("document-mode-button");

    //以下是对按钮状态的更新函数
    function updateModeButtons() {
        const isEditMode = hasSelectedFile && mode === "edit";
        const isPreviewMode = hasSelectedFile && mode === "preview";

        // 只有未选中文件时才禁用按钮
        editButtonElement.disabled = !hasSelectedFile;
        previewButtonElement.disabled = !hasSelectedFile;

        editButtonElement.classList.toggle(
            "document-mode-button--active",
            isEditMode
        );

        previewButtonElement.classList.toggle(
            "document-mode-button--active",
            isPreviewMode
        );

    }

    toolbarElement.append(editButtonElement, previewButtonElement);

    //两个Area一个空状态，一个负责编辑，一个负责预览，一个负责在未选中文件时显示内容
    const editArea = createEditArea(handleInput);
    const previewArea = createPreviewArea();
    const emptyStateElement = document.createElement("section");

    //空状态对象
    emptyStateElement.className = "document-empty-state";

    const emptyStateContentElement = document.createElement("div"); //容器
    emptyStateContentElement.className = "document-empty-state__content";

    const emptyStateTitleElement = document.createElement("h2"); //标题
    emptyStateTitleElement.className = "document-empty-state__title";
    emptyStateTitleElement.textContent = "尚未打开文件";

    const emptyStateDescriptionElement = document.createElement("p"); //内容
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

        if (newMode !== "edit" && newMode !== "preview") {
            return;
        }
        mode = newMode;

        //判断是否是编辑模式
        const isEditMode = mode === "edit";

        editArea.element.hidden = !isEditMode;
        previewArea.element.hidden = isEditMode;

        //重载阅读区
        if (!isEditMode) {
            previewArea.render(content);
        }

        updateModeButtons();
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

        emptyStateElement.hidden = hasSelectedFile;

        //若未选中任何文件重载
        if (!hasSelectedFile) {
            editArea.element.hidden = true;
            previewArea.element.hidden = true;
            updateModeButtons();
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
