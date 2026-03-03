import React, { useState } from 'react';
import { OrderItem } from '../../types';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface SweetsPricingCalculatorProps {
  item: OrderItem;
  onUpdate: (item: OrderItem) => void;
  onRemove?: () => void;
}

export const SweetsPricingCalculator: React.FC<SweetsPricingCalculatorProps> = ({
  item,
  onUpdate,
  onRemove
}) => {
  const [showOverrideReason, setShowOverrideReason] = useState(!!item.priceOverride);
  const [overrideReason, setOverrideReason] = useState(item.overrideReason || '');

  const weight = item.weight || 1;
  const basePrice = item.basePrice || item.price;
  const calculatedPrice = weight * basePrice;
  const finalPrice = item.priceOverride || calculatedPrice;
  const discount = calculatedPrice - finalPrice;

  const handleWeightChange = (newWeight: number) => {
    if (newWeight > 0) {
      const newPrice = newWeight * basePrice;
      onUpdate({
        ...item,
        weight: newWeight,
        price: item.priceOverride || newPrice
      });
    }
  };

  const handlePriceOverride = (newPrice: number) => {
    if (newPrice >= 0) {
      onUpdate({
        ...item,
        priceOverride: newPrice,
        price: newPrice,
        overrideReason: overrideReason || 'تخفيض'
      });
    }
  };

  const handleReasonChange = (reason: string) => {
    setOverrideReason(reason);
    if (item.priceOverride) {
      onUpdate({
        ...item,
        overrideReason: reason
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-teal-500/20 rounded-lg p-4 space-y-4">
      {/* Item Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="text-white font-bold">{item.name}</h4>
          <p className="text-slate-400 text-sm">السعر الأساسي: ${basePrice.toFixed(2)}/كغ</p>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-slate-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Weight Control */}
      <div className="space-y-2">
        <label className="text-xs uppercase text-slate-400 font-bold">الوزن (كغ)</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleWeightChange(Math.max(0.1, weight - 0.25))}
            className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={weight.toFixed(3)}
            onChange={(e) => handleWeightChange(parseFloat(e.target.value))}
            className="flex-1 bg-slate-700 border border-slate-600 rounded text-white text-center py-2 px-3 focus:outline-none focus:border-teal-500"
          />
          <button
            onClick={() => handleWeightChange(weight + 0.25)}
            className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Price Calculation */}
      <div className="bg-slate-700/40 rounded p-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">المبلغ المحسوب:</span>
          <span className="text-white font-semibold">${calculatedPrice.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">التخفيض:</span>
            <span className="text-red-400 font-semibold">-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-base border-t border-slate-600 pt-2">
          <span className="text-slate-300 font-bold">السعر النهائي:</span>
          <span className="text-teal-400 font-bold text-lg">${finalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Price Override Option */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showOverrideReason}
            onChange={(e) => {
              setShowOverrideReason(e.target.checked);
              if (!e.target.checked) {
                handlePriceOverride(calculatedPrice);
              }
            }}
            className="w-4 h-4"
          />
          <span className="text-sm text-slate-300 font-medium">تطبيق تخفيض</span>
        </label>

        {showOverrideReason && (
          <div className="space-y-2">
            <input
              type="number"
              step="0.1"
              min="0"
              value={finalPrice.toFixed(2)}
              onChange={(e) => handlePriceOverride(parseFloat(e.target.value))}
              className="w-full bg-slate-700 border border-slate-600 rounded text-white py-2 px-3 focus:outline-none focus:border-amber-500"
              placeholder="السعر الجديد"
            />
            <input
              type="text"
              value={overrideReason}
              onChange={(e) => handleReasonChange(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded text-white py-2 px-3 focus:outline-none focus:border-amber-500"
              placeholder="سبب التخفيض (مثال: عرض خاص، تعويض)"
            />
          </div>
        )}
      </div>

      {/* Quantity Control */}
      <div className="space-y-2">
        <label className="text-xs uppercase text-slate-400 font-bold">الكمية</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdate({ ...item, quantity: Math.max(1, item.quantity - 1) })}
            className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="flex-1 bg-slate-700 text-white text-center py-2 px-3 font-semibold rounded">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdate({ ...item, quantity: item.quantity + 1 })}
            className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
