import React, { useEffect, useState } from "react";
import getInvoices from "../lib/fetchPaymentInvoices";
import getVendorWithdrawalRequests from "../lib/fetchPaymentVendorWithdrawalRequests";
import getStatistics from "../lib/fetchPaymentStatistics";
import { useTranslation } from "react-i18next";

function PaymentsManagement() {
      const { t, i18n } = useTranslation();
  
  // بيانات المعاملات
  const [statistics, setStatistics] = useState([]);
  const [transactions, setTransactions] = useState([]);
  // طلبات سحب البائعين
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
      const load = async () => {
        const invoices = await getInvoices();
        const withdrawals = await getVendorWithdrawalRequests();
        const statistics = await getStatistics();
        setTransactions(invoices);
        setWithdrawals(withdrawals);
        setStatistics(statistics);
      }
  
      load();
  
    }, []);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 3;
  const totalPages = Math.ceil(transactions?.length / perPage);
  const currentTransactions = transactions.slice((currentPage - 1) * perPage, currentPage * perPage);

  // إدارة طلبات السحب
  const handleWithdraw = (id, action) => {
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, status: action === "approve" ? "تم التحويل" : "مرفوض" } : w
      )
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">إدارة المدفوعات والفواتير</h2>

      {/* تحليل الإيرادات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-gray-600 text-sm">إيرادات اليوم</h3>
          <p className="text-xl font-bold text-green-600">{statistics?.totalVolumeToday} ج.م</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-gray-600 text-sm">إجمالي الإيرادات</h3>
          <p className="text-xl font-bold text-blue-600">{statistics?.totalVolumeAll} ج.م</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-gray-600 text-sm">عدد المعاملات</h3>
          <p className="text-xl font-bold text-gray-800">{statistics?.totalTransactionsToday}</p>
        </div>
      </div>

      {/* جدول المعاملات */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">جميع الفواتير والمعاملات</h3>

        <table className="w-full text-right border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">رقم الطلب</th>
              <th className="p-2">المبلغ</th>
              <th className="p-2">طريقة الدفع</th>
              <th className="p-2">التاريخ</th>
              <th className="p-2">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{item.id}</td>
                <td className="p-2">{item.order_id}</td>
                <td className="p-2">{item.amount}</td>
                <td className="p-2">{t("translation."+item.method)}</td>
                <td className="p-2">{new Date(item.createdAt).toLocaleString()}</td>
                <td className="p-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      item.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : item.status === "failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {t("translation."+item.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-4 gap-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            السابق
          </button>
          <span className="px-4 py-1 text-gray-700">
            الصفحة {currentPage} من {totalPages}
          </span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            التالي
          </button>
        </div>
      </div>

      {/* طلبات السحب */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">طلبات سحب البائعين</h3>

        <table className="w-full text-right border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">البائع</th>
              <th className="p-2">المبلغ</th>
              <th className="p-2">الحالة</th>
              <th className="p-2 text-center">التحكم</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((w) => (
              <tr key={w.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{w.id}</td>
                <td className="p-2">{w.seller}</td>
                <td className="p-2">{w.amount} ر.س</td>
                <td className="p-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      w.status === "تم التحويل"
                        ? "bg-green-100 text-green-700"
                        : w.status === "مرفوض"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {w.status}
                  </span>
                </td>
                <td className="p-2 text-center flex gap-2 justify-center">
                  {w.status === "قيد المراجعة" && (
                    <>
                      <button
                        onClick={() => handleWithdraw(w.id, "approve")}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        موافقة
                      </button>
                      <button
                        onClick={() => handleWithdraw(w.id, "reject")}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        رفض
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default PaymentsManagement;
