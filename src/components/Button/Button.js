import "./Button.css"

export function Button(option) {
    const button = document.createElement("button");
    button.className = "btn";
    
    if(option.text) {
        button.textContent = option.text;
    }

    if(option.image) {
        const icon = document.createElement("img");
        icon.className = "icon";
        icon.src = option.image;
        icon.alt = option.alt ?? "";
        button.append(icon);
    }

    return button;
}
