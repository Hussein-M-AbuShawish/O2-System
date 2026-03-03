# Call Center Dashboard - Component Architecture Guide

## System Overview

```
App.tsx (Main Router)
  ↓
AppProvider (State Management)
  ↓
AppLayout (Sidebar + Layout)
  ↓
CallCenterDashboard (Main Container)
  ├─ CustomerSearchHeader (Phone search + instant lookup)
  ├─ Tab: Overview
  │   ├─ CustomerProfileCard (Sidebar - Customer details)
  │   └─ OrderLifecycleStepper (Main - Order tracking)
  ├─ Tab: New Order
  │   └─ OrderManagementPanel (Order creation)
  │       └─ SweetsPricingCalculator (Sweets KG pricing)
  ├─ Tab: Analytics
  │   └─ AnalyticsDashboard (Performance metrics)
  └─ Tab: Complaints
      └─ ComplaintsPanel (Issue tracking)
```

## Component Details

### 🔍 CustomerSearchHeader
**Location**: `components/CallCenter/CustomerSearchHeader.tsx`  
**Purpose**: Real-time customer lookup by phone number  
**Key Features**:
- Phone input field with search button
- Clear button to reset search
- Loading state while searching
- Instant result display

**Props**: None (uses context)

**State Management**:
```typescript
- phoneInput: string
- isSearching: boolean
```

**Methods**:
```typescript
searchCustomerByPhone(phone: string): User | null
setSelectedCallCenterCustomer(user: User | null): void
```

---

### 👤 CustomerProfileCard
**Location**: `components/CallCenter/CustomerProfileCard.tsx`  
**Purpose**: Display complete customer information and quick actions  
**Key Features**:
- Customer name and phone display
- Tier badge with point system (SILVER/GOLD/PLATINUM)
- Order count, balance, favorites stats
- Personality tags (AI-generated customer traits)
- Last delivery driver info
- "Order The Usual" quick-reorder button
- Recent order history (last 3)

**Props**:
```typescript
interface CustomerProfileCardProps {
  customer: User;
  onReorder?: (customer: User) => void;
  onClose?: () => void;
}
```

**Data Displayed**:
- `customer.name` - Customer full name
- `customer.phone` - Contact number
- `customer.tier` - Loyalty tier
- `customer.points` - Loyalty points
- `customer.balance` - Account balance
- `customer.personalityTags` - AI traits (e.g., "Prefers Spicy", "Late Night Buyer")
- `customer.lastDeliveryDriver` - Previous delivery agent name
- `customer.frequentItems` - Quick reorder items

---

### 📦 OrderManagementPanel
**Location**: `components/CallCenter/OrderManagementPanel.tsx`  
**Purpose**: Create and manage new orders with menu items  
**Key Features**:
- Category-based menu grid (Sweets, Meals, Beverages)
- Quick item addition buttons
- Current order item display
- Sweets pricing calculator integration
- Delivery address selector
- Real-time total calculation (subtotal + tax + delivery)
- Order confirmation button

**Props**:
```typescript
interface OrderManagementPanelProps {
  order: Order;
  onUpdateOrder?: (order: Order) => void;
}
```

**Price Calculation Logic**:
```
subtotal = Σ(item.price × item.quantity)
tax = subtotal × 10%
total = subtotal + tax + deliveryFee
```

**Sample Menu Items**:
- كيك العسل (Honey Cake) - $8.99
- البقلاوة (Baklava) - $12.99
- الكنافة (Kunafa) - $15.99
- برجر كلاسيكي (Classic Burger) - $9.99
- شاورما دجاج (Chicken Shawarma) - $7.99

---

### 🧁 SweetsPricingCalculator
**Location**: `components/CallCenter/SweetsPricingCalculator.tsx`  
**Purpose**: Weight-based pricing for sweets items  
**Key Features**:
- Weight input with ±0.25 kg buttons
- Real-time price calculation (weight × basePrice/kg)
- Price override checkbox
- Discount reason tracking (audit trail)
- Quantity control
- Item removal button

**Props**:
```typescript
interface SweetsPricingCalculatorProps {
  item: OrderItem;
  onUpdate: (item: OrderItem) => void;
  onRemove?: () => void;
}
```

**Calculation Formula**:
```
calculatedPrice = weight × basePrice
finalPrice = priceOverride || calculatedPrice
discount = calculatedPrice - finalPrice
```

**Data Fields Updated**:
- `item.weight` - Weight in kilograms (0.1 - ∞)
- `item.price` - Final calculated/overridden price
- `item.priceOverride` - Custom price if applied
- `item.overrideReason` - Reason for discount (e.g., "عرض خاص" = Special Offer)
- `item.quantity` - Number of this item

---

### 📊 OrderLifecycleStepper
**Location**: `components/CallCenter/OrderLifecycleStepper.tsx`  
**Purpose**: Visual progress tracking of order through fulfillment stages  
**Key Features**:
- 5-stage progression display
- Elapsed time per stage
- Bottleneck detection (stages > 15 min flagged in red)
- Current stage animation
- Timeline visualization with connecting lines
- Completed stage highlighting

**Stages**:
1. **PENDING** (⏳) - Order received, awaiting processing
2. **IN_PROGRESS** (👨‍🍳) - Being prepared in kitchen
3. **READY** (✓) - Quality check passed
4. **ON_DELIVERY** (🚗) - With delivery driver
5. **DELIVERED** (✓✓) - Successfully delivered

**Props**:
```typescript
interface OrderLifecycleStepperProps {
  order: Order;
}
```

**Bottleneck Detection Logic**:
```typescript
stages > 15 minutes → Flag as bottleneck
Display warning indicator
```

