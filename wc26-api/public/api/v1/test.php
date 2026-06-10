<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'status' => 'ok',
    'php_version' => PHP_VERSION,
    'server_time' => date(DATE_ATOM),
]);