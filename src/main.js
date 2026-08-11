import "./style.css";
import { createNavbar } from "./components/Navbar";
import { createWorkspace } from "./components/Workspace";
import { initializeTheme, toggleTheme } from "./utils/theme.js";

const appElement = document.querySelector("#app");
let currentTheme = initializeTheme();

appElement.append(
    createNavbar({
        initialTheme: currentTheme,
        onThemeToggle: () => {
            currentTheme = toggleTheme(currentTheme);
            return currentTheme;
        }
    })
);

appElement.append(createWorkspace());
