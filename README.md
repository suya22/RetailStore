# RetailStore E-commerce Platform

A full-stack e-commerce platform for clothing and accessories built with the MERN stack (MongoDB, Express, React, Node.js).

![RetailStore Store Screenshot](https://placeholder.svg?height=400&width=800)

## Features

- *User Authentication*: Secure login and registration system
- *Product Catalog*: Browse products with filtering and search capabilities
- *Shopping Cart*: Add, remove, and update items in cart
- *Checkout Process*: Complete purchase flow with shipping and payment options
- *User Profiles*: View order history and manage account details
- *Admin Dashboard*: Manage products, orders, and users
- *Responsive Design*: Mobile-friendly interface
- *Payment Integration*: Ready for payment gateway integration (Coming soon.....)

## Technologies Used

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- Bootstrap 5 for UI components
- Framer Motion for animations
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Setup Instructions

1. *Clone the repository*
   \\\`bash
   git clone https://github.com/yourusername/RetailStore.git cd RetailStore
   \\\`

3. *Install server dependencies*
   \\\`bash
   cd backend
   npm install
   \\\`

4. *Install client dependencies*
   \\\`bash
   cd RetailStoreFront
   npm install
   \\\`

5. *Set up environment variables*
   
   Create a .env file in the backend directory with the following variables:
   \\\`
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   \\\`

6. *Seed the database (optional)*
   \\\`bash
   cd backend/seed
   node seed.js
   \\\`
   This will create initial categories and an admin user.

## Running the Application

1. *Start the backend server*
   \\\`bash
   cd backend
   npm run dev
   \\\`

2. *Start the frontend development server*
   \\\`bash
   cd RetailStoreFront
   npm run dev
   \\\`

3. *Access the application*
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Admin Access

After running the seeder script, you can log in as an admin with:
- Email: admin@retail.com
- Password: admin123


## Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Bootstrap](https://getbootstrap.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Framer Motion](https://www.framer.com/motion/)
- [Cloudinary](https://cloudinary.com/)
