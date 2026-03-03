# Call Center Dashboard - Developer Quick Reference

## 🚀 Quick Start (5 minutes)

```bash
# 1. Login as CALL_CENTER
Click "مركز الاتصالات" button in login screen

# 2. Enter phone number
Type in search box at top

# 3. Browse tabs
- Overview: Customer + Order tracking
- New Order: Create orders with pricing
- Analytics: View daily metrics
- Complaints: Manage issues
```

---

## 🔑 Key Imports

```typescript
// Main components
import { CallCenterDashboard } from './components/CallCenterDashboard';
import { CustomerSearchHeader } from './components/CallCenter/CustomerSearchHeader';
import { CustomerProfileCard } from './components/CallCenter/CustomerProfileCard';

// Types
import { User, Order, OrderStatus, OrderType, CustomerFeedback } from './types';

// Context
import { useApp } from './store';
```

---

## 📊 Core Data Structures

```typescript
// Customer object
{
  id: string;
  name: string;
  phone: string;
  tier: 'SILVER' | 'GOLD' | 'PLATINUM';
  points: number;
  balance: number;
  personalityTags?: string[];
  lastDeliveryDriver?: string;
  frequentItems?: string[];
  addresses: SavedAddress[];
}

// Order object
{
  id: string;
  orderNumber: string;
  type: OrderType.DELIVERY;
  status: OrderStatus.PENDING | IN_PROGRESS | READY | ON_DELIVERY | DELIVERED;
  items: OrderItem[];
  customerId: string;
  total: number;
  timeline: { status: OrderStatus; time: Date }[];
}

// Order item with sweets pricing
{
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  basePrice: number;
  weight?: number; // KG for sweets
  priceOverride?: number;
  overrideReason?: string; // Discount reason
}
```

---

## 🎨 Styling Quick Reference

```typescript
// Containers
className="bg-gradient-to-br from-slate-800 to-slate-900 border border-teal-500/20 rounded-2xl p-6"

// Buttons
className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg"

// Active state
className={activeTab === 'overview' ? 'bg-teal-600 text-white' : 'bg-slate-700'}

// Input fields
className="bg-slate-700 border border-slate-600 rounded text-white py-2 px-3 focus:outline-none focus:border-teal-500"

// Icons
<Search className="w-5 h-5" /> // 20px icons standard
<Plus className="w-4 h-4" />   // 16px for inline
```

---

## 💾 Context Usage Patterns

```typescript
// Get customer by phone
const { searchCustomerByPhone } = useApp();
const customer = searchCustomerByPhone('123456789');

// Get order history
const { getCustomerOrderHistory } = useApp();
const orders = getCustomerOrderHistory(customerId);

// Add complaint
const { addCallCenterComplaint } = useApp();
addCallCenterComplaint({
  orderId: order.id,
  customerId: customer.id,
  customerName: customer.name,
  type: 'COMPLAINT',
  category: 'COLD_FOOD',
  rating: 2,
  comment: 'Food arrived cold'
});

// Update cart item price
const { updateCartItem } = useApp();
updateCartItem(itemId, {
  weight: 1.5,
  price: 18.98,
  priceOverride: 17.00,
  overrideReason: 'Bulk discount'
});
```

---

## ⏱️ Timeline Entry Format

```typescript
// Order timeline
timeline: [
  { status: OrderStatus.PENDING, time: new Date() },
  { status: OrderStatus.IN_PROGRESS, time: new Date(Date.now() + 5*60000) },
  { status: OrderStatus.READY, time: new Date(Date.now() + 25*60000) },
  { status: OrderStatus.ON_DELIVERY, time: new Date(Date.now() + 30*60000) },
  { status: OrderStatus.DELIVERED, time: new Date(Date.now() + 45*60000) }
]

// Bottleneck flagged if > 15 minutes
elapsed = endTime - startTime
if (elapsed > 15 * 60 * 1000) {
  flagAsBottleneck = true; // Shows red warning
}
```

---

## 🧮 Price Calculation Formula

