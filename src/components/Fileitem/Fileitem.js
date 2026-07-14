

export function FileItem(file, onClick){
    const fileitem = document.createElement("div");
    fileitem.className = "file_item";

    //which 用来约束filetitle这个元素的样式
    const filetitle = document.createElement("p");
    // filetitle.className = "file_title";
    filetitle.textContent = file.title;

    //为每个组件预留点击事件，他的点击触发事件就是传来的参数
    fileitem.addEventListener("click", () => {
        onClick(file);
    })
    fileitem.append(filetitle);

    return fileitem;
}