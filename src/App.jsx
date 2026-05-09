import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import router from './router';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from "./context/CartContext";

const queryClient = new QueryClient();

function App() {
const { i18n } = useTranslation();

  useEffect(() => {
    // ضبط اتجاه اللغة
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;

  }, [i18n.language]);

  return (
    <CartProvider>
      <QueryClientProvider client={queryClient}>
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={i18n.language === 'ar'}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <RouterProvider router={router} />
    </QueryClientProvider>
    </CartProvider>
    
  );
}

export default App;
