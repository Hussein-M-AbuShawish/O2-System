import React from 'react';
import { User } from '../../types';
import { useApp } from '../../store';
import { Phone, Trophy, ShoppingHistory, Zap, X, RotateCcw } from 'lucide-react';

interface CustomerProfileCardProps {
  customer: User;
  onReorder?: (customer: User) => void;
  onClose?: () => void;
}

export const CustomerProfileCard: React.FC<CustomerProfileCardProps> = ({ customer, onReorder, onClose }) => {
  const { getCustomerOrderHistory } = useApp();
  const orderHistory = getCustomerOrderHistory(customer.id);
  
  const getTierBadgeColor = (tier: string) => {
    switch(tier) {
      case 'PLATINUM': return 'bg-purple-600 text-white';
      case 'GOLD': return 'bg-amber-500 text-white';
      case 'SILVER': return 'bg-slate-400 text-white';
      default: return 'bg-slate-600 text-white';
    }
  };

  const getTierIcon = (tier: string) => {
    switch(tier) {
      case 'PLATINUM': return '👑';
      case 'GOLD': return '⭐';
      case 'SILVER': return '✦';
      default: return '○';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-teal-500/20 rounded-2xl p-6 space-y-5">
      {/* Header with Close Button */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-2xl font-black text-white mb-1">{customer.name}</h3>
          <div className="flex items-center gap-2 text-slate-300">
            <Phone className="w-4 h-4" />
            <span className="font-medium">{customer.phone}</span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Tier Badge */}
      <div className={`inline-block px-4 py-2 rounded-full font-bold text-sm ${getTierBadgeColor(customer.tier)}`}>
        {getTierIcon(customer.tier)} {customer.tier} - {customer.points} نقطة
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <div className="text-slate-400 text-xs font-medium mb-1">الطلبات</div>
          <div className="text-2xl font-black text-teal-400">{orderHistory.length}</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <div className="text-slate-400 text-xs font-medium mb-1">الرصيد</div>
          <div className="text-2xl font-black text-amber-400">${customer.balance.toFixed(2)}</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <div className="text-slate-400 text-xs font-medium mb-1">المفضلة</div>
          <div className="text-2xl font-black text-pink-400">{customer.favorites.length}</div>
        </div>
      </div>

      {/* Personality Tags */}
      {customer.personalityTags && customer.personalityTags.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs uppercase text-slate-400 font-bold">الخصائص</label>
          <div className="flex flex-wrap gap-2">
            {customer.personalityTags.map((tag, idx) => (
              <span key={idx} className="bg-teal-500/20 text-teal-300 text-xs font-semibold px-3 py-1 rounded-full border border-teal-500/30">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Last Delivery Driver */}
      {customer.lastDeliveryDriver && (
        <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-3">
          <div className="text-xs uppercase text-slate-400 font-bold mb-1">آخر سائق تسليم</div>
          <div className="text-white font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            {customer.lastDeliveryDriver}
          </div>
        </div>
      )}

      {/* Frequently Ordered Items */}
      {customer.frequentItems && customer.frequentItems.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs uppercase text-slate-400 font-bold flex items-center gap-2">
            <ShoppingHistory className="w-4 h-4" />
            المعتاد
          </label>
          <button
            onClick={() => onReorder && onReorder(customer)}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            اطلب المعتاد
          </button>
        </div>
      )}

      {/* Recent Orders */}
      {orderHistory.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs uppercase text-slate-400 font-bold">آخر طلبات</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {orderHistory.slice(0, 3).map((order) => (
              <div key={order.id} className="bg-slate-700/40 rounded p-2 text-xs">
                <div className="text-slate-300 font-semibold">#{order.orderNumber}</div>
                <div className="text-slate-400">${order.total.toFixed(2)} • {new Date(order.createdAt).toLocaleDateString('ar-EG')}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
