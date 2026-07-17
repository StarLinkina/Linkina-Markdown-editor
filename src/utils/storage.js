const STORAGE_KEY = "MARKDOWN-FILES";

//进行localstorage，长期化存储
export function savefiles(files) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(files) //JSON转换成字符串格式
    );    
}

export function loadfiles() {
    const data = localStorage.getItem(STORAGE_KEY); //先取出localstorage的数据

    if(!data){
        return [];
    }

    try{
        const files = JSON.parse(data); //JSON转化成数组
        return Array.isArray(files) ? files: [];
    } catch(error){
        console.error("加载文件失败", error);
        return [];
    }
}