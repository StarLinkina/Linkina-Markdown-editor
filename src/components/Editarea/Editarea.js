import "./Editarea.css";


export function Editarea(onContentChange) {

    const editarea = document.createElement("main");
    editarea.className = "edit_area";

    const textarea = document.createElement("textarea");
    textarea.className = "text_area";

    textarea.addEventListener("input", () => {
        onContentChange(textarea.value);
    });
    
    editarea.append(textarea);
    function render(file){
        textarea.value = file.content;
    }

    return{
        element: editarea,
        render
    }
}