import LegalPage from "./LegalPage";

// مثال للاستخدام في صفحة الشروط والأحكام
const TermsOfService = () => {
  const data = [
    "باستخدامك لهذا التطبيق، فإنك توافق على الالتزام بكافة الشروط المذكورة هنا.",
    "يجب ألا يقل عمر المستخدم عن 18 عاماً لإنشاء حساب وطلب أوردر.",
    "نحتفظ بالحق في تعديل الأسعار أو الخدمات في أي وقت دون إشعار مسبق."
  ];

  return (
    <LegalPage 
      title="الشروط والأحكام" 
      content={data} 
      lastUpdated="2026/01/08" 
    />
  );
};

export default TermsOfService