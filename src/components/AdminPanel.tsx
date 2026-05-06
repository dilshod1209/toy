import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { api, MenuItem } from '../services/api';
import { CheckCircle, XCircle, ChevronLeft, LogOut, LayoutDashboard, Utensils, Plus, Trash2, Edit2, Save, X } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'bookings' | 'menu'>('bookings');
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  
  // Menu Item Form State
  const [isEditingMenu, setIsEditingMenu] = useState<number | null>(null);
  const [menuForm, setMenuForm] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    price_per_person: 0,
    category: 'Main'
  });

  useEffect(() => {
    loadBookings();
    loadMenuItems();
  }, []);

  const loadBookings = async () => {
    const data = await api.getAdminBookings();
    setBookings(data);
  };

  const loadMenuItems = async () => {
    const data = await api.getMenuItems();
    setMenuItems(data);
  };

  const setStatus = async (id: number, status: string) => {
    await api.updateBookingStatus(id, status);
    loadBookings();
  };

  const handleSaveMenu = async () => {
    if (!menuForm.name || menuForm.price_per_person <= 0) return;
    
    if (isEditingMenu !== null) {
      await api.updateMenuItem(isEditingMenu, menuForm);
    } else {
      await api.createMenuItem(menuForm);
    }
    
    setMenuForm({ name: '', price_per_person: 0, category: 'Main' });
    setIsEditingMenu(null);
    loadMenuItems();
  };

  const handleDeleteMenu = async (id: number) => {
    if (confirm('Ushbu taomni oʻchirib tashlamoqchimisiz?')) {
      await api.deleteMenuItem(id);
      loadMenuItems();
    }
  };

  const startEdit = (item: MenuItem) => {
    setIsEditingMenu(item.id);
    setMenuForm({
      name: item.name,
      price_per_person: item.price_per_person,
      category: item.category
    });
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
        <div className="flex gap-4 mb-8">
           <button 
            onClick={() => setActiveTab('bookings')}
            className={`px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'bookings' ? 'bg-dark text-white shadow-lg shadow-dark/20' : 'bg-white text-gray-500 hover:bg-gray-100'
            }`}
           >
             <LayoutDashboard size={20} /> Buyurtmalar
           </button>
           <button 
            onClick={() => setActiveTab('menu')}
            className={`px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${
              activeTab === 'menu' ? 'bg-dark text-white shadow-lg shadow-dark/20' : 'bg-white text-gray-500 hover:bg-gray-100'
            }`}
           >
             <Utensils size={20} /> Menyular
           </button>
        </div>

        {activeTab === 'bookings' ? (
          <>
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
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-32">
                   <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                     {isEditingMenu !== null ? <Edit2 size={20} className="text-gold" /> : <Plus size={20} className="text-gold" />}
                     {isEditingMenu !== null ? 'Taomni tahrirlash' : 'Yangi taom qo\'shish'}
                   </h3>
                   
                   <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Taom nomi</label>
                        <input 
                          type="text" 
                          value={menuForm.name}
                          onChange={(e) => setMenuForm({...menuForm, name: e.target.value})}
                          placeholder="Masalan: To'y oshi"
                          className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:border-gold outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Bir kishi uchun narxi (so'm)</label>
                        <input 
                          type="number" 
                          value={menuForm.price_per_person || ''}
                          onChange={(e) => setMenuForm({...menuForm, price_per_person: Number(e.target.value)})}
                          placeholder="0"
                          className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:border-gold outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Kategoriya</label>
                        <select 
                          value={menuForm.category}
                          onChange={(e) => setMenuForm({...menuForm, category: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:border-gold outline-none transition-all appearance-none"
                        >
                           <option value="Main">Asosiy taom</option>
                           <option value="Salad">Salat</option>
                           <option value="Drink">Ichimlik</option>
                           <option value="Dessert">Desert</option>
                        </select>
                      </div>

                      <div className="flex gap-3 pt-4">
                        {isEditingMenu !== null && (
                          <button 
                            onClick={() => { setIsEditingMenu(null); setMenuForm({ name: '', price_per_person: 0, category: 'Main' }); }}
                            className="flex-1 bg-gray-100 py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                          >
                             <X size={20} /> Bekor qilish
                          </button>
                        )}
                        <button 
                          onClick={handleSaveMenu}
                          disabled={!menuForm.name || menuForm.price_per_person <= 0}
                          className="flex-[2] bg-gold text-white py-4 rounded-2xl font-bold shadow-lg shadow-gold/20 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                           <Save size={20} /> {isEditingMenu !== null ? 'Saqlash' : 'Qo\'shish'}
                        </button>
                      </div>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="p-8 border-b border-gray-50">
                    <h3 className="text-xl font-serif font-bold">Mavjud taomlar</h3>
                  </div>
                  <div className="p-8">
                    <div className="space-y-4">
                      {menuItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold font-bold">
                               {item.name.charAt(0)}
                             </div>
                             <div>
                               <p className="font-bold text-dark">{item.name}</p>
                               <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{item.category}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-6">
                             <p className="font-serif font-bold text-gold">{item.price_per_person.toLocaleString()} so'm</p>
                             <div className="flex gap-2">
                                <button 
                                  onClick={() => startEdit(item)}
                                  className="p-2 text-dark hover:bg-white rounded-lg transition-all"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteMenu(item.id)}
                                  className="p-2 text-red-500 hover:bg-white rounded-lg transition-all"
                                >
                                  <Trash2 size={18} />
                                </button>
                             </div>
                          </div>
                        </div>
                      ))}
                      {menuItems.length === 0 && (
                        <div className="py-20 text-center">
                           <p className="text-gray-300 italic font-serif text-xl">Menyu hali bo'sh</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
