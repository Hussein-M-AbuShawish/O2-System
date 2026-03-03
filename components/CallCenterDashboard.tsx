import React, { useState } from 'react';
import { useApp } from '../store';
import { Order, OrderType, OrderStatus } from '../types';
import { CustomerSearchHeader } from './CallCenter/CustomerSearchHeader';
import { CustomerProfileCard } from './CallCenter/CustomerProfileCard';
import { OrderLifecycleStepper } from './CallCenter/OrderLifecycleStepper';
import { OrderManagementPanel } from './CallCenter/OrderManagementPanel';
import { ComplaintsPanel } from './CallCenter/ComplaintsPanel';
import { AnalyticsDashboard } from './CallCenter/AnalyticsDashboard';
import { PhoneOff, BarChart3, AlertCircle, Plus, Edit } from 'lucide-react';

export const CallCenterDashboard: React.FC = () => {
  const { selectedCallCenterCustomer, setSelectedCallCenterCustomer, getCustomerOrderHistory, reorder, currentCart } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'complaints' | 'new_order'>('overview');
  const [newOrder, setNewOrder] = useState<Order | null>(null);

  const orderHistory = selectedCallCenterCustomer ? getCustomerOrderHistory(selectedCallCenterCustomer.id) : [];
  const lastOrder = orderHistory.length > 0 ? orderHistory[0] : null;

  const handleReorder = (customer: any) => {
    if (lastOrder) {
      reorder(lastOrder.id);
    }
  };

  const handleCreateNewOrder = () => {
    if (!selectedCallCenterCustomer) return;
    const newOrderObj: Order = {
      id: 'o_' + Math.random().toString(36).substr(2, 9),
      orderNumber: 'ORD-' + Math.floor(Math.random() * 10000),
      type: OrderType.DELIVERY,
      status: OrderStatus.PENDING,
      items: currentCart.length > 0 ? currentCart : [],
      customerId: selectedCallCenterCustomer.id,
      customerName: selectedCallCenterCustomer.name,
      customerPhone: selectedCallCenterCustomer.phone,
      createdAt: new Date(),
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
      timeline: [{ status: OrderStatus.PENDING, time: new Date() }]
    };
    setNewOrder(newOrderObj);
    setActiveTab('new_order');
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Search Header */}
      <CustomerSearchHeader />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          {!selectedCallCenterCustomer ? (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-teal-500/20 rounded-2xl p-12 text-center space-y-4 min-h-96 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto">
                <PhoneOff className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-3xl font-black text-white">مرحباً بك في مركز الاتصالات</h2>
              <p className="text-slate-400 text-lg max-w-md">
                ابدأ بالبحث عن رقم هاتف العميل في شريط البحث أعلاه لعرض بيانات العميل والطلبات السابقة والشكاوى.
              </p>
              <div className="mt-4 space-y-2 text-sm text-slate-400">
                <p>⚡ معرفة فورية للعميل برقم الهاتف</p>
                <p>📋 عرض سجل الطلبات والتفضيلات</p>
                <p>📞 إدارة الشكاوى والملاحظات</p>
                <p>📊 تحليل الأداء اليومي</p>
              </div>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex gap-2 border-b border-slate-700 sticky top-0 bg-gradient-to-b from-slate-900 via-slate-800 to-transparent pt-4 -mx-6 px-6 pb-4 items-center justify-between flex-wrap">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 font-bold rounded-t-lg transition-all ${
                      activeTab === 'overview'
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    نظرة عامة
                  </button>
                  <button
                    onClick={() => setActiveTab('new_order')}
                    className={`px-4 py-2 font-bold rounded-t-lg transition-all flex items-center gap-2 ${
                      activeTab === 'new_order'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    طلب جديد
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-4 py-2 font-bold rounded-t-lg transition-all flex items-center gap-2 ${
                      activeTab === 'analytics'
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    التحليلات
                  </button>
                  <button
                    onClick={() => setActiveTab('complaints')}
                    className={`px-4 py-2 font-bold rounded-t-lg transition-all flex items-center gap-2 ${
                      activeTab === 'complaints'
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4" />
                    الشكاوى
                  </button>
                </div>
                {activeTab === 'overview' && lastOrder && (
                  <button
                    onClick={handleCreateNewOrder}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    طلب جديد
                  </button>
                )}
              </div>

              {/* Tab Content */}
              {activeTab === 'new_order' && newOrder && (
                <OrderManagementPanel order={newOrder} />
              )}

              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Customer Profile - Left Sidebar */}
                  <div className="lg:col-span-1">
                    <CustomerProfileCard
                      customer={selectedCallCenterCustomer}
                      onReorder={handleReorder}
                      onClose={() => setSelectedCallCenterCustomer(null)}
                    />
                  </div>

                  {/* Order Tracking - Right Content */}
                  <div className="lg:col-span-2 space-y-4">
                    {lastOrder ? (
                      <OrderLifecycleStepper order={lastOrder} />
                    ) : (
                      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 text-center">
                        <p className="text-slate-400">لا توجد طلبات نشطة لهذا العميل</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <AnalyticsDashboard />
              )}

              {activeTab === 'complaints' && (
                <ComplaintsPanel />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
