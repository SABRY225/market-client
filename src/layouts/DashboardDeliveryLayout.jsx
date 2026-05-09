import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  HiOutlineClipboardList,
  HiOutlineTruck,
  HiOutlineClock,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineMenuAlt2,
  HiOutlineX,
  HiOutlineUserCircle
} from 'react-icons/hi'; 
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const navLinks = [
  { id: 'delivery', title: 'ready_orders', icon: <HiOutlineClipboardList className="w-5 h-5" />, path: '/delivery' },
  { id: 'active', title: 'orders_active', icon: <HiOutlineTruck className="w-5 h-5" />, path: '/delivery/active' },
  { id: 'orders', title: 'order_history', icon: <HiOutlineClock className="w-5 h-5" />, path: '/delivery/orders' },
  { id: 'statistics', title: 'delivery_statistics', icon: <HiOutlineClipboardList className="w-5 h-5" />, path: '/delivery/statistics' },
  { id: 'settings', title: 'settings', icon: <HiOutlineCog className="w-5 h-5" />, path: '/delivery/settings' }
];

const DashboardDeliveryLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeLink, setActiveLink] = useState('');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const current = navLinks.find(link => location.pathname === link.path);
    if (current) setActiveLink(current.id);
  }, [location.pathname]);
  const fetchProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/delivery/profile/${user.id}`);
      if (!response.ok) throw new Error("فشل في جلب البيانات");
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      console.error(err.message);

    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/delivery/login");
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-e border-gray-100 shadow-sm">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
            <HiOutlineTruck className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">{t("Logistics")}</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navLinks.map((link) => {
            const isActive = activeLink === link.id;
            return (
              <Link
                key={link.id}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-100'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-orange-600'
                  }`}
              >
                <span className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-orange-500'}`}>
                  {link.icon}
                </span>
                <span className="text-sm font-semibold">{t("translation." + link.title)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <HiOutlineLogout className="w-5 h-5" />
            {t("translation.log_out")}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100 px-4 md:px-8">
          <div className="h-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              >
                <HiOutlineMenuAlt2 size={24} />
              </button>

              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-800 leading-tight">
                  {t("translation.hi")} {user?.name?.split(' ')[0] || 'كابتن'}!
                </h1>
                <p className={`text-[11px] font-black uppercase flex items-center gap-1.5 px-2 py-1 rounded-lg ${profile?.online ? "text-green-600 bg-green-50/50" : "text-slate-400 bg-slate-50"
                  }`}>
                  <span>{profile?.online ? "🟢" : "⚪"}</span>
                  {profile?.online ? "استقبال الطلبات مفعل" : "استقبال الطلبات متوقف"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-5">
              <LanguageSwitcher />
              <div className="h-8 w-[1px] bg-gray-100 hidden md:block"></div>
              <div className="flex items-center gap-3 bg-gray-50 p-1.5 pr-4 rounded-full border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <HiOutlineUserCircle size={24} />
                </div>
                <span className="text-sm font-bold text-gray-700 hidden lg:block">{user?.name || 'User'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Container */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            {/* الصفحة الداخلية */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 z-50 md:hidden ${sidebarOpen ? 'visible' : 'invisible'} transition-all duration-300`}>
        <div
          className={`absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setSidebarOpen(false)}
        ></div>
        <aside className={`absolute ${isRtl ? 'right-0' : 'left-0'} top-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full' : '-translate-x-full')}`}>
          <div className="p-6 flex items-center justify-between border-b border-gray-50">
            <span className="font-bold text-lg text-orange-600">{t("translation.dashboard")}</span>
            <button onClick={() => setSidebarOpen(false)} className="p-2 text-gray-400 hover:text-gray-600"><HiOutlineX size={20} /></button>
          </div>
          <nav className="p-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.id}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-4 rounded-xl font-medium transition-all ${activeLink === link.id ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {link.icon}
                <span className="text-[15px]">{t("translation."+link.title)}</span>
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default DashboardDeliveryLayout;