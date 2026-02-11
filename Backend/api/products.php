<?php
/**
 * Products API
 * Handles product CRUD operations
 */

require_once '../config/database.php';
require_once '../models/Product.php';

setCorsHeaders();

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    sendJsonResponse(false, "Database connection failed", null, 500);
}

$product = new Product($db);
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

/**
 * GET ALL PRODUCTS
 */
if ($method === 'GET' && $action === 'list') {
    $filters = [
        'category_id' => $_GET['category_id'] ?? '',
        'search' => $_GET['search'] ?? '',
        'is_organic' => $_GET['is_organic'] ?? '',
        'max_price' => $_GET['max_price'] ?? ''
    ];
    
    $products = $product->getAllProducts($filters);
    sendJsonResponse(true, "Products retrieved successfully", $products, 200);
}

/**
 * GET PRODUCT BY ID
 */
elseif ($method === 'GET' && $action === 'get') {
    $product_id = $_GET['id'] ?? 0;
    
    if (!$product_id) {
        sendJsonResponse(false, "Product ID required", null, 400);
    }
    
    $productData = $product->getProductById($product_id);
    
    if ($productData) {
        sendJsonResponse(true, "Product retrieved successfully", $productData, 200);
    } else {
        sendJsonResponse(false, "Product not found", null, 404);
    }
}

/**
 * GET PRODUCTS BY DEALER
 */
elseif ($method === 'GET' && $action === 'dealer-products') {
    session_start();
    
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'dealer') {
        sendJsonResponse(false, "Unauthorized access", null, 401);
    }
    
    // Get dealer_id from dealers table
    $query = "SELECT dealer_id FROM dealers WHERE user_id = :user_id LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $_SESSION['user_id']);
    $stmt->execute();
    $dealer = $stmt->fetch();
    
    if (!$dealer) {
        sendJsonResponse(false, "Dealer profile not found", null, 404);
    }
    
    $products = $product->getProductsByDealer($dealer['dealer_id']);
    sendJsonResponse(true, "Products retrieved successfully", $products, 200);
}

/**
 * CREATE PRODUCT (Dealer only)
 */
elseif ($method === 'POST' && $action === 'create') {
    session_start();
    
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'dealer') {
        sendJsonResponse(false, "Unauthorized access", null, 401);
    }
    
    $data = json_decode(file_get_contents("php://input"));
    
    // Get dealer_id
    $query = "SELECT dealer_id, verification_status FROM dealers WHERE user_id = :user_id LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $_SESSION['user_id']);
    $stmt->execute();
    $dealer = $stmt->fetch();
    
    if (!$dealer) {
        sendJsonResponse(false, "Dealer profile not found", null, 404);
    }
    
    if ($dealer['verification_status'] !== 'verified') {
        sendJsonResponse(false, "Your dealer account is not verified yet", null, 403);
    }
    
    // Validate required fields
    if (
        empty($data->product_name) ||
        empty($data->category_id) ||
        empty($data->price) ||
        empty($data->unit)
    ) {
        sendJsonResponse(false, "Missing required fields", null, 400);
    }
    
    // Set product data
    $product->dealer_id = $dealer['dealer_id'];
    $product->category_id = $data->category_id;
    $product->product_name = sanitizeInput($data->product_name);
    $product->description = sanitizeInput($data->description ?? '');
    $product->price = $data->price;
    $product->unit = $data->unit;
    $product->stock_quantity = $data->stock_quantity ?? 0;
    $product->min_order_quantity = $data->min_order_quantity ?? 1;
    $product->product_image_url = sanitizeInput($data->product_image_url ?? '');
    $product->is_organic = $data->is_organic ?? false;
    
    if ($product->create()) {
        sendJsonResponse(true, "Product created successfully", [
            'product_id' => $product->product_id
        ], 201);
    } else {
        sendJsonResponse(false, "Failed to create product", null, 500);
    }
}

/**
 * UPDATE PRODUCT (Dealer only)
 */
elseif ($method === 'PUT' && $action === 'update') {
    session_start();
    
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'dealer') {
        sendJsonResponse(false, "Unauthorized access", null, 401);
    }
    
    $data = json_decode(file_get_contents("php://input"));
    
    // Get dealer_id
    $query = "SELECT dealer_id FROM dealers WHERE user_id = :user_id LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $_SESSION['user_id']);
    $stmt->execute();
    $dealer = $stmt->fetch();
    
    if (!$dealer) {
        sendJsonResponse(false, "Dealer profile not found", null, 404);
    }
    
    if (empty($data->product_id)) {
        sendJsonResponse(false, "Product ID required", null, 400);
    }
    
    // Set product data
    $product->product_id = $data->product_id;
    $product->dealer_id = $dealer['dealer_id'];
    $product->category_id = $data->category_id;
    $product->product_name = sanitizeInput($data->product_name);
    $product->description = sanitizeInput($data->description ?? '');
    $product->price = $data->price;
    $product->unit = $data->unit;
    $product->stock_quantity = $data->stock_quantity ?? 0;
    $product->min_order_quantity = $data->min_order_quantity ?? 1;
    $product->product_image_url = sanitizeInput($data->product_image_url ?? '');
    $product->is_organic = $data->is_organic ?? false;
    $product->is_available = $data->is_available ?? true;
    
    if ($product->update()) {
        sendJsonResponse(true, "Product updated successfully", null, 200);
    } else {
        sendJsonResponse(false, "Failed to update product", null, 500);
    }
}

/**
 * DELETE PRODUCT (Dealer only)
 */
elseif ($method === 'DELETE' && $action === 'delete') {
    session_start();
    
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'dealer') {
        sendJsonResponse(false, "Unauthorized access", null, 401);
    }
    
    $product_id = $_GET['id'] ?? 0;
    
    if (!$product_id) {
        sendJsonResponse(false, "Product ID required", null, 400);
    }
    
    // Get dealer_id
    $query = "SELECT dealer_id FROM dealers WHERE user_id = :user_id LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $_SESSION['user_id']);
    $stmt->execute();
    $dealer = $stmt->fetch();
    
    if (!$dealer) {
        sendJsonResponse(false, "Dealer profile not found", null, 404);
    }
    
    if ($product->delete($product_id, $dealer['dealer_id'])) {
        sendJsonResponse(true, "Product deleted successfully", null, 200);
    } else {
        sendJsonResponse(false, "Failed to delete product", null, 500);
    }
}

/**
 * GET PRODUCT CATEGORIES
 */
elseif ($method === 'GET' && $action === 'categories') {
    $categories = $product->getCategories();
    sendJsonResponse(true, "Categories retrieved successfully", $categories, 200);
}

/**
 * Invalid endpoint
 */
else {
    sendJsonResponse(false, "Invalid endpoint or method", null, 404);
}
?>
