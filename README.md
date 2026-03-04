# Shopify Dashboard

A modern, feature-rich Shopify-style dashboard built with Next.js 16, React 19, and Shopify Polaris. This project demonstrates advanced product management capabilities, analytics tracking, and sophisticated filtering systems.

## 🚀 Features

- **Product Management**: Advanced product table with search, filtering, and analytics tracking
- **Analytics Dashboard**: Real-time analytics with event tracking and metrics visualization
- **Advanced Filtering**: Multi-level filtering with search, checkbox popovers, and collapsible sidebar filters
- **Mock Data Integration**: Seamless integration with FakeStore API enhanced with UI-specific fields
- **Responsive Design**: Built with Shopify Polaris for consistent, professional UI
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.6 with App Router
- **UI Library**: Shopify Polaris 13.9.5
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Analytics**: Custom lightweight analytics service with localStorage
- **Data**: FakeStore API integration with mock data enrichment

## 📁 Project Structure

```
shopify-dashboard/
├── app/                          # Next.js App Router directory
│   ├── page.tsx                  # Root page - Product management interface
│   ├── layout.tsx                # Root layout with Polaris AppProvider
│   ├── globals.css               # Global styles
│   ├── analytics/
│   │   └── page.tsx              # Analytics dashboard
│   ├── products/
│   │   ├── page.tsx              # Products overview
│   │   └── table/
│   │       └── page.tsx          # Product table view
│   └── components/               # App-specific components
├── components/                   # Shared components
│   ├── ProductTable/             # Product table component
│   ├── ProductModal/             # Product modal component
│   └── ProductTableSkeleton/     # Loading skeleton
├── lib/                          # Core libraries
│   └── analytics/                # Analytics system
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript type definitions
├── utils/                        # Utility functions
└── public/                       # Static assets
```

## 🌐 Routes & Navigation

### Main Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `app/page.tsx` | **Main Dashboard** - Complete product management interface with search, filtering, and analytics tracking |
| `/analytics` | `app/analytics/page.tsx` | **Internal Dashboard** - Analytics visualization with metrics, event tracking, and data management |

### Product Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/products` | `app/products/page.tsx` | Products overview and navigation hub |
| `/products/table` | `app/products/table/page.tsx` | Dedicated product table view (mirrors main dashboard functionality) |

### Key Features by Route

#### `/` (Main Dashboard)
- **Product Table**: Comprehensive product listing with enhanced data
- **Search Functionality**: Real-time search across product names and descriptions
- **Advanced Filtering**: 
  - Purchase Availability filter (checkbox popover)
  - Product Type filter (checkbox popover)
  - More Filters sidebar with collapsible sections (Vendor selection)
- **Filter Tags**: Visual representation of active filters with close functionality
- **Analytics Integration**: Event tracking for product clicks, page views, and user interactions
- **Status Navigation**: Tabs for filtering by product status (Active, Draft, Archived)

#### `/analytics` (Internal Dashboard)
- **Key Metrics**: Total product clicks, modal opens, and session tracking
- **Event Visualization**: Detailed analytics events table with timestamps and metadata
- **Most Viewed Products**: Ranking of products by interaction frequency
- **Data Management**: Tools for clearing analytics data and generating test events
- **Debug Capabilities**: Enhanced logging and troubleshooting features

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shopify-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application

### Build for Production

```bash
npm run build
npm start
```

## 🧩 Key Components & Systems

### Product Management System
- **Enhanced Product Types**: Extended FakeStore API products with UI-specific fields (status, vendor, productType, availability)
- **Mock Data Enrichment**: Deterministic seeded randomization for consistent demo data
- **Filter Architecture**: Multi-level filtering system with search, checkboxes, and sidebar filters

### Analytics System
- **Event Tracking**: Comprehensive tracking of user interactions, page views, and product engagement
- **LocalStorage Backend**: Lightweight analytics service using browser localStorage
- **Real-time Metrics**: Dynamic calculation of analytics metrics with filtering and aggregation
- **Debug Capabilities**: Enhanced logging and troubleshooting tools for development

### UI/UX Features
- **Shopify Polaris Integration**: Professional, consistent design system
- **Responsive Layout**: Optimized for desktop and mobile viewing
- **Interactive Filters**: Checkbox-based filtering with visual feedback
- **Status Management**: Product status handling with visual indicators

## 📊 Analytics Events

The application tracks several types of analytics events:

- **Page Views**: Navigation and route changes
- **User Actions**: Product clicks, filter interactions, search queries
- **Product Interactions**: Individual product engagement and modal opens
- **Session Tracking**: User session management and duration

## 🔍 Search & Filtering

### Search Functionality
- Real-time search across product names and descriptions
- Debounced input for performance optimization
- Clear search functionality

### Filter System
1. **Purchase Availability**: Checkbox popover with multiple availability options
2. **Product Type**: Checkbox popover for product category filtering
3. **More Filters Sidebar**: Collapsible sections for additional filtering options
4. **Filter Tags**: Visual representation of active filters with individual removal

## 🚀 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Structure

- **Type Safety**: Full TypeScript implementation with strict type checking
- **Component Architecture**: Modular, reusable components following React best practices
- **Custom Hooks**: Specialized hooks for analytics, product management, and filtering
- **Service Layer**: Dedicated services for data management and analytics

## 📝 API Integration

The application integrates with the FakeStore API for product data and enhances it with:
- Product status (Active, Draft, Archived)
- Vendor information
- Product type categorization
- Purchase availability options

## 🔧 Configuration

### Environment Variables
No environment variables are required for basic functionality. The application uses:
- FakeStore API for product data
- LocalStorage for analytics persistence
- Client-side routing with Next.js App Router

### Customization
- Product fields can be extended in `types/product.ts`
- Analytics events can be customized in `lib/analytics/types.ts`
- UI components can be modified using Shopify Polaris theming

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For support and questions:
- Check the [Next.js Documentation](https://nextjs.org/docs)
- Review [Shopify Polaris Documentation](https://polaris.shopify.com/)
- Open an issue in the repository

---

Built with ❤️ using Next.js and Shopify Polaris
