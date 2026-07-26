import "./PreviewArea.css";

import { renderMarkdown } from "../../utils/markdownRenderer";
import DOMPurify from "dompurify";

export function createPreviewArea() {
    const previewAreaElement = document.createElement("article");
    previewAreaElement.className = "preview-area";

    function render(content = "") {
        //通过utils里的markdownRenderer进行markdown渲染
        const html = renderMarkdown(content);
        //使用dompurify去除可能的危险字段
        previewAreaElement.innerHTML = DOMPurify.sanitize(html);
    }

    return {
        element: previewAreaElement,
        render
    };
}
