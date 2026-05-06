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
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
      id={`hall-card-${hall.id}`}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={hall.image_url}
          alt={hall.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-gold border border-gold/20">
          Premium
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-serif text-dark mb-2">{hall.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{hall.description}</p>
        
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="space-y-1">
            <div className="flex items-center text-sm text-gray-600">
              <Users size={16} className="mr-2 text-gold" />
              <span>{hall.capacity} kishilik</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CreditCard size={16} className="mr-2 text-gold" />
              <span>{hall.price_per_day.toLocaleString()} so'm / kun</span>
            </div>
          </div>
          
          <button
            onClick={() => onSelect(hall)}
            id={`select-hall-${hall.id}`}
            className="bg-gold text-white p-3 rounded-xl hover:bg-gold/90 transition-colors shadow-lg shadow-gold/20 flex items-center"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
