import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { CheckCircle, XCircle, ChevronLeft, LogOut, LayoutDashboard } from 'lucide-react';

interface BookingRecord {
  id: number;
  hall_name: string;
  booking_date: string;
  status: string;
  total_price: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
}

interface AdminPanelProps {
    onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const data = await api.getAdminBookings();
    setBookings(data);
  };

  const setStatus = async (id: number, status: string) => {
    await api.updateBookingStatus(id, status);
    loadBookings();
  };

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto"
    >
      <div className="bg-white border-b border-gray-100 py-6 px-6 md:px-12 mb-10 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft size={24} className="text-gray-400" />
            </button>
            <div className="flex items-center gap-3">
               <div className="bg-gold/10 p-2 rounded-lg text-gold">
                  <LayoutDashboard size={24} />
               </div>
               <h1 className="text-2xl font-serif font-bold text-dark">Admin Dashboard</h1>
            </div>
          </div>
          
          <button 
            onClick={onClose} 
            className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors font-medium"
          >
            <LogOut size={20} /> Chiqish
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Jami Buyurtmalar</p>
            <p className="text-4xl font-serif font-bold">{bookings.length}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Kutilayotgan</p>
            <p className="text-4xl font-serif font-bold text-yellow-500">
               {bookings.filter(b => b.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Tasdiqlangan</p>
            <p className="text-4xl font-serif font-bold text-green-500">
               {bookings.filter(b => b.status === 'confirmed').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-serif font-bold">Oxirgi buyurtmalar</h3>
            <span className="text-xs bg-gray-100 text-gray-400 px-3 py-1 rounded-full font-bold">YANGILANGAN</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400">
                <tr>
                  <th className="px-8 py-5 text-xs uppercase tracking-widest font-bold">Mijoz</th>
                  <th className="px-8 py-5 text-xs uppercase tracking-widest font-bold">Tadbir Zali</th>
                  <th className="px-8 py-5 text-xs uppercase tracking-widest font-bold">Sana</th>
                  <th className="px-8 py-5 text-xs uppercase tracking-widest font-bold">Narxi</th>
                  <th className="px-8 py-5 text-xs uppercase tracking-widest font-bold">Holat</th>
                  <th className="px-8 py-5 text-xs uppercase tracking-widest font-bold">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-bold text-dark">{booking.customer_name}</div>
                      <div className="text-xs text-gray-400">{booking.customer_phone}</div>
                      <div className="text-[10px] text-gray-300 italic truncate max-w-[150px]">{booking.customer_address}</div>
                    </td>
                    <td className="px-8 py-6 font-medium text-gray-600 transition-colors">{booking.hall_name}</td>
                    <td className="px-8 py-6 text-gray-500">{booking.booking_date}</td>
                    <td className="px-8 py-6 font-bold text-dark">
                      {booking.total_price ? booking.total_price.toLocaleString() + " so'm" : "Hisoblanmagan"}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-widest font-black inline-block min-w-24 text-center ${
                        booking.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                        booking.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                        'bg-yellow-50 text-yellow-600'
                      }`}>
                        {booking.status === 'confirmed' ? 'Band qilindi' :
                         booking.status === 'cancelled' ? 'Bekor qilindi' : 'Kutilmoqda'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setStatus(booking.id, 'confirmed')}
                          className="w-10 h-10 flex items-center justify-center text-green-600 hover:bg-green-50 rounded-xl transition-all hover:scale-110 active:scale-95"
                          title="Tasdiqlash"
                        >
                          <CheckCircle size={22} />
                        </button>
                        <button 
                          onClick={() => setStatus(booking.id, 'cancelled')}
                          className="w-10 h-10 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-xl transition-all hover:scale-110 active:scale-95"
                          title="Bekor qilish"
                        >
                          <XCircle size={22} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                       <div className="max-w-xs mx-auto">
                          <p className="text-gray-300 font-serif italic text-xl mb-2">Hozircha bo'shliq...</p>
                          <p className="text-gray-400 text-sm">Sayt orqali yangi buyurtmalar kelishini kuting.</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
