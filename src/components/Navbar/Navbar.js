import "./Navbar.css";

import { createButton } from "../Button";
import { THEME } from "../../utils/theme.js";

import sunIcon from "../../assets/bright/sun.svg";
import moonIcon from "../../assets/dark/moon.svg";
import githubIcon from "../../assets/github/github.svg";

const REPOSITORY_URL = "https://github.com/StarLinkina/Linkina-Markdown-editor";

export function createNavbar({ initialTheme, onThemeToggle }) {
    const navbarElement = document.createElement("nav");
    navbarElement.className = "navbar";
    navbarElement.setAttribute("aria-label", "主导航");

    const productNameElement = document.createElement("span");
    productNameElement.className = "navbar__product-name";
    productNameElement.textContent = "Linkina-Markdown-Editor";

    const navbarActionsElement = document.createElement("div");
    navbarActionsElement.className = "navbar__actions";

    const repositoryLinkElement = document.createElement("a");
    repositoryLinkElement.className = "button icon-button navbar__repository-link";
    repositoryLinkElement.href = REPOSITORY_URL;
    repositoryLinkElement.target = "_blank";
    repositoryLinkElement.rel = "noopener noreferrer";
    repositoryLinkElement.title = "打开项目仓库";
    repositoryLinkElement.setAttribute("aria-label", "打开项目仓库");
    repositoryLinkElement.style.setProperty(
        "--button-icon-image",
        `url("${githubIcon}")`
    );

    const repositoryIconElement = document.createElement("span");
    repositoryIconElement.className = "button-icon";
    repositoryIconElement.setAttribute("aria-hidden", "true");
    repositoryLinkElement.append(repositoryIconElement);

    const themeButtonElement = createButton({
        image: moonIcon,
        alt: "暗色主题"
    });
    themeButtonElement.classList.add("navbar__theme-button");

    function renderTheme(theme) {
        const isDarkTheme = theme === THEME.DARK;
        const currentThemeIcon = isDarkTheme ? moonIcon : sunIcon;
        const description = isDarkTheme
            ? "当前为暗色主题，点击切换到亮色主题"
            : "当前为亮色主题，点击切换到暗色主题";

        themeButtonElement.style.setProperty(
            "--button-icon-image",
            `url("${currentThemeIcon}")`
        );
        themeButtonElement.title = description;
        themeButtonElement.setAttribute("aria-pressed", String(isDarkTheme));
    }

    themeButtonElement.addEventListener("click", () => {
        renderTheme(onThemeToggle());
    });

    renderTheme(initialTheme);

    navbarActionsElement.append(
        repositoryLinkElement,
        themeButtonElement
    );
    navbarElement.append(
        productNameElement,
        navbarActionsElement
    );

    return navbarElement;
}
