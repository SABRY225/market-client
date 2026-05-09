import React, { useState } from "react";

function ProductsManagement() {
  const [products, setProducts] = useState([
    { id: 1, name: "منتج 1", seller: "البائع أ", price: 100, status: "جديد" },
    { id: 2, name: "منتج 2", seller: "البائع ب", price: 250, status: "جديد" },
    { id: 3, name: "منتج 3", seller: "البائع ج", price: 300, status: "قيد المراجعة" },
    { id: 4, name: "منتج 4", seller: "البائع د", price: 450, status: "مرفوض" },
    { id: 5, name: "منتج 5", seller: "البائع هـ", price: 120, status: "جديد" },
    { id: 6, name: "منتج 6", seller: "البائع و", price: 200, status: "جديد" },
  ]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 3;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

  // Handlers
  const handleApprove = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "تمت الموافقة" } : p))
    );
  };

  const handleReject = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "مرفوض" } : p))
    );
  };


  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        إدارة المنتجات الجديدة
      </h2>

      <table className="w-full bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-2 px-4 text-right">#</th>
            <th className="py-2 px-4 text-right">اسم المنتج</th>
            <th className="py-2 px-4 text-right">البائع</th>
            <th className="py-2 px-4 text-right">السعر</th>
            <th className="py-2 px-4 text-right">الحالة</th>
            <th className="py-2 px-4 text-center">التحكم</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{product.id}</td>
              <td className="py-2 px-4">{product.name}</td>
              <td className="py-2 px-4">{product.seller}</td>
              <td className="py-2 px-4">{product.price} ر.س</td>
              <td className="py-2 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    product.status === "تمت الموافقة"
                      ? "bg-green-100 text-green-600"
                      : product.status === "مرفوض"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {product.status}
                </span>
              </td>
              <td className="py-2 px-4 flex gap-2 justify-center">
                <button
                  onClick={() => handleApprove(product.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  قبول
                </button>
                <button
                  onClick={() => handleReject(product.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  رفض
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                >
                  حذف
                </button>
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
  );
}

export default ProductsManagement;
