import React, { useMemo } from 'react';
import { useApp } from '../../store';
import { TrendingUp, Clock, Star, Package } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { activeOrders, feedbacks, currentUser } = useApp();

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = activeOrders.filter(o => {
      const orderDate = new Date(o.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    const completedOrders = todayOrders.filter(o => o.status === 'DELIVERED');
    const totalRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

    // Calculate average completion time
    const avgCompletionTime = completedOrders.length > 0
      ? completedOrders.reduce((sum, o) => {
          if (o.timeline.length > 1) {
            const start = new Date(o.timeline[0].time);
            const end = new Date(o.timeline[o.timeline.length - 1].time);
            return sum + (end.getTime() - start.getTime()) / 60000;
          }
          return sum;
        }, 0) / completedOrders.length
      : 0;

    // Top items by frequency
    const itemFrequency: Record<string, number> = {};
    todayOrders.forEach(order => {
      order.items.forEach(item => {
        itemFrequency[item.name] = (itemFrequency[item.name] || 0) + item.quantity;
      });
    });

    const topItems = Object.entries(itemFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // Complaint stats
    const todayComplaints = feedbacks.filter(f => {
      const complaintDate = new Date(f.timestamp);
      complaintDate.setHours(0, 0, 0, 0);
      return complaintDate.getTime() === today.getTime() && f.type === 'COMPLAINT';
    });

    const avgRating = feedbacks.length > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
      : 0;

    return {
      todayOrdersCount: todayOrders.length,
      completedOrdersCount: completedOrders.length,
      totalRevenue,
      avgCompletionTime: Math.round(avgCompletionTime),
      topItems,
      complaintCount: todayComplaints.length,
      avgRating
    };
  }, [activeOrders, feedbacks]);

  const performanceRating = useMemo(() => {
    if (stats.todayOrdersCount === 0) return 'N/A';
    const completionRate = (stats.completedOrdersCount / stats.todayOrdersCount) * 100;
    if (completionRate >= 90) return '⭐⭐⭐⭐⭐';
    if (completionRate >= 75) return '⭐⭐⭐⭐';
    if (completionRate >= 60) return '⭐⭐⭐';
    return '⭐⭐';
  }, [stats]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Orders */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-teal-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-slate-400 text-sm font-bold uppercase">طلبات اليوم</h4>
            <Package className="w-5 h-5 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-teal-400">{stats.todayOrdersCount}</div>
          <div className="text-xs text-slate-400 mt-1">{stats.completedOrdersCount} اكتملت</div>
        </div>

        {/* Revenue */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-slate-400 text-sm font-bold uppercase">الإيرادات</h4>
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">${stats.totalRevenue.toFixed(2)}</div>
          <div className="text-xs text-slate-400 mt-1">إجمالي اليوم</div>
        </div>

        {/* Avg Completion Time */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-slate-400 text-sm font-bold uppercase">متوسط الوقت</h4>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-blue-400">{stats.avgCompletionTime}</div>
          <div className="text-xs text-slate-400 mt-1">دقيقة</div>
        </div>

        {/* Rating */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-pink-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-slate-400 text-sm font-bold uppercase">التقييم</h4>
            <Star className="w-5 h-5 text-pink-400" />
          </div>
          <div className="text-3xl font-black text-pink-400">{stats.avgRating}</div>
          <div className="text-xs text-slate-400 mt-1">من العملاء</div>
        </div>
      </div>

      {/* Performance & Top Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Performance */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-teal-500/20 rounded-xl p-4">
          <h3 className="text-xl font-black text-white mb-4">أداء اليوم</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">نسبة الإنجاز</span>
              <span className="font-bold text-teal-400">
                {stats.todayOrdersCount > 0
                  ? Math.round((stats.completedOrdersCount / stats.todayOrdersCount) * 100)
                  : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-teal-400 h-full transition-all"
                style={{
                  width: `${stats.todayOrdersCount > 0 ? (stats.completedOrdersCount / stats.todayOrdersCount) * 100 : 0}%`
                }}
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">التقييم</span>
              <span className="text-amber-400 font-bold">{performanceRating}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">الشكاوى</span>
              <span className="text-red-400 font-bold">{stats.complaintCount}</span>
            </div>
          </div>
        </div>

        {/* Top Items */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/20 rounded-xl p-4">
          <h3 className="text-xl font-black text-white mb-4">أكثر العناصر طلباً</h3>
          {stats.topItems.length > 0 ? (
            <div className="space-y-3">
              {stats.topItems.map(([itemName, count], idx) => (
                <div key={itemName} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <span className="text-slate-300 truncate">{itemName}</span>
                  </div>
                  <span className="font-bold text-amber-400">{count}x</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-400 text-center py-8">لا توجد بيانات</div>
          )}
        </div>
      </div>

      {/* Agent Stats */}
      {currentUser && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/20 rounded-xl p-4">
          <h3 className="text-xl font-black text-white mb-4">إحصائيات الوكيل</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-700/40 rounded-lg p-3 text-center">
              <div className="text-slate-400 text-xs font-bold mb-1">الأداء</div>
              <div className="text-2xl font-black text-purple-400">⭐⭐⭐⭐</div>
            </div>
            <div className="bg-slate-700/40 rounded-lg p-3 text-center">
              <div className="text-slate-400 text-xs font-bold mb-1">معدل الرضا</div>
              <div className="text-2xl font-black text-pink-400">96%</div>
            </div>
            <div className="bg-slate-700/40 rounded-lg p-3 text-center">
              <div className="text-slate-400 text-xs font-bold mb-1">الطلبات المعالجة</div>
              <div className="text-2xl font-black text-cyan-400">{stats.todayOrdersCount}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
