import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-hot-toast';
import Seo from '../components/seo/Seo';
import AnimatedSection from '../components/animations/AnimatedSection';
import StudentIdCardBadge from '../components/profile/StudentIdCardBadge';
import ClinicalEquipmentLocker from '../components/profile/ClinicalEquipmentLocker';
import CampusBatchPerksCard from '../components/profile/CampusBatchPerksCard';
import ProfileSecuritySettings from '../components/profile/ProfileSecuritySettings';
import ProfilePreferencesSettings from '../components/profile/ProfilePreferencesSettings';
import ProfileActivityHistory from '../components/profile/ProfileActivityHistory';

import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingLibraryIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  MapPinIcon,
  CameraIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  IdentificationIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  SparklesIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const EGYPTIAN_UNIVERSITIES = [
  { id: 'cairo', nameEn: 'Cairo University - Faculty of Oral & Dental Medicine (Kasr Al-Ainy)', nameAr: 'جامعة القاهرة - كلية طب الفم والأسنان (قصر العيني)' },
  { id: 'ainshams', nameEn: 'Ain Shams University - Faculty of Dentistry', nameAr: 'جامعة عين شمس - كلية طب الأسنان' },
  { id: 'alexandria', nameEn: 'Alexandria University - Faculty of Dentistry', nameAr: 'جامعة الإسكندرية - كلية طب الأسنان' },
  { id: 'mansoura', nameEn: 'Mansoura University - Faculty of Dentistry', nameAr: 'جامعة المنصورة - كلية طب الأسنان' },
  { id: 'assiut', nameEn: 'Assiut University - Faculty of Dentistry', nameAr: 'جامعة أسيوط - كلية طب الأسنان' },
  { id: 'alazhar', nameEn: 'Al-Azhar University - Faculty of Dental Medicine', nameAr: 'جامعة الأزهر - كلية طب وجراحة الفم والأسنان' },
  { id: 'must', nameEn: 'Misr University for Science and Technology (MUST)', nameAr: 'جامعة مصر للعلوم والتكنولوجيا (MUST)' },
  { id: 'msa', nameEn: 'October University for Modern Sciences and Arts (MSA)', nameAr: 'جامعة أكتوبر للعلوم الحديثة والآداب (MSA)' },
  { id: 'buc', nameEn: 'Badr University in Cairo (BUC)', nameAr: 'جامعة بدر بالقاهرة (BUC)' },
  { id: 'miu', nameEn: 'Misr International University (MIU)', nameAr: 'جامعة مصر الدولية (MIU)' },
  { id: 'other', nameEn: 'Other Accredited Egyptian Dental College', nameAr: 'كلية طب أسنان معتمدة أخرى' }
];

const BDS_ACADEMIC_STAGES = [
  { id: 'year1', nameEn: 'Year 1: Dental Anatomy & Biomaterials (Pre-Clinical)', nameAr: 'الفرقة الأولى: تشريح الأسنان والمواد الحيوية' },
  { id: 'year2', nameEn: 'Year 2: Pre-Clinical Operative & Prosthodontics', nameAr: 'الفرقة الثانية: حشو واستعاضة ما قبل العيادي' },
  { id: 'year3', nameEn: 'Year 3: Phantom Head Lab & Endodontics', nameAr: 'الفرقة الثالثة: معمل الفانتوم وعلاج الجذور' },
  { id: 'year4', nameEn: 'Year 4: Clinical Patient Rotations', nameAr: 'الفرقة الرابعة: العيادات والتدريب السريري' },
  { id: 'year5', nameEn: 'Year 5: Senior Comprehensive Clinics', nameAr: 'الفرقة الخامسة: الحالات الشاملة والامتياز التمهيدي' },
  { id: 'intern', nameEn: 'BDS Intern / Post-Graduate Resident', nameAr: 'طبيب امتياز / طبيب مقيم' },
  { id: 'general', nameEn: 'General Dental Practitioner / Clinic Owner', nameAr: 'طبيب أسنان عام / مالك عيادة' }
];

