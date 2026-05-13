import React, { useEffect, useState } from 'react';
import { adService } from '../../services/adService';

const AdsDashboard = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // حالات التحكم في النوافذ المنبثقة
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editAd, setEditAd] = useState(null); // تخزين الإعلان المراد تعديله

  const fetchAds = async () => {
    try {
      const { data } = await adService.getAll();
      setAds(data.data);
    } catch (error) {
      console.error("خطأ في جلب البيانات", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAds(); }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* الهيدر */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">إدارة الإعلانات</h1>
            <p className="text-gray-500 text-sm">لديك {ads.length} إعلان حالياً</p>
          </div>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
          >
            إضافة إعلان جديد +
          </button>
        </div>

        {/* عرض الإعلانات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
             <AdCard 
               key={ad.id} 
               ad={ad} 
               refresh={fetchAds} 
               onEdit={() => setEditAd(ad)} // تمرير وظيفة التعديل
             />
          ))}
        </div>
      </div>

      {/* نافذة الإضافة */}
      {isAddModalOpen && (
        <AdFormModal 
          onClose={() => setIsAddModalOpen(false)} 
          onSuccess={() => { setIsAddModalOpen(false); fetchAds(); }} 
        />
      )}

      {/* نافذة التعديل */}
      {editAd && (
        <AdFormModal 
          ad={editAd} // نمرر بيانات الإعلان الحالي
          onClose={() => setEditAd(null)} 
          onSuccess={() => { setEditAd(null); fetchAds(); }} 
        />
      )}
    </div>
  );
};

// ==========================================
// مكون الفورم الموحد (للإضافة والتعديل)
// ==========================================
const AdFormModal = ({ ad = null, onClose, onSuccess }) => {
  const isEdit = !!ad;
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: ad?.name || '',
    duration: ad?.duration || '',
    owner: ad?.owner || '',
    price: ad?.price || '',
    link: ad?.link || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    if (file) formData.append('image', file);

    try {
      if (isEdit) {
        await adService.update(ad.id, formData);
      } else {
        await adService.create(formData);
      }
      onSuccess();
    } catch (err) {
      alert("حدث خطأ أثناء العملية");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{isEdit ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input type="text" placeholder="اسم الإعلان" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required
            value={data.name} onChange={e => setData({...data, name: e.target.value})} />
          
          <input type="text" placeholder="اسم المالك" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required
            value={data.owner} onChange={e => setData({...data, owner: e.target.value})} />

          <div>
            <label className="text-xs text-gray-500">صورة الإعلان {isEdit && "(اتركها فارغة إذا لا تريد التغيير)"}</label>
            <input type="file" accept="image/*" className="w-full border p-2 rounded-lg" 
              onChange={e => setFile(e.target.files[0])} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="السعر" className="border p-2 rounded-lg" required
              value={data.price} onChange={e => setData({...data, price: e.target.value})} />
            <input type="text" placeholder="المدة" className="border p-2 rounded-lg"
              value={data.duration} onChange={e => setData({...data, duration: e.target.value})} />
          </div>

          <input type="url" placeholder="الرابط" className="w-full border p-2 rounded-lg" required
            value={data.link} onChange={e => setData({...data, link: e.target.value})} />

          <button disabled={loading} className="w-full py-3 rounded-xl font-bold text-white bg-blue-600">
            {loading ? 'جاري المعالجة...' : isEdit ? 'حفظ التغييرات' : 'نشر الإعلان'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// مكون الكارت (AdCard) مع خاصية التعديل والتبديل
// ==========================================
const AdCard = ({ ad, refresh, onEdit }) => {
  const handleToggle = async () => {
    try {
      await adService.toggleActive(ad.id, ad.is_active);
      refresh();
    } catch (err) {
      alert("فشل تحديث الحالة");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("هل أنت متأكد من حذف هذا الإعلان؟")) {
      await adService.delete(ad.id);
      refresh();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden transition hover:shadow-md">
      <div className="relative">
        <img src={ad.image || 'https://via.placeholder.com/400x200'} className="h-40 w-full object-cover" alt="" />
        {/* حالة النشاط كشارة فوق الصورة */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-[10px] font-bold text-white shadow-sm ${ad.is_active ? 'bg-green-500' : 'bg-red-500'}`}>
          {ad.is_active ? 'نـشـط' : 'مـعـطـل'}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-800">{ad.name}</h3>
        <p className="text-xs text-gray-500 mb-4 tracking-wide">المالك: {ad.owner}</p>
        
        <div className="flex flex-col gap-2 border-t pt-3 mt-2">
          {/* أزرار الإجراءات */}
          <div className="flex justify-between items-center">
            <button 
              onClick={handleToggle} 
              className={`flex-1 ml-2 text-xs py-2 rounded-lg font-medium transition ${ad.is_active ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-green-50 text-green-600 border border-green-200'}`}
            >
              {ad.is_active ? 'إيقاف النشاط' : 'تفعيل الإعلان'}
            </button>
            
            <button 
              onClick={onEdit}
              className="px-4 py-2 bg-gray-50 text-gray-600 border rounded-lg text-xs hover:bg-gray-100"
            >
              تعديل
            </button>
          </div>

          <button 
            onClick={handleDelete}
            className="w-full text-red-500 text-xs py-1 hover:underline"
          >
            حذف الإعلان نهائياً
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdsDashboard;