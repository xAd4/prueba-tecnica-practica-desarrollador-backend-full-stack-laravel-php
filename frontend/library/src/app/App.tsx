import { BooksPage } from '../books/pages/BooksPage'
import { AppLayout } from '../shared/components/layout/AppLayout/AppLayout'
import { GlobalStyles } from '../shared/theme/GlobalStyles'

export const App = () => (
  <>
    <GlobalStyles />
    <AppLayout>
      <BooksPage />
    </AppLayout>
  </>
)
