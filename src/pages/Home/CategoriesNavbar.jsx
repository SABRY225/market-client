import { NavLink, useNavigate } from "react-router-dom";
import { categories } from "../../data/categories";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2"; 

function CategoriesNavbar() {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const navigate = useNavigate();

    const checkAuthAndNavigate = (targetPath) => {
        const token = localStorage.getItem('token'); // تأكد من اسم المفتاح المستخدم (token أو usertoken)

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

    return (
        <div className="bg-white border-b sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4">
                <nav className="flex justify-center gap-2 md:gap-4 overflow-x-auto custom-scrollbar py-3">
                    {categories.map(cat => {
                        const Icon = cat.icon;
                        const targetPath = `/categories?c=${cat?.key}`;

                        return (
                            <NavLink
                                key={cat?.key}
                                // التأكد أن الوظيفة تعيد نصاً دائماً
                                className={({ isActive }) => {
                                    const baseClasses = "whitespace-nowrap px-3 py-2 rounded-full border flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
                                    const activeClasses = isActive
                                        ? 'bg-orange-500 text-white border-orange-500'
                                        : 'hover:bg-orange-50 text-gray-700 border-gray-200';

                                    return `${baseClasses} ${activeClasses}`;
                                }}
                                to={targetPath}
                                onClick={(e) => {
                                    e.preventDefault();
                                    checkAuthAndNavigate(targetPath);
                                }}
                            >
                                {/* تصحيح تمرير className للأيقونة */}
                                {Icon && (
                                    <Icon
                                        className={`w-5 h-5 ${localStorage.getItem('token') && window.location.search.includes(cat.key) ? "text-white" : "text-orange-500"}`}
                                    />
                                )}
                                {t('translation.' + cat?.key)}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}

export default CategoriesNavbar;