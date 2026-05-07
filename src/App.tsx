import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { api, Hall } from './services/api';
import HallCard from './components/HallCard';
import BookingModal from './components/BookingModal';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import { Search, Calendar, Star, MapPin, ArrowRight, Users } from 'lucide-react';

export default function App() {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'home' | 'login' | 'admin'>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    api.getHalls().then(data => {
      setHalls(data);
      setLoading(false);
    });

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setView('admin');
    } else {
      setView('login');
    }
  };

  if (view === 'login') {
    return <Login onLogin={() => { setIsAuthenticated(true); setView('admin'); }} onBack={() => setView('home')} />;
  }

  if (view === 'admin' && isAuthenticated) {
    return <AdminPanel onClose={() => setView('home')} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-lg shadow-sm py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-white shadow-lg"
            >
              <Star fill="currentColor" size={20} />
            </motion.div>
            <span className={`text-2xl font-serif font-bold ${scrolled ? 'text-dark' : 'text-white'}`}>
              Event-Master
            </span>
          </div>
          
          <div className={`hidden md:flex items-center gap-10 text-sm font-semibold tracking-wide ${
            scrolled ? 'text-dark' : 'text-white'
          }`}>
             <a href="#halls" className="hover:text-gold transition-colors">Zallar</a>
             <a href="#menu" className="hover:text-gold transition-colors">Menyu</a>
             <a href="#about" className="hover:text-gold transition-colors">Biz haqimizda</a>
             <button 
               onClick={handleAdminClick}
               className={`px-6 py-2.5 rounded-full transition-all duration-300 border-2 ${
                 scrolled ? 'border-dark bg-dark text-white hover:bg-gold hover:border-gold' : 'border-white text-white hover:bg-white hover:text-dark'
               }`}
             >
               Admin Panel
             </button>
           </div>
         </div>
       </nav>

       {/* Hero Section */}
       <section className="relative min-h-screen flex items-center overflow-hidden bg-dark">
         <div className="absolute inset-0 z-0">
           <motion.img 
             initial={{ scale: 1.1, opacity: 0 }}
             animate={{ scale: 1, opacity: 0.5 }}
             transition={{ duration: 1.5 }}
             src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=2000" 
             className="w-full h-full object-cover"
             alt="Hero Background"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/70 to-transparent" />
         </div>
         
         <div className="max-w-7xl mx-auto px-6 relative z-10 w-full pt-20">
           <motion.div
             initial={{ opacity: 0, x: -30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="max-w-2xl"
           >
             <span className="text-gold uppercase tracking-[0.3em] font-bold text-xs mb-4 block underline underline-offset-8">To'yxanalar portaliga xush kelibsiz</span>
             <h1 className="text-6xl md:text-8xl text-white font-serif mb-8 leading-[1.1]">
               Sizning baxtli <br /> <span className="text-gold italic">Lahzangiz</span> uchun
             </h1>
             <p className="text-xl text-gray-300 mb-12 font-light leading-relaxed max-w-lg">
               Sizga eng hashamatli va zamonaviy to'yxanalarni topishda yordam beramiz. 
               Har bir detalni onlayn rejalashtiring.
             </p>
             
             <div className="flex flex-wrap gap-4">
               <a 
                 href="#halls" 
                 className="bg-gold text-white px-10 py-5 rounded-2xl font-bold hover:bg-white hover:text-dark transition-all shadow-xl shadow-gold/20 flex items-center gap-3 group"
               >
                 Zallarni ko'rish <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
               </a>
               <a href="#about" className="bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-bold hover:bg-white hover:text-dark transition-all">
                 Ma'lumot
               </a>
             </div>
           </motion.div>
         </div>
       </section>

       {/* Hall Listing */}
       <main id="halls" className="bg-white py-32 px-6">
         <div className="max-w-7xl mx-auto">
           <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
             <div className="max-w-xl">
               <h2 className="text-5xl font-serif text-dark mb-6">Tanlangan Maskanlar</h2>
               <div className="w-20 h-1 bg-gold mb-6"></div>
               <p className="text-gray-500 text-lg font-light leading-relaxed">
                 Har bir to'yxana o'zining takrorlanmas muhiti va yuqori darajadagi xizmati bilan ajralib turadi. 
                 Sizning talablaringizga mos keladiganini tanlang.
               </p>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
             {loading ? (
               Array.from({ length: 3 }).map((_, i) => (
                 <div key={i} className="h-[500px] bg-gray-50 animate-pulse rounded-3xl"></div>
               ))
             ) : (
               halls.map(hall => (
                 <HallCard key={hall.id} hall={hall} onSelect={setSelectedHall} />
               ))
             )}
           </div>
         </div>
       </main>

       {/* About Us Section */}
       <section id="about" className="bg-dark py-32 px-6 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
            <div className="w-full h-full bg-gold blur-[150px] rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
         </div>
         
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
               <h2 className="text-gold uppercase tracking-[0.4em] font-bold text-xs mb-6">Biz haqimizda</h2>
               <h3 className="text-5xl md:text-6xl text-white font-serif mb-8 leading-tight">
                 San'at darajasidagi <br /> <span className="text-gold italic">Tadbirlar</span>
               </h3>
               <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-light">
                  <p>
                    Event-Master — bu shunchaki bron qilish tizimi emas. Bu sizning orzuingizdagi tadbirni mukammal darajada rejalashtirish uchun yaratilgan ekotizimdir.
                  </p>
                  <p>
                    Biz 10 yildan ortiq vaqt davomida O'zbekistondagi eng nufuzli to'yxanalar bilan hamkorlik qilib kelmoqdamiz. Maqsadimiz — har bir mijoz uchun shaffoflik, qulaylik va ishonchni ta'minlashdir.
                  </p>
                  <div className="grid grid-cols-2 gap-8 pt-6">
                     <div>
                        <p className="text-4xl font-serif text-gold font-bold mb-2">500+</p>
                        <p className="text-xs uppercase tracking-widest font-bold">Muvaffaqiyatli tadbirlar</p>
                     </div>
                     <div>
                        <p className="text-4xl font-serif text-gold font-bold mb-2">25+</p>
                        <p className="text-xs uppercase tracking-widest font-bold">Premium hamkorlar</p>
                     </div>
                  </div>
               </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 p-12 rounded-[3rem] border border-white/10 backdrop-blur-sm"
            >
               <h4 className="text-2xl font-serif text-white mb-8">Nega aynan biz?</h4>
               <ul className="space-y-8">
                  <li className="flex gap-6">
                     <div className="w-12 h-12 bg-gold/20 rounded-2xl flex items-center justify-center text-gold shrink-0">
                        <Star size={24} />
                     </div>
                     <div>
                        <h5 className="text-white font-bold mb-2">Eksklyuziv takliflar</h5>
                        <p className="text-gray-500 text-sm">Biz orqali bron qilganingizda maxsus chegirmalar va bonuslarga ega bo'lasiz.</p>
                     </div>
                  </li>
                  <li className="flex gap-6">
                     <div className="w-12 h-12 bg-gold/20 rounded-2xl flex items-center justify-center text-gold shrink-0">
                        <Calendar size={24} />
                     </div>
                     <div>
                        <h5 className="text-white font-bold mb-2">Ishonchli taqvim</h5>
                        <p className="text-gray-500 text-sm">Zallarning bandligi har doim dolzarb holatda ko'rsatiladi.</p>
                     </div>
                  </li>
                  <li className="flex gap-6">
                     <div className="w-12 h-12 bg-gold/20 rounded-2xl flex items-center justify-center text-gold shrink-0">
                        <Users size={24} />
                     </div>
                     <div>
                        <h5 className="text-white font-bold mb-2">Professional yordam</h5>
                        <p className="text-gray-500 text-sm">Mutaxassislarimiz tashkiliy masalalarda sizga bepul maslahat berishadi.</p>
                     </div>
                  </li>
               </ul>
            </motion.div>
         </div>
       </section>

       {/* Menu Section */}
       <section id="menu" className="bg-white py-32 px-6">
          <div className="max-w-7xl mx-auto">
             <div className="text-center mb-20">
                <h2 className="text-gold uppercase tracking-[0.4em] font-bold text-xs mb-6">Bizning Oshxonamiz</h2>
                <h3 className="text-5xl md:text-6xl text-dark font-serif mb-8 leading-tight">Milliy va Yevropa taomlari</h3>
                <p className="text-gray-500 text-xl font-light max-w-2xl mx-auto">Har bir tadbir uchun maxsus tayyorlangan menyular to'plami. Sifat va maza uyg'unligi.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl transition-all duration-500 group">
                   <h4 className="text-2xl font-serif text-dark mb-6 group-hover:text-gold transition-colors">"An'anaviy" Menyusi</h4>
                   <ul className="space-y-4 text-gray-500 mb-8 font-light">
                      <li>• To'y oshi (Katta qozonda)</li>
                      <li>• Tandir kabob (Qashqadaryo uslubida)</li>
                      <li>• Milliy salatlar assortimenti</li>
                      <li>• Shirinliklar va mevalar</li>
                   </ul>
                   <p className="text-sm font-bold text-dark uppercase tracking-widest">350 000 so'mdan boshlab</p>
                </div>
                
                <div className="p-10 bg-dark text-white rounded-[2.5rem] shadow-2xl shadow-gold/10 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-6">
                      <Star fill="#D4AF37" className="text-gold" />
                   </div>
                   <h4 className="text-2xl font-serif text-white mb-6 group-hover:text-gold transition-colors">"Premium" Menyusi</h4>
                   <ul className="space-y-4 text-gray-400 mb-8 font-light">
                      <li>• Assorti shashlik (6 xil)</li>
                      <li>• Norin va Hasip</li>
                      <li>• Yevropa uslubidagi salatlar</li>
                      <li>• Maxsus tayyorlangan desertlar</li>
                   </ul>
                   <p className="text-sm font-bold text-gold uppercase tracking-widest">550 000 so'mdan boshlab</p>
                </div>

                <div className="p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl transition-all duration-500 group">
                   <h4 className="text-2xl font-serif text-dark mb-6 group-hover:text-gold transition-colors">"Yevropa" Menyusi</h4>
                   <ul className="space-y-4 text-gray-500 mb-8 font-light">
                      <li>• Steak assorti (Medium/Well)</li>
                      <li>• Dengiz mahsulotlari salati</li>
                      <li>• Italiya pastalari assortimenti</li>
                      <li>• Frantsuz desertlari</li>
                   </ul>
                   <p className="text-sm font-bold text-dark uppercase tracking-widest">450 000 so'mdan boshlab</p>
                </div>
             </div>
          </div>
       </section>

      {/* Features */}
      <section className="bg-gray-50 py-32">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="space-y-6">
                 <div className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center text-gold">
                    <Calendar size={32} />
                 </div>
                 <h3 className="text-2xl font-serif">Tezkor Bronlashtirish</h3>
                 <p className="text-gray-500 leading-relaxed">Zallarning bo'sh kunlarini real-vaqt rejimida ko'ring va bir zumda band qiling.</p>
              </div>
              <div className="space-y-6">
                 <div className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center text-gold">
                    <Star size={32} />
                 </div>
                 <h3 className="text-2xl font-serif">Premium Sifat</h3>
                 <p className="text-gray-500 leading-relaxed">Biz faqatgina eng yaxshi reytingga ega bo'lgan hamkorlar bilan ishlaymiz.</p>
              </div>
              <div className="space-y-6">
                 <div className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center text-gold">
                    <MapPin size={32} />
                 </div>
                 <h3 className="text-2xl font-serif">Qulay Joylashuv</h3>
                 <p className="text-gray-500 leading-relaxed">Shaharning istalgan nuqtasidan sizga qulay bo'lgan manzilni toping.</p>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center text-white">
                <Star size={16} fill="white" />
             </div>
            <span className="text-2xl font-serif font-bold text-white tracking-widest uppercase">Event-Master</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 Event-Master Platforma. Barcha huquqlar himoyalangan.</p>
          <div className="flex gap-8 text-gray-400 text-sm">
             <a href="#" className="hover:text-gold transition-colors">Telegram</a>
             <a href="#" className="hover:text-gold transition-colors">Instagram</a>
             <a href="#" className="hover:text-gold transition-colors">Facebook</a>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {selectedHall && (
        <BookingModal 
          hall={selectedHall} 
          isOpen={!!selectedHall} 
          onClose={() => setSelectedHall(null)} 
        />
      )}
    </div>
  );
}
