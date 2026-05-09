import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Plus, Trash2, Tag, Percent, Loader2, Info, AlertTriangle, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast"; // تأكد من تثبيتها: npm install react-hot-toast
import getSallerPromotions from "../lib/saller/fetchSallerPromotions";
import removeCoupon from "../lib/removeCoupon";
import addCoupon from "../lib/addCoupon";

export default function VendorPromotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState({ show: false, id: null });
  const [newPromo, setNewPromo] = useState({
    code: "",
    discount: "",
    expires_at: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getSallerPromotions();
      setPromotions(data);
    } catch (error) {
      toast.error("فشل في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPromotion = async () => {
    if (!newPromo.code || !newPromo.discount || !newPromo.expires_at) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }
    
    setActionLoading(true);
    try {
      const createdPromo = await addCoupon(newPromo);
      setPromotions([...promotions, createdPromo]);
      setNewPromo({ code: "", discount: "", expires_at: "" });
      toast.success("تم إضافة العرض بنجاح! 🎉");
    } catch (error) {
      toast.error("فشل في إضافة العرض");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    const id = showDeleteModal.id;
    setActionLoading(true);
    try {
      await removeCoupon(id);
      setPromotions(promotions.filter((p) => p.id !== id));
      toast.success("تم حذف العرض نهائياً");
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    } finally {
      setActionLoading(false);
      setShowDeleteModal({ show: false, id: null });
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50/30 min-h-screen rtl text-right relative">
      <Toaster position="top-center" reverseOrder={false} />

      {/* نافذة التأكيد (Modal) */}
      {showDeleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl bg-white overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">هل أنت متأكد؟</h3>
              <p className="text-gray-500 mb-8">سيتم حذف هذا الكوبون نهائياً ولا يمكن التراجع عن هذا الإجراء.</p>
              <div className="flex gap-4">
                <Button 
                  onClick={confirmDelete} 
                  disabled={actionLoading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl h-12 font-bold"
                >
                  {actionLoading ? <Loader2 className="animate-spin" size={20} /> : "نعم، احذف"}
                </Button>
                <Button 
                  onClick={() => setShowDeleteModal({ show: false, id: null })}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-black rounded-2xl h-12 font-bold"
                >
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-600 rounded-xl text-white">
          <Tag size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">العروض والخصومات</h2>
      </div>

      {/* إنشاء خصم جديد */}
      <Card className="border-none shadow-sm rounded-3xl bg-white">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold mb-6 text-gray-700 flex items-center gap-2">
            <Plus size={20} className="text-blue-600" /> إضافة عرض ترويجي جديد
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 text-right">
              <label className="text-sm font-medium text-gray-500 mr-2">كود الخصم</label>
              <input
                type="text"
                placeholder="مثال: SALE2024"
                value={newPromo.code}
                onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })}
                className="w-full border-gray-100 bg-gray-50 rounded-2xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 mr-2">نسبة الخصم</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="20"
                  value={newPromo.discount}
                  onChange={(e) => setNewPromo({ ...newPromo, discount: e.target.value })}
                  className="w-full border-gray-100 bg-gray-50 rounded-2xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <Percent className="absolute left-3 top-3.5 text-gray-300" size={18} />
              </div>
            </div>

            <div className="space-y-2 text-right">
              <label className="text-sm font-medium text-gray-500 mr-2">موعد انتهاء العرض</label>
              <input
                type="date"
                value={newPromo.expires_at}
                onChange={(e) => setNewPromo({ ...newPromo, expires_at: e.target.value })}
                className="w-full border-gray-100 bg-gray-50 rounded-2xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>
          <Button 
            onClick={handleAddPromotion} 
            disabled={actionLoading}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 h-12 shadow-lg transition-all"
          >
            {actionLoading ? <Loader2 className="animate-spin ml-2" size={18} /> : <Plus className="ml-2" size={18} />}
            تفعيل العرض الآن
          </Button>
        </CardContent>
      </Card>

      {/* قائمة الخصومات */}
      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 border-b border-gray-100 text-sm">
                  <th className="p-4 font-bold">كود الخصم</th>
                  <th className="p-4 font-bold text-center">نسبة الخصم</th>
                  <th className="p-4 font-bold">تاريخ الانتهاء</th>
                  <th className="p-4 font-bold text-center">الحالة</th>
                  <th className="p-4 font-bold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {promotions.map((promo) => (
                  <tr key={promo.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-gray-800">{promo.code}</td>
                    <td className="p-4 text-center">
                      <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-black">
                        %{promo.discount}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">{new Date(promo.expires_at).toLocaleDateString('ar-EG')}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${promo.active ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}></span>
                        <span className={`text-xs font-bold ${promo.active ? "text-green-600" : "text-gray-400"}`}>
                          {promo.active ? "نشط" : "غير نشط"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setShowDeleteModal({ show: true, id: promo.id })}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}