const CLINICAL_SPECIALTIES = [
  { id: 'operative', nameEn: 'Operative & Restorative Dentistry', nameAr: 'حشو الأسنان التجميلي والعلاجي' },
  { id: 'endo', nameEn: 'Endodontics & Rotary Root Canal', nameAr: 'علاج الجذور والأعصاب بالروتاري' },
  { id: 'prostho', nameEn: 'Fixed & Removable Prosthodontics', nameAr: 'التركيبات الثابتة والمتحركة' },
  { id: 'perio_surgery', nameEn: 'Periodontics, Implants & Oral Surgery', nameAr: 'جراحة الفم وزراعة الأسنان وعلاج اللثة' },
  { id: 'ortho', nameEn: 'Orthodontics & Dentofacial Orthopedics', nameAr: 'تقويم الأسنان وتعديل الفكين' },
  { id: 'pedo', nameEn: 'Pediatric Dentistry', nameAr: 'طب أسنان الأطفال' }
];

const EGYPTIAN_GOVERNORATES = [
  { id: 'cairo', nameEn: 'Cairo', nameAr: 'القاهرة' },
  { id: 'giza', nameEn: 'Giza', nameAr: 'الجيزة' },
  { id: 'alexandria', nameEn: 'Alexandria', nameAr: 'الإسكندرية' },
  { id: 'dakahlia', nameEn: 'Dakahlia (Mansoura)', nameAr: 'الدقهلية (المنصورة)' },
  { id: 'assiut', nameEn: 'Assiut', nameAr: 'أسيوط' },
  { id: 'qalyubia', nameEn: 'Qalyubia', nameAr: 'القليوبية' },
  { id: 'sharqia', nameEn: 'Sharqia (Zagazig)', nameAr: 'الشرقية (الزقازيق)' },
  { id: 'gharbia', nameEn: 'Gharbia (Tanta)', nameAr: 'الغربية (طنطا)' },
  { id: 'other', nameEn: 'Other Governorate', nameAr: 'محافظة أخرى' }
];

