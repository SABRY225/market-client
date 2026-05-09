import React, { useState } from 'react';
import { 
  Star, Clock, MapPin, Phone, Info, ShoppingBag, 
  Search, Heart, Share2, ChevronLeft, Utensils 
} from 'lucide-react';
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const RestaurantPage = () => {
  const [activeCategory, setActiveCategory] = useState('الكل');

  const restaurant = {
    name: "برجر هاوس - Burger House",
    cover: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&h=400&fit=crop",
    logo: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=150&h=150&fit=crop",
    rating: 4.8,
    reviewsCount: "1.2k+",
    deliveryTime: "25-35 دقيقة",
    deliveryFee: "15 ج.م",
    minOrder: "50 ج.م",
    description: "نقدم أجود أنواع اللحوم الطازجة المشوية على اللهب مع خلطاتنا السرية الخاصة. طعم لا يقاوم منذ عام 2010.",
    address: "القاهرة، مدينة نصر، شارع عباس العقاد",
    categories: ['الكل', 'الأكثر مبيعاً', 'برجر لحم', 'برجر دجاج', 'مقبلات', 'مشروبات']
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 text-right" dir="rtl">
      
      {/* 1. Header & Cover - قسم الغلاف */}
      <div className="relative h-64 md:h-80 w-full">
        <img src={restaurant.cover} className="w-full h-full object-cover" alt="cover" />
        <div className="absolute inset-0 bg-black/30" />
        <Button variant="ghost" className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40" onClick={() => window.history.back()}>
           <ChevronLeft className="ml-1" /> العودة
        </Button>
      </div>

      {/* 2. Restaurant Info Card - كارت معلومات المطعم */}
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="px-0 py-10">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-6 bg-white">
              <img 
                src={restaurant.logo} 
                className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg -mt-16 md:-mt-20 object-cover" 
                alt="logo" 
              />
              <div className="flex-1 text-center md:text-right">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <h1 className="text-3xl font-black text-gray-900">{restaurant.name}</h1>
                  <Badge className="w-fit mx-auto md:mx-0 bg-green-100 text-green-700 border-none">مفتوح الآن</Badge>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-gray-600 font-medium">
                  <span className="flex items-center gap-1"><Star size={16} className="text-orange-500 fill-orange-500" /> {restaurant.rating} ({restaurant.reviewsCount})</span>
                  <span className="flex items-center gap-1"><Clock size={16} /> {restaurant.deliveryTime}</span>
                  <span className="flex items-center gap-1"><MapPin size={16} /> {restaurant.address}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl border-gray-200"><Share2 size={18} /></Button>
                <Button variant="outline" className="rounded-xl border-gray-200 text-red-500"><Heart size={18} /></Button>
              </div>
            </div>

            {/* تفاصيل إضافية (وقت، توصيل، أدنى طلب) */}
            <div className="grid grid-cols-3 border-t border-gray-100 bg-orange-50/30">
              <div className="p-4 text-center border-l border-gray-100">
                <p className="text-xs text-gray-500">التوصيل</p>
                <p className="font-bold text-orange-600">{restaurant.deliveryFee}</p>
              </div>
              <div className="p-4 text-center border-l border-gray-100">
                <p className="text-xs text-gray-500">أقل طلب</p>
                <p className="font-bold text-gray-800">{restaurant.minOrder}</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-xs text-gray-500">التقييم</p>
                <p className="font-bold text-gray-800">ممتاز</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Menu Content - محتوى القائمة */}
      <div className="max-w-6xl mx-auto px-4 mt-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar - القائمة الجانبية ومعلومات إضافية */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Info size={18} className="text-orange-500" /> معلومات المتجر
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{restaurant.description}</p>
            <div className="space-y-3 pt-4 border-t border-gray-50">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Phone size={16} className="text-orange-500" /> {restaurant.phone || "0100 123 4567"}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Utensils size={16} className="text-orange-500" /> مأكولات أمريكية، برجر
              </div>
            </div>
          </div>
        </div>

        {/* Main Menu - قائمة الأكل */}
        <div className="lg:col-span-3">
          {/* بحث وفئات */}
          <div className="sticky top-4 z-20 bg-white/80 backdrop-blur-lg p-2 rounded-2xl shadow-sm mb-6 flex items-center gap-4 border border-gray-100">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input className="pr-10 bg-gray-50 border-none rounded-xl" placeholder="ابحث في المنيو..." />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto py-2 px-1 no-scrollbar ">
            {restaurant.categories.map(cat => (
              <Button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                variant={activeCategory === cat ? 'default' : 'outline'}
                className={`rounded-full px-6 font-bold whitespace-nowrap ${activeCategory === cat ? 'bg-orange-500 hover:bg-orange-600' : 'text-gray-500'}`}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* وجبات القائمة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="group flex p-3 rounded-2xl border-none shadow-sm hover:shadow-md transition-all bg-white cursor-pointer">
                <div className="flex-1 space-y-2 pr-2">
                  <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">برجر كلاسيك سينجل</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    شريحة لحم مشوي، خس، طماطم، صوص هاوس الأصلي وخبز طازج.
                  </p>
                  <p className="font-black text-orange-600">145 ج.م</p>
                </div>
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop&sig=${item}`} 
                    className="w-full h-full object-cover" 
                    alt="meal" 
                  />
                  <Button size="icon" className="absolute bottom-1 left-1 w-8 h-8 rounded-lg bg-white text-orange-600 shadow-md border border-orange-100  hover:bg-orange-500 hover:text-white">
                    <ShoppingBag size={16} className='text-orange-500 hover:text-white' />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage;