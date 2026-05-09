import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserX,
  Trash2,
  Eye,
  Truck,
  PlusSquare,
  ChevronLeft,
  ChevronRight,
  Store,
  Loader2,
} from "lucide-react";
import getVendors from "../lib/fetchVendors";
import getDeliverys from "../lib/fetchDeliverys";
import getCustomers from "../lib/fetchCustomers";

export default function UsersManagement() {
  const navigate = useNavigate();
  // بيانات العملاء
  const [customers, setCustomers] = useState([]);

  // بيانات البائعين
  const [sellers, setSellers] = useState([]);
  // دعم وتوصيل
  const [support, setSupport] = useState([]);
const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        // 2. جلب جميع البيانات بالتوازي لسرعة الأداء
        const [sellersData, deliverysData, customersData] = await Promise.all([
          getVendors(),
          getDeliverys(),
          getCustomers(),
        ]);

        setSellers(sellersData);
        setSupport(deliverysData);
        setCustomers(customersData);
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
      } finally {
        // 3. إنهاء حالة التحميل
        setIsLoading(false);
      }
    };

    load();
  }, []);

  // Pagination للعملاء
  const [customerPage, setCustomerPage] = useState(1);
  const customersPerPage = 3;
  const totalCustomerPages = Math.ceil(customers.length / customersPerPage);
  const displayedCustomers = customers.slice(
    (customerPage - 1) * customersPerPage,
    customerPage * customersPerPage
  );

  // Pagination للبائعين
  const [sellerPage, setSellerPage] = useState(1);
  const sellersPerPage = 3;
  const totalSellerPages = Math.ceil(sellers.length / sellersPerPage);
  const displayedSellers = sellers.slice(
    (sellerPage - 1) * sellersPerPage,
    sellerPage * sellersPerPage
  );

  // وظائف
  const handleDeleteCustomer = (id) => {
    setCustomers(customers.filter((c) => c.id !== id));
  };

  const handleToggleCustomer = (id) => {
    setCustomers(
      customers.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "نشط" ? "معطل" : "نشط" }
          : c
      )
    );
  };

  const handleSellerApproval = (id, action) => {
    setSellers(
      sellers.map((s) =>
        s.id === id
          ? { ...s, verified: action === "accept" ? true : false }
          : s
      )
    );
  };

  const handleDeleteSeller = (id) => {
    setSellers(sellers.filter((s) => s.id !== id));
  };

  const handleDeleteDelivery = (id) => {
    setSupport(support.filter((m) => m.id !== id));
  };

  const handleViewCustomer = (id) => {
    navigate(`/admin/users/customer/${id}`);
  };

  const handleViewSeller = (id) => {
    navigate(`/admin/users/seller/${id}`);
  };

  const handleViewDelivery = (id) => {
    navigate(`/admin/users/delivery/${id}`);
  };

  const handleAddSeller = () => {
    navigate('/admin/users/seller/new');
  };

  const handleAddDelivery = () => {
    navigate('/admin/users/delivery/new');
  };

