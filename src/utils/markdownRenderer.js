import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";

import hljs from "highlight.js/lib/core";

import plaintext from "highlight.js/lib/languages/plaintext";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import markdown from "highlight.js/lib/languages/markdown";

hljs.registerLanguage("plaintext", plaintext);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("markdown", markdown);

//实现代码语法高亮
const markdownRenderer = new Marked(
    {
        gfm: true,
        breaks: true
    },
    markedHighlight({
        emptyLangClass: "hljs",
        langPrefix: "hljs language-",

        highlight(code, language) {
            const normalizedLanguage = (language ?? "")
                .trim()
                .split(/\s+/)[0]
                .toLowerCase();

            const languageName = hljs.getLanguage(normalizedLanguage)
                ? normalizedLanguage
                : "plaintext";

            return hljs.highlight(code, {
                language: languageName,
                ignoreIllegals: true
            }).value;
        }
    })
);

export function renderMarkdown(content = "") {
    const markdownContent = content.replace(
        /^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,
        ""
    );

    return markdownRenderer.parse(markdownContent);
}