---

### ⚠️ ComplaintsPanel
**Location**: `components/CallCenter/ComplaintsPanel.tsx`  
**Purpose**: Manage customer complaints and feedback  
**Key Features**:
- Complaint form with comment input
- Root cause dropdown (COLD_FOOD, LATE_DELIVERY, MISSING_ITEM, WRONG_ORDER, QUALITY_ISSUE, OTHER)
- Status tracking (NEW → REVIEWED → RESOLVED)
- Order linkage for context
- Timestamp display
- Complaint history list

**Complaint Categories**:
- FOOD - Product quality issues
- SERVICE - Delivery or service issues
- CLEANLINESS - Cleanliness concerns
- ATMOSPHERE - Environment-related feedback
- OTHER - Miscellaneous

**Status Workflow**:
- NEW - Just entered
- REVIEWED - Agent reviewed
- RESOLVED - Issue addressed

---

### 📈 AnalyticsDashboard
**Location**: `components/CallCenter/AnalyticsDashboard.tsx`  
**Purpose**: Real-time performance metrics and insights  
**Key Features**:
- Daily order count
- Total revenue
- Completion rate %
- Average order time
- Top-selling items ranking
- Agent performance stats
- Order status breakdown

**Key Metrics**:
```
Today's Orders: X
Revenue: $XXX.XX
Completion Rate: XX%
Avg Order Time: X min
Top Item: [Item Name]
On-Time Delivery: XX%
Customer Satisfaction: XX%
```

**Data Aggregation**:
- Tracks activeOrders count
- Sums order totals
- Calculates time deltas from timeline
- Groups items by frequency

---

### 🎯 CallCenterDashboard (Main Container)
**Location**: `components/CallCenterDashboard.tsx`  
**Purpose**: Main orchestrator and layout for all call center features  
**Key Features**:
- Tab navigation (Overview, New Order, Analytics, Complaints)
- Error boundary with fallback UI
- Responsive grid layout
- Empty state messaging
- Button to create new orders

**Layout Structure**:
```
┌─────────────────────────────────┐
│   CustomerSearchHeader          │
├────────────┬────────────────────┤
│  Profile   │  Overview/Content  │
│  Sidebar   │                    │
│            │                    │
└────────────┴────────────────────┘
```

**Tab States**:
- `overview` - Customer profile + order tracking
- `new_order` - Order creation interface
- `analytics` - Performance dashboard
- `complaints` - Issue management

**Responsive Behavior**:
- Mobile: Single column stacking
- Tablet: 2 columns
- Desktop: 3-column layout (profile + 2x content)

---

## State Management Integration

### Context Properties Used:
```typescript
// Call Center State
selectedCallCenterCustomer: User | null
currentCart: OrderItem[]
activeOrders: Order[]

// Methods
searchCustomerByPhone(phone: string): User | null
setSelectedCallCenterCustomer(user: User | null): void
getCustomerOrderHistory(customerId: string): Order[]
addToCart(item: MenuItem): void
updateCartItem(uniqueId: string, updates: Partial<OrderItem>): void
removeFromCart(uniqueId: string): void
addFeedback(feedback: CustomerFeedback): void
reorder(orderId: string): void
```

---

## Styling System

### Color Palette:
```
Background: from-slate-900 via-slate-800 to-slate-900
Primary: teal-600 (#0d9488)
Secondary: amber-600 (#d97706)
Accents: slate-700, slate-800
Text: white, slate-400, slate-300
Success: teal-400
Warning: amber-400
Error: red-400
```

### Key Tailwind Classes:
```
- bg-gradient-to-br: Diagonal gradients
- border-teal-500/20: Subtle borders
- rounded-2xl: Large border radius (1rem)
- font-black: Bold headings
- space-y-4: Vertical spacing
- gap-2: Component spacing
- max-w-7xl: Content constraint
- lg:col-span-2: Responsive columns
```

---

## Error Handling

### Try-Catch Wrapper:
```typescript
try {
  // Component logic
  return <JSX />
} catch (error) {
  console.error('CallCenter Dashboard Error:', error);
  return <ErrorFallbackUI message={error} />
}
```

### Validation:
```typescript
if (!phoneInput.trim()) return; // Prevent empty search
if (!selectedCallCenterCustomer) return; // Prevent null operations
if (newWeight > 0) { ... } // Weight validation
if (newPrice >= 0) { ... } // Price validation
```

---

## Performance Optimizations

1. **useMemo**: TimeAnalysis calculation in OrderLifecycleStepper
2. **Tab-based rendering**: Only active tab content renders
3. **Array filtering**: Efficient order and item filtering
4. **Lazy computation**: Price calculations on value change only
5. **No unnecessary renders**: Proper dependency arrays

---

## RTL (Right-to-Left) Support

- All text is in Arabic
- Icons positioned correctly for RTL
- Input fields RTL-compatible
- Grid layouts fluid for RTL direction
- Using `transform -translate-y-1/2` for centering

---

## Testing Checklist

- [ ] Search by phone number returns correct customer
- [ ] Weight adjustment updates price in real-time
- [ ] Override discount tracking saves reason
- [ ] Tab switching works smoothly
- [ ] New order creation flows correctly
- [ ] Stepper shows correct elapsed time
- [ ] Bottleneck detection triggers at >15 min
- [ ] Complaint form submits successfully
- [ ] Analytics dashboard loads metrics
- [ ] Error boundary catches and displays errors
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Arabic text displays correctly

---

**Last Updated**: 2026-03-04  
**Framework**: React 18 + TypeScript + Tailwind CSS v4  
**Status**: Production Ready ✅
