import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Truck,
  CreditCard,
  TicketPercent,
  BarChart3,
  AlertCircle,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  Settings,
  Gavel
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import getAdminInfo from '../lib/Admin/fetchAdminInfo';

// المصفوفة المحدثة بأسماء مفاتيح الترجمة
const navLinks = [
  { id: 'dashboard', title: 'overview', label: 'نظرة عامة', icon: <LayoutDashboard size={20} />, path: '/admin' },
  { id: 'admins', title: 'manage admins', label: 'إدارة المسؤولين', icon: <ShieldCheck size={20} />, path: '/admin/manage-admins' },
  { id: 'users', title: 'manage users', label: 'إدارة المستخدمين', icon: <Users size={20} />, path: '/admin/users' },
  { id: 'orders', title: 'manage orders', label: 'إدارة الطلبات', icon: <Truck size={20} />, path: '/admin/orders' },
  { id: 'payments', title: 'payments', label: 'المدفوعات', icon: <CreditCard size={20} />, path: '/admin/payments' },
  { id: 'analytics', title: 'reports', label: 'التقارير', icon: <BarChart3 size={20} />, path: '/admin/analytics' },
  { id: 'chat', title: 'chat', label: 'الدردشة', icon: <MessageSquare size={20} />, path: '/admin/chat' },
  { id: 'setting', title: 'setting', label: 'الاعدادات', icon: <Settings size={20} />, path: '/admin/setting' },
  { id: 'disputes', title: 'disputes', label: 'الشكاوى', icon: <Gavel size={20} />, path: '/admin/disputes' }, 
];

const DashboardAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  async function fetchData() {
    try {
      const data = await getAdminInfo();
      setUser(data);
    } catch (err) {
      console.error(err.message);
    }
  }

  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    const current = navLinks.find(link =>
      location.pathname === link.path || location.pathname.startsWith(link.path + 'admin/')
    );
    fetchData();
    if (current) setActiveLink(current.id)
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  const NavItem = ({ link, onClick }) => {
    const isActive = activeLink === link.id;
    return (
      <Link
        to={link.path}
        onClick={onClick}
        className={`group flex items-center justify-between px-4 py-3 mx-4 mb-1 rounded-xl transition-all duration-200 ${isActive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          }`}
      >
        <div className="flex items-center gap-3">
          <span className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'}`}>
            {link.icon}
          </span>
          <span className="text-[14px] font-semibold">
            {isRtl ? link.label : t(link.title)}
          </span>
        </div>
        {isActive && (
          <ChevronRight
            size={14}
            className={`transition-transform ${isRtl ? 'rotate-180' : ''}`}
          />
        )}
      </Link>
    );
  };

  return (
    <div className={`flex h-screen bg-[#F8FAFC] font-sans ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Sidebar Desktop */}
      <aside className={`hidden lg:flex flex-col w-72 bg-white border-${isRtl ? 'l' : 'r'} border-gray-100 shadow-sm z-50`}>
        <div className="p-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              {isRtl ? 'لوحة التحكم' : 'Admin Panel'}
            </span>
          </div>
        </div>

        <nav className="flex-1 mt-4">
          {navLinks.map(link => <NavItem key={link.id} link={link} />)}
        </nav>

        <div className="p-4 mt-auto border-t border-gray-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} className={isRtl ? 'rotate-180' : ''} />
            <span>{isRtl ? 'تسجيل الخروج' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-4 lg:px-8">
          <div className="h-full flex items-center justify-between gap-4">

            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={24} />
              </button>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              <LanguageSwitcher />

              <div className="h-8 w-[1px] bg-gray-100 mx-2 hidden sm:block"></div>

              <div className="flex items-center gap-3 pl-2">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-gray-900 leading-none">{user?.name || (isRtl ? 'المسؤول' : 'Admin')}</p>
                  <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider font-medium">
                    {isRtl ? 'مدير عام' : 'Super Admin'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-100">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Section */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                {activeLink
                  ? (isRtl ? navLinks.find(l => l.id === activeLink)?.label : t(navLinks.find(l => l.id === activeLink)?.title))
                  : (isRtl ? 'الرئيسية' : 'Home')
                }
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {isRtl ? 'مرحباً بك مجدداً في لوحة التحكم الخاصة بك.' : 'Welcome back to your control dashboard.'}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 min-h-[400px] shadow-sm border border-gray-100">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
          <aside className={`fixed top-0 bottom-0 ${isRtl ? 'right-0' : 'left-0'} w-80 bg-white shadow-2xl transition-transform duration-300 ease-in-out`}>
            <div className="flex items-center justify-between p-6 border-b border-gray-50">
              <span className="font-bold text-xl">{isRtl ? 'لوحة التحكم' : 'Dashboard'}</span>
              <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <nav className="py-6">
              {navLinks.map(link => (
                <NavItem key={link.id} link={link} onClick={() => setSidebarOpen(false)} />
              ))}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
};

export default DashboardAdminLayout;