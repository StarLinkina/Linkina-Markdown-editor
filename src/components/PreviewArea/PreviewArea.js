import "./PreviewArea.css";

import { marked } from "marked";
import DOMPurify from "dompurify";

export function createPreviewArea() {
    const previewAreaElement = document.createElement("article");
    previewAreaElement.className = "preview-area";

    function render(content = "") {
        //取出content中的零宽字符
        const markdown = content.replace(
            /^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,
            ""
        );
        //使用marked将markdown语法的content转换成html
        const html = marked.parse(markdown, {
            gfm: true, //github风格
            breaks: true //在分段之间加上<br>
        });
        //使用dompurify去除可能的危险字段
        previewAreaElement.innerHTML = DOMPurify.sanitize(html);
    }

    return {
        element: previewAreaElement,
        render
    };
}
