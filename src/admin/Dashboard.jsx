import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  Bell, 
  Package, 
  DollarSign, 
  ShoppingCart, 
  Store, 
  Shield, 
  User, 
  Truck, 
  AlertTriangle 
} from "lucide-react";
import getAdminNotification from "../lib/Admin/fetchAdminNotification";
import getAdminStatistics from "../lib/Admin/fetchAdminStatistics";
import getAdminStock from "../lib/Admin/fetchAdminStock";

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  const [statistics, setStatistics] = useState();
  const [stock, setStock] = useState();
  const [notifications, setNotifications] = useState();

  useEffect(() => {
    const load = async () => {
      try {
        const [stockData, statisticsData, notificationData] = await Promise.all([
          getAdminStock(),
          getAdminStatistics(),
          getAdminNotification()
        ]);
        setStock(stockData);
        setStatistics(statisticsData);
        setNotifications(notificationData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };
    load();
  }, []);

  return (
    <div className={`p-6 space-y-6 bg-gray-50 min-h-screen ${isArabic ? 'font-sans' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* العنوان */}
      <h1 className="text-2xl font-bold text-gray-800">
        {isArabic ? "لوحة التحكم" : "Dashboard Overview"}
      </h1>

      {/* الإحصائيات الأساسية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {/* إجمالي المبيعات */}
        <StatCard 
          icon={<DollarSign className="text-orange-500" size={24} />}
          label={isArabic ? "إجمالي المبيعات" : "Total Sales"}
          value={`${statistics?.totalSales || 0} ${isArabic ? 'ج.م' : 'EGP'}`}
        />
        {/* عدد الطلبات */}
        <StatCard 
          icon={<ShoppingCart className="text-blue-500" size={24} />}
          label={isArabic ? "عدد الطلبات" : "Total Orders"}
          value={statistics?.orders || 0}
        />
        {/* عدد المطاعم */}
        <StatCard 
          icon={<Store className="text-green-500" size={24} />}
          label={isArabic ? "عدد المطاعم" : "Total Vendors"}
          value={statistics?.vendors || 0}
        />
        {/* عدد المسؤولين */}
        <StatCard 
          icon={<Shield className="text-indigo-500" size={24} />}
          label={isArabic ? "عدد المسؤولين" : "Admins"}
          value={statistics?.admins || 0}
        />
        {/* عدد العملاء */}
        <StatCard 
          icon={<User className="text-purple-500" size={24} />}
          label={isArabic ? "عدد العملاء" : "Total Customers"}
          value={statistics?.customers || 0}
        />
        {/* عدد المندوبين */}
        <StatCard 
          icon={<Truck className="text-pink-500" size={24} />}
          label={isArabic ? "عدد المندوبين" : "Delivery Agents"}
          value={statistics?.delivery || 0}
        />
      </div>

      {/* حالة المخزون */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
          <Package className="text-orange-600" size={20} /> 
          {isArabic ? "حالة المخزون العام" : "General Stock Status"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-sm">{isArabic ? "إجمالي الأصناف" : "Total Items"}</p>
            <p className="text-xl font-bold text-gray-800">{stock?.totalProducts || 0}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-xl">
            <p className="text-yellow-700 text-sm">{isArabic ? "قريب من النفاد" : "Low Stock"}</p>
            <p className="text-xl font-bold text-yellow-600">{stock?.lowStock || 0}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-xl">
            <p className="text-red-700 text-sm">{isArabic ? "منتهي الصلاحية/الكمية" : "Out of Stock"}</p>
            <p className="text-xl font-bold text-red-600">{stock?.outOfStock || 0}</p>
          </div>
        </div>
      </div>

      {/* الإشعارات العاجلة */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
          <Bell className="text-red-500" size={20} /> 
          {isArabic ? "إشعارات عاجلة" : "Urgent Notifications"}
        </h2>
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
          {notifications?.length > 0 ? (
            <ul className="space-y-3">
              {notifications.map((note, i) => (
                <li key={i} className={`flex items-start gap-3 p-3 rounded-lg border-b border-gray-50 hover:bg-gray-50 transition-colors`}>
                  <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={18} />
                  <div>
                    <span className="font-bold text-gray-700 block text-sm">
                      {note?.title || (isArabic ? 'تنبيه' : 'Alert')}
                    </span>
                    <span className="text-gray-600 text-sm">{note?.message}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <Bell className="mx-auto text-gray-300 mb-2" size={40} />
              <p className="text-gray-500">{isArabic ? "لا توجد إشعارات حالياً." : "No new notifications."}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// مكون فرعي لبطاقات الإحصائيات لتقليل تكرار الكود
function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className="p-3 bg-gray-50 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{label}</p>
        <h3 className="text-lg font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );
}