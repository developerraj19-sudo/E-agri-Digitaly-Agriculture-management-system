<?php
/**
 * Weather API
 * Handles weather data retrieval and management
 */

require_once '../config/database.php';

setCorsHeaders();

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    sendJsonResponse(false, "Database connection failed", null, 500);
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

/**
 * GET WEATHER BY LOCATION
 */
if ($method === 'GET' && $action === 'get') {
    $district = $_GET['district'] ?? '';
    $state = $_GET['state'] ?? '';
    
    if (empty($district) || empty($state)) {
        sendJsonResponse(false, "District and state required", null, 400);
    }
    
    // Get latest weather data from database
    $query = "SELECT * FROM weather_data 
              WHERE district = :district AND state = :state 
              AND forecast_date >= CURDATE()
              ORDER BY forecast_date ASC 
              LIMIT 7";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":district", $district);
    $stmt->bindParam(":state", $state);
    $stmt->execute();
    
    $weatherData = $stmt->fetchAll();
    
    if ($weatherData) {
        sendJsonResponse(true, "Weather data retrieved successfully", $weatherData, 200);
    } else {
        // If no data in database, fetch from OpenWeather API (optional)
        $weatherData = fetchWeatherFromAPI($district, $state);
        sendJsonResponse(true, "Weather data retrieved from API", $weatherData, 200);
    }
}

/**
 * ADD WEATHER DATA (Admin only)
 */
elseif ($method === 'POST' && $action === 'add') {
    session_start();
    
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
        sendJsonResponse(false, "Unauthorized access", null, 401);
    }
    
    $data = json_decode(file_get_contents("php://input"));
    
    // Validate required fields
    if (
        empty($data->location) ||
        empty($data->temperature) ||
        empty($data->forecast_date)
    ) {
        sendJsonResponse(false, "Missing required fields", null, 400);
    }
    
    $query = "INSERT INTO weather_data 
              (location, district, state, temperature, feels_like, humidity, 
               wind_speed, weather_condition, description, rainfall, forecast_date, updated_by)
              VALUES (:location, :district, :state, :temperature, :feels_like, :humidity,
                      :wind_speed, :weather_condition, :description, :rainfall, :forecast_date, :updated_by)";
    
    $stmt = $db->prepare($query);
    
    $location = sanitizeInput($data->location);
    $district = sanitizeInput($data->district ?? '');
    $state = sanitizeInput($data->state ?? '');
    $temperature = $data->temperature;
    $feels_like = $data->feels_like ?? $data->temperature;
    $humidity = $data->humidity ?? 0;
    $wind_speed = $data->wind_speed ?? 0;
    $weather_condition = sanitizeInput($data->weather_condition ?? '');
    $description = sanitizeInput($data->description ?? '');
    $rainfall = $data->rainfall ?? 0;
    $forecast_date = $data->forecast_date;
    $updated_by = $_SESSION['user_id'];
    
    $stmt->bindParam(":location", $location);
    $stmt->bindParam(":district", $district);
    $stmt->bindParam(":state", $state);
    $stmt->bindParam(":temperature", $temperature);
    $stmt->bindParam(":feels_like", $feels_like);
    $stmt->bindParam(":humidity", $humidity);
    $stmt->bindParam(":wind_speed", $wind_speed);
    $stmt->bindParam(":weather_condition", $weather_condition);
    $stmt->bindParam(":description", $description);
    $stmt->bindParam(":rainfall", $rainfall);
    $stmt->bindParam(":forecast_date", $forecast_date);
    $stmt->bindParam(":updated_by", $updated_by);
    
    if ($stmt->execute()) {
        sendJsonResponse(true, "Weather data added successfully", [
            'weather_id' => $db->lastInsertId()
        ], 201);
    } else {
        sendJsonResponse(false, "Failed to add weather data", null, 500);
    }
}

/**
 * GET CURRENT WEATHER (simplified)
 */
elseif ($method === 'GET' && $action === 'current') {
    $location = $_GET['location'] ?? 'Bengaluru';
    
    // Get today's weather
    $query = "SELECT * FROM weather_data 
              WHERE location LIKE :location 
              AND forecast_date = CURDATE()
              ORDER BY recorded_at DESC 
              LIMIT 1";
    
    $stmt = $db->prepare($query);
    $locationParam = "%$location%";
    $stmt->bindParam(":location", $locationParam);
    $stmt->execute();
    
    $weather = $stmt->fetch();
    
    if ($weather) {
        sendJsonResponse(true, "Current weather retrieved", $weather, 200);
    } else {
        // Return default/sample data
        $defaultWeather = [
            'location' => $location,
            'temperature' => 28,
            'humidity' => 65,
            'wind_speed' => 12,
            'weather_condition' => 'Clear',
            'description' => 'Clear sky',
            'forecast_date' => date('Y-m-d')
        ];
        sendJsonResponse(true, "Default weather data", $defaultWeather, 200);
    }
}

/**
 * Invalid endpoint
 */
else {
    sendJsonResponse(false, "Invalid endpoint or method", null, 404);
}

/**
 * Helper function to fetch weather from OpenWeather API
 * This is optional and requires API key
 */
function fetchWeatherFromAPI($city, $state) {
    // This would require OpenWeather API key
    // For now, return sample data
    return [
        [
            'location' => "$city, $state",
            'temperature' => 28,
            'humidity' => 65,
            'wind_speed' => 12,
            'weather_condition' => 'Clear',
            'description' => 'Clear sky',
            'forecast_date' => date('Y-m-d')
        ]
    ];
}
?>
