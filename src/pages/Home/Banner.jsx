import { useTranslation } from 'react-i18next';

function Banner() {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar' ? true : false;
    const scrollToRestaurants = () => {
        const element = document.getElementById('restaurants-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const scrollToOffers = () => {
        const element = document.getElementById('offers-section');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section
            className="relative flex flex-col md:flex-row items-center justify-between px-8 py-5 rounded-[40px] shadow-2xl mx-4 mt-6 overflow-hidden min-h-[300px]"
            style={{
                backgroundImage: `url(banner2.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* طبقة التعتيم (Overlay) لضمان وضوح النص */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-0" />

            <div className="max-w-2xl z-10 space-y-6">
                {/* شارة العرض الخاص */}
                <div className="inline-block px-4 py-1 rounded-full bg-orange-500 text-white text-sm font-bold animate-pulse">
                    {t("خصم 50% لفترة محدودة 🔥")}
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-2xl">
                    {t("translation.main_banner_title")}
                </h1>

                <p className="text-xl md:text-2xl text-white/80 max-w-lg leading-relaxed font-medium">
                    {t("translation.main_banner_subtitle")}
                </p>

                <div className="flex gap-4 pt-4">
                    <button className="px-10 py-4 rounded-2xl bg-orange-500 text-white font-black text-xl shadow-xl shadow-orange-500/30 hover:bg-orange-600 hover:-translate-y-1 transition-all duration-300" onClick={scrollToOffers}>
                        {t("translation.shop_now")}
                    </button>

                    <button className="px-10 py-4 rounded-2xl bg-white/10 backdrop-blur-md text-white font-bold text-xl border border-white/20 hover:bg-white/20 transition-all shadow-xl" onClick={scrollToRestaurants}>
                        {t("translation.discover_restaurants")}
                    </button>
                </div>
            </div>
        </section>
    )
}

export default Banner