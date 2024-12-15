import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import './index.css'
import App from './App.jsx'
import theme from '../theme.js'
import Home from './pages/Home.jsx'
import Movies from './pages/Movies.jsx'
import Shows from './pages/Shows.jsx'
import Watchlist from './pages/Watchlist.jsx'
import Details from './pages/Details.jsx'
import { AuthProvider } from './context/authProvider.jsx'
import Protected from './components/routes/Protected.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/movies',
        element: <Movies />,
      },
      {
        path: '/shows',
        element: <Shows />,
      },
      {
        path: '/watchlist',
        element: (
          <Protected>
            <Watchlist />
          </Protected>
        )
      },
      {
        path: '/:type/:id',
        element: <Details />,
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    {localStorage.setItem('chakra-ui-color-mode', 'dark')}
    <ChakraProvider theme={theme}>
      <AuthProvider>
      <RouterProvider router={router} />
      </AuthProvider>
    </ChakraProvider>
  </StrictMode>,
)
