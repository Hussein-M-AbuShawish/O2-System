import React, { useMemo } from 'react';
import { Order, OrderStatus } from '../../types';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface OrderLifecycleStepperProps {
  order: Order;
}

const CALL_CENTER_STAGES = [
  { status: OrderStatus.PENDING, label: 'معلق', icon: '⏳' },
  { status: OrderStatus.IN_PROGRESS, label: 'في المطبخ', icon: '👨‍🍳' },
  { status: OrderStatus.READY, label: 'فحص الجودة', icon: '✓' },
  { status: OrderStatus.ON_DELIVERY, label: 'مع السائق', icon: '🚗' },
  { status: OrderStatus.DELIVERED, label: 'تم التسليم', icon: '✓✓' }
];

export const OrderLifecycleStepper: React.FC<OrderLifecycleStepperProps> = ({ order }) => {
  const timeAnalysis = useMemo(() => {
    const timeline = order.timeline || [];
    const analysis: Record<string, { duration: number; startTime: Date; endTime: Date }> = {};

    CALL_CENTER_STAGES.forEach((stage, idx) => {
      const currentStageIdx = timeline.findIndex(t => t.status === stage.status);
      const nextStageIdx = timeline.findIndex(t => t.status === CALL_CENTER_STAGES[idx + 1]?.status);

      if (currentStageIdx !== -1) {
        const startTime = new Date(timeline[currentStageIdx].time);
        const endTime = nextStageIdx !== -1 ? new Date(timeline[nextStageIdx].time) : new Date();
        const durationMs = endTime.getTime() - startTime.getTime();
        const durationMins = Math.floor(durationMs / 60000);

        analysis[stage.status] = { duration: durationMins, startTime, endTime };
      }
    });

    return analysis;
  }, [order.timeline]);

  const getCurrentStageIdx = () => {
    return CALL_CENTER_STAGES.findIndex(s => s.status === order.status);
  };

  const currentIdx = getCurrentStageIdx();
  const bottlenecks = useMemo(() => {
    return Object.entries(timeAnalysis)
      .filter(([_, analysis]) => analysis.duration > 15) // Flag stages > 15 mins
      .map(([status]) => status);
  }, [timeAnalysis]);

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-teal-500/20 rounded-2xl p-6 space-y-6">
      {/* Order Header */}
      <div>
        <h3 className="text-2xl font-black text-white mb-2">طلب #{order.orderNumber}</h3>
        <p className="text-slate-400 text-sm">تم الإنشاء: {new Date(order.createdAt).toLocaleString('ar-EG')}</p>
      </div>

      {/* Timeline Visualization */}
      <div className="space-y-4">
        {CALL_CENTER_STAGES.map((stage, idx) => {
          const isActive = idx <= currentIdx;
          const isCompleted = idx < currentIdx;
          const analysis = timeAnalysis[stage.status];
          const isBottleneck = bottlenecks.includes(stage.status);

          return (
            <div key={stage.status} className="flex gap-4 items-start">
              {/* Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-2 transition-all ${
                    isCompleted
                      ? 'bg-teal-600 border-teal-500 text-white'
                      : isActive
                      ? 'bg-amber-500 border-amber-400 text-white animate-pulse'
                      : 'bg-slate-700 border-slate-600 text-slate-400'
                  }`}
                >
                  {stage.icon}
                </div>
                {idx < CALL_CENTER_STAGES.length - 1 && (
                  <div
                    className={`w-1 h-12 my-1 ${
                      isCompleted ? 'bg-teal-600' : 'bg-slate-700'
                    }`}
                  />
                )}
              </div>

              {/* Stage Info */}
              <div className="flex-1 pt-2">
                <div className="flex items-center justify-between mb-1">
                  <h4
                    className={`font-bold ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </h4>
                  {analysis && (
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        isBottleneck
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-slate-700/40 text-slate-300'
                      }`}
                    >
                      {analysis.duration} دقيقة
                    </span>
                  )}
                </div>

                {isBottleneck && (
                  <div className="flex items-center gap-2 text-red-400 text-xs mt-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>اختناق: هذه المرحلة تأخذ وقتاً طويلاً</span>
                  </div>
                )}

                {isCompleted && analysis && (
                  <p className="text-xs text-slate-400 mt-1">
                    انتهت قبل {Math.floor((new Date().getTime() - analysis.endTime.getTime()) / 60000)} دقيقة
                  </p>
                )}
              </div>

              {/* Status Icon */}
              {isCompleted && (
                <CheckCircle2 className="w-5 h-5 text-teal-400 mt-2 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="bg-slate-700/40 rounded-lg p-4 space-y-3 border border-slate-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span className="text-slate-300 font-medium">إجمالي الوقت المنقضي</span>
          </div>
          <span className="text-white font-bold text-lg">
            {Math.floor(
              (new Date().getTime() - new Date(order.createdAt).getTime()) / 60000
            )}{' '}
            دقيقة
          </span>
        </div>

        {bottlenecks.length > 0 && (
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-300 font-medium">مراحل بطيئة</span>
            </div>
            <div className="text-right">
              {bottlenecks.map(status => {
                const stage = CALL_CENTER_STAGES.find(s => s.status === status);
                return (
                  <p key={status} className="text-red-300 text-sm font-semibold">
                    {stage?.label}
                  </p>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Items Summary */}
      <div className="bg-slate-700/20 rounded-lg p-3">
        <h4 className="text-slate-300 font-bold text-sm mb-2">العناصر</h4>
        <div className="space-y-1">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-xs text-slate-400">
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
