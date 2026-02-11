# E-AGRI - Digital Agriculture Management System

![E-AGRI Logo](frontend/assets/images/logo.png)

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Requirements](#system-requirements)
- [Installation Guide](#installation-guide)
- [Project Structure](#project-structure)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

E-AGRI is a comprehensive digital agriculture management platform that connects farmers, dealers, and administrators in one unified system. The platform provides real-time agricultural information, AI-powered crop recommendations, an online marketplace, and multilingual support to digitize agriculture management.

### Key Objectives
- Digitize agriculture information management
- Provide verified dealers and trusted products
- Help farmers make data-driven decisions
- Enable multilingual and voice-based access
- Centralize agriculture services into one platform

## ✨ Features

### For Farmers 👨‍🌾
- ☁️ **Real-time Weather Updates** - Location-based weather forecasts and alerts
- 📈 **Market Prices** - Daily mandi crop prices for informed selling decisions
- 🤖 **AI Recommendations** - Smart crop suggestions based on soil type and season
- 🛒 **Online Marketplace** - Buy quality crops, fertilizers, and equipment
- 🎤 **Voice Support** - Voice-based interaction in regional languages
- 🌍 **Multi-language** - Available in English, Kannada, and Hindi

### For Dealers 🏪
- 📦 **Product Management** - Add, edit, and manage product inventory
- 📊 **Sales Analytics** - Track orders and view sales reports
- ✅ **Verification Badge** - Get verified by admin for credibility
- 🚚 **Order Tracking** - Manage and fulfill customer orders
- 💼 **Business Dashboard** - Comprehensive dealer analytics

### For Administrators 👨‍💼
- 🎛️ **Platform Management** - Control users, dealers, and content
- 🌤️ **Weather Updates** - Update location-based weather data
- 💰 **Market Prices** - Update daily crop prices
- 📰 **News Management** - Post agriculture news and updates
- ✔️ **Dealer Verification** - Approve or reject dealer registrations
- 📊 **Analytics Dashboard** - View platform statistics and insights

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Page structure and semantics
- **CSS3** - Styling with modern features (Grid, Flexbox, Animations)
- **JavaScript (ES6+)** - Client-side interactivity
- **Bootstrap 5** - Responsive design framework
- **Font Awesome 6** - Icon library
- **Google Fonts** - Typography (Poppins)

### Backend
- **PHP 8+** - Server-side logic
- **MySQL 8+** - Relational database
- **PDO** - Database abstraction layer
- **RESTful API** - API architecture

### External APIs
- **OpenWeather API** - Weather data
- **OpenAI API** - AI chatbot
- **Web Speech API** - Speech-to-text
- **Google Translate API** - Multi-language support

### Development Tools
- **XAMPP/WAMP** - Local development server
- **phpMyAdmin** - Database management
- **Git** - Version control

## 💻 System Requirements

### Minimum Requirements
- **PHP**: 8.0 or higher
- **MySQL**: 8.0 or higher
- **Web Server**: Apache 2.4+ or Nginx
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **RAM**: 2GB minimum
- **Storage**: 500MB free space

### Recommended Requirements
- **PHP**: 8.1+
- **MySQL**: 8.0+
- **RAM**: 4GB or more
- **Storage**: 1GB free space
- **SSD**: For better performance

## 📥 Installation Guide

### Step 1: Download and Install XAMPP

1. Download XAMPP from [https://www.apachefriends.org](https://www.apachefriends.org)
2. Install XAMPP with PHP 8.0+ and MySQL
3. Start Apache and MySQL services from XAMPP Control Panel

### Step 2: Clone or Download Project

```bash
# Clone repository (if using Git)
git clone https://github.com/yourusername/eagri-app.git

# Or download ZIP and extract to XAMPP htdocs folder
# Default location: C:\xampp\htdocs\eagri-app
```

### Step 3: Database Setup

1. Open phpMyAdmin in browser: `http://localhost/phpmyadmin`
2. Create a new database named `eagri_db`
3. Import the database schema:
   - Click on `eagri_db` database
   - Go to "Import" tab
   - Choose file: `database/eagri_database_schema.sql`
   - Click "Go" to import

### Step 4: Configure Database Connection

Edit `backend/config/database.php`:

```php
private $host = "localhost";
private $db_name = "eagri_db";
private $username = "root";
private $password = ""; // Your MySQL password
```

### Step 5: Configure API Keys (Optional)

Edit configuration files to add API keys:

```php
// For OpenWeather API
define('OPENWEATHER_API_KEY', 'your-api-key-here');

// For OpenAI API
define('OPENAI_API_KEY', 'your-api-key-here');

// For Google Translate API
define('GOOGLE_TRANSLATE_KEY', 'your-api-key-here');
```

### Step 6: Set Permissions

Ensure proper file permissions (Linux/Mac):

```bash
chmod -R 755 /path/to/eagri-app
chmod -R 777 /path/to/eagri-app/uploads
```

### Step 7: Access the Application

Open your browser and navigate to:
```
http://localhost/eagri-app/frontend/
```

### Default Admin Credentials

```
Email: admin@eagri.com
Password: admin123
```

**⚠️ IMPORTANT: Change the default admin password immediately after first login!**

## 📁 Project Structure

```
eagri-app/
│
├── frontend/                   # Frontend application
│   ├── index.html             # Landing page
│   ├── login.html             # Login page
│   ├── register.html          # Registration page
│   ├── farmer-dashboard.html  # Farmer dashboard
│   ├── dealer-dashboard.html  # Dealer dashboard
│   ├── admin-dashboard.html   # Admin dashboard
│   │
│   └── assets/
│       ├── css/
│       │   ├── style.css      # Main stylesheet
│       │   └── auth.css       # Authentication styles
│       ├── js/
│       │   ├── main.js        # Main JavaScript
│       │   └── auth.js        # Authentication JS
│       └── images/            # Image assets
│
├── backend/                   # Backend application
│   ├── api/                   # API endpoints
│   │   ├── auth.php          # Authentication API
│   │   ├── products.php      # Products API
│   │   ├── orders.php        # Orders API
│   │   └── weather.php       # Weather API
│   │
│   ├── config/               # Configuration files
│   │   └── database.php      # Database config
│   │
│   ├── models/               # Data models
│   │   ├── User.php          # User model
│   │   ├── Product.php       # Product model
│   │   ├── Order.php         # Order model
│   │   └── Weather.php       # Weather model
│   │
│   └── controllers/          # Business logic
│       ├── AuthController.php
│       ├── ProductController.php
│       └── OrderController.php
│
├── database/                 # Database files
│   ├── eagri_database_schema.sql
│   └── sample_data.sql
│
├── uploads/                  # User uploaded files
│   ├── products/            # Product images
│   └── profiles/            # Profile pictures
│
├── logs/                    # Application logs
│   └── error.log
│
├── docs/                    # Documentation
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   └── USER_GUIDE.md
│
└── README.md               # This file
```

## 🗄️ Database Setup

### Database Schema Overview

The E-AGRI database consists of 18 tables organized into 8 modules:

1. **User Management** (3 tables)
   - `users` - Master user table
   - `farmers` - Farmer profiles
   - `dealers` - Dealer profiles

2. **Product Catalog** (2 tables)
   - `product_categories` - Product categories
   - `products` - Product listings

3. **Order Management** (2 tables)
   - `orders` - Order headers
   - `order_items` - Order line items

4. **Agriculture Information** (3 tables)
   - `weather_data` - Weather forecasts
   - `market_prices` - Crop prices
   - `agriculture_news` - News articles

5. **AI & Recommendations** (2 tables)
   - `soil_crop_recommendations` - Crop suggestions
   - `chatbot_conversations` - AI chat logs

6. **Notifications** (2 tables)
   - `notifications` - User notifications
   - `support_tickets` - Support system

7. **Analytics** (2 tables)
   - `user_activity_logs` - Activity tracking
   - `search_history` - Search analytics

### Import Database

```bash
# Using MySQL command line
mysql -u root -p eagri_db < database/eagri_database_schema.sql

# Or use phpMyAdmin Import feature
```

### Database Configuration

Located in: `backend/config/database.php`

```php
class Database {
    private $host = "localhost";
    private $db_name = "eagri_db";
    private $username = "root";
    private $password = "";
    // ...
}
```

## ⚙️ Configuration

### 1. Database Configuration

File: `backend/config/database.php`

Update the database credentials:
```php
private $host = "localhost";
private $db_name = "eagri_db";
private $username = "your_username";
private $password = "your_password";
```

### 2. API Configuration

File: `backend/config/api_config.php`

```php
// OpenWeather API
define('OPENWEATHER_API_KEY', 'your-key');
define('OPENWEATHER_BASE_URL', 'https://api.openweathermap.org/data/2.5/');

// OpenAI API
define('OPENAI_API_KEY', 'your-key');
define('OPENAI_MODEL', 'gpt-3.5-turbo');
```

### 3. Application Settings

File: `backend/config/app_config.php`

```php
// Application Settings
define('APP_NAME', 'E-AGRI');
define('APP_URL', 'http://localhost/eagri-app');
define('UPLOAD_PATH', __DIR__ . '/../../uploads/');
define('MAX_FILE_SIZE', 5242880); // 5MB

// Session Settings
define('SESSION_LIFETIME', 86400); // 24 hours

// Security Settings
define('PASSWORD_MIN_LENGTH', 8);
define('MAX_LOGIN_ATTEMPTS', 5);
```

## 🚀 Usage

### User Registration

1. Visit the registration page
2. Choose role (Farmer or Dealer)
3. Fill in required information
4. Submit the form
5. **Farmers**: Automatically approved
6. **Dealers**: Wait for admin verification

### User Login

1. Visit the login page
2. Enter email and password
3. Click "Login"
4. Redirected to role-specific dashboard

### Farmer Workflow

1. **View Dashboard** - See weather, prices, news
2. **Browse Products** - Search and filter products
3. **Add to Cart** - Select products to purchase
4. **Place Order** - Checkout and confirm order
5. **Track Order** - Monitor order status
6. **Get AI Recommendations** - Ask chatbot for advice

### Dealer Workflow

1. **Complete Profile** - Add business details
2. **Wait for Verification** - Admin approval required
3. **Add Products** - List products with details
4. **Manage Inventory** - Update stock levels
5. **Process Orders** - Fulfill customer orders
6. **View Analytics** - Track sales performance

### Admin Workflow

1. **Verify Dealers** - Approve or reject applications
2. **Update Weather** - Post weather forecasts
3. **Update Prices** - Enter daily market prices
4. **Post News** - Publish agriculture news
5. **Manage Users** - View and manage all users
6. **View Analytics** - Monitor platform statistics

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```
POST /backend/api/auth.php?action=register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "role": "farmer",
  "phone": "9876543210"
}
```

#### Login User
```
POST /backend/api/auth.php?action=login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Logout User
```
POST /backend/api/auth.php?action=logout
```

### Product Endpoints

#### Get All Products
```
GET /backend/api/products.php?action=list
Optional Query Parameters:
  - category_id
  - search
  - is_organic
  - max_price
```

#### Get Product Details
```
GET /backend/api/products.php?action=get&id=123
```

#### Create Product (Dealer only)
```
POST /backend/api/products.php?action=create
Content-Type: application/json

{
  "category_id": 1,
  "product_name": "Organic Fertilizer",
  "description": "High quality organic fertilizer",
  "price": 500,
  "unit": "kg",
  "stock_quantity": 100
}
```

## 🔒 Security

### Password Security
- Passwords hashed using `password_hash()` with bcrypt
- Minimum 8 characters required
- Complexity requirements enforced

### SQL Injection Prevention
- PDO prepared statements used throughout
- All inputs sanitized and validated

### XSS Prevention
- `htmlspecialchars()` used on all output
- Content Security Policy headers

### CSRF Protection
- Session-based CSRF tokens
- Token validation on all forms

### Authentication
- Session-based authentication
- Auto-logout after inactivity
- Secure session configuration

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration (Farmer & Dealer)
- [ ] User login/logout
- [ ] Password reset
- [ ] Product CRUD operations
- [ ] Order placement
- [ ] Payment processing
- [ ] Weather data display
- [ ] Market prices display
- [ ] AI chatbot interaction
- [ ] Multi-language switching
- [ ] Voice input

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Connection refused" or database error
- **Solution**: Check MySQL service is running in XAMPP
- Verify database credentials in `config/database.php`

**Issue**: 404 errors on API calls
- **Solution**: Check `.htaccess` file exists
- Verify Apache mod_rewrite is enabled

**Issue**: File upload fails
- **Solution**: Check `uploads/` folder permissions (777)
- Verify `upload_max_filesize` in `php.ini`

**Issue**: Session not persisting
- **Solution**: Check session save path is writable
- Verify `session.save_path` in `php.ini`

## 📞 Support

For support and questions:
- Email: support@eagri.com
- GitHub Issues: [https://github.com/yourusername/eagri-app/issues](https://github.com/yourusername/eagri-app/issues)
- Documentation: [https://docs.eagri.com](https://docs.eagri.com)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenWeather API for weather data
- OpenAI for AI capabilities
- Font Awesome for icons
- Bootstrap team for the framework
- All contributors and testers

## 📈 Future Enhancements

- [ ] Mobile application (Android & iOS)
- [ ] IoT integration for soil sensors
- [ ] Online payment gateway
- [ ] SMS/Email notifications
- [ ] Government scheme integration
- [ ] Blockchain for supply chain tracking
- [ ] Advanced analytics and reporting
- [ ] Social features (farmer community)
- [ ] Video tutorials and courses

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Maintained By**: E-AGRI Development Team

For the latest updates, visit our [GitHub repository](https://github.com/yourusername/eagri-app).
