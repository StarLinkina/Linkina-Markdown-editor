import { Editarea } from "../Editarea";
import { Previewarea } from "../Previewarea";

import { Button } from "../Button";

export function Documentarea({onContentChange}) {
    const document_area = document.createElement("main");
    document_area.className = "document_area";

    const toolbar = document.createElement("div");
    toolbar.className = "document_toolbar";

    const edit_button = Button({ text: "编辑" });
    const preview_button = Button({ text: "阅读" });

    toolbar.append(edit_button, preview_button);

    const edit_area = Editarea(handleInput);
    const preview_area = Previewarea();

    document_area.append(
        toolbar,
        edit_area.element,
        preview_area.element
    );

    //内部状态变量，用于切换编辑/阅读模式
    let mode = "edit";
    let content = "";
    let hasFile = false;

    //处理编辑区输入的函数
    function handleInput(newContent) {
        content = newContent;
        onContentChange(content);
    }

    //切换模式的函数
    function setMode(newMode) {
        if(!hasFile) return;

        mode = newMode;

        //判断是否是编辑模式
        const isEditMode = mode === "edit";

        edit_area.element.hidden = !isEditMode;
        preview_area.element.hidden = isEditMode;

        //重载阅读区
        if (!isEditMode) {
            preview_area.render(content);
        }

        //禁用按钮
        edit_button.disabled = isEditMode;
        preview_button.disabled = !isEditMode;
    }

    //赋予按钮改变状态
    edit_button.addEventListener("click", () => {
        setMode("edit");
    });

    preview_button.addEventListener("click", () => {
        setMode("preview");
    });

    function render(file) {
        hasFile = Boolean(file);
        content = file?.content ?? "";

        edit_area.render(file);
        preview_area.render(content);

        edit_button.disabled = !hasFile;
        preview_button.disabled = !hasFile;

        //若未选中任何文件重载
        if (!hasFile) {
            edit_area.element.hidden = false;
            preview_area.element.hidden = true;
            return;
        }

        setMode(mode);
    }

    function clear() {
        render(null);
    }

    return {
        element: document_area,
        render,
        clear,
        setMode
    };
}