```typescript
// For sweets items
const weight = itemInput.weight || 1;          // KG
const basePrice = itemInput.basePrice || 8.99; // $/KG
const calculatedPrice = weight * basePrice;    // Total price
const finalPrice = priceOverride || calculatedPrice;
const discount = calculatedPrice - finalPrice;

// Order totals
const subtotal = items.reduce((sum, item) => 
  sum + (item.price * item.quantity), 0);
const tax = subtotal * 0.10;
const total = subtotal + tax + deliveryFee;
```

---

## 🔄 Tab Navigation

```typescript
const [activeTab, setActiveTab] = useState<'overview' | 'new_order' | 'analytics' | 'complaints'>('overview');

// Change tab
<button onClick={() => setActiveTab('overview')}>
  نظرة عامة
</button>

// Render tab content
{activeTab === 'overview' && <Overview />}
{activeTab === 'new_order' && <OrderCreation />}
{activeTab === 'analytics' && <Analytics />}
{activeTab === 'complaints' && <Complaints />}
```

---

## ✋ Common Error Prevention

```typescript
// ❌ DON'T: Missing customer check
const orderHistory = getCustomerOrderHistory(customer.id);

// ✅ DO: Always check if customer exists
if (!selectedCallCenterCustomer) return null;
const orderHistory = getCustomerOrderHistory(selectedCallCenterCustomer.id);

// ❌ DON'T: Invalid weight
handleWeightChange(weight); // Could be 0 or negative

// ✅ DO: Validate weight
if (newWeight > 0) {
  handleWeightChange(newWeight);
}

// ❌ DON'T: Missing price calculation
const total = item.price * item.quantity; // Ignores tax/delivery

// ✅ DO: Full calculation
const total = subtotal + (subtotal * 0.10) + deliveryFee;
```

---

## 🐛 Debugging Tips

```typescript
// Log user search
console.log("[v0] Searching for customer:", phoneInput);
console.log("[v0] Customer found:", customer);

// Log order creation
console.log("[v0] Creating order:", {
  customerId: customer.id,
  itemCount: items.length,
  subtotal: subtotal,
  total: total
});

// Log price changes
console.log("[v0] Weight changed:", { 
  oldWeight: item.weight,
  newWeight: newWeight,
  newPrice: calculatedPrice
});

// Log errors
console.error('[v0] Search failed:', error.message);
```

---

## 📱 Responsive Breakpoints

```typescript
// Mobile: < 768px
<div className="grid grid-cols-1 gap-4">
  {/* Single column */}
</div>

// Tablet: 768px - 1024px
<div className="grid grid-cols-2 gap-4">
  {/* Two columns */}
</div>

// Desktop: > 1024px
<div className="grid grid-cols-3 gap-6 lg:col-span-2">
  {/* Three columns, full width */}
</div>

// Responsive helper
className="lg:col-span-2" // Full width on large screens
```

---

## 🎯 State Management Checklist

- [ ] Initialize state with useState
- [ ] Update state with setter function
- [ ] Use context for shared state (customers, orders)
- [ ] Memoize expensive calculations
- [ ] Add proper dependency arrays to useEffect
- [ ] Clear side effects in cleanup functions

---

## 🧪 Testing Props

```typescript
// CustomerProfileCard test
<CustomerProfileCard
  customer={{
    id: 'c1',
    name: 'أحمد محمد',
    phone: '966501234567',
    tier: 'GOLD',
    points: 250,
    balance: 150,
    personalityTags: ['يفضل الحار'],
    lastDeliveryDriver: 'محمد علي'
  }}
  onReorder={(customer) => console.log('Reorder:', customer)}
  onClose={() => console.log('Close')}
/>

// OrderLifecycleStepper test
<OrderLifecycleStepper
  order={{
    id: 'o1',
    orderNumber: 'ORD-001',
    status: OrderStatus.IN_PROGRESS,
    timeline: [
      { status: OrderStatus.PENDING, time: new Date() },
      { status: OrderStatus.IN_PROGRESS, time: new Date(Date.now() + 5*60000) }
    ]
  }}
/>
```

