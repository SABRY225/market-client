import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // أضفنا هذا للتوجيه
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  Trash2, Plus, Minus, ShoppingBag, Utensils, 
  CreditCard, ReceiptText, Loader2, AlertCircle
} from "lucide-react";
import getCartItems from "../lib/client/cart/fetchCartItems";
import deleteCartItems from "../lib/client/cart/deleteCartItem";
import updateCartItem from "../lib/client/cart/updateCartItem";
import { CartContext } from "../Context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import createOrder from "../lib/client/addOrder";

const formatCurrency = (amount) => 
  new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount || 0);

export default function FoodCart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { setCartCount } = useContext(CartContext);

  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCartItems();
      // تأكد أن الاستجابة مصفوفة
      setItems(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      setError("فشل في تحميل السلة. يرجى التأكد من تسجيل الدخول.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (id, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    try {
      // تحديث متفائل (Optimistic Update)
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, quantity: newQty } : item
      ));

      await updateCartItem(id, { quantity: newQty });
    } catch (err) {
      fetchCart(); // استعادة البيانات من السيرفر في حال الفشل
      toast.error("عذراً، تعذر تحديث الكمية");
    }
  };

  const removeItem = async (id) => {
    try {
      await deleteCartItems(id);
      setItems(prev => prev.filter(item => item.id !== id));
      setCartCount(prev => Math.max(0, prev - 1));
      toast.success("تم الحذف من السلة");
    } catch (err) {
      toast.error("فشل حذف الصنف");
    }
  };

  // الحسابات مع حماية ضد القيم الفارغة
  const subtotal = items.reduce((sum, item) => {
    const price = item.menu?.price || 0;
    return sum + (price * item.quantity);
  }, 0);
  const serviceFee = subtotal * 0.05;
  const grandTotal = subtotal + serviceFee;

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA]">
      <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
      <p className="font-bold text-gray-500">جاري تحضير حقيبتك...</p>
    </div>
  );
  console.log(serviceFee);
  console.log(items);
  
  const handleCheckout = async () => {
    if (items.length === 0) return;
    try {
      setIsProcessing(true);
      const data= await createOrder();
      console.log(data);
      
      toast.success("تم تأكيد طلبك بنجاح!");
      setItems([]);
      setCartCount(0);
      setTimeout(() => navigate(`/checkout/${data[0].id}`), 1500);
    } catch (err) {
      toast.error("حدث خطأ أثناء معالجة الطلب");
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 pt-10 px-4" dir="rtl">
      <Toaster />
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <ShoppingBag className="text-orange-500 w-8 h-8" />
              حقيبة الطعام
            </h1>
            <Badge className="bg-orange-100 text-orange-600 border-none font-extrabold px-4">
              {items.length} أصناف
            </Badge>
          </div>

          {items.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-16 text-center shadow-sm border border-gray-100">
              <Utensils className="w-10 h-10 text-gray-200 mx-auto mb-6" />
              <h2 className="text-xl font-bold text-gray-800">حقيبتك فارغة حالياً</h2>
              <Button onClick={() => navigate('/')} className="mt-6 bg-orange-500 hover:bg-orange-600 rounded-2xl px-8 h-12 font-bold">
                ابدأ باختيار وجبتك
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl p-5 shadow-sm flex items-center gap-4 border border-transparent hover:border-orange-100 transition-all">
                  <img src={item.menu?.image} className="w-24 h-24 rounded-2xl object-cover" alt={item.menu?.name} />
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{item.menu?.name}</h3>
                    <p className="text-gray-400 text-sm">{item.restaurant_name}</p>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <p className="font-black text-xl text-gray-900">{formatCurrency((item.menu?.price || 0) * item.quantity)}</p>
                    <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
                      <button onClick={() => updateQuantity(item.id, item.quantity, -1)} className="p-1 hover:bg-white rounded-lg shadow-sm"><Minus size={16}/></button>
                      <span className="px-4 font-bold text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity, 1)} className="p-1 hover:bg-white rounded-lg shadow-sm"><Plus size={16}/></button>
                    </div>
                  </div>
                  
                  <button onClick={() => removeItem(item.id)} className="mr-2 p-2 text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 h-fit space-y-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg">
              <ReceiptText size={20} className="text-orange-500" /> الحساب
            </h3>
            
            <div className="space-y-4 text-sm pb-6 border-b border-dashed border-gray-200">
              <div className="flex justify-between text-gray-500">
                <span>المجموع الفرعي</span>
                <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>رسوم الخدمة (5%)</span>
                <span className="font-bold text-gray-900">{formatCurrency(serviceFee)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center my-6">
              <span className="text-lg font-black text-gray-900">الإجمالي</span>
              <span className="text-2xl font-black text-orange-600">{formatCurrency(grandTotal)}</span>
            </div>

            <Button 
              onClick={handleCheckout}
              disabled={items.length === 0 || isProcessing}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white h-16 rounded-[1.25rem] font-black text-lg shadow-lg flex items-center gap-3 transition-all active:scale-95"
            >
              {isProcessing ? <Loader2 className="animate-spin" /> : <><CreditCard size={22} /> تأكيد الطلب والدفع</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}