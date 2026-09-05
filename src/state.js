import { loadFiles } from "./utils/storage.js";
import { initializeFilePersistence } from "./services/filePersistence.js";

export const fileLoadResult = loadFiles();
export const markdownFiles = fileLoadResult.files;

initializeFilePersistence(fileLoadResult);

export let currentFileId = null;

export function setCurrentFileId(id) {
    currentFileId = id;
}
