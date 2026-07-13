

export function FileItem(file){
    const fileitem = document.createElement("div");
    // fileitem.className = "file_item";

    const filetitle = document.createElement("p");
    // fileitem.className = "file_item";
    filetitle.textContent = file.title;

    fileitem.append(filetitle);

    return fileitem;
}