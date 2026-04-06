<?php
// ============================================================
// XSS DEMO — Vulnerable vs Secure
// ============================================================

// ❌ VULNERABLE — directly echoes user input
// If user types: <script>alert('Hacked!')</script>
// That script RUNS in the browser!

// ✅ SECURE — always use htmlspecialchars() before displaying input
?>

<!DOCTYPE html>
<html>
<head>
  <title>XSS Demo</title>
</head>
<body>

<h2>XSS — Cross-Site Scripting Demo</h2>

<form method="POST">
  <label>Enter your name:</label><br>
  <input type="text" name="username" placeholder="Try: <script>alert('XSS')</script>">
  <button type="submit">Submit</button>
</form>

<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];

    // ❌ VULNERABLE — never do this
    echo "<h3>Vulnerable Output:</h3>";
    echo "<p>Hello, " . $username . "</p>";
    // If input is <script>alert('XSS')</script>, script executes!

    // ✅ SECURE — always sanitize output
    echo "<h3>Secure Output:</h3>";
    $safe_username = htmlspecialchars($username, ENT_QUOTES, 'UTF-8');
    echo "<p>Hello, " . $safe_username . "</p>";
    // <script> becomes &lt;script&gt; — harmless text
}
?>

<hr>
<h3>What happened?</h3>
<ul>
  <li><strong>Vulnerable:</strong> Raw input is printed — script runs</li>
  <li><strong>Secure:</strong> htmlspecialchars() converts &lt; &gt; to safe text</li>
</ul>

<h3>Best Practices for XSS:</h3>
<ul>
  <li>Always use <code>htmlspecialchars($input, ENT_QUOTES, 'UTF-8')</code> before displaying any user input</li>
  <li>Never echo $_GET, $_POST, or $_COOKIE directly</li>
  <li>Use Content Security Policy (CSP) headers</li>
  <li>Validate and sanitize all input on the server side</li>
</ul>

</body>
</html>