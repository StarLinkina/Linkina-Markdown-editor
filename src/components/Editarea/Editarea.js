import "./Editarea.css";


export function Editarea(onContentChange) {

    //最外部容器editarea
    const editarea = document.createElement("main");
    editarea.className = "edit_area";

    //编辑区textarea
    const textarea = document.createElement("textarea");
    textarea.className = "text_area";
    textarea.disabled = true; //初始渲染不可编辑
    editarea.append(textarea);
    //textarea输入事件，自动更新content
    textarea.addEventListener("input", () => {
        onContentChange(textarea.value);
    });
    //编辑区重新渲染
    function render(file){
        textarea.value = file?.content ?? "";
        textarea.disabled = !file; //选中文件时能否编辑
    }

    return{
        element: editarea,
        render
    }
}