import { files } from "./state.js";
import { Filearea } from "./components/Filearea";

export function renderFileArea() {

    const container = document.querySelector(".file_display");
    files.map(file => { 
        const fileitem = FileItem(file);
        filedisplay.append(fileitem);
    }).join("")

}