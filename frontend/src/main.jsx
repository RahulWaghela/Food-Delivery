import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
// import {StoreContext,StoreContextProvider} from './components/Context/StoreContext.jsx';
import StoreContextProvider from '../src/Context/StoreContext';
ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <StoreContextProvider>
        <App />
      </StoreContextProvider>
    </BrowserRouter>
)
