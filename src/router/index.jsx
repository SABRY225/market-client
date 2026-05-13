import { createBrowserRouter } from 'react-router-dom';
import About from '../About';
import DashboardSallerLayout from '../layouts/DashboardSallerLayout';

import DashboardSupportLayout from '../layouts/DashboardSupportLayout';
import DashboardDeliveryLayout from '../layouts/DashboardDeliveryLayout';
import HomePage from '../Home';
import DashboardAdminLayout from '../layouts/DashboardAdminLayout';
import Dashboard from '../admin/Dashboard';
import UsersManagement from '../admin/UsersManagement';
import ProductsManagement from '../admin/ProductsManagement';
import OrdersManagement from '../admin/OrdersManagement';
import PaymentsManagement from '../admin/PaymentsManagement';
import MarketingManagement from '../admin/MarketingManagement';
import AnalyticsDashboard from '../admin/AnalyticsDashboard';
import DisputesManagement from '../admin/DisputesManagement';
import Settings from '../admin/Settings';
import AvailableOrders from '../delivery/AvailableOrders';
import DeliverySettings from '../delivery/DeliverySettings';
import OrdersHistory from '../delivery/OrdersHistory';
import ActiveOrders from '../delivery/ActiveOrders';
import VendorOverview from '../saller/VendorOverview';
import ProductsDashboard from '../saller/ProductsDashboard';
import OrdersDashboard from '../saller/OrdersDashboard';
import ReportsDashboard from '../saller/ReportsDashboard';
import VendorPromotions from '../saller/VendorPromotions';
import VendorReviews from '../saller/VendorReviews';
import VendorStoreSettings from '../saller/VendorStoreSettings';
import VendorSupport from '../saller/VendorSupport';

import DeliveryLogin from '../Auth/DeliveryLogin';
import SupportLogin from '../Auth/SupportLogin';
import CustomerLogin from '../Auth/CustomerLogin';
import CustomerRegister from '../Auth/CustomerRegister';
import ForgotPassword from '../Auth/ForgotPassword';
import AdminLogin from '../Auth/AdminLogin';
import AdminVerify from '../Auth/AdminVerify';
import ProductDetails from '../pages/ProductDetails';
import Categories from '../pages/Categories';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import OrdersPage from '../pages/OrdersPage';
import Wishlist from '../pages/Wishlist';
import Profile from '../pages/Profile';
import Support from '../pages/other/Support';
import Layout from '../layouts/Layout';
import NotFoundPage from '../layouts/NotFoundPage';
import CustomerProfile from '../admin/CustomerProfile';
import SellerProfile from '../admin/saller/SellerProfile';
import DeliveryProfile from '../admin/delivery/DeliveryProfile';
import SupportProfile from '../admin/SupportProfile';
import SellerCreate from '../admin/saller/SellerCreate';
import DeliveryCreate from '../admin/delivery/DeliveryCreate';
import RestaurantPage from '../pages/RestaurantPage';
import Contact from '../Contact';
import RestaurantLogin from '../Auth/VendorLogin';
import AdminsManagement from '../admin/AdminsManagement';
import ProtectedRoute from '../components/ProtectedRoute';
import SellerEdit from '../admin/saller/SellerEdit';
import MenuManagement from '../saller/MenuManagement';
import VendorVerify from '../Auth/VendorVerify';
import FAQPage from '../pages/other/FAQPage';
import ShippingPolicy from '../pages/other/ShippingPolicy';
import ReturnPolicy from '../pages/other/ReturnPolicy';
import PrivacyPolicy from '../pages/other/PrivacyPolicy';
import TermsOfService from '../pages/other/TermsOfService';
import LayoutClient from '../layouts/LayoutClient';
import DeliveryStatistics from '../delivery/DeliveryStatistics';
import OrderPageDetails from '../saller/OrderPageDetails';
import ChatPage from '../admin/ChatPage';
import Mart from '../admin/setting/Mart';
import InvitationSystem from '../admin/setting/InvitationSystem';
import DeliverySystem from '../admin/setting/DeliverySystem';
import Integrations from '../admin/setting/Integrations';
import AdsDashboard from '../admin/setting/Ads';

