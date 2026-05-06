import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { api, Hall } from './services/api';
import HallCard from './components/HallCard';
import BookingModal from './components/BookingModal';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import { Search, Calendar, Star, MapPin, ArrowRight } from 'lucide-react';

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
            <a href="#" className="opacity-60 cursor-not-allowed">Menyu</a>
            <a href="#" className="opacity-60 cursor-not-allowed">Biz haqimizda</a>
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
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=2000" 
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
              Biz faqatgina eng hashamatli va zamonaviy to'yxanalarni saralab oldik. 
              Onlayn band qilish va menyu hisob-kitobi bilan vaqtingizni tejang.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a 
                href="#halls" 
                className="bg-gold text-white px-10 py-5 rounded-2xl font-bold hover:bg-white hover:text-dark transition-all shadow-xl shadow-gold/20 flex items-center gap-3 group"
              >
                Zallarni ko'rish <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <button className="bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-bold hover:bg-white hover:text-dark transition-all">
                Aloqa
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hall Listing */}
      <main id="halls" className="bg-white py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-5xl font-serif text-dark mb-6">Saralangan To'yxanalar</h2>
              <div className="w-20 h-1 bg-gold mb-6"></div>
              <p className="text-gray-500 text-lg font-light">Bizning tanlovimizdan eng yaxshi xizmat ko'rsatish va shinamlikni topishingiz mumkin.</p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-3 border border-gray-100 rounded-xl bg-gray-50 text-dark font-medium hover:bg-gold hover:text-white transition-all">Barchasi</button>
              <button className="px-6 py-3 border border-gray-100 rounded-xl bg-gray-50 text-dark font-medium hover:bg-gold hover:text-white transition-all">Katta zallar</button>
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
