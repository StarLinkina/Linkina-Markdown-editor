import { loadfiles } from "./utils/storage.js";

export let files = loadfiles();

export let currentFileId = null;

export function SetCurrentFileId(id) {
    currentFileId = id;
}