import React, { useState, useMemo } from "react";
import {
  FiPlus, FiImage, FiTrash2, FiEdit3, FiGrid,
  FiX, FiLayers, FiLoader, FiSearch, FiChevronLeft
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

import {
  useMenuCategories,
  useAddMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
  useAddCategory,
} from "../lib/saller/menuQueries";

const PREDEFINED_CATEGORIES = [
  "وجبات رئيسية",
  "مشويات",
  "بيتزا",
  "برجر",
  "مقبلات",
  "حلويات",
  "مشروبات",
  "سلطات"
];

export default function MenuManagement() {
  /* =====================
      🟢 React Query
  ===================== */
  const { data: categories = [], isLoading } = useMenuCategories();

  const addItemMutation = useAddMenuItem();
  const updateItemMutation = useUpdateMenuItem();
  const deleteItemMutation = useDeleteMenuItem();
  const addCategoryMutation = useAddCategory();

  // تعريف حالة التحميل للعمليات (حل مشكلة actionLoading)
  const actionLoading = addItemMutation.isLoading || updateItemMutation.isLoading;

  /* =====================
      🟡 Local State
  ===================== */
  const [searchTerm, setSearchTerm] = useState("");
  const [showItemModal, setShowItemModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    name: "",
    desc: "",
    categoryId: "",
    type: "normal", // normal | offer
    price: "",
    price_before_discount: "",
    discount_percentage: "",
    is_available: 1
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  /* =====================
      🔍 Search Logic
  ===================== */
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    return categories.map(cat => ({
      ...cat,
      menus: cat.menus?.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.desc?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(cat => cat.menus?.length > 0);
  }, [categories, searchTerm]);

  /* =====================
      ➕ / ✏️ حفظ صنف
  ===================== */
  const handleSaveItem = async () => {
    if (!currentItem.name) {
      return toast.error("يرجى إكمال البيانات الأساسية");
    }

    const formData = new FormData();
    formData.append("name", currentItem.name);
    formData.append("price", currentItem.price || 0);
    formData.append("description", currentItem.desc || "");
    formData.append("category_id", currentItem.categoryId);
    formData.append("type", currentItem.type);
    formData.append("price_before_discount", currentItem.price_before_discount);
    formData.append("discount_percentage", currentItem.discount_percentage);
    formData.append("is_available", currentItem.is_available);
    if (imageFile) formData.append("image", imageFile);

    try {
      if (isEditing) {
        await updateItemMutation.mutateAsync({
          id: currentItem.id,
          formData,
        });
        toast.success("تم تحديث الصنف بنجاح");
      } else {
        await addItemMutation.mutateAsync(formData);
        toast.success("تم إضافة الصنف بنجاح");
      }
      setShowItemModal(false);
    } catch (err) {
      toast.error("حدث خطأ أثناء الحفظ");
    }
  };

  /* =====================
      🗑 حذف صنف
  ===================== */
  const handleDeleteItem = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا الصنف نهائياً؟")) return;
    try {
      await deleteItemMutation.mutateAsync(id);
      toast.success("تم حذف الصنف");
    } catch {
      toast.error("فشل في حذف الصنف");
    }
  };

  /* =====================
      ➕ إضافة قسم
  ===================== */
  const handleAddCategory = async (name) => {
    if (categories.find(c => c.name === name)) {
      return toast.error("هذا القسم موجود بالفعل");
    }
    try {
      await addCategoryMutation.mutateAsync({ name });
      toast.success("تم إضافة القسم الجديد");
    } catch {
      toast.error("فشل إضافة القسم");
    }
  };

  /* =====================
      🧩 Helpers
  ===================== */
  const openAddItem = (cat) => {
    setIsEditing(false);
    setCurrentItem({
      id: null, name: "", price: "", desc: "",
      categoryId: cat.id, category: cat.name,
    });
    setImageFile(null);
    setImagePreview(null);
    setShowItemModal(true);
  };

  const openEditItem = (item, cat) => {
    setIsEditing(true);
    setCurrentItem({
      ...item,
      desc: item.description || item.desc, // للتوافق مع مسميات الداتابيز
      categoryId: cat.id,
      category: cat.name,
    });
    setImagePreview(item.image_url || item.image);
    setShowItemModal(true);
  };

  /* =====================
      ⏳ Loading State
  ===================== */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <FiLoader className="animate-spin text-blue-600" size={50} />
          <p className="text-gray-500 font-bold">جاري تحميل المنيو...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FD] pb-20" dir="rtl">
      <Toaster position="top-center" />

      {/* 1. Sticky Header & Search */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <FiGrid className="text-blue-600" /> إدارة المنيو
            </h1>

            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن طبق أو وصف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
              />
            </div>

            {/* Category Selector */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <FiLayers className="text-gray-400 shrink-0" />
              <select
                onChange={(e) => e.target.value && handleAddCategory(e.target.value)}
                className="w-full md:w-48 bg-blue-600 text-white border-none rounded-xl px-4 py-3 font-bold cursor-pointer hover:bg-blue-700 transition-colors"
              >
                <option value="">+ قسم جديد</option>
                {PREDEFINED_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          {/* Quick Nav Chips */}
          {!searchTerm && categories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => document.getElementById(`cat-${cat.id}`)?.scrollIntoView({ behavior: 'smooth' })}
                  className="shrink-0 bg-white border border-gray-200 px-4 py-1.5 rounded-full text-sm font-bold text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <p className="text-gray-400 text-lg font-bold">لا يوجد نتائج تطابق بحثك أو المنيو فارغ حالياً</p>
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-40">
              {/* رأس القسم - تم تصغير المسافات */}
              <div className="flex justify-between items-end mb-4 px-2">
                <div className="flex flex-col">
                  <h3 className="text-xl font-black text-gray-800">{cat.name}</h3>
                  <div className="flex items-center gap-1 text-blue-600 text-xs font-bold">
                    <span>{cat.menus?.length || 0} صنف</span>
                    <FiChevronLeft size={12} />
                  </div>
                </div>
                <button
                  onClick={() => openAddItem(cat)}
                  className="bg-white border border-blue-600 text-blue-600 px-4 py-1.5 rounded-xl text-sm font-black hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
                >
                  <FiPlus size={16} /> إضافة صنف
                </button>
              </div>

              {/* شبكة العرض - زيادة الكروت في الصف الواحد */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {cat.menus?.map((item) => (
                  <div
                    key={item.id}
                    className="relative bg-white border border-gray-100 rounded-[1.5rem] p-3 flex flex-col gap-3 hover:shadow-xl hover:shadow-blue-200/10 transition-all group overflow-hidden"
                  >
                    {/* حالة عدم التوفر */}
                    {item.is_available === 0 && (
                      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-20 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-black">
                          غير متوفر
                        </span>
                      </div>
                    )}

                    {/* Badge العرض - أصغر */}
                    {item.type === "offer" && item.discount_percentage && (
                      <span className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-sm">
                        {item.discount_percentage}%-
                      </span>
                    )}

                    {/* الصورة - أصغر */}
                    <div className="w-full h-32 bg-gray-50 rounded-xl overflow-hidden relative">
                      <img
                        src={item.imageUrl || item.image || item.image_url || "https://via.placeholder.com/300x200?text=No+Image"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* المحتوى - خطوط أنعم */}
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-bold text-gray-800 text-md line-clamp-1">
                          {item.name}
                        </h4>
                        <div className="text-right shrink-0">
                          {item.type === "offer" ? (
                            <>
                              <p className="text-green-600 font-black text-md">
                                {item.price} <span className="text-[10px]">EGP</span>
                              </p>
                              <p className="text-gray-400 line-through text-[10px] font-bold">
                                {item.price_before_discount}
                              </p>
                            </>
                          ) : (
                            <p className="text-blue-600 font-black text-md">
                              {item.price} <span className="text-[10px]">EGP</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs leading-snug line-clamp-2">
                        {item.description || item.desc || "لا يوجد وصف"}
                      </p>
                    </div>

                    {/* الأزرار - مدمجة أكثر */}
                    <div className="flex gap-2 mt-1 pt-2 border-t border-gray-50">
                      <button
                        onClick={() => openEditItem(item, cat)}
                        className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all flex justify-center gap-1 items-center"
                      >
                        <FiEdit3 size={14} /> تعديل
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* =====================
          🖼 Modal Add/Edit
      ===================== */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[3rem] w-full max-w-xl p-8 md:p-10 shadow-2xl animate-in zoom-in duration-300 relative my-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-gray-800">
                  {isEditing ? "تعديل الصنف" : "إضافة صنف جديد"}
                </h2>
                <p className="text-blue-600 font-bold text-sm">قسم: {currentItem.category}</p>
              </div>
              <button
                onClick={() => setShowItemModal(false)}
                className="text-gray-400 hover:text-gray-600 bg-gray-100 p-3 rounded-full transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Image Upload */}
              <label className="w-full h-52 border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all overflow-hidden relative group">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-bold">تغيير الصورة</div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-2 inline-block"><FiImage size={32} className="text-gray-300" /></div>
                    <p className="text-sm text-gray-400 font-bold">اضغط لإرفاق صورة جذابة</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }} />
              </label>

              <div className="space-y-4">
                <input
                  value={currentItem.name}
                  onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                  placeholder="اسم الطبق..."
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-700"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setCurrentItem({
                        ...currentItem,
                        type: "normal",
                        price_before_discount: "",
                        discount_percentage: ""
                      })
                    }
                    className={`flex-1 py-4 rounded-2xl font-black transition-all
      ${currentItem.type === "normal"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-500"}
    `}
                  >
                    منتج عادي
                  </button>

                  <button
                    onClick={() =>
                      setCurrentItem({
                        ...currentItem,
                        type: "offer"
                      })
                    }
                    className={`flex-1 py-4 rounded-2xl font-black transition-all
      ${currentItem.type === "offer"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-500"}
    `}
                  >
                    🔥 عرض
                  </button>
                </div>
                {currentItem.type === "normal" && (
                  <div className="relative">
                    <input
                      value={currentItem.price}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, price: e.target.value })
                      }
                      type="number"
                      placeholder="السعر"
                      className="w-full bg-gray-50 rounded-2xl p-4 pl-16 font-black text-blue-600"
                    />
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                      EGP
                    </span>
                  </div>
                )}
                {currentItem.type === "offer" && (
                  <div className="space-y-4">

                    {/* السعر قبل الخصم */}
                    <div className="relative">
                      <input
                        value={currentItem.price_before_discount}
                        onChange={(e) =>
                          setCurrentItem({
                            ...currentItem,
                            price_before_discount: e.target.value
                          })
                        }
                        type="number"
                        placeholder="السعر قبل الخصم"
                        className="w-full bg-gray-50 rounded-2xl p-4 pl-16 font-bold"
                      />
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                        EGP
                      </span>
                    </div>

                    {/* نسبة الخصم */}
                    <div className="relative">
                      <input
                        value={currentItem.discount_percentage}
                        onChange={(e) =>
                          setCurrentItem({
                            ...currentItem,
                            discount_percentage: e.target.value
                          })
                        }
                        type="number"
                        placeholder="نسبة الخصم %"
                        className="w-full bg-gray-50 rounded-2xl p-4 pr-14 font-bold"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                        %
                      </span>
                    </div>

                    {/* السعر النهائي (محسوب) */}
                    {currentItem.price_before_discount && currentItem.discount_percentage && (
                      <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center font-black text-green-600">
                        السعر بعد الخصم:{" "}
                        {(
                          currentItem.price_before_discount -
                          (currentItem.price_before_discount *
                            currentItem.discount_percentage) /
                          100
                        ).toFixed(2)}{" "}
                        EGP
                      </div>
                    )}
                  </div>
                )}
                <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
                  <p className="font-black text-gray-700">حالة التوفر</p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentItem({ ...currentItem, is_available: true })}
                      className={`flex-1 py-4 rounded-2xl font-black transition-all
        ${currentItem.is_available > 0
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-500"}
      `}
                    >
                      ✅ متوفر
                    </button>

                    <button
                      onClick={() => setCurrentItem({ ...currentItem, is_available: false })}
                      className={`flex-1 py-4 rounded-2xl font-black transition-all
        ${currentItem.is_available === false
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 text-gray-500"}
      `}
                    >
                      ❌ غير متوفر
                    </button>
                  </div>
                </div>

                <textarea
                  value={currentItem.desc}
                  onChange={(e) => setCurrentItem({ ...currentItem, desc: e.target.value })}
                  placeholder="وصف الطبق (مكونات، ملاحظات...)"
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none text-gray-600 font-medium"
                  rows="4"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSaveItem}
                  disabled={actionLoading}
                  className="flex-1 bg-blue-600 text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:bg-blue-300"
                >
                  {actionLoading ? <FiLoader className="animate-spin" /> : (isEditing ? "تحديث البيانات" : "تأكيد الإضافة")}
                </button>
                <button
                  onClick={() => setShowItemModal(false)}
                  className="px-8 bg-gray-100 text-gray-500 py-5 rounded-[1.5rem] font-bold hover:bg-gray-200 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}