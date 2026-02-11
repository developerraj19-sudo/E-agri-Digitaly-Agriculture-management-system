-- ============================================
-- E-AGRI Database Schema Design
-- Agriculture Digital Management System
-- ============================================

-- ============================================
-- 1. USER MANAGEMENT TABLES
-- ============================================

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role ENUM('admin', 'farmer', 'dealer') NOT NULL,
    preferred_language ENUM('english', 'kannada', 'hindi') DEFAULT 'english',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE farmers (
    farmer_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    farm_location VARCHAR(255),
    farm_size_acres DECIMAL(10,2),
    soil_type ENUM('black', 'red', 'alluvial', 'clay', 'sandy', 'loamy') NULL,
    primary_crop VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_location (district, state),
    INDEX idx_soil_type (soil_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE dealers (
    dealer_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_license VARCHAR(100),
    gst_number VARCHAR(20),
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    verified_by INT NULL,
    verified_at TIMESTAMP NULL,
    rejection_reason TEXT NULL,
    business_address TEXT,
    district VARCHAR(100),
    state VARCHAR(100),
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_verification_status (verification_status),
    INDEX idx_location (district, state)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 2. PRODUCT CATALOG TABLES
-- ============================================

CREATE TABLE product_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    category_type ENUM('crop', 'fertilizer', 'pesticide', 'equipment', 'seeds') NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    
    UNIQUE KEY unique_category (category_name, category_type),
    INDEX idx_type (category_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    dealer_id INT NOT NULL,
    category_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    unit ENUM('kg', 'quintal', 'ton', 'liter', 'piece', 'packet') NOT NULL,
    stock_quantity DECIMAL(10,2) DEFAULT 0,
    min_order_quantity DECIMAL(10,2) DEFAULT 1,
    product_image_url VARCHAR(500),
    is_organic BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (dealer_id) REFERENCES dealers(dealer_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES product_categories(category_id),
    INDEX idx_dealer (dealer_id),
    INDEX idx_category (category_id),
    INDEX idx_available (is_available),
    INDEX idx_price (price),
    FULLTEXT idx_search (product_name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 3. ORDER MANAGEMENT TABLES
-- ============================================

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    farmer_id INT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    order_status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    delivery_address TEXT NOT NULL,
    delivery_pincode VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id) ON DELETE CASCADE,
    INDEX idx_farmer (farmer_id),
    INDEX idx_status (order_status),
    INDEX idx_order_number (order_number),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    dealer_id INT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    item_status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (dealer_id) REFERENCES dealers(dealer_id),
    INDEX idx_order (order_id),
    INDEX idx_product (product_id),
    INDEX idx_dealer (dealer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 4. AGRICULTURE INFORMATION TABLES
-- ============================================

CREATE TABLE weather_data (
    weather_id INT PRIMARY KEY AUTO_INCREMENT,
    location VARCHAR(255) NOT NULL,
    district VARCHAR(100),
    state VARCHAR(100),
    temperature DECIMAL(5,2),
    feels_like DECIMAL(5,2),
    humidity INT,
    wind_speed DECIMAL(5,2),
    weather_condition VARCHAR(100),
    description TEXT,
    rainfall DECIMAL(5,2) DEFAULT 0,
    forecast_date DATE,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT,
    
    FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_location (district, state),
    INDEX idx_forecast_date (forecast_date),
    INDEX idx_recorded_at (recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE market_prices (
    price_id INT PRIMARY KEY AUTO_INCREMENT,
    crop_name VARCHAR(100) NOT NULL,
    market_location VARCHAR(255) NOT NULL,
    district VARCHAR(100),
    state VARCHAR(100),
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    modal_price DECIMAL(10,2) NOT NULL,
    unit ENUM('quintal', 'kg', 'ton') DEFAULT 'quintal',
    price_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT,
    
    FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_crop (crop_name),
    INDEX idx_location (district, state),
    INDEX idx_price_date (price_date),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE agriculture_news (
    news_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    content LONGTEXT,
    category ENUM('weather', 'market', 'technique', 'government_scheme', 'general') NOT NULL,
    image_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    priority INT DEFAULT 0,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_category (category),
    INDEX idx_featured (is_featured),
    INDEX idx_published_at (published_at),
    FULLTEXT idx_search (title, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 5. AI & RECOMMENDATION TABLES
-- ============================================

CREATE TABLE soil_crop_recommendations (
    recommendation_id INT PRIMARY KEY AUTO_INCREMENT,
    soil_type ENUM('black', 'red', 'alluvial', 'clay', 'sandy', 'loamy') NOT NULL,
    season ENUM('kharif', 'rabi', 'zaid', 'year_round') NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    suitability_score INT CHECK (suitability_score BETWEEN 1 AND 10),
    water_requirement ENUM('low', 'medium', 'high') NOT NULL,
    fertilizer_recommendation TEXT,
    expected_yield VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_recommendation (soil_type, season, crop_name),
    INDEX idx_soil_season (soil_type, season)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE chatbot_conversations (
    conversation_id INT PRIMARY KEY AUTO_INCREMENT,
    farmer_id INT NOT NULL,
    user_query TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    query_type ENUM('crop_suggestion', 'fertilizer', 'pest_control', 'weather', 'general') NULL,
    is_voice_input BOOLEAN DEFAULT FALSE,
    language ENUM('english', 'kannada', 'hindi') DEFAULT 'english',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (farmer_id) REFERENCES farmers(farmer_id) ON DELETE CASCADE,
    INDEX idx_farmer (farmer_id),
    INDEX idx_query_type (query_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 6. NOTIFICATION & SUPPORT TABLES
-- ============================================

CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('order', 'weather', 'price_alert', 'news', 'system') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE support_tickets (
    ticket_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    assigned_to INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 7. ANALYTICS & LOGGING TABLES
-- ============================================

CREATE TABLE user_activity_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    activity_description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE search_history (
    search_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    search_query VARCHAR(500) NOT NULL,
    search_category ENUM('products', 'news', 'weather', 'prices', 'general') NULL,
    results_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_query (search_query)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 9. SECURITY & RATE LIMITING TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS login_attempts (
    attempt_id INT PRIMARY KEY AUTO_INCREMENT,
    ip_address VARCHAR(45) NOT NULL,
    email VARCHAR(255),
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN DEFAULT FALSE,
    
    INDEX idx_ip (ip_address),
    INDEX idx_email (email),
    INDEX idx_time (attempt_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- 8. INITIAL DATA SEEDS
-- ============================================

-- Insert default admin user (password: admin123 - should be changed)
INSERT INTO users (email, password_hash, full_name, role, preferred_language) 
VALUES ('admin@eagri.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Admin', 'admin', 'english');

-- Insert product categories
INSERT INTO product_categories (category_name, category_type) VALUES
('Rice Seeds', 'seeds'),
('Wheat Seeds', 'seeds'),
('Organic Fertilizer', 'fertilizer'),
('Chemical Fertilizer', 'fertilizer'),
('Pesticides', 'pesticide'),
('Farm Equipment', 'equipment'),
('Vegetables', 'crop'),
('Grains', 'crop');

-- Insert soil-crop recommendations
INSERT INTO soil_crop_recommendations (soil_type, season, crop_name, suitability_score, water_requirement, fertilizer_recommendation, expected_yield) VALUES
('black', 'kharif', 'Cotton', 9, 'medium', 'NPK 10:26:26 @ 50kg/acre', '10-12 quintal/acre'),
('black', 'kharif', 'Soybean', 8, 'medium', 'DAP @ 50kg/acre', '8-10 quintal/acre'),
('red', 'rabi', 'Groundnut', 9, 'low', 'Gypsum @ 200kg/acre', '12-15 quintal/acre'),
('alluvial', 'kharif', 'Rice', 10, 'high', 'Urea @ 60kg/acre', '25-30 quintal/acre'),
('clay', 'rabi', 'Wheat', 9, 'medium', 'NPK 12:32:16 @ 75kg/acre', '20-25 quintal/acre'),
('sandy', 'year_round', 'Watermelon', 8, 'medium', 'Organic Compost @ 2 ton/acre', '100-120 fruits/acre'),
('loamy', 'kharif', 'Maize', 9, 'medium', 'DAP @ 40kg/acre', '18-22 quintal/acre');