const router = createBrowserRouter([
  { path: '/admin/login', element: <AdminLogin /> },
  { path: '/saller/login', element: <RestaurantLogin /> },
  { path: '/delivery/login', element: <DeliveryLogin /> },
  { path: '/support/login', element: <SupportLogin /> },
  { path: '/admin/verify', element: <AdminVerify /> },
  { path: '/saller/verify', element: <VendorVerify /> },
  { path: '/login', element: <CustomerLogin /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/register', element: <CustomerRegister /> },
  {
    path: '/', element: <Layout />, children: [
      { index: true, element: <HomePage /> },
      { path: '/faq', element: <FAQPage /> },
      { path: '/shipping-policy', element: <ShippingPolicy /> },
      { path: '/return-policy', element: <ReturnPolicy /> },
      { path: '/terms', element: <PrivacyPolicy /> },
      { path: '/privacy', element: <TermsOfService /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '/support-ticket', element: <Support /> },
      {
        element: <ProtectedRoute allowedRoles={["customer"]} />, children: [
          {
            path: '/', element: <LayoutClient />, children: [
              { path: '/product-details', element: <ProductDetails /> },
              { path: '/restaurant-details/:id', element: <RestaurantPage /> },
              { path: '/categories', element: <Categories /> },
              { path: '/cart', element: <Cart /> },
              { path: '/checkout/:orderId', element: <Checkout /> },
              { path: '/orders', element: <OrdersPage /> },
              { path: '/wishlist', element: <Wishlist /> },
              { path: '/profile', element: <Profile /> },
            ]
          }
        ]
      },
    ]
  },
  {
    element: <ProtectedRoute allowedRoles={["saller"]} />, children: [
      {
        path: '/saller', element: <DashboardSallerLayout />, children: [
          { index: true, element: <VendorOverview /> },
          { path: '/saller/menu', element: <MenuManagement /> },
          { path: '/saller/products', element: <ProductsDashboard /> },
          { path: '/saller/orders', element: <OrdersDashboard /> },
          { path: '/saller/orders/:orderId', element: <OrderPageDetails /> },
          { path: '/saller/reports', element: <ReportsDashboard /> },
          { path: '/saller/promotions', element: <VendorPromotions /> },
          { path: '/saller/reviews', element: <VendorReviews /> },
          { path: '/saller/setting', element: <VendorStoreSettings /> },
          { path: '/saller/support', element: <VendorSupport /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        path: "/admin",
        element: <DashboardAdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },

          { path: "manage-admins", element: <AdminsManagement /> },
          { path: "users", element: <UsersManagement /> },

          { path: "users/customer/:id", element: <CustomerProfile /> },

          { path: "users/seller/new", element: <SellerCreate /> },
          { path: "users/seller/:id", element: <SellerProfile /> },
          { path: "users/seller/edit/:id", element: <SellerEdit /> },

          { path: "users/delivery/new", element: <DeliveryCreate /> },
          { path: "users/delivery/:id", element: <DeliveryProfile /> },

          { path: "users/support/:id", element: <SupportProfile /> },

          { path: "products", element: <ProductsManagement /> },
          { path: "orders", element: <OrdersManagement /> },
          { path: "payments", element: <PaymentsManagement /> },
          { path: "marketing", element: <MarketingManagement /> },
          { path: "analytics", element: <AnalyticsDashboard /> },
          { path: "disputes", element: <DisputesManagement /> },
          { path: "setting", element: <Settings /> },
          { path: "setting/general", element: <AdsDashboard /> },
          { path: "setting/mart", element: <Mart /> },
          { path: "setting/integrations", element: <Integrations /> },
          { path: "setting/invitation-system", element: <InvitationSystem /> },
          { path: "setting/delivery-system", element: <DeliverySystem /> },

          { path: "chat", element: <ChatPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["delivery"]} />, children: [
      {
        path: '/delivery', element: <DashboardDeliveryLayout />, children: [
          { index: true, element: <AvailableOrders /> },
          { path: '/delivery/statistics', element: <DeliveryStatistics /> },
          { path: '/delivery/settings', element: <DeliverySettings /> },
          { path: '/delivery/orders', element: <OrdersHistory /> },
          { path: '/delivery/active', element: <ActiveOrders /> },
        ]
      },
    ]
  },
  { path: "/*", element: <NotFoundPage /> },
]);

export default router;
