import {
    SIDEBAR_MODE,
    WORKSPACE_LAYOUT_CONFIG
} from "./workspaceLayoutConstraints.js";

export const WORKSPACE_LAYOUT_STORAGE_KEY =
    "LINKINA-WORKSPACE-LAYOUT";

const WORKSPACE_LAYOUT_STORAGE_VERSION = 1;
const SIDEBAR_SIDES = Object.freeze(["file", "extend"]);

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function createDefaultSidebarState(sidebarConfig) {
    return {
        mode: SIDEBAR_MODE.EXPANDED,
        width: sidebarConfig.defaultWidth,
        lastExpandedWidth: sidebarConfig.defaultWidth
    };
}

function normalizeWidth(value, sidebarConfig, fallbackWidth) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return fallbackWidth;
    }

    return clamp(
        value,
        sidebarConfig.minWidth,
        sidebarConfig.maxWidth
    );
}

function normalizeSidebarState(side, storedSidebarState) {
    const sidebarConfig = WORKSPACE_LAYOUT_CONFIG[side];
    const defaultState = createDefaultSidebarState(sidebarConfig);

    if (
        !storedSidebarState
        || typeof storedSidebarState !== "object"
        || Array.isArray(storedSidebarState)
    ) {
        return defaultState;
    }

    const isValidMode = Object.values(SIDEBAR_MODE)
        .includes(storedSidebarState.mode);
    const width = normalizeWidth(
        storedSidebarState.width,
        sidebarConfig,
        defaultState.width
    );
    const lastExpandedWidth = normalizeWidth(
        storedSidebarState.lastExpandedWidth,
        sidebarConfig,
        width
    );

    return {
        mode: isValidMode
            ? storedSidebarState.mode
            : defaultState.mode,
        width,
        lastExpandedWidth
    };
}

function createDefaultWorkspaceLayoutState() {
    return {
        file: createDefaultSidebarState(
            WORKSPACE_LAYOUT_CONFIG.file
        ),
        extend: createDefaultSidebarState(
            WORKSPACE_LAYOUT_CONFIG.extend
        )
    };
}

export function loadWorkspaceLayoutState(
    storage = globalThis.localStorage
) {
    if (!storage) {
        return createDefaultWorkspaceLayoutState();
    }

    try {
        const storedValue = storage.getItem(
            WORKSPACE_LAYOUT_STORAGE_KEY
        );

        if (!storedValue) {
            return createDefaultWorkspaceLayoutState();
        }

        const storedLayout = JSON.parse(storedValue);
        if (
            !storedLayout
            || typeof storedLayout !== "object"
            || storedLayout.version !== WORKSPACE_LAYOUT_STORAGE_VERSION
        ) {
            return createDefaultWorkspaceLayoutState();
        }

        return {
            file: normalizeSidebarState(
                "file",
                storedLayout.file
            ),
            extend: normalizeSidebarState(
                "extend",
                storedLayout.extend
            )
        };
    } catch {
        return createDefaultWorkspaceLayoutState();
    }
}

export function saveWorkspaceLayoutState(
    sidebarLayoutState,
    storage = globalThis.localStorage
) {
    if (!storage) return false;

    const storedLayout = {
        version: WORKSPACE_LAYOUT_STORAGE_VERSION
    };

    SIDEBAR_SIDES.forEach(side => {
        storedLayout[side] = {
            mode: sidebarLayoutState[side].mode,
            width: sidebarLayoutState[side].width,
            lastExpandedWidth:
                sidebarLayoutState[side].lastExpandedWidth
        };
    });

    try {
        storage.setItem(
            WORKSPACE_LAYOUT_STORAGE_KEY,
            JSON.stringify(storedLayout)
        );
        return true;
    } catch {
        return false;
    }
}
