import React from 'react'
import RootRoute from './route/RootRoute.tsx'
import './App.scss'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { persistor, store } from './slices/StoreConfiguration.ts'

export default function App (): React.JSX.Element {
  return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RootRoute/>
        </PersistGate>
      </Provider>
  )
}
