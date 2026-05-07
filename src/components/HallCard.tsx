import { Hall } from '../services/api';
import { motion } from 'motion/react';
import { Users, CreditCard, ChevronRight } from 'lucide-react';

interface HallCardProps {
  key?: number | string;
  hall: Hall;
  onSelect: (hall: Hall) => void;
}

export default function HallCard({ hall, onSelect }: HallCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 group flex flex-col justify-between h-full"
      id={`hall-card-${hall.id}`}
    >
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold font-serif font-bold text-2xl">
            {hall.name.charAt(0)}
          </div>
          <div className="bg-gold/5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-gold border border-gold/10">
            Premium Tanlov
          </div>
        </div>
        
        <h3 className="text-3xl font-serif text-dark mb-4 group-hover:text-gold transition-colors duration-300 leading-tight">{hall.name}</h3>
        
        <div className="flex gap-2 mb-6 flex-wrap">
          <span className="bg-gray-50 text-gray-500 px-3 py-1 rounded-lg text-xs font-bold border border-gray-100 uppercase tracking-tighter">LUKS</span>
          <span className="bg-gray-50 text-gray-500 px-3 py-1 rounded-lg text-xs font-bold border border-gray-100 uppercase tracking-tighter">ZAMONAVIY</span>
          <span className="bg-gray-50 text-gray-500 px-3 py-1 rounded-lg text-xs font-bold border border-gray-100 uppercase tracking-tighter">OVOZ TIZIMI</span>
        </div>

        <p className="text-gray-500 text-lg font-light leading-relaxed mb-8 line-clamp-4 italic border-l-2 border-gold/20 pl-4 py-1">
          "{hall.description}"
        </p>
      </div>
      
      <div className="pt-8 border-t border-gray-50">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-3">
            <div className="flex items-center text-sm font-semibold text-gray-600">
              <div className="w-8 h-8 rounded-full bg-gold/5 flex items-center justify-center mr-3">
                <Users size={14} className="text-gold" />
              </div>
              <span className="tracking-tight">{hall.capacity.toLocaleString()} nafar mehmonga mo'ljallangan</span>
            </div>
            <div className="flex items-center text-sm font-semibold text-gray-600">
              <div className="w-8 h-8 rounded-full bg-gold/5 flex items-center justify-center mr-3">
                <CreditCard size={14} className="text-gold" />
              </div>
              <span className="tracking-tight">{hall.price_per_day.toLocaleString()} so'm dan boshlanadi</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onSelect(hall)}
          id={`select-hall-${hall.id}`}
          className="w-full bg-dark text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-gold transition-all duration-300 shadow-xl shadow-dark/10 flex items-center justify-center gap-3 group/btn"
        >
          Bron qilish <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
