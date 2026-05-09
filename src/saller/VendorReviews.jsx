import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Progress } from "../components/ui/progress";
import { Star, MessageSquare, Send, Loader2, User, Package } from "lucide-react";
import getSallerReviews from "../lib/saller/fetchSallerReviews"; // افترضت وجود هذه الدالة
import postReviewReply from "../lib/saller/postReviewReply"; // دالة إرسال الرد

export default function VendorReviews() {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0.0);
  const [totalReviews, setTotalReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [replyTexts, setReplyTexts] = useState({}); // لتخزين نصوص الردود مؤقتاً
  const [submittingId, setSubmittingId] = useState(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await getSallerReviews();
      setReviews(data.reviews);
      setAverageRating(data.average_rating);
      setTotalReviews(data.total_reviews);
    } catch (error) {
      console.error("خطأ في جلب التقييمات:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (id) => {
    const text = replyTexts[id];
    if (!text || text.trim() === "") return;

    setSubmittingId(id);
    try {
      await postReviewReply(id, text);
      // تحديث الحالة محلياً بعد نجاح الإرسال
      setReviews(reviews.map((r) => (r.id === id ? { ...r, reply: text } : r)));
    } catch (error) {
      alert("حدث خطأ أثناء إرسال الرد");
    } finally {
      setSubmittingId(null);
    }
  };


  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50/30 min-h-screen rtl text-right">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-800">⭐ التقييمات والمراجعات</h2>
        <p className="text-gray-500">استمع لعملائك وحسّن تجربتهم</p>
      </header>

      {/* ملخص التقييمات */}
      <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="text-center space-y-1">
              <h1 className="text-5xl font-black text-gray-800">{averageRating}</h1>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill={i < Math.round(averageRating) ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="text-sm text-gray-400">من {totalReviews} مراجعة</p>
            </div>
            
            <div className="flex-1 w-full space-y-3">
              <h3 className="text-sm font-bold text-gray-700">معدل الرضا العام</h3>
              <div className="flex items-center gap-4">
                <Progress value={(averageRating / 5) * 100} className="h-3 bg-gray-100" />
                <span className="text-sm font-bold text-blue-600">
                  {Math.round((averageRating / 5) * 100)}%
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">
                تؤثر التقييمات المرتفعة مباشرة على ظهور منتجاتك في مقدمة البحث.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* قائمة التقييمات */}
      <div className="grid gap-6">
        {reviews.map((review) => (
          <Card key={review.id} className="border-none shadow-sm rounded-3xl bg-white overflow-hidden group">
            <CardContent className="p-6 space-y-5">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                    <User size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{review.customer}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <Package size={14} />
                      <span>{review.product}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} 
                    />
                  ))}
                </div>
              </div>

              <div className="relative p-4 bg-gray-50 rounded-2xl">
                <p className="text-gray-700 leading-relaxed italic">"{review.comment}"</p>
              </div>

              {review.reply ? (
                <div className="mr-8 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-sm flex gap-3">
                  <div className="shrink-0 text-blue-500">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <strong className="text-blue-800 block mb-1 font-bold italic underline">ردك كتاجر:</strong>
                    <p className="text-blue-700">{review.reply}</p>
                  </div>
                </div>
              ) : (
                <div className="mr-8 space-y-3 animate-in fade-in duration-500">
                  <Textarea
                    placeholder="اشكر العميل أو حل مشكلته هنا..."
                    value={replyTexts[review.id] || ""}
                    onChange={(e) => setReplyTexts({ ...replyTexts, [review.id]: e.target.value })}
                    className="w-full rounded-2xl border-gray-100 focus:ring-blue-500 bg-gray-50/30 min-h-[100px]"
                  />
                  <Button
                    onClick={() => handleSendReply(review.id)}
                    disabled={submittingId === review.id || !replyTexts[review.id]}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 flex gap-2"
                  >
                    {submittingId === review.id ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    إرسال الرد الاحترافي
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}