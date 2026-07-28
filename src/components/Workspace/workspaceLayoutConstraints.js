export const SIDEBAR_MODE = Object.freeze({
    EXPANDED: "expanded",
    COLLAPSED: "collapsed"
});

export const WORKSPACE_LAYOUT_CONFIG = Object.freeze({
    file: Object.freeze({
        defaultWidth: 260,
        minWidth: 200,
        maxWidth: 420,
        collapseThreshold: 176
    }),
    extend: Object.freeze({
        defaultWidth: 320,
        minWidth: 240,
        maxWidth: 480,
        collapseThreshold: 216
    }),
    documentMinWidth: 480,
    collapsedWidth: 48,
    resizeHandleWidth: 6,
    resizeHandleLineWidth: 1
});

const SIDEBAR_SIDES = Object.freeze(["file", "extend"]);

function getSidebarsWidth(sidebarViews) {
    return SIDEBAR_SIDES.reduce(
        (totalWidth, side) => totalWidth + sidebarViews[side].width,
        0
    );
}

function getAvailableSidebarWidth(workspaceWidth) {
    const resizeHandlesWidth =
        WORKSPACE_LAYOUT_CONFIG.resizeHandleWidth * 2;

    return workspaceWidth
        - WORKSPACE_LAYOUT_CONFIG.documentMinWidth
        - resizeHandlesWidth;
}

export function resolveResponsiveSidebarViews({
    workspaceWidth,
    fileView,
    extendView
}) {
    const sidebarViews = {
        file: {
            ...fileView,
            isResponsiveCollapsed: false
        },
        extend: {
            ...extendView,
            isResponsiveCollapsed: false
        }
    };

    if (!Number.isFinite(workspaceWidth) || workspaceWidth <= 0) {
        return sidebarViews;
    }

    const availableSidebarWidth =
        getAvailableSidebarWidth(workspaceWidth);

    function hasEnoughSpace() {
        return getSidebarsWidth(sidebarViews) <= availableSidebarWidth;
    }

    function collapseTemporarily(side) {
        if (
            sidebarViews[side].width
            <= WORKSPACE_LAYOUT_CONFIG.collapsedWidth
        ) {
            return;
        }

        sidebarViews[side] = {
            ...sidebarViews[side],
            isExpanded: false,
            width: WORKSPACE_LAYOUT_CONFIG.collapsedWidth,
            isResponsiveCollapsed: true
        };
    }

    if (!hasEnoughSpace()) {
        collapseTemporarily("extend");
    }

    if (!hasEnoughSpace()) {
        collapseTemporarily("file");
    }

    return sidebarViews;
}

export function getSidebarDynamicMaxWidth({
    side,
    workspaceWidth,
    otherSidebarWidth
}) {
    const sidebarConfig = WORKSPACE_LAYOUT_CONFIG[side];
    if (!sidebarConfig) return null;

    if (
        !Number.isFinite(workspaceWidth)
        || workspaceWidth <= 0
        || !Number.isFinite(otherSidebarWidth)
    ) {
        return sidebarConfig.maxWidth;
    }

    const resizeHandlesWidth =
        WORKSPACE_LAYOUT_CONFIG.resizeHandleWidth * 2;
    const availableWidth = workspaceWidth
        - WORKSPACE_LAYOUT_CONFIG.documentMinWidth
        - resizeHandlesWidth
        - otherSidebarWidth;

    return Math.min(
        sidebarConfig.maxWidth,
        Math.max(
            WORKSPACE_LAYOUT_CONFIG.collapsedWidth,
            availableWidth
        )
    );
}
