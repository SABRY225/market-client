import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Package, 
  User, 
  ChevronLeft,
  Info
} from 'lucide-react';
import getUserData from '../lib/client/fetchUserData';
import getUserOrdersByAdmin from '../lib/Admin/fetchUserOrdersByAdmin';
import { useTranslation } from 'react-i18next';

export default function CustomerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    async function fetchData() {
      try {
        const [custRes, ordersRes] = await Promise.all([
          getUserData(id),
          getUserOrdersByAdmin(id)
        ]);
        setCustomer(custRes);
        setOrders(ordersRes);
      } catch (err) {
        setError(err.message || 'خطأ في جلب البيانات');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-500 font-medium animate-pulse">جاري تحميل ملف العميل...</p>
    </div>
  );

  if (error) return (
    <div className="p-6">
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl flex items-center gap-4">
        <div className="bg-red-100 p-3 rounded-full italic font-serif text-xl">!</div>
        <div>
          <h3 className="font-bold text-lg">عذراً، حدث خطأ</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="mt-2 underline text-sm">إعادة المحاولة</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen text-right" dir="rtl">
      
      {/* Top Navigation & Actions */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all group"
          >
            <ArrowRight size={22} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{customer?.name || 'ملف العميل'}</h1>
            <p className="text-sm text-slate-500 mt-0.5">إدارة بيانات العميل وسجل الطلبات</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 ${
            customer?.isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
          }`}>
            <span className={`h-2 w-2 rounded-full ${customer?.isActive ? "bg-emerald-500" : "bg-rose-500"}`}></span>
            {customer?.isActive ? "حساب نشط" : "حساب معطل"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Main Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mb-4 border border-blue-100">
                <User size={40} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">{customer?.name}</h2>
              <p className="text-slate-400 text-sm font-mono mt-1 uppercase">ID: {id}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600"><Mail size={18} /></div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">البريد الإلكتروني</p>
                  <p className="text-slate-700 font-medium truncate">{customer?.email || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600"><Phone size={18} /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">رقم الهاتف</p>
                  <p className="text-slate-700 font-medium" dir="ltr">{customer?.phone || '—'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600"><MapPin size={18} /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">الموقع</p>
                  <p className="text-slate-700 font-medium">{customer?.city || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Joined Date Card */}
          <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl"><Calendar size={24} /></div>
              <div>
                <p className="text-slate-400 text-xs">تاريخ الانضمام</p>
                <p className="text-lg font-semibold">
                  {customer?.createdAt ? new Date(customer.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Address & Orders */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Detailed Address Section */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4 text-slate-800">
              <Info size={20} className="text-blue-500" />
              <h3 className="font-bold text-lg">العنوان التفصيلي</h3>
            </div>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {customer?.address || 'لم يتم تسجيل عنوان مفصل لهذا العميل.'}
            </p>
          </div>

          {/* Orders Section */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-slate-800">
                <Package size={22} className="text-orange-500" />
                <h3 className="font-bold text-lg">سجل الطلبات</h3>
              </div>
              <span className="bg-slate-100 text-slate-600 px-4 py-1 rounded-full text-xs font-bold">
                إجمالي الطلبات: {orders.length}
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="text-slate-300" size={32} />
                </div>
                <p className="text-slate-400 italic">لا توجد طلبات سابقة لهذا العميل.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id || order._id} className="group border border-slate-100 rounded-3xl p-5 hover:border-blue-200 hover:shadow-md hover:shadow-blue-50/50 transition-all">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                          <Package size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">طلب #{order.orderNumber || order.id}</h4>
                          <p className="text-xs text-slate-400 mt-1">{new Date(order.createdAt).toLocaleString('ar-EG')}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2">
                        <span className="text-blue-600 font-bold">{order.total} {order.currency || 'EGP'}</span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black  tracking-tighter">
                          {t('translation.'+order.status)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                      <details className="w-full group/details">
                        <summary className="list-none flex items-center gap-2 text-sm text-slate-500 cursor-pointer hover:text-blue-600 transition-colors">
                          <ChevronLeft size={16} className="group-open/details:-rotate-90 transition-transform" />
                          <span>عرض تفاصيل المنتجات ({(order.items).length})</span>
                        </summary>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                          {(order.items).map((it, idx) => (
                            <div key={idx} className="bg-slate-50 p-3 rounded-xl text-sm flex justify-between border border-transparent hover:border-slate-200 transition-all">
                              <span className="text-slate-700">{it.Menu.name}</span>
                              <span className="font-bold text-slate-500">x{it.quantity || 1}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}