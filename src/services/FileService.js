import { files, SetCurrentFileId } from "../state.js";
import { CreateFile } from "../models/file.js";

export function AddFile(title) {
    const file = CreateFile(title);
    files.push(file);
}

export function DeleteFile() {
    
}

export function ImportFile() {
    
}

export function SelectFile(id){
    SetCurrentFileId(id);
}

export function UpdateFile(id, content) {
    const file = files.find(file => file.id === id);

    file.content = content;
    file.updateTime = new Date().toISOString();
}