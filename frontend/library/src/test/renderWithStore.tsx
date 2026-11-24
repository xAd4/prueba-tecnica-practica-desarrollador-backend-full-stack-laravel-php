import { render, renderHook, type RenderOptions } from '@testing-library/react'
import type { PropsWithChildren, ReactElement } from 'react'
import { Provider } from 'react-redux'
import { setupStore, type AppStore, type RootState } from '../app/store/store'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>
  store?: AppStore
}

const createWrapper = (store: AppStore) =>
  function Wrapper({ children }: PropsWithChildren) {
    return <Provider store={store}>{children}</Provider>
  }

export const renderWithStore = (
  ui: ReactElement,
  { preloadedState = {}, store = setupStore(preloadedState), ...options }: ExtendedRenderOptions = {},
) => ({ store, ...render(ui, { wrapper: createWrapper(store), ...options }) })

export const renderHookWithStore = <Result,>(
  hook: () => Result,
  { preloadedState = {}, store = setupStore(preloadedState) }: ExtendedRenderOptions = {},
) => ({ store, ...renderHook(hook, { wrapper: createWrapper(store) }) })
