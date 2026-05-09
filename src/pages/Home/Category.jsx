import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useAnimation } from 'framer-motion';
import { cetageroiesNavbar } from '../../data/cetageroiesNavbar';
import { useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2'; 

function Category() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar' ? true : false;
  const controls = useAnimation();
  const containerRef = useRef(null);
  const navigate = useNavigate(); // هوك للتنقل البرمجي

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    controls.start({
      x: isArabic ? ["0%", "50%"] : ["0%", "-50%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 25,
          ease: "linear",
        },
      },
    });
  };

  const stopAnimation = () => {
    controls.stop();
  };

  // دالة التعامل مع الضغط على القسم
  const handleCategoryClick = (e, categoryKey) => {
    e.preventDefault(); // منع الانتقال الافتراضي للـ Link
    
    const token = localStorage.getItem("token");

    if (token) {
      // إذا كان مسجل دخول، اذهب للقسم
      navigate(`/categories?c=${categoryKey}`);
    } else {
      // إذا غير مسجل، اظهر النافذة
      Swal.fire({
        title: isArabic ? 'تنبيه' : 'Attention',
        text: isArabic 
          ? 'يرجى تسجيل الدخول لتتمكن من تصفح التصنيفات' 
          : 'Please login to browse categories',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#f97316', // لون برتقالي مثل التصميم
        cancelButtonColor: '#d33',
        confirmButtonText: isArabic ? 'ذهاب للتسجيل' : 'Go to Login',
        cancelButtonText: isArabic ? 'إلغاء' : 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login'); // الانتقال لصفحة التسجيل
        }
      });
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 mt-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-black text-gray-900">
          {isArabic ? 'تصفح حسب التصنيف' : 'Shop by Category'}
        </h3>
      </div>
      
      <div className="relative overflow-hidden">
        <motion.div
          ref={containerRef}
          animate={controls}
          onMouseEnter={stopAnimation}
          onMouseLeave={startAnimation}
          className="flex gap-6 snap-x snap-mandatory pb-8 px-10"
        >
          {cetageroiesNavbar.map((c) => (
            <motion.div
              key={c.key}
              variants={itemVariants}
              className="snap-start"
            >
              {/* قمنا بتغيير الـ Link ليستخدم دالة الـ onClick */}
              <div
                onClick={(e) => handleCategoryClick(e, c.key)}
                className="min-w-[170px] md:min-w-[220px] block group relative cursor-pointer"
              >
                <div className="relative h-56 md:h-64 rounded-[2.5rem] overflow-hidden shadow-md transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-orange-200 group-hover:-translate-y-3">
                  <img
                    src={c.img}
                    alt={c.key}
                    loading="lazy"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-[1.5s] ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="relative overflow-hidden rounded-2xl p-[1px]">
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl group-hover:bg-orange-600 group-hover:border-orange-400 transition-all duration-300" />
                      <span className="relative block text-center py-2.5 text-white text-sm md:text-base font-black tracking-wide">
                        {c.title ? t("translation." + c.title) : ""}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-10 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:animate-shine" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Category;