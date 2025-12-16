import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import { UserProvider } from "../context/UserContext";
import { CartProvider } from '../context/CartContext';
import { ReservationCartProvider } from '../context/ReservationCartContext';
import routes from '../routes/routes';

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <CartProvider>
        <ReservationCartProvider>
          <RouterProvider router={router} />
        </ReservationCartProvider>
      </CartProvider>
    </UserProvider>
  </StrictMode>,
)