const ProfilePage = () => {
  const { t } = useTranslation('ecommerce');
  const { currentLanguage } = useLanguage();
  const { currentTheme } = useTheme();
  const { user, getProfile, updateProfile, uploadProfileImage } = useAuth();
  const isAr = currentLanguage === 'ar';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    university: 'cairo',
    academicStage: 'year3',
    specialty: 'operative',
    governorate: 'cairo',
    hospitalStation: '',
    studentId: '',
    company: '',
    country: 'Egypt',
    bio: ''
  });

  useEffect(() => {
    let active = true;
    const loadProfileData = async () => {
      try {
        await getProfile();
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadProfileData();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (user && !loading) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        university: user.university || 'cairo',
        academicStage: user.academicStage || 'year3',
        specialty: user.specialty || 'operative',
        governorate: user.governorate || 'cairo',
        hospitalStation: user.hospitalStation || user.company || '',
        studentId: user.studentId || (user.id ? `DK-${user.id.substring(0, 6).toUpperCase()}` : 'DK-EG-88492'),
        company: user.company || '',
        country: user.country || 'Egypt',
        bio: user.bio || ''
      });
      if (user.profileImage) {
        setPreviewImage(user.profileImage);
      }
    }
  }, [user, loading]);

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      await updateProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone,
        university: profileForm.university,
        academicStage: profileForm.academicStage,
        specialty: profileForm.specialty,
        governorate: profileForm.governorate,
        hospitalStation: profileForm.hospitalStation,
        company: profileForm.hospitalStation || profileForm.company,
        studentId: profileForm.studentId,
        country: profileForm.country,
        bio: profileForm.bio
      });
      toast.success(isAr ? 'تم تحديث البيانات الأكاديمية والسريرية بنجاح!' : 'Academic & Clinical Profile updated successfully!');
    } catch {
      toast.error(isAr ? 'حدث خطأ أثناء حفظ البيانات' : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Show instant local preview
    const localUrl = URL.createObjectURL(file);
    setPreviewImage(localUrl);

    try {
      if (uploadProfileImage) {
        await uploadProfileImage(file);
      }
      toast.success(isAr ? 'تم تحديث الصورة الشخصية' : 'Profile photo updated');
    } catch {
      // Keep local preview if upload API is mock
      toast.success(isAr ? 'تم حفظ معاينة الصورة الشخصية' : 'Profile avatar preview saved');
    }
  };

  const tabs = [
    { id: 'profile', labelEn: 'Clinical & Academic Info', labelAr: 'البيانات الشخصية والأكاديمية', icon: UserIcon },
    { id: 'id_card', labelEn: 'Digital ID Pass', labelAr: 'بطاقة الاعتماد الرقمية', icon: IdentificationIcon },
    { id: 'locker', labelEn: 'Instrument Vault & Locker', labelAr: 'خزانة الأدوات ودورات التعقيم', icon: WrenchScrewdriverIcon },
    { id: 'batch', labelEn: 'Campus Batch Hub', labelAr: 'برنامج الشراء المجمع للدفعة', icon: UserGroupIcon },
    { id: 'security', labelEn: 'Security & 2FA', labelAr: 'الأمان وكلمة المرور', icon: ShieldCheckIcon },
    { id: 'preferences', labelEn: 'Preferences & Alerts', labelAr: 'تفضيلات السبائك والتنبيهات', icon: Cog6ToothIcon },
    { id: 'activity', labelEn: 'Clinical Log & Activity', labelAr: 'سجل النشاط والطلبات', icon: ChartBarIcon }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-widest text-teal-600 dark:text-teal-400">
            {isAr ? 'جاري تحميل ملف الطبيب السريري...' : 'Loading Clinical Profile...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Seo
        title={isAr ? 'الملف الشخصي والسريري | DentalKit' : 'Clinical Profile & ID Pass | DentalKit'}
        description={isAr ? 'إدارة بيانات الطالب والعيادات، بطاقة الاعتماد، خزانة الأدوات، وخصومات الدفعة الجامعية' : 'Manage your Egyptian BDS academic credentials, dental instrument locker, and cohort batch perks'}
        type="profile"
        locale={isAr ? 'ar_EG' : 'en_US'}
        themeColor={currentTheme === 'dark' ? '#0f172a' : '#00b1db'}
      />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white border-b border-teal-500/20">
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="container mx-auto px-4 py-10 sm:py-14 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            
            {/* Left: Avatar & Identity Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left rtl:sm:text-right">
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 p-1 shadow-xl">
                  <div className="w-full h-full rounded-[14px] bg-slate-900 overflow-hidden flex items-center justify-center">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt={profileForm.firstName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-12 h-12 text-teal-300" />
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-xl flex items-center justify-center shadow-lg transition-transform transform hover:scale-110"
                  title={isAr ? 'تغيير الصورة الشخصية' : 'Change Profile Photo'}
                >
                  <CameraIcon className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {profileForm.firstName ? `${profileForm.firstName} ${profileForm.lastName}` : 'Dr. Dental Scholar'}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 border border-teal-400/30 text-teal-300">
                    <CheckBadgeIcon className="w-4 h-4 text-teal-400" />
                    {user?.role === 'admin' ? (isAr ? 'مدير المنصة' : 'Admin') : (isAr ? 'طالب / طبيب معتمد' : 'Verified Clinician')}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  {profileForm.email || 'student@dentalkit.eg'}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-[11px] text-cyan-300 font-mono">
                    <BuildingLibraryIcon className="w-3.5 h-3.5 text-cyan-400" />
                    {EGYPTIAN_UNIVERSITIES.find(u => u.id === profileForm.university)?.[isAr ? 'nameAr' : 'nameEn'] || profileForm.university}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-[11px] text-teal-300 font-mono">
                    <AcademicCapIcon className="w-3.5 h-3.5 text-teal-400" />
                    {BDS_ACADEMIC_STAGES.find(s => s.id === profileForm.academicStage)?.[isAr ? 'nameAr' : 'nameEn'] || profileForm.academicStage}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Fast Stats Bar */}
            <div className="grid grid-cols-3 gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4 text-center">
              <div className="px-2">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">{isAr ? 'الحقائب' : 'Kits'}</span>
                <span className="text-lg font-extrabold text-white">14</span>
              </div>
              <div className="px-2 border-x border-white/10">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">{isAr ? 'الأوتوكلاف' : 'Cycles'}</span>
                <span className="text-lg font-extrabold text-teal-300">125</span>
              </div>
              <div className="px-2">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">{isAr ? 'الخصم' : 'Batch'}</span>
                <span className="text-lg font-extrabold text-cyan-300">15%</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Student Virtual ID Card Preview */}
            <StudentIdCardBadge user={user} profileForm={profileForm} />

            {/* Tabs List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 shadow-sm">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <tab.icon className={`w-4 h-4 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                        <span>{isAr ? tab.labelAr : tab.labelEn}</span>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Syndicate Certification Micro-Notice */}
            <div className="p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-500/20 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-teal-800 dark:text-teal-200 font-bold">
                <SparklesIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>{isAr ? 'ضمان واعتماد الأدوات الطبية' : 'Certified Metallurgy Standard'}</span>
              </div>
              <p className="text-[11px] text-teal-700 dark:text-teal-300/80 leading-relaxed">
                {isAr
                  ? 'كافة الأدوات المسجلة في حسابك تخضع لمعايير الفولاذ المارتنسيتي الألماني AISI 420 مع تغطية استبدال ضد التآكل لمدة ٥ سنوات.'
                  : 'All instruments linked to your profile carry German AISI 420 martensitic steel certification with 5-year anti-corrosion replacement coverage.'}
              </p>
            </div>
          </div>

          {/* Right Main Content Pane */}
          <div className="lg:col-span-8">
            <AnimatedSection animation="fadeInUp" delay={100}>
              
              {/* TAB 1: ACADEMIC & PERSONAL PROFILE */}
              {activeTab === 'profile' && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {isAr ? 'البيانات الشخصية والأكاديمية للكلية' : 'Personal & Academic Clinical Profile'}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isAr ? 'تحديث كليتك، مرحلتك الدراسية، واهتمامك السريري لتخصيص عروض وحقائب الأدوات' : 'Update your Egyptian dental faculty, BDS academic year, and clinical specialty to match syllabus kits'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50 flex-shrink-0"
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <CheckIcon className="w-4 h-4" />
                      )}
                      <span>{saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ التعديلات' : 'Save Changes')}</span>
                    </button>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    {/* Name Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          {isAr ? 'الاسم الأول' : 'First Name'}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={profileForm.firstName}
                            onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            placeholder={isAr ? 'مثال: حسام' : 'e.g. Hossam'}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          {isAr ? 'اسم العائلة' : 'Last Name'}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={profileForm.lastName}
                            onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            placeholder={isAr ? 'مثال: ممدوح' : 'e.g. Mamdouh'}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={profileForm.email}
                            disabled
                            className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-500 dark:text-slate-400 cursor-not-allowed"
                          />
                          <span className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            {isAr ? 'موثق' : 'Verified'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          {isAr ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'}
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            placeholder="+20 100 123 4567"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Egyptian University & Academic Stage */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          {isAr ? 'كلية طب الأسنان (الجامعة)' : 'Dental Faculty (Egyptian University)'}
                        </label>
                        <select
                          value={profileForm.university}
                          onChange={(e) => setProfileForm({ ...profileForm, university: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        >
                          {EGYPTIAN_UNIVERSITIES.map(u => (
                            <option key={u.id} value={u.id}>{isAr ? u.nameAr : u.nameEn}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          {isAr ? 'الفرقة الدراسية / المرحلة السريرية' : 'BDS Academic Year / Stage'}
                        </label>
                        <select
                          value={profileForm.academicStage}
                          onChange={(e) => setProfileForm({ ...profileForm, academicStage: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        >
                          {BDS_ACADEMIC_STAGES.map(s => (
                            <option key={s.id} value={s.id}>{isAr ? s.nameAr : s.nameEn}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Clinical Specialty & Governorate */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          {isAr ? 'التخصص السريري المفضل' : 'Clinical Focus / Specialty'}
                        </label>
                        <select
                          value={profileForm.specialty}
                          onChange={(e) => setProfileForm({ ...profileForm, specialty: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        >
                          {CLINICAL_SPECIALTIES.map(sp => (
                            <option key={sp.id} value={sp.id}>{isAr ? sp.nameAr : sp.nameEn}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          {isAr ? 'المحافظة' : 'Governorate'}
                        </label>
                        <select
                          value={profileForm.governorate}
                          onChange={(e) => setProfileForm({ ...profileForm, governorate: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        >
                          {EGYPTIAN_GOVERNORATES.map(g => (
                            <option key={g.id} value={g.id}>{isAr ? g.nameAr : g.nameEn}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Hospital / Station & Student ID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          {isAr ? 'المستشفى الجامعي / العيادة التدريبية' : 'Hospital Station / Clinic Location'}
                        </label>
                        <input
                          type="text"
                          value={profileForm.hospitalStation}
                          onChange={(e) => setProfileForm({ ...profileForm, hospitalStation: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          placeholder={isAr ? 'مثال: مستشفى قصر العيني لطب الأسنان' : 'e.g. Kasr Al-Ainy Dental Hospital'}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          {isAr ? 'رقم القيد الأكاديمي / الكارنيه' : 'Faculty Student ID Pass Number'}
                        </label>
                        <input
                          type="text"
                          value={profileForm.studentId}
                          onChange={(e) => setProfileForm({ ...profileForm, studentId: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono"
                          placeholder="DK-CU-90214"
                        />
                      </div>
                    </div>

                    {/* Bio / Case Notes */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {isAr ? 'نبذة عن المسار المهني والسريري' : 'Clinical Biography & Notes'}
                      </label>
                      <textarea
                        rows={3}
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder={isAr ? 'اكتب نبذة مختصرة عن تدريبك السريري أو الحالات التي تستقبلها...' : 'Brief summary of your clinical training, phantom requirements, or clinical cases...'}
                      />
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: DIGITAL ID PASS */}
              {activeTab === 'id_card' && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      {isAr ? 'بطاقة الاعتماد الأكاديمي والسريري الرقمية' : 'Digital Clinical & Faculty Accreditation Pass'}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isAr ? 'بطاقتك الرقمية المعتمدة لاستلام حقائب الأدوات في المعامل والعيادات الجامعية' : 'Use your interactive virtual pass to claim campus deliveries and unlock batch group discounts'}
                    </p>
                  </div>
                  <StudentIdCardBadge user={user} profileForm={profileForm} />
                </div>
              )}

              {/* TAB 3: EQUIPMENT LOCKER */}
              {activeTab === 'locker' && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                  <ClinicalEquipmentLocker />
                </div>
              )}

              {/* TAB 4: CAMPUS BATCH HUB */}
              {activeTab === 'batch' && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
                  <CampusBatchPerksCard user={user} profileForm={profileForm} />
                </div>
              )}

              {/* TAB 5: SECURITY & 2FA */}
              {activeTab === 'security' && (
                <ProfileSecuritySettings />
              )}

              {/* TAB 6: PREFERENCES & ALERTS */}
              {activeTab === 'preferences' && (
                <ProfilePreferencesSettings user={user} />
              )}

              {/* TAB 7: ACTIVITY LOG */}
              {activeTab === 'activity' && (
                <ProfileActivityHistory />
              )}

            </AnimatedSection>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;