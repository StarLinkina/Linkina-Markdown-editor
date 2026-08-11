import "./Button.css";

export function createButton(options) {
    const buttonElement = document.createElement("button");
    buttonElement.type = "button";
    buttonElement.className = "button";

    if (options.text) {
        buttonElement.classList.add("text-button");
        buttonElement.textContent = options.text;
    } else if (options.image) {
        buttonElement.classList.add("icon-button");
        buttonElement.title = options.alt ?? "";
        buttonElement.setAttribute("aria-label", options.alt ?? "");
    }

    if (options.image) {
        const iconElement = document.createElement("span");
        iconElement.className = "button-icon";
        iconElement.setAttribute("aria-hidden", "true");
        buttonElement.style.setProperty(
            "--button-icon-image",
            `url("${options.image}")`
        );
        buttonElement.append(iconElement);
    }

    return buttonElement;
}
