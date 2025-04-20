import React from 'react'
import ReactDOM from 'react-dom/client'
import "./assets/css/main.css";
import "flowbite" 
import RouterConfig from './config/router.config';
import { ClerkProvider } from '@clerk/clerk-react'



const elem = ReactDOM.createRoot(document.getElementById('root')!)

elem.render(
<React.StrictMode>
<RouterConfig/>
</React.StrictMode>
)
