import { Quote } from 'lucide-react'
import { RatingStars } from '../../components/ui/RatingStars';
import { useTranslation } from 'react-i18next';

function ReviewsPage({reviews}) {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar' ? true : false;
    // const reviews = [
    //     { id: 1, name: isArabic ? 'أحمد علي' : 'Ahmed Ali', avatar: 'https://placehold.co/64x64/ddd/555?text=A', rating: 5, comment: isArabic ? 'منتج رائع وجودة ممتازة، التوصيل كان سريع جداً.' : 'Great product and excellent quality, delivery was super fast.', date: '2d' },
    //     { id: 2, name: isArabic ? 'سارة خالد' : 'Sara Khaled', avatar: 'https://placehold.co/64x64/ddd/555?text=S', rating: 4, comment: isArabic ? 'الخدمة ممتازة والدعم متعاون.' : 'Excellent service and helpful support.', date: '5d' },
    //     { id: 3, name: isArabic ? 'محمد حسن' : 'Mohamed Hassan', avatar: 'https://placehold.co/64x64/ddd/555?text=M', rating: 5, comment: isArabic ? 'أفضل تجربة شراء عبر الإنترنت.' : 'Best online shopping experience.', date: '1w' },
    //     { id: 4, name: isArabic ? 'نورة صالح' : 'Nora Saleh', avatar: 'https://placehold.co/64x64/ddd/555?text=N', rating: 4.5, comment: isArabic ? 'التغليف ممتاز والأسعار منافسة.' : 'Great packaging and competitive prices.', date: '1w' },
    // ];

    return (
        <section className="max-w-7xl mx-auto px-4 pb-16">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Quote className="w-5 h-5 text-orange-600" />
                        {isArabic ? 'آراء العملاء' : 'Customer Reviews'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {isArabic ? 'ماذا يقول العملاء عن منتجاتنا' : 'What customers say about our products'}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {reviews.map(r => (
                    <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center gap-3">
                            <img src={`https://placehold.co/64x64/ddd/555?text=`+r.user.name} alt={r.user.name} className="w-10 h-10 rounded-full object-cover" />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div className="font-semibold text-gray-800 text-sm">{r.user.name}</div>
                                    <span className="text-xs text-gray-400">{r.createdAt}</span>
                                </div>
                                <RatingStars rating={r.rating} reviewCount={0} t={t} />
                            </div>
                        </div>
                        <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                            {r.comment}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default ReviewsPage