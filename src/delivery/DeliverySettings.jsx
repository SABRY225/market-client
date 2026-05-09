import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  HiOutlineUserCircle, 
  HiOutlinePhone, 
  HiOutlineMail, 
  HiOutlineTruck, 
  HiOutlineShieldCheck,
  HiOutlineLocationMarker,
  HiOutlineCalendar
} from "react-icons/hi";

function DeliverySettings() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/delivery/profile/${user.id}`);
      if (!response.ok) throw new Error("Fetch failed");
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const toggleOnlineStatus = async () => {
    const newStatus = !profile.online;
    const oldStatus = profile.online;
    try {
      setProfile({ ...profile, online: newStatus });
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/delivery/profile/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ online: newStatus }),
      });
      if (!response.ok) throw new Error();
    } catch (err) {
      setProfile({ ...profile, online: oldStatus });
      alert(t("translation.messages.update_error"));
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-slate-500 font-bold">{t("translation.status.loading_profile")}</p>
    </div>
  );

  if (!profile) return null;

  return (
    <div className={`bg-[#F8FAFC] min-h-screen p-4 pb-20 ${isRtl ? 'font-arabic text-right' : 'font-sans text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header: Profile & Status */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex justify-between items-center group">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-blue-600 rounded-[1.8rem] flex items-center justify-center text-4xl text-white shadow-xl shadow-blue-100 group-hover:scale-105 transition-transform">
              <HiOutlineUserCircle />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">{profile.username}</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`w-2 h-2 rounded-full ${profile.accountStatus === 'approved' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                <span className={`text-[11px] font-black uppercase tracking-wider ${
                  profile.accountStatus === 'approved' ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {profile.accountStatus === 'approved' ? t("translation.profile.verified") : t("translation.profile.pending")}
                </span>
              </div>
            </div>
          </div>

          {/* Online/Offline Toggle */}
          <div className="flex flex-col items-center bg-slate-50 p-3 rounded-3xl border border-slate-100">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={profile.online} 
                className="sr-only peer" 
                onChange={toggleOnlineStatus}
              />
              <div className={`w-14 h-7 bg-slate-300 peer-focus:outline-none rounded-full peer 
                peer-checked:after:translate-x-full ${isRtl ? 'peer-checked:after:-translate-x-full' : 'peer-checked:after:translate-x-full'} 
                after:content-[''] after:absolute after:top-[2px] after:left-[2px] ${isRtl ? 'after:right-[2px] after:left-auto' : ''} 
                after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500`}>
              </div>
            </label>
            <span className={`text-[10px] font-black mt-2 uppercase tracking-tighter ${profile.online ? 'text-green-600' : 'text-slate-400'}`}>
              {profile.online ? t("translation.profile.online") : t("translation.profile.offline")}
            </span>
          </div>
        </div>

        {/* Section 1: Contact Info */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
          <h4 className="text-xs font-black text-blue-600 mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
            <HiOutlinePhone className="text-lg" /> {t("translation.profile.contact_info")}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-transparent hover:border-blue-100 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <HiOutlineMail className="text-slate-400" />
                <p className="text-[10px] text-slate-400 font-black uppercase">{t("translation.profile.email")}</p>
              </div>
              <p className="text-sm font-bold text-slate-700 truncate">{profile.email}</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-transparent hover:border-blue-100 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <HiOutlinePhone className="text-slate-400" />
                <p className="text-[10px] text-slate-400 font-black uppercase">{t("translation.profile.phone")}</p>
              </div>
              <p className="text-sm font-bold text-slate-700">{profile.phone}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Vehicle Info */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
          <h4 className="text-xs font-black text-blue-600 mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
            <HiOutlineTruck className="text-lg" /> {t("translation.profile.vehicle_details")}
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: t("translation.profile.v_type"), value: profile.vehicleType, icon: "🚲" },
              { label: t("translation.profile.v_color"), value: profile.vehicleColor, icon: "🎨" },
              { label: t("translation.profile.v_plate"), value: profile.plateNumber, icon: "🔢" }
            ].map((item, i) => (
              <div key={i} className="text-center p-4 bg-blue-50/30 rounded-3xl border border-blue-50/50 hover:bg-blue-50 transition-colors">
                <p className="text-[9px] font-black text-blue-400 mb-2 uppercase tracking-tighter">{item.label}</p>
                <p className="text-xs font-black text-slate-800 uppercase leading-none">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Work & License */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
          <h4 className="text-xs font-black text-blue-600 mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
            <HiOutlineShieldCheck className="text-lg" /> {t("translation.profile.work_license")}
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <HiOutlineLocationMarker className="text-slate-400 text-xl" />
                <span className="text-sm font-bold text-slate-600">{t("translation.profile.area")}</span>
              </div>
              <span className="text-sm font-black text-slate-800">{profile.operatingArea || t("translation.common.not_set")}</span>
            </div>
            
            <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <HiOutlineCalendar className="text-slate-400 text-xl" />
                <span className="text-sm font-bold text-slate-600">{t("translation.profile.expiry")}</span>
              </div>
              <span className={`text-sm font-black px-4 py-1 rounded-full ${isRtl ? 'font-arabic' : 'font-sans'} bg-red-50 text-red-600 border border-red-100`}>
                {profile.licenseExpiry}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliverySettings;