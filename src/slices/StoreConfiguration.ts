import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import authenticationSlice from './AuthenticationSlice.ts'
import messageModalSlice from './MessageModalSlice.ts'
import domainSlice from './DomainSlice.ts'
import { persistReducer, persistStore, FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, getStoredState, type RehydrateAction } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import processSlice from './ProcessSlice.ts'

const rootReducer = combineReducers({
  [authenticationSlice.name]: authenticationSlice.reducer,
  [messageModalSlice.name]: messageModalSlice.reducer,
  [domainSlice.name]: domainSlice.reducer,
  [processSlice.name]: processSlice.reducer
})

const persistConfig = {
  key: 'persistence',
  whitelist: ['authentication'],
  storage
}

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  }),
  devTools: process.env.NODE_ENV !== 'production'
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const rehydrate = async (): Promise<RehydrateAction> => {
  const state: RootState = await getStoredState(persistConfig) as RootState
  return {
    type: REHYDRATE,
    key: persistConfig.key,
    payload: state
  }
}

export const persistor = persistStore(store)
