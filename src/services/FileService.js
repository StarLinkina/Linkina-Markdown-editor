import { files, currentNoteId } from "../state.js";
import { CreateFile } from "../models/file.js";

export function AddFile(title) {
    const file = CreateFile(title);
    files.push(file);
}

export function DeleteFile() {
    
}

export function ImportFile() {
    
}

export function selectNote(id){

    currentNoteId = id;

}