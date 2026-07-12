import './style.css'
import {Navbar} from './components/Navbar'
import {Workspace} from "./components/Workspace";

const app = document.querySelector('#app');

app.append(Navbar());



app.append(Workspace());