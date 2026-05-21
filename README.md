# Growing Players - Premium Ecommerce Platform

A production-ready ecommerce platform for premium cake design ingredients and bakery decoration products built with React, Vite, Tailwind CSS, and Supabase.

## 🎨 Features

### Frontend
- ⚛️ **React 18** - Modern UI library
- ⚡ **Vite** - Lightning-fast build tool
- 🎯 **Tailwind CSS** - Utility-first styling
- 🎬 **Framer Motion** - Smooth animations
- 🚀 **React Router v6** - Client-side routing
- 🌾 **Zustand** - State management
- 🍞 **React Hot Toast** - Notifications
- 🎨 **Lucide React** - Beautiful icons

### Backend & Database
- 🗄️ **Supabase** - PostgreSQL database
- 🔐 **Authentication** - Email/password + session
- 💾 **Storage** - Image uploads
- 📊 **Real-time** - Live data updates

### Design
- 📱 **Fully Responsive** - Mobile-first approach
- ✨ **Smooth Animations** - Engaging interactions
- 🎨 **Premium UI** - Glassmorphism & gradients
- 🌙 **Modern Typography** - Professional fonts
- ♿ **Accessible** - WCAG compliant

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── CategoryCard.jsx
│   └── Loaders.jsx
├── pages/              # Page components
│   └── Home.jsx
├── layouts/            # Layout wrappers
│   └── MainLayout.jsx
├── hooks/              # Custom React hooks
│   └── index.js
├── services/           # API services
│   └── api.js
├── store/              # Zustand stores
│   └── index.js
├── context/            # React Context (optional)
├── utils/              # Utility functions
│   └── helpers.js
├── lib/                # Library configurations
│   └── supabase.js
├── styles/             # Global styles
│   ├── globals.css
│   └── animations.css
├── assets/             # Images, fonts
├── routes/             # Route configurations
├── App.jsx             # Main app component
└── main.jsx            # Entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd growing-players
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Create a new Supabase project
   - Copy your project URL and anon key
   - Paste them in `.env.local`:
   ```
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   ```

4. **Setup Database**
   - Go to Supabase SQL editor
   - Run the SQL schema (see [Database Schema](#database-schema))

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🗄️ Database Schema

```sql
-- Users table (auto-created by Supabase Auth)
-- Add custom fields:
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS phone TEXT;

-- Categories table
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  slug TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  image TEXT,
  images TEXT[],
  stock INTEGER DEFAULT 0,
  sku TEXT UNIQUE,
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart items table
CREATE TABLE cart_items (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB,
  payment_method TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wishlist table
CREATE TABLE wishlist (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

-- Create storage bucket for product images
-- In Supabase: Storage → Create new bucket → "products" (Public)
```

## 🔧 Configuration

### Tailwind CSS
Custom theme configured in `tailwind.config.js`:
- Primary colors: Warm bakery tones
- Typography: Professional sans-serif + display serif
- Animations: Smooth, engaging transitions

### Supabase Client
Initialized in `src/lib/supabase.js` using environment variables.

### State Management
Zustand stores in `src/store/index.js`:
- `useAuthStore` - Authentication state
- `useCartStore` - Shopping cart
- `useWishlistStore` - Wishlist
- `useProductStore` - Products data

## 📦 Key Dependencies

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "framer-motion": "^10.16.4",
  "zustand": "^4.4.7",
  "supabase": "^1.49.2",
  "react-hot-toast": "^2.4.1",
  "lucide-react": "^0.294.0",
  "tailwindcss": "^3.3.6"
}
```

## 🎯 Development Workflow

1. **Components** - Build reusable components in `src/components/`
2. **Pages** - Create page components in `src/pages/`
3. **Services** - Add API calls in `src/services/api.js`
4. **Stores** - Manage state in `src/store/`
5. **Styles** - Add global styles in `src/styles/`

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 📋 Environment Variables

Required for production:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_BASE_URL=your_api_url
VITE_ENV=production
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change brand colors:
```js
colors: {
  primary: { ... },
  accent: { ... },
  rose: { ... }
}
```

### Fonts
Update global styles in `src/styles/globals.css`

### Animations
Modify `src/styles/animations.css` for custom animations

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All components follow mobile-first design approach.

## 🔒 Security

- ✅ Supabase Row Level Security (RLS) policies
- ✅ Secure authentication with email verification
- ✅ Protected API routes
- ✅ Environment variables for sensitive data
- ✅ CORS configuration
- ✅ Input validation & sanitization

## 🐛 Troubleshooting

### Supabase Connection Issues
1. Verify `.env.local` has correct credentials
2. Check Supabase project is active
3. Ensure CORS is configured

### Styling Issues
1. Clear `.next` or `dist` folder
2. Reinstall Tailwind dependencies
3. Restart dev server

### Build Errors
1. Delete `node_modules` and `.lock` files
2. Run `npm install`
3. Check Node version (16+)

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase Docs](https://supabase.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [React Router](https://reactrouter.com)

## 📝 License

MIT License - Feel free to use this project

## 🤝 Contributing

Contributions are welcome! Please follow the project structure and coding conventions.

## 👥 Support

For issues and questions, please open an issue on GitHub or contact support@growingplayers.com

---

**Made with ❤️ for bakers by Growing Players**
