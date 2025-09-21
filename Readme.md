# 🍭 Sweet Shop Management System

A comprehensive full-stack web application for managing a sweet shop with features for both customers and administrators. Built with modern technologies including React, TypeScript, Node.js, Express, and MongoDB.

## 🌟 Features

### Customer Features
- **User Authentication**: Secure login/registration system with JWT tokens
- **Product Catalog**: Browse and search through available sweets with advanced filtering
- **Shopping Cart**: Add items to cart and manage quantities
- **Order Processing**: Complete purchase workflow with order confirmation
- **Responsive Design**: Mobile-friendly interface with beautiful UI components

### Admin Features
- **Inventory Management**: Add, update, and delete sweet products
- **Order Tracking**: View and manage customer orders
- **Product Analytics**: Monitor stock levels and sales
- **User Management**: Admin dashboard with protected routes

### Technical Features
- **Real-time Updates**: Live inventory updates after purchases
- **Search & Filter**: Advanced product search with category and price filtering
- **Authentication**: JWT-based secure authentication system
- **Error Handling**: Comprehensive error handling and user feedback
- **Type Safety**: Full TypeScript implementation for better code quality

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI components library
- **React Router** - Client-side routing
- **React Query** - Data fetching and state management
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server code
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting
- **ts-node** - TypeScript execution for Node.js
- **Vite** - Fast development server

## 📦 Project Structure

```
sweet-shop-management/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── orderController.ts
│   │   │   └── sweetController.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── models/
│   │   │   ├── Order.ts
│   │   │   ├── Sweet.ts
│   │   │   └── User.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── orders.ts
│   │   │   └── sweets.ts
│   │   └── utils/
│   │       └── dummyImages.ts
│   ├── server.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/         
│   │   │   ├── Header.tsx
│   │   │   ├── SweetCard.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   └── CartContext.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Catalog.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── Auth.tsx
│   │   │   └── Admin.tsx
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── sweetService.ts
│   │   │   └── orderService.ts
│   │   └── hooks/
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <https://github.com/F1Square/TDD-Kata>
   cd sweet-shop-management
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create environment variables file
   touch .env
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/sweet-shop
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start the Development Servers**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:5000

## 🔐 Authentication

The application uses JWT-based authentication with the following roles:
- **Customer**: Can browse products, add to cart, and make purchases
- **Admin**: Can manage inventory, view orders, and access admin dashboard

### Default Admin Account
```
Email: admin@gmail.com
Password: admin@123
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/validate` - Validate JWT token

### Sweets
- `GET /api/sweets` - Get all sweets
- `POST /api/sweets` - Create sweet (Admin only)
- `PUT /api/sweets/:id` - Update sweet (Admin only)
- `DELETE /api/sweets/:id` - Delete sweet (Admin only)
- `POST /api/sweets/:id/purchase` - Purchase sweet

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/admin` - Get all orders (Admin only)

## 🎨 UI Components

The application uses **Shadcn/ui** components for a consistent and modern design:
- **Cards** - Product displays and information panels
- **Buttons** - Various button variants with candy-themed styling
- **Forms** - Login, registration, and admin forms
- **Navigation** - Header with responsive mobile menu
- **Modals** - Confirmation dialogs and forms
- **Toast** - Success and error notifications

### Color Scheme
- **Primary**: Candy Pink (#FF69B4)
- **Secondary**: Candy Purple (#9370DB)
- **Accent**: Golden Sweet (#FFD700)
- **Background**: Cream (#FFF8DC)

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Protected Routes**: Route-level authentication guards
- **CORS Configuration**: Proper cross-origin request handling
- **Input Validation**: Server-side validation for all inputs

## 📊 Key Features Implementation

### Cart Management
- Add/remove items from cart
- Update quantities
- Persistent cart state using React Context
- Real-time total calculations

### Inventory Management
- Live stock tracking
- Automatic quantity updates after purchases
- Admin-only inventory modifications
- Out-of-stock handling

### Search & Filtering
- Real-time product search
- Category-based filtering
- Price range filtering
- Sorting options (name, price, rating)

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Mobile-friendly navigation
- Touch-optimized interactions






