import "./EditArea.css";

export function createEditArea(onContentChange) {
    // 最外部的编辑区容器
    const editAreaElement = document.createElement("section");
    editAreaElement.className = "edit-area";

    // 编辑区文本框
    const textareaElement = document.createElement("textarea");
    textareaElement.className = "edit-area-textarea";
    textareaElement.disabled = true; // 初始渲染不可编辑
    textareaElement.placeholder = "请输入Markdown..."
    editAreaElement.append(textareaElement);

    // 输入时自动更新内容
    textareaElement.addEventListener("input", () => {
        editAreaElement.classList.toggle(
            "edit-area--empty",
            textareaElement.value.length === 0
        );
        onContentChange(textareaElement.value);
    });

    // render函数
    function render(markdownFile) {
        const hasFile = Boolean(markdownFile);

        textareaElement.value = markdownFile?.content ?? "";
        textareaElement.disabled = !markdownFile;

        editAreaElement.classList.toggle(
            "edit-area--disabled",
            !hasFile
        );

        editAreaElement.classList.toggle(
            "edit-area--empty",
            hasFile && textareaElement.value.length === 0
        );
    }

    return {
        element: editAreaElement,
        render
    };
}
