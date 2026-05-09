import Footer from './components/Footer';
import AppPromoSection from './pages/Home/AppPromoSection';
import VendorPage from './pages/Home/VendorPage';
import ReviewsPage from './pages/Home/ReviewsPage';
import ProductSection from './pages/Home/ProductSection';
import Banner from './pages/Home/Banner';
import Category from './pages/Home/Category';
import CategoriesNavbar from './pages/Home/CategoriesNavbar';
import getTopMenu from './lib/client/fetchTopMenu';
import { useEffect, useState } from 'react';

export default function HomePage() {
     const [products, setProducts] = useState([]);
     const [Offers, setOffers] = useState([]);
     const [reviews, setReviews] = useState([]);
     const [restaurants, setRestaurants] = useState([]);
     const [loading, setLoading] = useState(true);
   
     useEffect(() => {
       loadOrders();
     }, []);
   
     const loadOrders = async () => {
       try {
         const data = await getTopMenu();
         setReviews(data.reviews);
         setRestaurants(data.restaurants);
         setOffers(data.topProductsOffer);
         setProducts(data.topProducts);
       } catch (error) {
         console.error("خطأ في جلب الطلبات:", error);
       } finally {
         setLoading(false);
       }
     };


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white font-['Inter']">
      <CategoriesNavbar />
      <Banner />
      <Category />
      {Offers.length>0 ?<ProductSection mockProducts={Offers} title={"offer_products"}sectionId={"offers-section"}/> :"" }
      {products.length>0 ?<ProductSection mockProducts={products} title={"featured_products"} sectionId={"offers-section"}/> :"" }
      {restaurants.length>0 ?<VendorPage vendors={restaurants}/> :"" }
      {reviews.length>0? <ReviewsPage reviews={reviews}/>:""}
      <AppPromoSection />
      <Footer />
    </div>
  );
}