<?php
$es_local = in_array($_SERVER['SERVER_NAME'], ['localhost', '127.0.0.1']);

if ($es_local) {
    $host     = "localhost";
    $user     = "root";
    $password = "";
    $db       = "portafolio";
} else {
    $host     = "sql210.infinityfree.com";
    $user     = "if0_43499658";
    $password = "to8iCQKpTc";
    $db       = "if0_43499658_portafolio";
}

function salir($mensaje) {
    echo "<script>alert(" . json_encode($mensaje, JSON_UNESCAPED_UNICODE) . ");</script>";
    echo "<script>window.location.href='index.html#contacto'</script>";
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

mysqli_report(MYSQLI_REPORT_OFF);
$con = mysqli_connect($host, $user, $password, $db);
if (!$con) {
    salir('Problemas al conectar');
}
mysqli_set_charset($con, 'utf8mb4');

$nombre     = trim($_POST["nombre"] ?? '');
$correo     = trim($_POST["correo"] ?? '');
$telefono   = trim($_POST["telefono"] ?? '');
$comentario = trim($_POST["comentario"] ?? '');

if ($nombre === '' || $telefono === '' || !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    salir('Complete correctamente los campos obligatorios');
}

$sql  = "INSERT INTO formulario (nombre, correo, telefono, comentario) VALUES (?, ?, ?, ?)";
$stmt = mysqli_prepare($con, $sql);
if (!$stmt) {
    salir('Problemas al enviar');
}
mysqli_stmt_bind_param($stmt, "ssss", $nombre, $correo, $telefono, $comentario);
$ejecutar = mysqli_stmt_execute($stmt);

if (!$ejecutar) {
    salir('Problemas al enviar');
} else {
    salir('Datos enviados correctamente');
}
?>