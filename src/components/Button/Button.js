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
    }

    if (options.image) {
        const iconElement = document.createElement("img");
        iconElement.className = "button-icon";
        iconElement.src = options.image;
        iconElement.alt = options.alt ?? "";
        buttonElement.append(iconElement);
    }

    return buttonElement;
}
