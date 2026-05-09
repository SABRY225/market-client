import { ArrowRight, Search } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductCard } from '../../components/ui/ProductCard';
import Swal from "sweetalert2"; // استيراد SweetAlert2
import { Await, useNavigate } from 'react-router-dom';
import addToCart from '../../lib/client/cart/addToCart';
import { CartContext } from '../../Context/CartContext';
import addToFavorite from '../../lib/client/wishlist/addToFavorite';

function ProductSection({ mockProducts, title, sectionId }) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar' ? true : false;
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { setCartCount, setWishlistCount } = useContext(CartContext);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(timer);
    }, []);
    const [cartFeedback, setCartFeedback] = useState(null);

    const checkAuthAndNavigate = (targetPath) => {
        const token = localStorage.getItem('token'); // تأكد من اسم المفتاح المستخدم (usertoken أو userusertoken)

        if (!token) {
            // إظهار نافذة SweetAlert2
            Swal.fire({
                title: isArabic ? 'تحتاج إلى تسجيل الدخول' : 'Login Required',
                text: isArabic
                    ? 'يرجى تسجيل الدخول أولاً لتتمكن من تصفح المنتجات'
                    : 'Please login first to be able to browse products',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#f97316', // لون البرتقالي الخاص بالتصميم
                cancelButtonColor: '#6b7280',
                confirmButtonText: isArabic ? 'ذهاب للتسجيل' : 'Go to Login',
                cancelButtonText: isArabic ? 'إلغاء' : 'Cancel',
                customClass: {
                    container: 'my-swal'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login', { state: { from: targetPath } });
                }
            });
            return false;
        }

        navigate(targetPath);
        return true;
    };

    const handleProductClick = (product) => {
        const id = product?.id ?? '';
        checkAuthAndNavigate(`/product-details${id ? `?id=${id}` : ''}`);
    };

    const toggleFavorite = async (id) => {
        await addToFavorite(id);
        setWishlistCount(prev => prev + 1)
    };

    const handleAddToCart = async (product) => {
        try {
            // تأثير مرئي للمستخدم فوراً
            setCartFeedback(product.id);

            await addToCart({ product_id: product.id })
            setCartCount(prev => prev + 1)

            toast.success(isArabic ? "تمت الإضافة للسلة" : "Added to cart");
        } catch (error) {
            toast.error(isArabic ? "فشلت الإضافة للسلة" : "Failed to add to cart");
            console.error("Cart Error:", error);
        } finally {
            setTimeout(() => setCartFeedback(null), 1200);
        }
    };


    return (
        <section className="max-w-7xl mx-auto px-4 py-12" id={sectionId}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-3xl font-bold text-gray-800">{t("translation." + title)}</h2>
                {mockProducts.length == 4 ? <button className="hidden md:inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700">
                    {isArabic ? 'عرض الكل' : 'View all'} <ArrowRight className="w-4 h-4" />
                </button> : ""}

            </div>
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 shadow animate-pulse">
                            <div className="h-48 bg-gray-200 rounded-xl mb-3" />
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
                            <div className="h-10 bg-gray-200 rounded-full" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {mockProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            t={t}
                            handleProductClick={handleProductClick}
                            toggleFavorite={toggleFavorite}
                            onAddToCart={handleAddToCart}
                            isInCartFeedback={cartFeedback === product.id}
                        />
                    ))}
                </div>

            )}
        </section>
    )
}

export default ProductSection