---

## 📄 File Locations

| Component | Path |
|-----------|------|
| Main Dashboard | `components/CallCenterDashboard.tsx` |
| Search | `components/CallCenter/CustomerSearchHeader.tsx` |
| Profile | `components/CallCenter/CustomerProfileCard.tsx` |
| Stepper | `components/CallCenter/OrderLifecycleStepper.tsx` |
| Order Form | `components/CallCenter/OrderManagementPanel.tsx` |
| Pricing | `components/CallCenter/SweetsPricingCalculator.tsx` |
| Complaints | `components/CallCenter/ComplaintsPanel.tsx` |
| Analytics | `components/CallCenter/AnalyticsDashboard.tsx` |
| Store | `store.tsx` |
| Types | `types.ts` |

---

## 🔍 API Endpoints (Ready for Integration)

```typescript
// Mock implementations - Replace with real API calls

// GET /api/customers?phone=123456789
searchCustomerByPhone(phone: string): User | null

// GET /api/customers/:id/orders
getCustomerOrderHistory(customerId: string): Order[]

// POST /api/orders
submitOrder(order: Order): Promise<Order>

// POST /api/complaints
addCallCenterComplaint(complaint: CustomerFeedback): Promise<void>

// PATCH /api/complaints/:id
updateCallCenterComplaint(id: string, complaint: Partial<CustomerFeedback>): Promise<void>

// GET /api/analytics/daily
getDailyMetrics(date: Date): Promise<Analytics>

// GET /api/menu/items
getMenuItems(): Promise<MenuItem[]>

// PATCH /api/orders/:id/status
updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>
```

---

## 🎓 Common Modifications

### Change primary color from Teal to Blue
```typescript
// In components, replace:
// bg-teal-600 → bg-blue-600
// border-teal-500 → border-blue-500
// text-teal-400 → text-blue-400

// Or use CSS variable:
:root { --primary-color: #3b82f6; }
.bg-primary { background-color: var(--primary-color); }
```

### Add new complaint category
```typescript
// In types.ts, update CustomerFeedback:
rootCause?: 'COLD_FOOD' | 'LATE_DELIVERY' | 'MISSING_ITEM' | 'WRONG_ORDER' | 'QUALITY_ISSUE' | 'NEW_CATEGORY' | 'OTHER';
```

### Increase KG precision
```typescript
// In SweetsPricingCalculator:
// Current: value={weight.toFixed(3)} // 3 decimals
// Change to:
// value={weight.toFixed(4)} // 4 decimals
step="0.01" // Instead of 0.1
```

---

## ⚡ Performance Tips

```typescript
// Use memo for expensive components
const MemoizedCard = React.memo(CustomerProfileCard);

// Use useMemo for calculations
const bottlenecks = useMemo(() => {
  return timeAnalysis.filter(s => s.duration > 15);
}, [timeAnalysis]);

// Use useCallback for event handlers
const handleSearch = useCallback((phone: string) => {
  searchCustomerByPhone(phone);
}, [searchCustomerByPhone]);

// Lazy load components
const AnalyticsDashboard = React.lazy(() => 
  import('./CallCenter/AnalyticsDashboard')
);
```

---

## 🚨 Error Messages

```typescript
// Search error
'لم يتم العثور على عميل برقم هاتف: ' + phoneInput

// Validation error
'الوزن يجب أن يكون أكبر من 0.1 كغ'

// Order error
'حدث خطأ في إنشاء الطلب'

// Calculation error
'خطأ في حساب الإجمالي'
```

---

## 📞 Support Commands

```bash
# Build
npm run build

# Dev server
npm run dev

# Type check
npm run type-check

# View console logs
Open Browser DevTools → Console Tab

# Check performance
Open Browser DevTools → Performance Tab

# Debug React
React DevTools Browser Extension

# Check Tailwind
Search for className in code
Verify class exists in Tailwind documentation
```

---

**Last Updated**: 2026-03-04  
**Quick Ref Version**: 1.0  
**Status**: ✅ Ready to Use
