import "./Button.css";

export function createButton(options) {
    const buttonElement = document.createElement("button");
    buttonElement.className = "button";

    if (options.text) {
        buttonElement.textContent = options.text;
    }

    if (options.image) {
        const iconElement = document.createElement("img");
        iconElement.className = "button__icon";
        iconElement.src = options.image;
        iconElement.alt = options.alt ?? "";
        buttonElement.append(iconElement);
    }

    return buttonElement;
}
