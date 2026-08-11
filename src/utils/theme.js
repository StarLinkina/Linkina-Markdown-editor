export const THEME = {
    LIGHT: "light",
    DARK: "dark"
};

const THEME_STORAGE_KEY = "LINKINA-THEME";

function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? THEME.DARK
        : THEME.LIGHT;
}

function loadTheme() {
    try {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme === THEME.LIGHT || storedTheme === THEME.DARK) {
            return storedTheme;
        }
    } catch {
        // 存储不可用时继续使用系统主题。
    }

    return getSystemTheme();
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
}

function saveTheme(theme) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
        // 存储不可用时只保留当前会话内的主题。
    }
}

export function initializeTheme() {
    const theme = loadTheme();
    applyTheme(theme);
    return theme;
}

export function toggleTheme(currentTheme) {
    const nextTheme = currentTheme === THEME.DARK
        ? THEME.LIGHT
        : THEME.DARK;

    applyTheme(nextTheme);
    saveTheme(nextTheme);
    return nextTheme;
}