if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600 font-medium animate-pulse text-lg">
          جاري تحميل بيانات المستخدمين...
        </p>
      </div>
    );
  }
  const Pagination = ({ page, totalPages, onPageChange }) => (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`p-2 rounded ${
          page === 1 ? "bg-gray-200 text-gray-400" : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        <ChevronRight size={16} />
      </button>
      <span className="text-sm text-gray-700">
        صفحة {page} من {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={`p-2 rounded ${
          page === totalPages
            ? "bg-gray-200 text-gray-400"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        <ChevronLeft size={16} />
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">إدارة المستخدمين</h1>

      {/* العملاء */}
      <section className="bg-white p-5 rounded-2xl shadow">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
          <Users className="text-blue-500" /> العملاء
        </h2>
        <table className="w-full text-sm text-right">
          <thead className="border-b bg-gray-100 text-gray-600">
            <tr>
              <th className="p-2">تاريخ الانشاء</th>
              <th className="p-2">الاسم</th>
              <th className="p-2">البريد الإلكتروني</th>
              <th className="p-2">الخيارات</th>
            </tr>
          </thead>
          <tbody>
            {displayedCustomers.map((c) => (
              <tr key={c?.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{new Date(c?.createdAt).toLocaleString()}</td>
                <td className="p-2">{c?.name}</td>
                <td className="p-2">{c?.email}</td>
                <td className="p-2 flex gap-2">
                  {/* <button
                    onClick={() => handleToggleCustomer(c.id)}
                    className="text-yellow-600 hover:text-yellow-800"
                    title="تعطيل / تفعيل"
                  >
                    <UserX size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(c.id)}
                    className="text-red-600 hover:text-red-800"
                    title="حذف"
                  >
                    <Trash2 size={18} />
                  </button> */}
                  <button
                    onClick={() => handleViewCustomer(c.id)}
                    className="text-blue-600 hover:text-blue-800"
                    title="عرض"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          page={customerPage}
          totalPages={totalCustomerPages}
          onPageChange={setCustomerPage}
        />
      </section>

      {/* البائعين */}
      <section className="bg-white p-5 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Store className="text-purple-500" /> المطاعم
          </h2>
          <button
            onClick={handleAddSeller}
            className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700"
            title="إضافة مطعم جديد"
          >
            <PlusSquare size={16} /> إضافة مطعم
          </button>
        </div>
        <table className="w-full text-sm text-right">
          <thead className="border-b bg-gray-100 text-gray-600">
            <tr>
              <th className="p-2">الاسم</th>
              <th className="p-2">البريد الإلكتروني</th>
              <th className="p-2">الحالة</th>
              <th className="p-2">الخيارات</th>
            </tr>
          </thead>
          <tbody>
            {displayedSellers.map((s) => (
              <tr key={s?.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{s?.name}</td>
                <td className="p-2">{s?.email}</td>
                <td className="p-2">
                  {s?.vendor?.status=="active" ? (
                    <span className="px-2 py-1 rounded bg-green-500 text-white">
                      مقبول
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded bg-gray-400 text-white">
                      بانتظار المراجعة
                    </span>
                  )}
                </td>
                <td className="p-2 flex gap-2">
                                    {/* {s?.vendor?.status=="active" ? (                  <button
                    onClick={() => handleSellerApproval(s.id, "reject")}
                    className="text-red-600 hover:text-red-800"
                    title="رفض"
                  >
                    <UserX size={18} />
                  </button>
                  ) : (
                                      <button
                    onClick={() => handleSellerApproval(s.id, "active")}
                    className="text-green-600 hover:text-green-800"
                    title="قبول"
                  >
                    <UserCheck size={18} />
                  </button>
                  )}


                  <button
                    onClick={() => handleDeleteSeller(s.id)}
                    className="text-red-600 hover:text-red-800"
                    title="حذف"
                  >
                    <Trash2 size={18} />
                  </button> */}
                  <button
                    onClick={() => handleViewSeller(s.id)}
                    className="text-blue-600 hover:text-blue-800"
                    title="ملف البائع"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          page={sellerPage}
          totalPages={totalSellerPages}
          onPageChange={setSellerPage}
        />
      </section>

      {/* فرق الدعم وموظفي التوصيل */}
      <section className="bg-white p-5 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Truck className="text-orange-500" />  مندوبي التوصيل
          </h2>
          <button
            onClick={handleAddDelivery}
            className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600"
            title="إضافة مندوب توصيل جديد"
          >
            <PlusSquare size={16} /> إضافة مندوب
          </button>
        </div>
        <ul className="space-y-2">
          {support.map((m) => (
            <li
              key={m.id}
              className="flex justify-between items-center border-b pb-1 text-sm"
            >
              <div className="flex gap-2 items-center">
                  <Truck className="text-orange-500" size={18} />
                <span>{m?.name}</span>
              </div>
              <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleViewDelivery(m?.id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="ملف المندوب"
                    >
                      <Eye size={18} />
                    </button>
                    {/* <button
                      onClick={() => handleDeleteDelivery(m?.id)}
                      className="text-red-600 hover:text-red-800"
                      title="حذف"
                    >
                      <Trash2 size={18} />
                    </button> */}

              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
