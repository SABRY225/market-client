import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  BarChart3, 
  Megaphone, 
  Star, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Store
} from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import getSallerInfo from '../lib/saller/fetchSallerInfo';
import { useTranslation } from 'react-i18next';

const navLinks = [
  { id: 'saller', title: 'dashboard', icon: <LayoutDashboard size={22} />, path: '/saller' },
  { id: 'products', title: 'menu_management', icon: <Package size={22} />, path: '/saller/menu' },
  { id: 'orders', title: 'incoming_orders', icon: <ShoppingBag size={22} />, path: '/saller/orders' },
  { id: 'reports', title: 'sales_reports', icon: <BarChart3 size={22} />, path: '/saller/reports' },
  { id: 'promotions', title: 'offers_discounts', icon: <Megaphone size={22} />, path: '/saller/promotions' },
  { id: 'reviews', title: 'product_reviews', icon: <Star size={22} />, path: '/saller/reviews' },
  { id: 'support', title: 'seller_support', icon: <MessageSquare size={22} />, path: '/saller/support' },
  { id: 'setting', title: 'store_settings', icon: <Settings size={22} />, path: '/saller/setting' }
];

const DashboardSallerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [user, setUser] = useState(null);
  const [activeLink, setActiveLink] = useState('');

  async function fetchData() {
    try {
      const data = await getSallerInfo();
      setUser(data);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    const current = navLinks.find(link => 
      location.pathname === link.path || location.pathname.startsWith(link.path + '/saller')
    );
    fetchData();
    if (current) setActiveLink(current.id);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/saller/login");
  };

  return (
    <div className={`flex h-screen bg-[#F4F7FE] overflow-hidden font-sans text-slate-900 ${isRtl ? 'font-arabic' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-e border-slate-100 shadow-sm z-50">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <Store size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-800 tracking-tight leading-none uppercase">
                {t("translation.market_name")}
              </span>
              <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">
                {t("translation.seller_central")}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 overflow-y-auto space-y-1">
          {navLinks.map((link) => {
            const isActive = activeLink === link.id;
            return (
              <Link
                key={link.id}
                to={link.path}
                className={`relative flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <div className={`absolute ${isRtl ? '-right-1' : '-left-1'} w-1.5 h-6 bg-indigo-600 rounded-full`} />
                )}
                <span className={`${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                  {link.icon}
                </span>
                <span className="text-[15px] font-semibold tracking-tight">{t('translation.'+link.title)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-rose-500 bg-rose-50/50 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100"
          >
            <LogOut size={20} className={isRtl ? 'rotate-180' : ''} />
            {t("translation.logout")}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40 px-6 lg:px-10">
          <div className="h-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all"
              >
                <Menu size={20} />
              </button>
              
              <div className="hidden md:flex flex-col">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                  {t("translation.welcome_back")}
                </p>
                <h2 className="text-lg font-extrabold text-slate-800">
                  {isRtl ? (user?.name_ar || user?.name_en) : (user?.name_en || 'Seller')} 👋
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-6">
              <LanguageSwitcher />
              
              <div className="h-8 w-[1px] bg-slate-100 mx-2 hidden sm:block"></div>

              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="hidden lg:block text-right">
                  <p className="text-[13px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-none">
                    {isRtl ? (user?.store_name_ar || user?.name_en) : (user?.name_en || 'My Store')}
                  </p>
                  <p className="text-[10px] text-green-500 font-bold mt-1 uppercase tracking-tighter">
                    {t("translation.verified_merchant")}
                  </p>
                </div>
                <div className="w-11 h-11">
                  <img 
                    src={user?.image_url} 
                    alt="profile" 
                    className="rounded-2xl bg-slate-100 border border-slate-200 w-full h-full object-cover group-hover:border-indigo-200 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Section */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-[32px] p-8 min-h-[calc(100vh-180px)] shadow-xl shadow-slate-200/50 border border-slate-50">
               <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${sidebarOpen ? 'visible' : 'invisible'} transition-all duration-300`}>
        <div 
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setSidebarOpen(false)}
        ></div>
        <aside className={`absolute ${isRtl ? 'right-0' : 'left-0'} top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full' : '-translate-x-full')}`}>
          <div className="p-8 flex items-center justify-between">
            <span className="font-black text-xl text-indigo-600 uppercase tracking-tight">{t("dashboard_title")}</span>
            <button onClick={() => setSidebarOpen(false)} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all"><X size={20}/></button>
          </div>
          <nav className="p-4 space-y-2">
             {navLinks.map(link => (
               <Link
                 key={link.id}
                 to={link.path}
                 onClick={() => setSidebarOpen(false)}
                 className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeLink === link.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
               >
                 {link.icon}
                 <span className="text-[16px]">{t(link.title)}</span>
               </Link>
             ))}
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default DashboardSallerLayout;