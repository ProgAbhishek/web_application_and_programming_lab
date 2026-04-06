<?php
// ============================================================
// SQL INJECTION DEMO — Vulnerable vs Secure
// ============================================================
?>

<!DOCTYPE html>
<html>
<head>
  <title>SQL Injection Demo</title>
</head>
<body>

<h2>SQL Injection Demo</h2>
<p>Try logging in with username: <code>admin' OR '1'='1</code> and any password</p>

<form method="POST">
  <label>Username:</label><br>
  <input type="text" name="username" placeholder="admin' OR '1'='1"><br><br>
  <label>Password:</label><br>
  <input type="text" name="password" placeholder="anything"><br><br>
  <button type="submit">Login</button>
</form>

<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $username = $_POST['username'];
    $password = $_POST['password'];

    $conn = new mysqli("localhost", "root", "", "security_demo");

    if ($conn->connect_error) {
        die("Connection failed. Run setup_db.php first.");
    }

    // ----------------------------------------------------------------
    // ❌ VULNERABLE — string is built directly from user input
    // Input: admin' OR '1'='1
    // Query becomes: SELECT * FROM users WHERE username='admin' OR '1'='1'
    // '1'='1' is always TRUE — logs in without correct password!
    // ----------------------------------------------------------------
    $vulnerable_query = "SELECT * FROM users WHERE username='$username' AND password='$password'";

    echo "<h3>Vulnerable Query:</h3>";
    echo "<code>" . htmlspecialchars($vulnerable_query) . "</code>";

    $result = $conn->query($vulnerable_query);
    if ($result && $result->num_rows > 0) {
        echo "<p style='color:red;'>❌ VULNERABLE LOGIN SUCCEEDED — attacker got in!</p>";
        while ($row = $result->fetch_assoc()) {
            echo "<p>Logged in as: <strong>" . htmlspecialchars($row['username']) . "</strong></p>";
        }
    } else {
        echo "<p>Vulnerable login failed.</p>";
    }

    // ----------------------------------------------------------------
    // ✅ SECURE — use Prepared Statements with bound parameters
    // User input is NEVER part of the SQL string
    // The ? placeholders are filled in safely by mysqli
    // ----------------------------------------------------------------
    echo "<h3>Secure Query (Prepared Statement):</h3>";
    echo "<code>SELECT * FROM users WHERE username=? AND password=?</code>";

    $stmt = $conn->prepare("SELECT * FROM users WHERE username=? AND password=?");
    $stmt->bind_param("ss", $username, $password); // "ss" = two strings
    $stmt->execute();
    $secure_result = $stmt->get_result();

    if ($secure_result->num_rows > 0) {
        echo "<p style='color:green;'>✅ Secure login succeeded with correct credentials.</p>";
        while ($row = $secure_result->fetch_assoc()) {
            echo "<p>Logged in as: <strong>" . htmlspecialchars($row['username']) . "</strong></p>";
        }
    } else {
        echo "<p style='color:green;'>✅ Secure login blocked the injection attempt.</p>";
    }

    $stmt->close();
    $conn->close();
}
?>

<hr>
<h3>Best Practices for SQL Injection:</h3>
<ul>
  <li>Always use <strong>Prepared Statements</strong> with <code>bind_param()</code></li>
  <li>Never build SQL queries using string concatenation with user input</li>
  <li>Use PDO or MySQLi — never use the old mysql_* functions</li>
  <li>Give your database user only the minimum permissions needed</li>
  <li>Never display raw database error messages to users</li>
</ul>

</body>
</html>