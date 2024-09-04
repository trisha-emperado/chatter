import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import routes from './routes.tsx'

const router = createBrowserRouter(routes)
const queryClient = new QueryClient()

document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById('app') as HTMLElement).render(
    /**
     * TODO: replace domain, clientId, and audience
     */
    <Auth0Provider
      domain="karaka-2024-georgia.au.auth0.com"
      clientId="J0fbW8JaYCEI2LYmAHIo5osd404vHszT"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://posts/api',
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </Auth0Provider>,
  )
})
