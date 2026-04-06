<?php
// ============================================================
// DATABASE SETUP — run this once to create the demo database
// ============================================================

$conn = new mysqli("localhost", "root", "", "");

// Create database
$conn->query("CREATE DATABASE IF NOT EXISTS security_demo");
$conn->select_db("security_demo");

// Create users table
$conn->query("
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50),
        password VARCHAR(50)
    )
");

// Insert sample users
$conn->query("INSERT INTO users (username, password) VALUES ('admin', 'admin123')");
$conn->query("INSERT INTO users (username, password) VALUES ('alice', 'alice456')");
$conn->query("INSERT INTO users (username, password) VALUES ('bob', 'bob789')");

echo "Database and table created! Sample users added.";
$conn->close();
?>