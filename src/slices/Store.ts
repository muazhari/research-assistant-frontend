import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import authenticationSlice from './AuthenticationSlice.ts'
import messageModalSlice from './MessageModalSlice.ts'
import domainSlice from './DomainSlice.ts'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import processSlice from './ProcessSlice.ts'
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist/es/constants'

const rootReducer = combineReducers({
  [authenticationSlice.name]: authenticationSlice.reducer,
  [messageModalSlice.name]: messageModalSlice.reducer,
  [domainSlice.name]: domainSlice.reducer,
  [processSlice.name]: processSlice.reducer
})

const persistedReducer = persistReducer({
  key: 'persistence',
  whitelist: ['authentication'],
  storage
},
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

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
