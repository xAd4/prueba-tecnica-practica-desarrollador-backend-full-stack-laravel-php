import { BooksPage } from '../books/pages/BooksPage'
import { AppLayout } from '../shared/components/layout/AppLayout/AppLayout'
import { GlobalStyles } from '../shared/theme/GlobalStyles'
import { VersionLegend } from '../version/components/VersionLegend/VersionLegend'

export const App = () => (
  <>
    <GlobalStyles />
    <AppLayout footer={<VersionLegend />}>
      <BooksPage />
    </AppLayout>
  </>
)
