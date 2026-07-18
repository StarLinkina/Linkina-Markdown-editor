import "./EditArea.css";

export function createEditArea(onContentChange) {
    // 最外部的编辑区容器
    const editAreaElement = document.createElement("main");
    editAreaElement.className = "edit-area";

    // 编辑区文本框
    const textareaElement = document.createElement("textarea");
    textareaElement.className = "edit-area__textarea";
    textareaElement.disabled = true; // 初始渲染不可编辑
    editAreaElement.append(textareaElement);

    // 输入时自动更新内容
    textareaElement.addEventListener("input", () => {
        onContentChange(textareaElement.value);
    });

    // 重新渲染编辑区
    function render(markdownFile) {
        textareaElement.value = markdownFile?.content ?? "";
        textareaElement.disabled = !markdownFile;
    }

    return {
        element: editAreaElement,
        render
    };
}
