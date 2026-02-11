<?php
/**
 * Product Model
 * Handles product CRUD operations
 */

class Product {
    private $conn;
    private $table = "products";

    public $product_id;
    public $dealer_id;
    public $category_id;
    public $product_name;
    public $description;
    public $price;
    public $unit;
    public $stock_quantity;
    public $min_order_quantity;
    public $product_image_url;
    public $is_organic;
    public $is_available;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Get all products
     */
    public function getAllProducts($filters = []) {
        $query = "SELECT p.*, d.business_name, pc.category_name, pc.category_type
                  FROM " . $this->table . " p
                  LEFT JOIN dealers d ON p.dealer_id = d.dealer_id
                  LEFT JOIN product_categories pc ON p.category_id = pc.category_id
                  WHERE p.is_available = 1 AND d.verification_status = 'verified'";

        // Apply filters
        if (!empty($filters['category_id'])) {
            $query .= " AND p.category_id = :category_id";
        }
        if (!empty($filters['search'])) {
            $query .= " AND (p.product_name LIKE :search OR p.description LIKE :search)";
        }
        if (!empty($filters['is_organic'])) {
            $query .= " AND p.is_organic = 1";
        }
        if (!empty($filters['max_price'])) {
            $query .= " AND p.price <= :max_price";
        }

        $query .= " ORDER BY p.created_at DESC";

        $stmt = $this->conn->prepare($query);

        // Bind filter values
        if (!empty($filters['category_id'])) {
            $stmt->bindParam(":category_id", $filters['category_id']);
        }
        if (!empty($filters['search'])) {
            $search_term = "%" . $filters['search'] . "%";
            $stmt->bindParam(":search", $search_term);
        }
        if (!empty($filters['max_price'])) {
            $stmt->bindParam(":max_price", $filters['max_price']);
        }

        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Get product by ID
     */
    public function getProductById($product_id) {
        $query = "SELECT p.*, d.business_name, d.district, d.state, 
                         pc.category_name, pc.category_type
                  FROM " . $this->table . " p
                  LEFT JOIN dealers d ON p.dealer_id = d.dealer_id
                  LEFT JOIN product_categories pc ON p.category_id = pc.category_id
                  WHERE p.product_id = :product_id
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":product_id", $product_id);
        $stmt->execute();

        return $stmt->fetch();
    }

    /**
     * Create new product (Dealer only)
     */
    public function create() {
        $query = "INSERT INTO " . $this->table . "
                  SET dealer_id = :dealer_id,
                      category_id = :category_id,
                      product_name = :product_name,
                      description = :description,
                      price = :price,
                      unit = :unit,
                      stock_quantity = :stock_quantity,
                      min_order_quantity = :min_order_quantity,
                      product_image_url = :product_image_url,
                      is_organic = :is_organic";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":dealer_id", $this->dealer_id);
        $stmt->bindParam(":category_id", $this->category_id);
        $stmt->bindParam(":product_name", $this->product_name);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":unit", $this->unit);
        $stmt->bindParam(":stock_quantity", $this->stock_quantity);
        $stmt->bindParam(":min_order_quantity", $this->min_order_quantity);
        $stmt->bindParam(":product_image_url", $this->product_image_url);
        $stmt->bindParam(":is_organic", $this->is_organic);

        if ($stmt->execute()) {
            $this->product_id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    /**
     * Update product
     */
    public function update() {
        $query = "UPDATE " . $this->table . "
                  SET category_id = :category_id,
                      product_name = :product_name,
                      description = :description,
                      price = :price,
                      unit = :unit,
                      stock_quantity = :stock_quantity,
                      min_order_quantity = :min_order_quantity,
                      is_organic = :is_organic,
                      is_available = :is_available";

        if (!empty($this->product_image_url)) {
            $query .= ", product_image_url = :product_image_url";
        }

        $query .= " WHERE product_id = :product_id AND dealer_id = :dealer_id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":category_id", $this->category_id);
        $stmt->bindParam(":product_name", $this->product_name);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":unit", $this->unit);
        $stmt->bindParam(":stock_quantity", $this->stock_quantity);
        $stmt->bindParam(":min_order_quantity", $this->min_order_quantity);
        $stmt->bindParam(":is_organic", $this->is_organic);
        $stmt->bindParam(":is_available", $this->is_available);
        $stmt->bindParam(":product_id", $this->product_id);
        $stmt->bindParam(":dealer_id", $this->dealer_id);

        if (!empty($this->product_image_url)) {
            $stmt->bindParam(":product_image_url", $this->product_image_url);
        }

        return $stmt->execute();
    }

    /**
     * Delete product
     */
    public function delete($product_id, $dealer_id) {
        $query = "DELETE FROM " . $this->table . "
                  WHERE product_id = :product_id AND dealer_id = :dealer_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":product_id", $product_id);
        $stmt->bindParam(":dealer_id", $dealer_id);

        return $stmt->execute();
    }

    /**
     * Get products by dealer
     */
    public function getProductsByDealer($dealer_id) {
        $query = "SELECT p.*, pc.category_name
                  FROM " . $this->table . " p
                  LEFT JOIN product_categories pc ON p.category_id = pc.category_id
                  WHERE p.dealer_id = :dealer_id
                  ORDER BY p.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":dealer_id", $dealer_id);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    /**
     * Update stock quantity
     */
    public function updateStock($product_id, $quantity) {
        $query = "UPDATE " . $this->table . "
                  SET stock_quantity = stock_quantity - :quantity
                  WHERE product_id = :product_id AND stock_quantity >= :quantity";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":quantity", $quantity);
        $stmt->bindParam(":product_id", $product_id);

        return $stmt->execute();
    }

    /**
     * Get product categories
     */
    public function getCategories() {
        $query = "SELECT * FROM product_categories WHERE is_active = 1 ORDER BY category_name";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
?>
