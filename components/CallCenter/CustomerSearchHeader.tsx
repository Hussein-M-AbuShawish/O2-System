import React, { useState } from 'react';
import { useApp } from '../../store';
import { Search, X } from 'lucide-react';

export const CustomerSearchHeader: React.FC = () => {
  const { searchCustomerByPhone, setSelectedCallCenterCustomer } = useApp();
  const [phoneInput, setPhoneInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;
    
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      const customer = searchCustomerByPhone(phoneInput);
      if (customer) {
        setSelectedCallCenterCustomer(customer);
      } else {
        alert('لم يتم العثور على عميل برقم هاتف: ' + phoneInput);
      }
      setIsSearching(false);
    }, 300);
  };

  const handleClear = () => {
    setPhoneInput('');
    setSelectedCallCenterCustomer(null);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-teal-500/30 px-6 py-4">
      <form onSubmit={handleSearch} className="flex gap-3 items-center">
        <div className="flex-1 relative">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="tel"
            placeholder="ابحث برقم الهاتف..."
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-4 pr-12 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30"
            disabled={isSearching}
          />
          {phoneInput && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isSearching || !phoneInput.trim()}
          className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Search className="w-5 h-5" />
          {isSearching ? 'جاري البحث...' : 'بحث'}
        </button>
      </form>
    </div>
  );
};
