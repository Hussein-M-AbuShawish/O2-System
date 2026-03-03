import React, { useState } from 'react';
import { Order, OrderItem, MenuItem, SavedAddress } from '../../types';
import { useApp } from '../../store';
import { SweetsPricingCalculator } from './SweetsPricingCalculator';
import { Plus, Trash2, DollarSign, MapPin, ShoppingCart } from 'lucide-react';

interface OrderManagementPanelProps {
  order: Order;
  onUpdateOrder?: (order: Order) => void;
}

const SAMPLE_MENU_ITEMS: MenuItem[] = [
  { id: '1', name: 'كيك العسل', nameAr: 'كيك العسل', price: 8.99, category: 'حلويات', image: '' },
  { id: '2', name: 'البقلاوة', nameAr: 'البقلاوة', price: 12.99, category: 'حلويات', image: '' },
  { id: '3', name: 'الكنافة', nameAr: 'الكنافة', price: 15.99, category: 'حلويات', image: '' },
  { id: '4', name: 'الحلويات المختلطة', nameAr: 'الحلويات المختلطة', price: 18.99, category: 'حلويات', image: '' },
  { id: '5', name: 'برجر كلاسيكي', nameAr: 'برجر كلاسيكي', price: 9.99, category: 'وجبات', image: '' },
  { id: '6', name: 'شاورما دجاج', nameAr: 'شاورما دجاج', price: 7.99, category: 'وجبات', image: '' },
  { id: '7', name: 'فلافل', nameAr: 'فلافل', price: 4.99, category: 'وجبات', image: '' },
  { id: '8', name: 'عصير برتقال', nameAr: 'عصير برتقال', price: 3.99, category: 'مشروبات', image: '' },
];

export const OrderManagementPanel: React.FC<OrderManagementPanelProps> = ({ order, onUpdateOrder }) => {
  const { addToCart, updateCartItem, removeFromCart, currentUser } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('حلويات');
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(null);

  const categories = Array.from(new Set(SAMPLE_MENU_ITEMS.map(m => m.category)));
  const itemsInCategory = SAMPLE_MENU_ITEMS.filter(m => m.category === selectedCategory);

  const handleAddItem = (item: MenuItem) => {
    addToCart(item, { weight: item.category === 'حلويات' ? 1 : undefined });
  };

  const handleRemoveItem = (itemUniqueId: string) => {
    removeFromCart(itemUniqueId);
  };

  const handleUpdateItem = (itemUniqueId: string, updates: Partial<OrderItem>) => {
    updateCartItem(itemUniqueId, updates);
  };

  const calculateTotal = (): number => {
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const deliveryFee = selectedAddress?.deliveryFee || 0;
  const subtotal = calculateTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax + deliveryFee;

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-teal-500/20 rounded-2xl p-6 space-y-6 h-full flex flex-col">
      {/* Order Header */}
      <div className="border-b border-slate-700 pb-4">
        <h3 className="text-2xl font-black text-white mb-2">إدارة الطلب</h3>
        <p className="text-slate-400 text-sm">إضافة وتعديل العناصر والأسعار</p>
      </div>

      {/* Menu Categories */}
      <div className="space-y-3">
        <label className="text-xs uppercase text-slate-400 font-bold">فئات القائمة</label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="space-y-2">
        <label className="text-xs uppercase text-slate-400 font-bold">العناصر المتاحة</label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {itemsInCategory.map(item => (
            <button
              key={item.id}
              onClick={() => handleAddItem(item)}
              className="bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-teal-500 rounded-lg p-2 text-left transition-all group"
            >
              <p className="text-sm font-bold text-white group-hover:text-teal-400">{item.name}</p>
              <p className="text-xs text-slate-400">${item.price.toFixed(2)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Current Items in Order */}
      <div className="space-y-2 border-t border-slate-700 pt-4 flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase text-slate-400 font-bold flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            العناصر المضافة ({order.items.length})
          </label>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-64">
          {order.items.length === 0 ? (
            <p className="text-slate-400 text-center py-8">لم تضف أي عناصر بعد</p>
          ) : (
            order.items.map((item) => (
              <div key={item.uniqueId} className="bg-slate-700/40 rounded-lg border border-slate-600 p-3">
                {/* For sweets items, show the pricing calculator */}
                {item.name.includes('حلويات') || item.name.includes('كيك') || item.name.includes('بقلاوة') || item.name.includes('كنافة') ? (
                  <SweetsPricingCalculator
                    item={item}
                    onUpdate={(updated) => handleUpdateItem(item.uniqueId, updated)}
                    onRemove={() => handleRemoveItem(item.uniqueId)}
                  />
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white">{item.name}</h4>
                      <button
                        onClick={() => handleRemoveItem(item.uniqueId)}
                        className="text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <span>الكمية:</span>
                      <button
                        onClick={() =>
                          handleUpdateItem(item.uniqueId, {
                            quantity: Math.max(1, item.quantity - 1)
                          })
                        }
                        className="bg-slate-600 text-white px-2 py-1 rounded"
                      >
                        -
                      </button>
                      <span className="font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleUpdateItem(item.uniqueId, {
                            quantity: item.quantity + 1
                          })
                        }
                        className="bg-slate-600 text-white px-2 py-1 rounded"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">السعر:</span>
                      <span className="font-bold text-teal-400">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delivery Address Selector */}
      {currentUser?.addresses && currentUser.addresses.length > 0 && (
        <div className="space-y-2 border-t border-slate-700 pt-3">
          <label className="text-xs uppercase text-slate-400 font-bold flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            عنوان التسليم
          </label>
          <div className="space-y-1">
            {currentUser.addresses.map((addr) => (
              <button
                key={addr.id}
                onClick={() => setSelectedAddress(addr)}
                className={`w-full text-left p-2 rounded text-sm transition-all ${
                  selectedAddress?.id === addr.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <div className="font-semibold">{addr.type}</div>
                <div className="text-xs opacity-75">${addr.deliveryFee} رسم التوصيل</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-slate-700/40 rounded-lg p-3 border border-slate-600 space-y-2 text-sm">
        <div className="flex justify-between text-slate-300">
          <span>المجموع الفرعي:</span>
          <span className="font-bold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>الضريبة (10%):</span>
          <span className="font-bold text-yellow-400">${tax.toFixed(2)}</span>
        </div>
        {deliveryFee > 0 && (
          <div className="flex justify-between text-slate-300">
            <span>رسم التوصيل:</span>
            <span className="font-bold">${deliveryFee.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-slate-600 pt-2 text-base">
          <span className="text-white font-bold">الإجمالي:</span>
          <span className="text-teal-400 font-black text-lg">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-slate-700">
        <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          تأكيد الطلب
        </button>
      </div>
    </div>
  );
};
