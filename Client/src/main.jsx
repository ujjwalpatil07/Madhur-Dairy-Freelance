import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeProvider.jsx'
import { AuthProvider } from "./context/AuthProvider.jsx"
import { ProductProvider } from './context/ProductProvider.jsx'
import { CartProvider } from './context/CartProvider.jsx'
import UserOrderProvider from './context/UserOrderProvider.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='199361032805-op5jfh1l5ribcj08elgt9gg10i0u56ao.apps.googleusercontent.com'>
      <BrowserRouter>
        <AuthProvider>
          <ProductProvider>
            <ThemeProvider>
              <CartProvider>
                <UserOrderProvider>
                  <App />
                </UserOrderProvider>
              </CartProvider>
            </ThemeProvider>
          </ProductProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
