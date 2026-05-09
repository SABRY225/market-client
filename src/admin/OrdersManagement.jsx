import React, { useEffect, useState } from "react";
import getOrders from "../lib/fetchOrders";
import { useTranslation } from "react-i18next";

function OrdersManagement() {
    const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const load = async () => {
      const orders = await getOrders();
      setOrders(orders);
    }

    load();

  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + ordersPerPage);

  // تتبع الطلبات المتأخرة
  const isLate = (date) => {
    const orderDate = new Date(date);
    const today = new Date();
    const diffDays = (today - orderDate) / (1000 * 60 * 60 * 24);
    return diffDays > 7 && !["مكتمل", "ملغي"].includes(date.status);
  };

  // تغيير الحالة يدويًا
  const handleChangeStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <table className="w-full bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-2 px-4 text-right">#</th>
            <th className="py-2 px-4 text-right">اسم العميل</th>
            <th className="py-2 px-4 text-right">الإجمالي</th>
            <th className="py-2 px-4 text-right">تاريخ الطلب</th>
            <th className="py-2 px-4 text-right">الحالة</th>
            <th className="py-2 px-4 text-center">التحكم</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => {
            const late = isLate(order.date);
            return (
              <tr
                key={order.id}
                className={`border-b hover:bg-gray-50 ${late ? "bg-red-50" : ""
                  }`}
              >
                <td className="py-2 px-4">{order.id}</td>
                <td className="py-2 px-4">{order.customer}</td>
                <td className="py-2 px-4">{order.total}</td>
                <td className="py-2 px-4">{new Date(order.date).toLocaleString()}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${order.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "delivered"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {t("translation."+order.status)}
                  </span>
                </td>
                <td className="py-2 px-4 text-center">
                  <select
                    value={order.status}
                    onChange={(e) => handleChangeStatus(order.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="processing">قيد التجهيز</option>
                    <option value="delivered">تم التوصيل</option>
                    <option value="confirmed">تم التأكيد</option>
                    <option value="shipped">تم الشحن</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </td>
              </tr>
            );
          })}
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
  );
}

export default OrdersManagement;
