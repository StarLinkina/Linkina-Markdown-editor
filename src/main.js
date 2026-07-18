import "./style.css";
import { createNavbar } from "./components/Navbar";
import { createWorkspace } from "./components/Workspace";

const appElement = document.querySelector("#app");

appElement.append(createNavbar());

appElement.append(createWorkspace());
