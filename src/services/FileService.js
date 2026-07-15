import { files, SetCurrentFileId } from "../state.js";
import { CreateFile } from "../models/file.js";

export function AddFile(title) {
    const file = CreateFile(title);
    files.push(file);
}

export function DeleteFile(id) {
    //找传入id对应的file的index
    const index = files.findIndex(file => file.id === id);
    if(index === -1) return;

    //使用splice切除，可改变长度
    files.splice(index, 1);
}

export function ImportFile() {
    
}

export function SelectFile(id){
    SetCurrentFileId(id);
}

export function UpdateFile(id, content) {
    //找传入id对于的file
    const file = files.find(file => file.id === id);
    if(!file) return;

    //更新file内容
    file.content = content;
    file.updateTime = new Date().toISOString();
}