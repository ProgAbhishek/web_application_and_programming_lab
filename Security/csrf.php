<?php
// ============================================================
// CSRF DEMO — Vulnerable vs Secure
// ============================================================

session_start(); // Sessions required for CSRF tokens

// ---- Helper: generate a CSRF token and store in session ----
function generate_csrf_token() {
    if (empty($_SESSION['csrf_token'])) {
        // random_bytes gives a cryptographically secure random token
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// ---- Helper: check the submitted token matches session token ----
function verify_csrf_token($token) {
    if (!isset($_SESSION['csrf_token'])) {
        return false;
    }
    // hash_equals prevents timing attacks
    return hash_equals($_SESSION['csrf_token'], $token);
}

// Simulate a logged-in user
$_SESSION['logged_in_user'] = 'abhishek';
$current_user = $_SESSION['logged_in_user'];

$vulnerable_message = "";
$secure_message     = "";

// ----------------------------------------------------------------
// ❌ VULNERABLE form handler — no token check at all
// Any website can submit this form on behalf of the user!
// ----------------------------------------------------------------
if (isset($_POST['vulnerable_submit'])) {
    $new_email = $_POST['new_email'];
    // No verification — just accepts the request!
    $vulnerable_message = "❌ VULNERABLE: Email changed to: " . htmlspecialchars($new_email);
}

// ----------------------------------------------------------------
// ✅ SECURE form handler — checks CSRF token before processing
// ----------------------------------------------------------------
if (isset($_POST['secure_submit'])) {
    $submitted_token = $_POST['csrf_token'] ?? '';

    if (verify_csrf_token($submitted_token)) {
        $new_email = $_POST['new_email'];
        $secure_message = "✅ SECURE: Token verified. Email changed to: " . htmlspecialchars($new_email);
        // Regenerate token after use
        unset($_SESSION['csrf_token']);
    } else {
        $secure_message = "✅ SECURE: CSRF token mismatch — request BLOCKED!";
    }
}

// Generate token for the secure form
$csrf_token = generate_csrf_token();
?>

<!DOCTYPE html>
<html>
<head>
  <title>CSRF Demo</title>
</head>
<body>

<h2>CSRF — Cross-Site Request Forgery Demo</h2>
<p>Logged in as: <strong><?= htmlspecialchars($current_user) ?></strong></p>

<hr>

<!-- ❌ VULNERABLE FORM — no CSRF token -->
<h3>❌ Vulnerable Form (no token)</h3>
<p>An attacker on another website can submit this form silently on your behalf.</p>

<form method="POST">
  <label>Change Email:</label><br>
  <input type="text" name="new_email" value="attacker@evil.com"><br><br>
  <button type="submit" name="vulnerable_submit">Update Email (Vulnerable)</button>
</form>

<?php if ($vulnerable_message): ?>
  <p style="color:red;"><?= $vulnerable_message ?></p>
<?php endif; ?>

<hr>

<!-- ✅ SECURE FORM — hidden CSRF token included -->
<h3>✅ Secure Form (with CSRF token)</h3>
<p>The hidden token is unique per session. An attacker cannot guess it.</p>

<form method="POST">
  <!-- Hidden input carries the token — attacker on another site cannot access this -->
  <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrf_token) ?>">

  <label>Change Email:</label><br>
  <input type="text" name="new_email" value="myemail@example.com"><br><br>
  <button type="submit" name="secure_submit">Update Email (Secure)</button>
</form>

<?php if ($secure_message): ?>
  <p style="color:green;"><?= $secure_message ?></p>
<?php endif; ?>

<hr>
<h3>How the Attack Works:</h3>
<p>An attacker creates this HTML on their own website:</p>
<pre style="background:#f5f5f5; padding:10px;">
&lt;!-- evil-site.com/attack.html --&gt;
&lt;form action="http://yoursite.com/csrf.php" method="POST"&gt;
  &lt;input type="hidden" name="new_email" value="attacker@evil.com"&gt;
  &lt;input type="hidden" name="vulnerable_submit" value="1"&gt;
&lt;/form&gt;
&lt;script&gt;document.forms[0].submit();&lt;/script&gt;
&lt;!-- This auto-submits when victim visits the attacker's page --&gt;
</pre>

<h3>Best Practices for CSRF:</h3>
<ul>
  <li>Always include a <strong>CSRF token</strong> in every form that changes data</li>
  <li>Generate the token with <code>bin2hex(random_bytes(32))</code> — not predictable</li>
  <li>Use <code>hash_equals()</code> to compare tokens — prevents timing attacks</li>
  <li>Regenerate the token after it is used (one-time tokens)</li>
  <li>Use <code>SameSite=Strict</code> on session cookies for extra protection</li>
  <li>Only use GET for read-only actions — always use POST for actions that change data</li>
</ul>

</body>
</html>