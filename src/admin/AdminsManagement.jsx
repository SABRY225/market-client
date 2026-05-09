import React, { useState, useEffect } from 'react';
import {
  Search,
  Trash2,
  ShieldCheck,
  Mail,
  X,
  UserPlus,
  Loader2,
  Edit3,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import getAllAdmin from '../lib/Admin/fetchAllAdmins';
import addAdmin from '../lib/Admin/addAdmin';
import deleteAdmin from '../lib/Admin/deleteAdmin';
import updateAdmin from '../lib/Admin/updateAdmin';

const AdminsManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // حالات المودالات
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, adminId: null });
  const [editingAdmin, setEditingAdmin] = useState(null); // لتحديد ما إذا كنا نعدل أم نضيف

  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const res = await getAllAdmin();
      setAdmins(res || []);
    } catch (err) {
      toast.error("فشل تحميل قائمة المسؤولين");
    } finally {
      setLoading(false);
    }
  };

  // فتح مودال الإضافة
  const openAddModal = () => {
    setEditingAdmin(null);
    setFormData({ name: "", email: "" });
    setIsModalOpen(true);
  };

  // فتح مودال التعديل
  const openEditModal = (admin) => {
    setEditingAdmin(admin);
    setFormData({ name: admin.name, email: admin.email });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAdmin) {
        await updateAdmin(editingAdmin.id, formData);
        toast.success("تم تحديث بيانات المسؤول");
      } else {
        await addAdmin(formData);
        toast.success("تم إضافة المسؤول بنجاح");
      }
      setIsModalOpen(false);
      loadAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ ما");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteAdmin(deleteConfirm.adminId);
      setAdmins(admins.filter(a => a.id !== deleteConfirm.adminId));
      toast.success("تم حذف المسؤول بنجاح");
      setDeleteConfirm({ open: false, adminId: null });
    } catch (err) {
      toast.error("فشل حذف المسؤول");
    }
  };

  const filteredAdmins = admins.filter(admin =>
    admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800">إدارة المسؤولين</h2>
          <p className="text-gray-500 mt-1">التحكم في صلاحيات الوصول وإدارة بيانات الفريق</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-200"
        >
          <UserPlus size={20} />
          <span className="font-bold">إضافة مسؤول جديد</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative group">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
        <input
          className="w-full bg-white border border-gray-200 rounded-2xl py-4 pr-12 pl-4 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm"
          placeholder="ابحث باسم المسؤول أو البريد الإلكتروني..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin mb-2" size={40} />
            <p>جاري مزامنة البيانات...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">المسؤول</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">الحالة</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAdmins.map(admin => (
                  <tr key={admin.id} className="hover:bg-blue-50/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold">
                          {admin.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 leading-none mb-1">{admin.name}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1"><Mail size={12} /> {admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold">
                        <ShieldCheck size={14} /> نشط
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(admin)}
                          className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ open: true, adminId: admin.id })}
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transition-all scale-100">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">{editingAdmin ? "تعديل مسؤول" : "إضافة مسؤول"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input
                required
                className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-blue-500"
                placeholder="الاسم الكامل"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                required
                type="email"
                className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-blue-500"
                placeholder="البريد الإلكتروني"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                {editingAdmin ? "حفظ التغييرات" : "إنشاء الحساب"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-red-900/20 backdrop-blur-sm" onClick={() => setDeleteConfirm({ open: false, adminId: null })} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">تأكيد الحذف</h3>
            <p className="text-gray-500 mb-6">هل أنت متأكد من حذف هذا المسؤول؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-3">
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all"
              >
                نعم، احذف
              </button>
              <button 
                onClick={() => setDeleteConfirm({ open: false, adminId: null })}
                className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminsManagement;