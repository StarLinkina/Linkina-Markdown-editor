import "./DocumentArea.css";

import { createEditArea } from "../EditArea";
import { createPreviewArea } from "../PreviewArea";
import { createButton } from "../Button";
import {
    FILE_LOAD_ERROR_TYPE,
    FILE_SAVE_ERROR_TYPE
} from "../../utils/storage.js";
import {
    FILE_PERSISTENCE_OPERATION,
    FILE_PERSISTENCE_STATUS
} from "../../services/filePersistence.js";

export function createDocumentArea({
    onContentChange,
    onSaveRetry,
    onExportCurrentFile
}) {

    const documentAreaElement = document.createElement("main");
    documentAreaElement.className = "document-area";

    const toolbarElement = document.createElement("div");
    toolbarElement.className = "document-toolbar";

    const saveStatusElement = document.createElement("div");
    saveStatusElement.className = "document-save-status";

    const saveStatusTextElement = document.createElement("span");
    saveStatusTextElement.className = "document-save-status__message";
    saveStatusTextElement.setAttribute("role", "status");
    saveStatusTextElement.setAttribute("aria-live", "polite");
    saveStatusTextElement.setAttribute("aria-atomic", "true");

    const saveStatusActionsElement = document.createElement("div");
    saveStatusActionsElement.className = "document-save-status__actions";

    const retrySaveButtonElement = createButton({ text: "重试" });
    retrySaveButtonElement.classList.add("document-save-status__button");
    retrySaveButtonElement.addEventListener("click", onSaveRetry);

    const exportCurrentFileButtonElement = createButton({
        text: "导出当前文件"
    });
    exportCurrentFileButtonElement.classList.add(
        "document-save-status__button"
    );
    exportCurrentFileButtonElement.addEventListener(
        "click",
        onExportCurrentFile
    );

    saveStatusActionsElement.append(
        retrySaveButtonElement,
        exportCurrentFileButtonElement
    );
    saveStatusElement.append(
        saveStatusTextElement,
        saveStatusActionsElement
    );

    const modeControlsElement = document.createElement("div");
    modeControlsElement.className = "document-mode-controls";
    modeControlsElement.setAttribute("role", "group");
    modeControlsElement.setAttribute("aria-label", "文档模式");

    //两个按钮，切换编辑/阅读状态。
    const editButtonElement = createButton({ text: "编辑" });
    const previewButtonElement = createButton({ text: "阅读" });
    editButtonElement.classList.add("document-mode-button");
    previewButtonElement.classList.add("document-mode-button");


    modeControlsElement.append(editButtonElement, previewButtonElement);
    toolbarElement.append(saveStatusElement, modeControlsElement);

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
    let persistenceState = {
        status: FILE_PERSISTENCE_STATUS.SAVED,
        error: null
    };

    function getLoadErrorMessage(errorType) {
        if (errorType === FILE_LOAD_ERROR_TYPE.STORAGE_UNAVAILABLE) {
            return "无法读取本地文件，请检查浏览器存储权限后刷新页面";
        }

        return "本地文件数据已损坏，原始数据未被覆盖";
    }

    function getSaveErrorMessage(errorType) {
        if (errorType === FILE_SAVE_ERROR_TYPE.QUOTA_EXCEEDED) {
            return "本地存储空间不足，修改仍保留在当前页面";
        }

        if (errorType === FILE_SAVE_ERROR_TYPE.STORAGE_UNAVAILABLE) {
            return "无法使用浏览器本地存储，修改仍保留在当前页面";
        }

        if (errorType === FILE_SAVE_ERROR_TYPE.SERIALIZATION_FAILED) {
            return "文件数据无法保存，修改仍保留在当前页面";
        }

        return "保存失败，修改仍保留在当前页面";
    }

    function getPersistenceMessage(state) {
        if (state.status === FILE_PERSISTENCE_STATUS.SAVING) {
            return "保存中…";
        }

        if (state.status === FILE_PERSISTENCE_STATUS.SAVED) {
            return "已保存";
        }

        return state.error?.operation === FILE_PERSISTENCE_OPERATION.LOAD
            ? getLoadErrorMessage(state.error.type)
            : getSaveErrorMessage(state.error?.type);
    }

    function renderPersistenceState(nextState) {
        persistenceState = nextState;

        const hasError = persistenceState.status
            === FILE_PERSISTENCE_STATUS.ERROR;
        const isLoadError = hasError
            && persistenceState.error?.operation
                === FILE_PERSISTENCE_OPERATION.LOAD;
        const shouldShowStatus = hasSelectedFile || hasError;
        const message = getPersistenceMessage(persistenceState);

        saveStatusElement.hidden = !shouldShowStatus;
        saveStatusTextElement.textContent = message;
        saveStatusTextElement.title = hasError ? message : "";

        saveStatusElement.classList.toggle(
            "document-save-status--saving",
            persistenceState.status === FILE_PERSISTENCE_STATUS.SAVING
        );
        saveStatusElement.classList.toggle(
            "document-save-status--saved",
            persistenceState.status === FILE_PERSISTENCE_STATUS.SAVED
        );
        saveStatusElement.classList.toggle(
            "document-save-status--error",
            hasError
        );

        retrySaveButtonElement.hidden = !hasError || isLoadError;
        exportCurrentFileButtonElement.hidden = !hasError || !hasSelectedFile;
    }

    //处理编辑区输入的函数
    function handleInput(newContent) {
        content = newContent;
        onContentChange(content);
    }

    //切换模式的函数
    function setMode(newMode) {
        if (!hasSelectedFile) {
            editButtonElement.disabled = true;
            previewButtonElement.disabled = true;
            editButtonElement.setAttribute("aria-pressed", "false");
            previewButtonElement.setAttribute("aria-pressed", "false");
            editButtonElement.classList.remove("document-mode-button--active");
            previewButtonElement.classList.remove("document-mode-button--active");

            emptyStateElement.hidden = false;
            editArea.element.hidden = true;
            previewArea.element.hidden = true;

            return;
        }

        if (newMode !== "edit" && newMode !== "preview") {
            return;
        }
        mode = newMode;

        //判断选中的是编辑模式还是预览模式
        const isEditMode = mode === "edit";
        const isPreviewMode = mode === "preview";

        //切换按钮状态
        editButtonElement.classList.toggle(
            "document-mode-button--active",
            isEditMode
        );
        previewButtonElement.classList.toggle(
            "document-mode-button--active",
            isPreviewMode
        );
        editButtonElement.setAttribute("aria-pressed", String(isEditMode));
        previewButtonElement.setAttribute("aria-pressed", String(isPreviewMode));

        editButtonElement.disabled = false;
        previewButtonElement.disabled = false;

        emptyStateElement.hidden = true;
        editArea.element.hidden = !isEditMode;
        previewArea.element.hidden = !isPreviewMode;

        //render阅读区
        if (isPreviewMode) {
            previewArea.render(content);
        }

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

        setMode(mode);
        renderPersistenceState(persistenceState);
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
        setMode,
        renderPersistenceState
    };
}
