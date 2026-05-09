import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Ticket, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  LifeBuoy,
  MessageCircle,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'; 
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const navLinks = [
  { id: 'support', title: 'tickets', icon: <Ticket size={22} />, path: '/support' },
  { id: 'reports', title: 'performance_reports', icon: <BarChart3 size={22} />, path: '/support/reports' },
  { id: 'settings', title: 'settings', icon: <Settings size={22} />, path: '/support/settings' },
];

const DashboardSupportLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    const current = navLinks.find(link => 
      location.pathname === link.path || location.pathname.startsWith(link.path + '/support/')
    );
    if (current) setActiveLink(current.id);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-slate-900" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-e border-slate-200 z-50 transition-all duration-300">
        <div className="p-6 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-100">
              <LifeBuoy size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              {t("HelpDesk")}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navLinks.map((link) => {
            const isActive = activeLink === link.id;
            return (
              <Link
                key={link.id}
                to={link.path}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? 'bg-teal-50 text-teal-700 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={`${isActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-teal-500'}`}>
                  {link.icon}
                </span>
                <span className="text-[14px] font-semibold">{t(link.title)}</span>
                {isActive && (
                   <div className={`ms-auto`}>
                     {isRtl ? <ChevronLeft size={14}/> : <ChevronRight size={14}/>}
                   </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{t("Status")}</p>
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-slate-700">{t("Active Now")}</span>
             </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            {t("log_out")}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 lg:px-8">
          <div className="h-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
              >
                <Menu size={24} />
              </button>
              
              <div className="relative hidden lg:block group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500" size={18} />
                 <input 
                  type="text" 
                  placeholder={t("Search tickets...")}
                  className="bg-slate-50 border-none rounded-xl py-2 px-10 text-sm w-64 focus:ring-2 focus:ring-teal-100 transition-all focus:w-80"
                 />
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-5">
              <LanguageSwitcher />
              
              <button className="relative p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-teal-500 border-2 border-white rounded-full"></span>
              </button>

              <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right leading-none">
                  <p className="text-sm font-bold text-slate-800">{user?.name || 'Agent'}</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">{t("Support Agent")}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold shadow-md shadow-teal-100">
                  {user?.name?.charAt(0) || <LifeBuoy size={18}/>}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Container */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            {/* Page Header (Breadcrumbs or Title) */}
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {t(navLinks.find(l => l.id === activeLink)?.title || "Dashboard")}
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">{t("Manage your support work and tickets.")}</p>
               </div>
               <button className="hidden sm:flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-100">
                  <MessageCircle size={18} />
                  {t("New Ticket")}
               </button>
            </div>

            <div className="bg-white rounded-[24px] p-6 min-h-[500px] shadow-sm border border-slate-200 transition-all duration-500">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 z-[60] md:hidden ${sidebarOpen ? 'visible' : 'invisible'} transition-all duration-300`}>
        <div 
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setSidebarOpen(false)}
        ></div>
        <aside className={`absolute ${isRtl ? 'right-0' : 'left-0'} top-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full' : '-translate-x-full')}`}>
          <div className="p-6 flex items-center justify-between border-b">
            <span className="font-bold text-teal-600 text-lg uppercase">{t("Support")}</span>
            <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600"><X size={20}/></button>
          </div>
          <nav className="p-4 space-y-2">
             {navLinks.map(link => (
               <Link
                 key={link.id}
                 to={link.path}
                 onClick={() => setSidebarOpen(false)}
                 className={`flex items-center gap-4 px-4 py-4 rounded-xl font-bold transition-all ${activeLink === link.id ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
               >
                 {link.icon}
                 <span className="text-[15px]">{t(link.title)}</span>
               </Link>
             ))}
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default DashboardSupportLayout;