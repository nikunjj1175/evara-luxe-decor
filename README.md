# Home Decor Website

A fully responsive home decor e-commerce website built with Next.js, featuring both user and admin interfaces with modern animations and a beautiful design.

## Features

### User Side
- 🏠 **Beautiful Homepage** with animated hero section
- 🆕 **New Arrivals Section** - Highlighting latest products and festival items
- 🛍️ **Product Catalog** with filtering and search
- 🎨 **Category-based browsing**
- ⭐ **Product ratings and reviews**
- 🛒 **Shopping cart functionality**
- 👤 **User authentication** (login/register)
- 📱 **Fully responsive design**
- ✨ **Smooth animations** with Framer Motion
- 🔍 **Search functionality**
- ❤️ **Wishlist feature**

### Admin Side
- 📊 **Dashboard** with analytics and statistics
- 🛍️ **Product management** (CRUD operations) with New Arrivals marking
- 👥 **User management**
- 📦 **Order management**
- ⚙️ **Website settings** - Control what users see
- 🎨 **Content management**
- 📈 **Analytics and reports**
- 🔒 **Protected admin routes**

### Technical Features
- 🔐 **JWT Authentication** with refresh tokens
- 🗄️ **MongoDB** database with Mongoose
- 🎨 **Tailwind CSS** for styling
- ⚡ **Next.js 15** with App Router
- 🔄 **Real-time updates**
- 📱 **Mobile-first responsive design**
- 🚀 **Optimized performance**

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: JWT with refresh tokens
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## New Arrivals Feature

The website includes a special "New Arrivals" feature that allows administrators to mark products as new arrivals or festival items:

### Admin Features
- **Mark Products as New Arrivals**: In the admin products page, administrators can toggle the "New Arrival" checkbox for any product
- **Product Management**: Full CRUD operations with new arrivals support
- **Visual Indicators**: New arrival products are clearly marked in the admin interface

### User Features
- **Homepage Display**: New arrivals are prominently displayed in a dedicated section on the homepage
- **Special Styling**: New arrival products feature gradient badges and special styling
- **Filtering**: Users can filter products to show only new arrivals
- **URL Support**: Direct links to new arrivals via `/products?newArrivals=true`

### Technical Implementation
- **Database**: Added `isNewArrival` field to the Product model
- **API**: Enhanced product endpoints to support new arrivals filtering
- **Frontend**: Added new arrivals section with animations and special styling
- **Responsive**: Fully responsive design for all screen sizes

### Cloudinary Image Management
- **Organized Storage**: Images are automatically organized in Cloudinary folders based on product names
- **Drag & Drop Upload**: Easy image upload with drag & drop functionality
- **Image Optimization**: Automatic image optimization and format conversion
- **Cleanup**: Automatic deletion of images when products are deleted or updated
- **Folder Structure**: `products/{product-name}/` format for easy organization

## Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- Cloudinary account (for image storage)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd home-decor-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Cloudinary**
   - Create a free account at [Cloudinary](https://cloudinary.com/)
   - Get your Cloud Name, API Key, and API Secret from the dashboard
   - These will be used for image uploads and storage

4. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/home-decor

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production

   # Cloudinary Configuration (for image uploads)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Next.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production
   ```

5. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `home-decor`
   - Update the `MONGODB_URI` in your `.env.local` file

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin pages
│   │   ├── layout.tsx     # Admin layout
│   │   ├── page.tsx       # Admin dashboard
│   │   └── settings/      # Admin settings
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── products/      # Product endpoints
│   │   ├── settings/      # Settings endpoints
│   │   └── admin/         # Admin endpoints
│   ├── login/             # Login page
│   ├── register/          # Register page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   └── layout/           # Layout components
├── hooks/                # Custom hooks
├── lib/                  # Utility functions
├── models/               # MongoDB models
└── types/                # TypeScript types
```

## Database Models

### User
- Authentication details
- Role-based access (user/admin)
- Profile information

### Product
- Product details
- Images, pricing, categories
- Stock management
- Reviews and ratings

### Order
- Order management
- Payment status
- Shipping information

### Settings
- Website configuration
- Content visibility controls
- Admin preferences

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh

### Products
- `GET /api/products` - Get products with filters
- `POST /api/products` - Create product (admin)
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Upload
- `POST /api/upload` - Upload image to Cloudinary (admin)

### Settings
- `GET /api/settings` - Get website settings
- `PUT /api/settings` - Update settings (admin)

### Admin
- `GET /api/admin/users` - Get users (admin)
- `PUT /api/admin/users` - Update user (admin)

## Admin Features

### Dashboard
- Overview statistics
- Recent activity
- Quick actions
- Performance metrics

### Settings Management
- **Content Visibility**: Control what users see
- **Hero Section**: Customize homepage hero
- **Contact Information**: Update contact details
- **Social Media**: Manage social links
- **Maintenance Mode**: Enable/disable site
- **General Settings**: Site name, description, etc.

### User Management
- View all users
- Change user roles
- Activate/deactivate users
- User statistics

## User Features

### Homepage
- Dynamic hero section (controlled by admin)
- Featured products (toggleable)
- Category showcase (toggleable)
- Testimonials (toggleable)
- Newsletter signup (toggleable)

### Product Browsing
- Category-based filtering
- Search functionality
- Product details with images
- Reviews and ratings
- Add to cart/wishlist

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
- **Netlify**: Similar to Vercel
- **Railway**: Good for full-stack apps
- **DigitalOcean**: More control

## Environment Variables

Make sure to set these environment variables in production:

```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
NEXTAUTH_URL=your-production-url
NEXTAUTH_SECRET=your-production-nextauth-secret
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@homedecor.com or create an issue in the repository.

## Screenshots

[Add screenshots of your application here]

---

**Note**: This is a demo project. For production use, make sure to:
- Change all secret keys
- Set up proper security measures
- Configure CORS properly
- Set up proper error handling
- Add comprehensive testing
- Configure proper logging
- Set up monitoring and analytics
