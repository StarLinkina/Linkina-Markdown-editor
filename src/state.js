import { loadFiles } from "./utils/storage.js";

export const markdownFiles = loadFiles();

export let currentFileId = null;

export function setCurrentFileId(id) {
    currentFileId = id;
}
