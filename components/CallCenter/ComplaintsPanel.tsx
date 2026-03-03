import React, { useState } from 'react';
import { CustomerFeedback } from '../../types';
import { useApp } from '../../store';
import { Plus, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export const ComplaintsPanel: React.FC = () => {
  const { feedbacks, addFeedback, updateFeedback, selectedCallCenterCustomer, getCustomerOrderHistory } = useApp();
  const [isAddingComplaint, setIsAddingComplaint] = useState(false);
  const [formData, setFormData] = useState({
    comment: '',
    rootCause: 'COLD_FOOD' as const,
    linkedOrderId: ''
  });

  const customerComplaints = selectedCallCenterCustomer
    ? feedbacks.filter(f => f.customerId === selectedCallCenterCustomer.id || f.type === 'COMPLAINT')
    : [];

  const orderHistory = selectedCallCenterCustomer
    ? getCustomerOrderHistory(selectedCallCenterCustomer.id)
    : [];

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.comment.trim()) return;

    addFeedback({
      customerId: selectedCallCenterCustomer?.id,
      customerName: selectedCallCenterCustomer?.name || 'عميل',
      type: 'COMPLAINT',
      category: 'SERVICE',
      rating: 1,
      comment: formData.comment,
      linkedOrderId: formData.linkedOrderId || undefined,
      rootCause: formData.rootCause
    });

    setFormData({ comment: '', rootCause: 'COLD_FOOD', linkedOrderId: '' });
    setIsAddingComplaint(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'REVIEWED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'RESOLVED':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getRootCauseLabel = (cause?: string) => {
    const causes: Record<string, string> = {
      COLD_FOOD: 'أكل بارد',
      LATE_DELIVERY: 'تأخر في التسليم',
      MISSING_ITEM: 'عنصر مفقود',
      WRONG_ORDER: 'طلب خاطئ',
      QUALITY_ISSUE: 'مشكلة جودة',
      OTHER: 'أخرى'
    };
    return causes[cause || 'OTHER'] || cause;
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-teal-500/20 rounded-2xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-white">نظام الشكاوى والملاحظات</h3>
        {selectedCallCenterCustomer && (
          <button
            onClick={() => setIsAddingComplaint(!isAddingComplaint)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            شكوى جديدة
          </button>
        )}
      </div>

      {!selectedCallCenterCustomer && (
        <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-4 text-center text-slate-400">
          اختر عميلاً أولاً لعرض والإبلاغ عن الشكاوى
        </div>
      )}

      {/* Add Complaint Form */}
      {isAddingComplaint && selectedCallCenterCustomer && (
        <form onSubmit={handleSubmitComplaint} className="bg-slate-700/30 border border-red-500/30 rounded-lg p-4 space-y-3">
          <h4 className="font-bold text-white">إضافة شكوى جديدة</h4>

          {/* Linked Order */}
          <div>
            <label className="text-xs uppercase text-slate-400 font-bold block mb-2">ربط بطلب سابق</label>
            <select
              value={formData.linkedOrderId}
              onChange={(e) => setFormData({ ...formData, linkedOrderId: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded text-white py-2 px-3 focus:outline-none focus:border-red-500"
            >
              <option value="">-- لا يوجد --</option>
              {orderHistory.map(order => (
                <option key={order.id} value={order.id}>
                  #{order.orderNumber} - ${order.total.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {/* Root Cause */}
          <div>
            <label className="text-xs uppercase text-slate-400 font-bold block mb-2">السبب الجذري</label>
            <select
              value={formData.rootCause}
              onChange={(e) => setFormData({ ...formData, rootCause: e.target.value as any })}
              className="w-full bg-slate-700 border border-slate-600 rounded text-white py-2 px-3 focus:outline-none focus:border-red-500"
            >
              <option value="COLD_FOOD">أكل بارد</option>
              <option value="LATE_DELIVERY">تأخر في التسليم</option>
              <option value="MISSING_ITEM">عنصر مفقود</option>
              <option value="WRONG_ORDER">طلب خاطئ</option>
              <option value="QUALITY_ISSUE">مشكلة جودة</option>
              <option value="OTHER">أخرى</option>
            </select>
          </div>

          {/* Comment */}
          <div>
            <label className="text-xs uppercase text-slate-400 font-bold block mb-2">تفاصيل الشكوى</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="اشرح تفاصيل الشكوى..."
              rows={3}
              className="w-full bg-slate-700 border border-slate-600 rounded text-white py-2 px-3 focus:outline-none focus:border-red-500 resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              إضافة الشكوى
            </button>
            <button
              type="button"
              onClick={() => setIsAddingComplaint(false)}
              className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      )}

      {/* Complaints List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {customerComplaints.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            لا توجد شكاوى مسجلة
          </div>
        ) : (
          customerComplaints.map((complaint) => (
            <div key={complaint.id} className="bg-slate-700/30 border border-slate-600 rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-sm">{complaint.customerName}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded border ${getStatusColor(complaint.status)}`}>
                      {complaint.status === 'NEW' && <AlertCircle className="w-3 h-3 inline mr-1" />}
                      {complaint.status === 'REVIEWED' && <Clock className="w-3 h-3 inline mr-1" />}
                      {complaint.status === 'RESOLVED' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                      {complaint.status === 'NEW' ? 'جديدة' : complaint.status === 'REVIEWED' ? 'قيد المراجعة' : 'تم الحل'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">{complaint.comment}</p>
                </div>
                {complaint.status === 'NEW' && (
                  <select
                    value={complaint.status}
                    onChange={(e) => updateFeedback(complaint.id, { status: e.target.value as any })}
                    className="bg-slate-600 text-white text-xs rounded px-2 py-1 border border-slate-500 focus:outline-none"
                  >
                    <option value="NEW">جديدة</option>
                    <option value="REVIEWED">قيد المراجعة</option>
                    <option value="RESOLVED">تم الحل</option>
                  </select>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <div>
                  {complaint.rootCause && (
                    <span className="bg-slate-600/50 text-slate-300 px-2 py-1 rounded inline-block">
                      {getRootCauseLabel(complaint.rootCause)}
                    </span>
                  )}
                </div>
                <span>{new Date(complaint.timestamp).toLocaleString('ar-EG')}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
