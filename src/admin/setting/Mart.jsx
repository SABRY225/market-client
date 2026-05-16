import React, { useState, useEffect } from 'react';
// استيراد الأيقونات الاحترافية من مكتبة React Icons
import { 
  FaBox, 
  FaSearch, 
  FaBarcode, 
  FaClipboardList, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes, 
  FaChevronRight, 
  FaChevronLeft,
  FaUpload
} from 'react-icons/fa';

function Mart() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveryMen, setDeliveryMen] = useState([]);

  // حقول إضافة منتج جديد
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '' });
  const [productImage, setProductImage] = useState(null); 

  // حقول تعديل المنتج الحالي
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProductData, setEditingProductData] = useState({ name: '', description: '', price: '', stock: '' });
  const [editProductImage, setEditProductImage] = useState(null); // 🟢 لحفظ ملف الصورة الجديد أثناء التعديل

  // حالات البحث والتقسيم لصفحات (Pagination & Search)
  const [searchTerm, setSearchTerm] = useState('');
  const [productPage, setProductPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const itemsPerPage = 5; 

  const [customerName, setCustomerName] = useState('');
  const [currentOrderItems, setCurrentOrderItems] = useState([]); 
  const [selectedProduct, setSelectedProduct] = useState({ productId: '', quantity: 1 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const prodsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/products-mart`);
      const ordersRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/orders-mart`);
      const deliveryRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/delivery`);
      const { data: dataProduct } = await prodsRes.json();
      const { data: dataOrder } = await ordersRes.json();
      
      setProducts(dataProduct);
      setOrders(dataOrder);
      setDeliveryMen(await deliveryRes.json());
    } catch (error) {
      console.error("خطأ أثناء الاتصال بالسيرفر:", error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.stock) return;

    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('stock', newProduct.stock);
    if (productImage) {
      formData.append('image', productImage); 
    }

    await fetch(`${import.meta.env.VITE_API_URL}/api/v1/products-mart`, {
      method: 'POST',
      body: formData 
    });

    setNewProduct({ name: '', description: '', price: '', stock: '' });
    setProductImage(null);
    e.target.reset(); 
    fetchData();
  };

  // بدء وضع التعديل لمنتج معين
  const startEditProduct = (product) => {
    setEditingProductId(product.id);
    setEditingProductData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock
    });
    setEditProductImage(null); // إعادة تعيين حقل الصورة عند بدء التعديل
  };

  // 🟢 حفظ تعديلات المنتج (بما في ذلك الصورة الجديدة إن وجدت) عبر FormData
  const handleUpdateProduct = async (id) => {
    try {
      const formData = new FormData();
      formData.append('name', editingProductData.name);
      formData.append('description', editingProductData.description);
      formData.append('price', editingProductData.price);
      formData.append('stock', editingProductData.stock);
      
      // إذا قام المستخدم برفع صورة جديدة، يتم إرفاقها بالطلب
      if (editProductImage) {
        formData.append('image', editProductImage);
      }

      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/products-mart/${id}`, {
        method: 'PUT', // استخدم PUT أو PATCH بناءً على متطلبات السيرفر لديك لدعم FormData والتحديث الكامل
        body: formData
      });

      setEditingProductId(null);
      setEditProductImage(null);
      fetchData();
    } catch (error) {
      console.error("خطأ في تحديث المنتج:", error);
    }
  };

  // حذف المنتج نهائياً من السيرفر
  const handleDeleteProduct = async (id) => {
    if (window.confirm("هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً؟")) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/v1/products-mart/${id}`, {
          method: 'DELETE'
        });
        fetchData();
      } catch (error) {
        console.error("خطأ في حذف المنتج:", error);
      }
    }
  };

  const updateOrderOnServer = async (id, payload) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/v1/orders-mart/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    fetchData();
  };

  const getStepClass = (currentStatus, targetStatus) => {
    return currentStatus === targetStatus
      ? 'bg-green-100 text-green-800 font-bold border border-green-200'
      : 'bg-slate-100 text-slate-400 font-medium';
  };

  // تصفية المنتجات بناءً على محرك البحث
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // تقسيم المنتجات إلى صفحات
  const totalProductPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const indexOfLastProduct = productPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // تقسيم الطلبيات إلى صفحات
  const totalOrderPages = Math.ceil(orders.length / itemsPerPage) || 1;
  const indexOfLastOrder = orderPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-800 font-sans" style={{ direction: 'rtl' }}>
      
      <header className="mb-8 border-b border-slate-200 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            نظام مارد الاحترافي 🛡️
          </h1>
          <p className="mt-1 text-sm text-slate-500">لوحة التحكم الذكية لإدارة المخازن، اللوجستيات، وتتبع مناديب الشحن</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 shadow-sm animate-pulse">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          الملفات تحفظ محلياً على جهازك
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 mb-8">
        {/* كارت إضافة منتج */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg text-base">
              <FaBox />
            </span>
            إضافة منتج جديد للمستودع
          </h3>
          <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
            <input type="text" placeholder="اسم المنتج" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
            <textarea name="description" id="description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder='وصف المنتج'></textarea>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="السعر (جنيه)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
              <input type="number" placeholder="الكمية المتاحة" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                <FaUpload className="text-blue-500" /> اختر صورة المنتج من جهازك:
              </label>
              <input 
                type="file" 
                accept="image/*"
                onChange={e => setProductImage(e.target.files[0])} 
                className="w-full text-sm text-slate-500 file:ml-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" 
              />
            </div>

            <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all shadow-blue-100">
              حفظ المنتج
            </button>
          </form>
        </section>
      </div>

      {/* جدول عرض جرد المستودع والمنتجات */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg text-base">
              <FaBarcode />
            </span>
            حالة جرد مستودع المنتجات الحالي
          </h3>
          {/* شريط البحث مع الأيقونة */}
          <div className="w-full md:w-72 relative">
            <input 
              type="text" 
              placeholder="ابحث عن منتج بالاسم أو الوصف..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setProductPage(1); }}
              className="w-full pr-10 pl-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <FaSearch className="absolute right-3.5 top-3 text-slate-400 text-xs" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 text-sm font-semibold text-slate-600 rounded-r-xl">المنتج التفصيلي</th>
                <th className="p-4 text-sm font-semibold text-slate-600">سعر الوحدة</th>
                <th className="p-4 text-sm font-semibold text-slate-600">المخزون المتاح</th>
                <th className="p-4 text-sm font-semibold text-slate-600 rounded-l-xl text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentProducts.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4">
                    {editingProductId === p.id ? (
                      <div className="flex flex-col gap-2 max-w-xs">
                        <input type="text" value={editingProductData.name} onChange={e => setEditingProductData({...editingProductData, name: e.target.value})} className="px-2 py-1 text-sm border rounded bg-white w-full" placeholder="اسم المنتج" />
                        <input type="text" value={editingProductData.description} onChange={e => setEditingProductData({...editingProductData, description: e.target.value})} className="px-2 py-1 text-xs border rounded bg-white w-full" placeholder="الوصف" />
                        {/* 🟢 حقل تعديل الصورة هنا */}
                        <div className="mt-1">
                          <label className="block text-[10px] text-slate-500 font-bold mb-1">تحديث صورة المنتج (اختياري):</label>
                          <input type="file" accept="image/*" onChange={e => setEditProductImage(e.target.files[0])} className="text-xs file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 cursor-pointer" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <img src={p.imageUrl} alt={p.name} className="w-11 h-11 rounded-xl object-cover shadow-sm border border-slate-100" onError={(e)=>{e.target.src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=100"}} />
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{p.name}</span>
                          <span className="text-xs text-slate-400 line-clamp-1">{p.description}</span>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-bold text-slate-900">
                    {editingProductId === p.id ? (
                      <input type="number" value={editingProductData.price} onChange={e => setEditingProductData({...editingProductData, price: e.target.value})} className="w-24 px-2 py-1 text-sm border rounded bg-white" />
                    ) : (
                      `${p.price.toLocaleString()} جنيه`
                    )}
                  </td>
                  <td className="p-4">
                    {editingProductId === p.id ? (
                      <input type="number" value={editingProductData.stock} onChange={e => setEditingProductData({...editingProductData, stock: e.target.value})} className="w-20 px-2 py-1 text-sm border rounded bg-white" />
                    ) : (
                      p.stock < 10 ? (
                        <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-lg bg-red-50 text-red-700 border border-red-100">
                          مخزون حرج ({p.stock} قطع)
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                          متوفر بكثرة ({p.stock} وحدة)
                        </span>
                      )
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {editingProductId === p.id ? (
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => handleUpdateProduct(p.id)} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1">
                          <FaSave /> حفظ
                        </button>
                        <button onClick={() => setEditingProductId(null)} className="px-3 py-1 bg-slate-300 hover:bg-slate-400 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1">
                          <FaTimes /> إلغاء
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => startEditProduct(p)} className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded-lg border border-blue-100 transition-all flex items-center gap-1">
                          <FaEdit /> تعديل
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-lg border border-rose-100 transition-all flex items-center gap-1">
                          <FaTrash /> حذف
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* عناصر الـ Pagination للمنتجات */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-500">عرض الصفحة {productPage} من {totalProductPages}</span>
          <div className="flex gap-1 items-center">
            <button 
              disabled={productPage === 1}
              onClick={() => setProductPage(prev => prev - 1)}
              className="px-3 py-1 text-xs font-medium border rounded-lg bg-white disabled:opacity-50 hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <FaChevronRight className="text-[10px]" /> السابق
            </button>
            {Array.from({ length: totalProductPages }, (_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setProductPage(idx + 1)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${productPage === idx + 1 ? 'bg-blue-600 text-white' : 'bg-white border text-slate-600 hover:bg-slate-50'}`}
              >
                {idx + 1}
              </button>
            ))}
            <button 
              disabled={productPage === totalProductPages}
              onClick={() => setProductPage(prev => prev + 1)}
              className="px-3 py-1 text-xs font-medium border rounded-lg bg-white disabled:opacity-50 hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              التالي <FaChevronLeft className="text-[10px]" />
            </button>
          </div>
        </div>
      </section>

      {/* سجل الأوامر واللوجستيات والديليفري */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 overflow-hidden">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="p-2 bg-slate-100 text-slate-700 rounded-lg text-base">
            <FaClipboardList />
          </span>
          إدارة حركة الطلبات واللوجستيات والشحن
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 text-sm font-semibold text-slate-600 rounded-r-xl">كود الطلب</th>
                <th className="p-4 text-sm font-semibold text-slate-600">العميل المستهدف</th>
                <th className="p-4 text-sm font-semibold text-slate-600">بيان محتويات الشحنة</th>
                <th className="p-4 text-sm font-semibold text-slate-600">إجمالي الحساب</th>
                <th className="p-4 text-sm font-semibold text-slate-600">إسناد لمندوب الشحن</th>
                <th className="p-4 text-sm font-semibold text-slate-600 rounded-l-xl">حالة المعاملة والتتبع المباشر</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-bold text-blue-600">#{order.id}</td>
                  <td className="p-4 font-bold text-slate-900">{order.customer}</td>
                  <td className="p-4 space-y-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="text-xs text-slate-500 font-medium">
                        • {item.name} <span className="text-slate-800 font-bold">({item.quantity}x)</span>
                      </div>
                    ))}
                  </td>
                  <td className="p-4 font-extrabold text-indigo-600 text-base">{order.totalPrice.toLocaleString()} ج</td>
                  <td className="p-4">
                    <select 
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium"
                      value={order.deliveryMan} 
                      onChange={(e) => updateOrderOnServer(order.id, { deliveryMan: e.target.value })}
                    >
                      <option value="غير معين بعد">اختر المندوب للتحرك</option>
                      {deliveryMen.map(man => <option key={man.id} value={man.name}>{man.name}</option>)}
                    </select>
                  </td>
                  <td className="p-4">
                    <select 
                      className="w-full px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 text-xs font-bold focus:outline-none"
                      value={order.status}
                      onChange={(e) => updateOrderOnServer(order.id, { status: e.target.value })}
                    >
                      <option value="قيد الانتظار">قيد الانتظار</option>
                      <option value="قيد التجهيز">قيد التجهيز</option>
                      <option value="مع الديليفري">مع الديليفري</option>
                      <option value="مكتمل">مكتمل</option>
                      <option value="ملغي">ملغي</option>
                    </select>

                    <div className="flex gap-1.5 mt-2.5">
                      <div className={`px-2 py-0.5 rounded text-[10px] tracking-tight transition-all ${getStepClass(order.status, 'قيد الانتظار')}`}>انتظار</div>
                      <div className={`px-2 py-0.5 rounded text-[10px] tracking-tight transition-all ${getStepClass(order.status, 'قيد التجهيز')}`}>تجهيز</div>
                      <div className={`px-2 py-0.5 rounded text-[10px] tracking-tight transition-all ${getStepClass(order.status, 'مع الديليفري')}`}>بالطريق</div>
                      <div className={`px-2 py-0.5 rounded text-[10px] tracking-tight transition-all ${getStepClass(order.status, 'مكتمل')}`}>تم التسليم</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* عناصر الـ Pagination للطلبيات */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-500">عرض الصفحة {orderPage} من {totalOrderPages}</span>
          <div className="flex gap-1 items-center">
            <button 
              disabled={orderPage === 1}
              onClick={() => setOrderPage(prev => prev - 1)}
              className="px-3 py-1 text-xs font-medium border rounded-lg bg-white disabled:opacity-50 hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              <FaChevronRight className="text-[10px]" /> السابق
            </button>
            {Array.from({ length: totalOrderPages }, (_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setOrderPage(idx + 1)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${orderPage === idx + 1 ? 'bg-blue-600 text-white' : 'bg-white border text-slate-600 hover:bg-slate-50'}`}
              >
                {idx + 1}
              </button>
            ))}
            <button 
              disabled={orderPage === totalOrderPages}
              onClick={() => setOrderPage(prev => prev + 1)}
              className="px-3 py-1 text-xs font-medium border rounded-lg bg-white disabled:opacity-50 hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              التالي <FaChevronLeft className="text-[10px]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Mart;