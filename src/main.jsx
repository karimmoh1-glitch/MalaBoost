// main.jsx — React entry point.
// It finds the <div id="root"> in index.html and draws the App inside it.
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './App.css'

createRoot(document.getElementById('root')).render(<App />)
