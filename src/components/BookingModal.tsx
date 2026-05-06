import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, Check, ChevronRight, ChevronLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { format, addDays, startOfToday, isSameDay, isBefore } from 'date-fns';
import { Hall, MenuItem, api } from '../services/api';

interface BookingModalProps {
  hall: Hall;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ hall, isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedMenuItems, setSelectedMenuItems] = useState<{[key: number]: number}>({});
  const [guestCount, setGuestCount] = useState(100);
  const [customer_name, setCustomerName] = useState('');
  const [customer_address, setCustomerAddress] = useState('');
  const [customer_phone, setCustomerPhone] = useState('');

  useEffect(() => {
    if (isOpen) {
      api.getMenuItems().then(setMenuItems);
    }
  }, [isOpen]);

  const checkDate = async (date: Date) => {
    setSelectedDate(date);
    const available = await api.checkAvailability(hall.id, format(date, 'yyyy-MM-dd'));
    setIsAvailable(available);
  };

  const toggleMenuItem = (itemId: number) => {
    setSelectedMenuItems(prev => ({
      ...prev,
      [itemId]: prev[itemId] ? 0 : 1
    }));
  };

  const totalMenuPrice = Object.entries(selectedMenuItems).reduce((total, [id, qty]) => {
    if (qty === 0) return total;
    const item = menuItems.find(mi => mi.id === Number(id));
    return total + (item ? item.price_per_person * guestCount : 0);
  }, 0);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBooking = async () => {
    if (!selectedDate || !customer_name || !customer_phone) return;
    setIsSubmitting(true);
    try {
      const result = await api.createBooking({
        hall_id: hall.id,
        user_id: 1, // Mock user for demo
        booking_date: format(selectedDate, 'yyyy-MM-dd'),
        menu_items: Object.keys(selectedMenuItems).filter(id => selectedMenuItems[Number(id)] > 0).map(Number),
        guest_count: guestCount,
        customer_name,
        customer_address,
        customer_phone
      });
      if (result.success) {
        setIsSuccess(true);
      } else {
        alert("Xatolik yuz berdi: " + result.error);
      }
    } catch (error) {
      alert("Xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          layoutId={`modal-${hall.id}`}
          className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row max-h-[90vh]"
        >
          {isSuccess ? (
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="w-full py-12 flex flex-col items-center justify-center text-center p-8 bg-white"
             >
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8 shadow-inner shadow-green-100">
                  <Check size={48} strokeWidth={3} />
                </div>
                <h3 className="text-4xl font-serif mb-4">Muvaffaqiyatli!</h3>
                <p className="text-gray-500 text-lg mb-8 max-w-md leading-relaxed">
                  Rahmat, <strong>{customer_name}</strong>! Sizning buyurtmangiz qabul qilindi va admin paneliga yuborildi. 
                  Tez orada operatorimiz <strong>{customer_phone}</strong> raqami orqali siz bilan bog'lanadi.
                </p>
                <div className="bg-gray-50 rounded-3xl p-8 mb-8 text-left border border-gray-100 w-full max-w-md">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">Buyurtma tafsilotlari:</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Zal:</span>
                      <span className="font-bold text-dark">{hall.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sana:</span>
                      <span className="font-bold text-dark">{selectedDate ? format(selectedDate, 'dd MMMM, yyyy') : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mehmonlar:</span>
                      <span className="font-bold text-dark">{guestCount} kishi</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-400">Holat:</span>
                      <span className="text-gold font-black uppercase tracking-tighter">Band qilindi (Kutilmoqda)</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => { onClose(); setIsSuccess(false); setStep(1); }} 
                  className="w-full max-w-md bg-dark text-white py-5 rounded-2xl font-bold hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-dark/20"
                >
                  Tushunarli, yopish
                </button>
             </motion.div>
          ) : (
            <>
              {/* Side Info */}
              <div className="w-full md:w-1/3 bg-dark p-8 text-white flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-serif mb-4">{hall.name}</h2>
                  <div className="space-y-4 text-gray-400 text-sm">
                    <div className={`flex items-center transition-colors ${step === 1 ? 'text-white' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${step === 1 ? 'bg-gold text-white' : 'bg-gold/20 text-gold'}`}>1</div>
                      <span>Sana tanlang</span>
                    </div>
                    <div className={`flex items-center transition-colors ${step === 2 ? 'text-white' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${step === 2 ? 'bg-gold text-white' : 'bg-gold/20 text-gold'}`}>2</div>
                      <span>Menyu konstruktori</span>
                    </div>
                    <div className={`flex items-center transition-colors ${step === 3 ? 'text-white' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${step === 3 ? 'bg-gold text-white' : 'bg-gold/20 text-gold'}`}>3</div>
                      <span>Mijoz ma'lumotlari</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="text-xs uppercase tracking-widest text-gold mb-4">Hisob-kitob</div>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Zal ijarasi:</span>
                      <span>{hall.price_per_day.toLocaleString()} so'm</span>
                    </div>
                    {totalMenuPrice > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Menyu ({guestCount} kishi):</span>
                        <span>{totalMenuPrice.toLocaleString()} so'm</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between font-bold text-2xl text-white border-t border-white/10 pt-4">
                    <span>Jami:</span>
                    <span className="text-gold">{(hall.price_per_day + totalMenuPrice).toLocaleString()} so'm</span>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-8 overflow-y-auto bg-gray-50/30">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-20">
                  <X size={24} />
                </button>

            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-2xl font-serif mb-6 flex items-center">
                  <CalendarIcon className="mr-3 text-gold" /> Band qilish sanasini belgilang
                </h3>
                <div className="grid grid-cols-7 gap-2 mb-8">
                  {Array.from({ length: 14 }).map((_, i) => {
                    const date = addDays(startOfToday(), i);
                    const isSelected = selectedDate && isSameDay(date, selectedDate);
                    return (
                      <button
                        key={i}
                        onClick={() => checkDate(date)}
                        className={`p-3 rounded-xl flex flex-col items-center transition-all ${
                          isSelected ? 'bg-gold text-white shadow-lg scale-105' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        <span className="text-xs uppercase font-medium">{format(date, 'EEE')}</span>
                        <span className="text-lg font-bold">{format(date, 'd')}</span>
                      </button>
                    );
                  })}
                </div>
                
                {isAvailable === true && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center mb-6">
                    <Check className="mr-3" /> Ushbu sana bo'sh! Keyingi qadamga o'tishingiz mumkin.
                  </div>
                )}
                {isAvailable === false && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center mb-6 text-sm">
                    Kechirasiz, ushbu sana band qilingan. Iltimos, boshqa sana tanlang.
                  </div>
                )}

                <button
                  disabled={!isAvailable}
                  onClick={() => setStep(2)}
                  className="w-full bg-gold text-white py-4 rounded-2xl font-semibold shadow-lg shadow-gold/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  id="next-step-button"
                >
                  Davom etish <ChevronRight size={20} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-2xl font-serif flex items-center">
                    <ShoppingCart className="mr-3 text-gold" /> Menyu konstruktori
                  </h3>
                   <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                    <button onClick={() => setGuestCount(Math.max(10, guestCount - 10))} className="p-1 hover:bg-white rounded shadow-sm"><Minus size={16} /></button>
                    <span className="font-bold min-w-[80px] text-center">{guestCount} kishi</span>
                    <button onClick={() => setGuestCount(guestCount + 10)} className="p-1 hover:bg-white rounded shadow-sm"><Plus size={16} /></button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 mb-8">
                  {menuItems.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => toggleMenuItem(item.id)}
                      className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedMenuItems[item.id] ? 'border-gold bg-gold/5 ring-1 ring-gold' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gold">{item.price_per_person.toLocaleString()} so'm</div>
                        <div className="text-xs text-gray-400">bir kishi uchun</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 bg-gray-100 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"><ChevronLeft size={20} /> Orqaga</button>
                  <button onClick={() => setStep(3)} className="flex-[2] bg-gold text-white py-4 rounded-2xl font-semibold shadow-lg shadow-gold/20 flex items-center justify-center gap-2">Davom etish <ChevronRight size={20} /></button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-2xl font-serif mb-6 flex items-center">
                  <Check size={24} className="mr-3 text-gold" /> Aloqa ma'lumotlari
                </h3>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest">To‘liq ism sharifingiz</label>
                    <input 
                      type="text" 
                      value={customer_name}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Masalan: Alisher Valiyev"
                      className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:border-gold outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest">Telefon raqamingiz</label>
                    <input 
                      type="tel" 
                      value={customer_phone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:border-gold outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest">Manzilingiz</label>
                    <input 
                      type="text" 
                      value={customer_address}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Shahar, tuman, ko‘cha..."
                      className="w-full bg-white border border-gray-200 p-4 rounded-2xl focus:border-gold outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="flex-1 bg-gray-100 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"><ChevronLeft size={20} /> Orqaga</button>
                  <button 
                    onClick={handleBooking} 
                    disabled={!customer_name || !customer_phone || isSubmitting}
                    className="flex-[2] bg-gold text-white py-5 rounded-2xl font-bold shadow-xl shadow-gold/30 flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-gold/90 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <motion.div 
                          animate={{ rotate: 360 }} 
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Yuborilmoqda...
                      </span>
                    ) : (
                      <>
                        Band qilishni yakunlash <Check size={24} strokeWidth={3} />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </>
      )}
    </motion.div>
  </div>
</AnimatePresence>
  );
}
