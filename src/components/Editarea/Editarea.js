import "./Editarea.css";


export function Editarea() {

    const editarea = document.createElement("main");
    editarea.className = "edit_area";
    const textarea = document.createElement("textarea");
    textarea.className = "text_area";

    editarea.append(textarea);
    function render(file){
        editarea.replaceChildren();
        textarea.value = file.content;
        editarea.append(textarea);
    }

    return{
        element: editarea,
        render
    }
}