<?php
$serverName = "localhost";
$userName = "root";
$password = "";
$database = "prototype2";

// Create connection
$conn = mysqli_connect($serverName, $userName, $password, $database);

// Check connection
if (!$conn) {
    die("Failed to connect: " . mysqli_connect_error());
}

// Create table if it doesn't exist
$createTable = "CREATE TABLE IF NOT EXISTS weather (k 
    id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(50) NOT NULL,
    humidity FLOAT NOT NULL,
    wind FLOAT NOT NULL,
    pressure FLOAT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);";
if (!mysqli_query($conn, $createTable)) {
    die("Failed to create table: " . mysqli_error($conn));
}

// Get city name from URL parameter or default to "Kathmandu"
$cityName = isset($_GET['q']) ? $_GET['q'] : "Kathmandu";

// Check if data exists for the specified city and is less than 2 hours old
$selectAllData = "SELECT * FROM weather WHERE city = '$cityName' AND timestamp > DATE_SUB(NOW(), INTERVAL 2 HOUR)";
$result = mysqli_query($conn, $selectAllData);

if (mysqli_num_rows($result) == 0) {
    // If no recent data is found, fetch from OpenWeatherMap API
    $apiKey = '4630850f4aa828417a059850d77bf00d';
    $url = "https://api.openweathermap.org/data/2.5/weather?q=$cityName&appid=$apiKey&units=metric";
    $response = file_get_contents($url);
    $data = json_decode($response, true);

    $humidity = $data['main']['humidity'];
    $wind = $data['wind']['speed'];
    $pressure = $data['main']['pressure'];

    // Insert data into the database
    $insertData = "INSERT INTO weather (city, humidity, wind, pressure) VALUES ('$cityName', '$humidity', '$wind', '$pressure')";
    if (!mysqli_query($conn, $insertData)) {
        die("Failed to insert data: " . mysqli_error($conn));
    }

    // Re-run the query for updated data
    $result = mysqli_query($conn, $selectAllData);
}

// Fetch data from the weather table
$rows = [];
while ($row = mysqli_fetch_assoc($result)) {
    $rows[] = $row;
}

// Encode fetched data to JSON and send as response
$json_data = json_encode($rows);
header('Content-Type: application/json');
echo $json_data;

mysqli_close($conn);
?>
