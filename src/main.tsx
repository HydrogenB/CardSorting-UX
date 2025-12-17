import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { router } from './app/router'
import { I18nProvider } from './contexts/i18n-context'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <RouterProvider router={router} />
      <Analytics />
    </I18nProvider>
  </StrictMode>,
)
