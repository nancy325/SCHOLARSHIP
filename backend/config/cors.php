<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',    // React default port
        'http://localhost:5173',    // Vite default port
        'http://localhost:8080',    // Alternative React port
        'http://127.0.0.1:3000',   // React with 127.0.0.1
        'http://127.0.0.1:5173',   // Vite with 127.0.0.1
        'http://127.0.0.1:8080',   // Alternative with 127.0.0.1
    ],

    'allowed_origins_patterns' => [
        '/^https?:\/\/localhost:\d+$/',  // Any localhost port
        '/^https?:\/\/127\.0\.0\.1:\d+$/',  // Any 127.0.0.1 port
    ],

    'allowed_headers' => [
        'Accept',
        'Authorization',
        'Content-Type',
        'X-Requested-With',
        'X-CSRF-TOKEN',
        'X-XSRF-TOKEN',
    ],

    'exposed_headers' => [
        'Cache-Control',
        'Content-Language',
        'Content-Type',
        'Expires',
        'Last-Modified',
        'Pragma',
    ],

    'max_age' => 86400, // 24 hours

    'supports_credentials' => true,

];