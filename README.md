# NexStore — Premium Full-Stack 3D E-Commerce Platform

NexStore is a full-stack, state-of-the-art 3D e-commerce web application. Customers can search, inspect premium items in a fully interactive 3D WebGL Canvas before buying, customize sizes/colors, manage carts/wishlists, checkout, and send inquiries. The platform includes a comprehensive Admin Panel for dynamic catalog creation, stock levels, reordering product media galleries, and local disk image uploads.

---

## 🚀 Key Features

* 🌟 **Interactive 3D Product Visualizations**:
  - Procedural 3D WebGL models for different product categories (T-Shirts, Sneakers, Watches, Headphones, and Laptops) built with **React Three Fiber** and **Three.js**.
  - Dynamic orbital controls: rotate via mouse drag, zoom in/out via scroll, auto-rotation, and interactive point lighting.
  - **Graceful 3D Card Fallback**: If a product has no custom category model, it renders a floating glassmorphic 3D card texture-mapped with the product's actual image.
* 💳 **Dynamic Shopping Cart & Wishlist**: Persistent database-backed shopping cart and wishlist synced to user accounts.
* 🛡️ **JWT Custom Authentication & Roles**: Custom mock Supabase auth layer connecting to Express JWT auth endpoints (`/api/auth`) with automatic route-guarding based on roles (User vs Admin).
* 📊 **Admin Dashboard**: Complete catalog management panel (Add, Edit, Delete products, manage stock levels, and customize sizes/colors) with changes updating instantly in real-time.
* 🖼️ **Image Gallery Manager**: Upload product images from local disk (stored in `backend/uploads/` statically) or URL, reorder cover images, and delete from database with immediate visual updates.
* 📨 **Contact Center & FAQ Desk**:
  - Validation-equipped Contact Page built with Framer Motion animations and glassmorphic cards.
  - Interlinked support info, phone hotline, and Radix-based accordion FAQ answers.
  - **Nodemailer Admin Emails**: Sends HTML notification alerts to the administrator upon contact form submissions.
* 🏷️ **Brand Logo Carousel & Filtering**:
  - Infinite looping brand carousel showing professional transparent SVG logos for Nike, Adidas, Puma, Zara, H&M, Gucci, Apple, Samsung, Sony, Rolex, Casio, and Levi's.
  - Grayscale-to-color transition, scale bounce, and a golden shadow glow on hover.
  - Clicking any brand logo filters and shows only that brand's products on the Search page, with a clearable gold filter badge.

---

## 🛠️ Technology Stack

### Frontend (User Interface)
* **Core**: React, JavaScript (ES Modules)
* **Routing**: TanStack Start & TanStack Router (File-based routing)
* **Data Fetching & Cache**: TanStack React Query (v5)
* **Styling**: Vanilla CSS, TailwindCSS (for utility structures)
* **Animations**: Framer Motion
* **3D Graphics**: Three.js, React Three Fiber (R3F), `@react-three/drei`
* **Icons & Feedback**: Lucide React, Sonner (Toasts)

### Backend (Server API & DB)
* **Runtime**: Node.js & Express server
* **Database**: MongoDB & Mongoose schemas
* **Authentication**: JWT (JsonWebToken), BcryptJS (password hashing)
* **File Processing**: Multer (disk storage uploads)
* **Email Broker**: Nodemailer (SMTP transport)

---

## 📂 Project Structure

```text
NexStore/
├── backend/
│   ├── config/              # MongoDB connection setup
│   ├── controllers/         # Express API controllers (auth, products, contacts, orders, etc.)
│   ├── middleware/          # JWT protect and Admin auth filters
│   ├── models/              # Mongoose database schemas (User, Product, Category, Brand, etc.)
│   ├── routes/              # Express API router definitions
│   ├── uploads/             # Locally uploaded product images (served statically)
│   ├── utils/               # Database seeder scripts
│   ├── .env                 # Database & SMTP Email credentials
│   ├── server.js            # Express entry point
│   └── package.json
└── frontend/
    ├── public/              # Favicon, static client assets
    ├── src/
    │   ├── components/      # UI components (Nav, Footer, Product3DViewer, BrandCarousel)
    │   ├── hooks/           # Custom React hooks
    │   ├── integrations/    # Supabase Mock custom fetch adapter (client.js)
    │   ├── lib/             # React Query bindings (queries.js) & useAuth.js
    │   ├── routes/          # TanStack Start File-based routes (index, search, contact, admin, etc.)
    │   ├── routeTree.gen.ts # Auto-generated TanStack Router tree mappings
    │   ├── router.jsx       # Router initialization
    │   └── styles.css       # Core stylesheet & custom animations (marquee, glassmorphism)
    └── vite.config.js       # Vite configuration with backend proxy
```

---

## ⚙️ Setup and Installation

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+)
* [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on port `27017` (or remote MongoDB URI).

### 1. Database & Backend Setup
Navigate to the `backend` folder, install dependencies, and configure environment variables.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```

### 2. Seed the Database
NexStore comes with a seeder script that populates categories, brand structures, users, and **239 realistic catalog products** matching all visual categories. Run this script to populate your database:

```bash
npm run seed
```

### 3. Frontend Setup
Navigate to the `frontend` folder and install dependencies:

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory (for API bindings):


```

---

## 🚀 Running the Platform

### 1. Start MongoDB Connection
Ensure MongoDB is running locally.

### 2. Launch Express Backend Server
In the `backend` folder, run the development script. It executes Nodemon to auto-reload on code updates:
```bash
cd backend
npm run dev
```
*Console output should verify: `Server running in development mode on port 5000` and `MongoDB Connected: localhost`.*

### 3. Launch Vite Frontend Server
In the `frontend` folder, launch the Vite development server:
```bash
cd ../frontend
npm run dev
```
Vite will proxy all API endpoint requests (`/api`) and static image uploads (`/uploads`) directly to the backend running on port `5000`.

---

## 🔐 Seeded Accounts

Use these pre-registered user logins to test authentication and role management:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@nexstore.com` | `admin123` |
| **Standard Customer** | `user@nexstore.com` | `user123` |

---

## 🧪 Verification Tasks

1. **Logout Flow**: Log in using any account, hover/click the user icon dropdown in the Navbar (or visit `/dashboard`), and select **Logout**. Verify that local JWT is deleted, a success toast `"Logged out successfully."` is displayed, and the browser redirects to `/`.
2. **Product 3D Viewer**: Open any product page. Verify custom models render for T-Shirts, Sneakers, Watches, Headphones, and Laptops. Ensure other catalog categories render the 3D Image-Card Fallback gracefully.
3. **Contact Submission**: Go to `/contact`, fill in form inputs, and click **Send Message**. Confirm that:
   - Success toast `"Your message has been sent successfully."` is displayed.
   - Message is saved inside MongoDB `contactMessages` collection.
   - Email is dispatched to the admin recipient configured in the backend `.env`.
4. **Brand Carousel Filtering**: Click any brand logo on the home carousel (e.g. Nike, Apple, Samsung, Levi's). Verify it redirects to `/search` with the query string pre-set, showing only products of that brand under a gold badge filter.
5. **Image Upload (Admin)**: Log in as `admin@nexstore.com`, edit a product in the Admin Panel, select a local image from your disk, and save. Verify that the image uploads correctly to `backend/uploads/` and fires a toast `"Image updated successfully."` with zero JSON parse syntax errors.

eeded Credentials for Testing:
Admin Login: admin@nexstore.com (password: admin123)
Standard User Login: user@nexstore.com (password: user123)