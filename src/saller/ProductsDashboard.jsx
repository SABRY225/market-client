import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Plus, Edit, Trash2, Filter, Search } from "lucide-react";

export default function ProductsDashboard() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("الكل");

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "تيشيرت رجالي",
      price: 15,
      stock: 20,
      status: "نشط",
      category: "ملابس",
    },
    {
      id: 2,
      name: "حذاء رياضي",
      price: 30,
      stock: 5,
      status: "منتهي",
      category: "أحذية",
    },
    {
      id: 3,
      name: "نظارة شمسية",
      price: 25,
      stock: 12,
      status: "مرفوض",
      category: "إكسسوارات",
    },
  ]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "الكل" ? true : p.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">📦 إدارة المنتجات</h1>

      {/* البحث والفلاتر */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="🔍 بحث عن منتج..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-xl p-2 pl-10 outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-xl p-2 outline-none"
        >
          <option value="الكل">كل الحالات</option>
          <option value="نشط">نشط</option>
          <option value="منتهي">منتهي</option>
          <option value="مرفوض">مرفوض</option>
        </select>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
          <Plus size={18} /> إضافة منتج
        </button>
      </div>

      {/* الجدول */}
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border">الاسم</th>
                  <th className="p-3 border">السعر</th>
                  <th className="p-3 border">المخزون</th>
                  <th className="p-3 border">الفئة</th>
                  <th className="p-3 border">الحالة</th>
                  <th className="p-3 border">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{product.name}</td>
                    <td className="p-3 border">{product.price} د.ك</td>
                    <td className="p-3 border">{product.stock}</td>
                    <td className="p-3 border">{product.category}</td>
                    <td
                      className={`p-3 border font-semibold ${
                        product.status === "نشط"
                          ? "text-green-600"
                          : product.status === "منتهي"
                          ? "text-red-500"
                          : "text-yellow-600"
                      }`}
                    >
                      {product.status}
                    </td>
                    <td className="p-3 border flex justify-center gap-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <Edit size={18} />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
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
