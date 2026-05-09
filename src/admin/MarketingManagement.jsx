import React, { useEffect, useState } from "react";
import getCoupon from "../lib/fetchCoupon";
import getVendors from "../lib/fetchVendors";

function MarketingManagement() {

  // بيانات الكوبونات
  const [coupons, setCoupons] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const load = async () => {
      const coupons = await getCoupon();
      setCoupons(coupons);
      try {
        const v = await getVendors();
        setVendors(v || []);
      } catch (e) {
        setVendors([]);
      }
    }

    load();

  }, []);
  // إضافة كوبون جديد عبر مودال
  const [showModal, setShowModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [newExpires, setNewExpires] = useState('');
  const [formError, setFormError] = useState('');
  const [newVendorId, setNewVendorId] = useState('');

  const openAddCoupon = () => {
    setFormError('');
    setNewCode('');
    setNewDiscount('');
    setNewExpires('');
    setNewVendorId('');
    setShowModal(true);
  };

  const handleSaveCoupon = () => {
    if (!newCode.trim()) return setFormError('الرجاء إدخال كود الكوبون');
    const discountNum = Number(newDiscount);
    if (!discountNum || discountNum <= 0) return setFormError('أدخل نسبة خصم صحيحة');
    if (!/\d{4}-\d{2}-\d{2}/.test(newExpires)) return setFormError('تأكد من صيغة التاريخ YYYY-MM-DD');
    if (!newVendorId) return setFormError('اختر المطعم صاحب الكوبون');

    setCoupons((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        code: newCode.trim(),
        discount: discountNum,
        expires: newExpires,
        vendorId: newVendorId,
        vendorName: (vendors.find(v=>String(v.id)===String(newVendorId))||{}).name || null,
      },
    ]);
    setShowModal(false);
  };

  // حذف كوبون
  const deleteCoupon = (id) => {
    if (window.confirm("هل تريد حذف هذا الكوبون؟")) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">إدارة التسويق</h2>

      {/* 🎟️ الكوبونات */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">الكوبونات والعروض</h3>
          <button
            onClick={openAddCoupon}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            إضافة كوبون
          </button>
        </div>

        <table className="w-full text-right border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">كود الكوبون</th>
              <th className="p-2">نسبة الخصم</th>
              <th className="p-2">تاريخ الانتهاء</th>
              <th className="p-2 text-center">التحكم</th>
            </tr>
          </thead>
          <tbody>
            {coupons?.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{c.id}</td>
                <td className="p-2 font-mono">{c.code}</td>
                <td className="p-2">{c.discount}%</td>
                <td className="p-2">{c.expires}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => deleteCoupon(c.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">إضافة كوبون جديد</h3>

            {formError && <p className="text-red-600 mb-2">{formError}</p>}

            <label className="block mb-2 text-sm">كود الكوبون</label>
            <input
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="w-full mb-3 border rounded px-3 py-2"
            />

            <label className="block mb-2 text-sm">نسبة الخصم (%)</label>
            <input
              value={newDiscount}
              onChange={(e) => setNewDiscount(e.target.value)}
              type="number"
              className="w-full mb-3 border rounded px-3 py-2"
            />

            <label className="block mb-2 text-sm">تاريخ الانتهاء (YYYY-MM-DD)</label>
            <input
              value={newExpires}
              onChange={(e) => setNewExpires(e.target.value)}
              placeholder="2026-12-31"
              className="w-full mb-4 border rounded px-3 py-2"
            />

            <label className="block mb-2 text-sm">المطعم صاحب الكوبون</label>
            <select
              value={newVendorId}
              onChange={(e) => setNewVendorId(e.target.value)}
              className="w-full mb-4 border rounded px-3 py-2"
            >
              <option value="">-- اختر مطعماً --</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveCoupon}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketingManagement;
