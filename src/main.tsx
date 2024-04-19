import React from 'react'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { persistor, store } from './slices/StoreConfiguration.ts'
import { PersistGate } from 'redux-persist/integration/react'

export function Main (): React.JSX.Element {
  return (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App/>
        </PersistGate>
    </Provider>
  )
}
