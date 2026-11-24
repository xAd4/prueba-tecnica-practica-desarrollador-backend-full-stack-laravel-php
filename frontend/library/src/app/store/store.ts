import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { bookSlice } from '../../books/slices/bookSlice'
import { categorySlice } from '../../categories/slices/categorySlice'
import { versionSlice } from '../../version/slices/versionSlice'

const rootReducer = combineReducers({
  books: bookSlice.reducer,
  categories: categorySlice.reducer,
  version: versionSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

/** Factory so tests can create an isolated store with a preloaded state. */
export const setupStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  })

export const store = setupStore()

export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
