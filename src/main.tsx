import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './App.scss'
import {Provider} from "react-redux";
import {persistor, store} from "./slices/Store.ts";
import {PersistGate} from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App/>
            </PersistGate>
        </Provider>
    </React.StrictMode>
)
