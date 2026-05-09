import React, { useEffect, useState } from "react";
import getAllDispute from "../lib/fetchAllDispute";
import changeStatusDispute from "../lib/changeStatusDispute";
import replyDispute from "../lib/replyDispute";

function DisputesManagement() {
  const [disputes, setDisputes] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(disputes.length / itemsPerPage);
  const displayedDisputes = disputes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

    useEffect(() => {
      const load = async () => {
        const disputesData = await getAllDispute();
        setDisputes(disputesData);
      }
  
      load();
  
    }, []);

    // ربط تذكرة بالدعوى
    const handleLinkTicket = async (id) => {
      const ticketId = window.prompt("أدخل رقم تذكرة الدعم:");
      if (!ticketId) return;
      try {
        await replyDispute(id, { ticketId });
        setDisputes((prev) => prev.map((d) => (d.id === id ? { ...d, ticketId } : d)));
        alert("تم ربط التذكرة بنجاح");
      } catch (err) {
        alert("خطأ أثناء ربط التذكرة: " + (err.message || err));
      }
    };

    // اتخاذ قرار للدعوى وتغيير الحالة
    const handleDecision = async (id, decision) => {
      if (!decision) return;
      const map = {
        تعويض: "تم التعويض",
        استبدال: "تم الاستبدال",
        رفض: "مرفوض",
      };
      const status = map[decision] || decision;
      if (!window.confirm(`تأكيد: تغيير حالة الدعوى إلى '${status}'؟`)) return;
      try {
        await changeStatusDispute(id, { status });
        setDisputes((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
        alert("تم تحديث الحالة بنجاح");
      } catch (err) {
        alert("خطأ أثناء تحديث الحالة: " + (err.message || err));
      }
    };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        الشكاوى والنزاعات (Disputes)
      </h2>

      <table className="w-full bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="p-3 text-right">#</th>
            <th className="p-3 text-right">رقم الطلب</th>
            <th className="p-3 text-right">العميل</th>
            <th className="p-3 text-right">البائع</th>
            <th className="p-3 text-right">السبب</th>
            <th className="p-3 text-right">التاريخ</th>
            <th className="p-3 text-right">تذكرة الدعم</th>
            <th className="p-3 text-center">الحالة</th>
            <th className="p-3 text-center">التحكم</th>
          </tr>
        </thead>
        <tbody>
          {displayedDisputes.map((d) => (
            <tr key={d.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{d.id}</td>
              <td className="p-3">{d.orderId}</td>
              <td className="p-3">{d.customer}</td>
              <td className="p-3">{d.seller}</td>
              <td className="p-3">{d.reason}</td>
              <td className="p-3">{d.date}</td>
              <td className="p-3 text-blue-600">
                {d.ticketId ? d.ticketId : "—"}
              </td>
              <td className="p-3 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    d.status === "تم التعويض"
                      ? "bg-green-100 text-green-700"
                      : d.status === "تم الاستبدال"
                      ? "bg-blue-100 text-blue-700"
                      : d.status === "مرفوض"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {d.status}
                </span>
              </td>
              <td className="p-3 flex gap-2 justify-center">
                {!d.ticketId && (
                  <button
                    onClick={() => handleLinkTicket(d.id)}
                    className="px-3 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600"
                  >
                    ربط بتذكرة
                  </button>
                )}
                <select
                  defaultValue=""
                  onChange={(e) =>
                    e.target.value &&
                    handleDecision(d.id, e.target.value)
                  }
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="">اتخاذ قرار</option>
                  <option value="تعويض">تعويض</option>
                  <option value="استبدال">استبدال</option>
                  <option value="رفض">رفض</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-3">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={currentPage === 1}
        >
          السابق
        </button>
        <span className="px-3 py-1 text-gray-600">
          الصفحة {currentPage} من {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          التالي
        </button>
      </div>
    </div>
  );
}

export default DisputesManagement;
