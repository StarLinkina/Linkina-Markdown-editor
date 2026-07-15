import {Button} from "../Button"

export function FileItem(file, {onSelect, onDelete, onExport}){
    
    //创建file_item，最外部容器
    const file_item = document.createElement("div");
    file_item.className = "file_item";

    //创建file_title，作为显示文件标题的元素
    const file_title = document.createElement("p");
    // filetitle.className = "file_title";
    file_title.textContent = file.title;
    file_item.append(file_title);

    //为每个组件预留点击事件，他的点击触发事件就是传来的参数
    file_item.addEventListener("click", () => {
        onSelect(file);
    })

    //创建删除按钮
    const delete_button = Button({text: "delete"});
    // delete_button.className = "delete_button"
    delete_button.addEventListener("click", (event) => {
        event.stopPropagation();
        onDelete(file.id);
    })
    file_item.append(delete_button);

    //创建导出按钮
    const export_button = Button({text: "export"});
    // export_button.className = "export_button";
    export_button.addEventListener("click", (event) => {
        event.stopPropagation();
        onExport(file.id);
    })
    file_item.append(export_button);

    return file_item;
}