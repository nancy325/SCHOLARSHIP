<?php

return [

    /*
    |--------------------------------------------------------------------------
    | API Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration options for the API including
    | rate limiting, CORS settings, and response formatting.
    |
    */

    'version' => '1.0.0',

    'rate_limits' => [
        'auth' => '5,1',        // 5 requests per minute for auth endpoints
        'public' => '100,1',    // 100 requests per minute for public endpoints
        'api' => '60,1',        // 60 requests per minute for API endpoints
        'admin' => '30,1',      // 30 requests per minute for admin endpoints
    ],

    'cors' => [
        'allowed_origins' => [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:8080',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:8080',
        ],
        'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        'allowed_headers' => [
            'Accept',
            'Authorization',
            'Content-Type',
            'X-Requested-With',
            'X-CSRF-TOKEN',
            'X-XSRF-TOKEN',
        ],
        'supports_credentials' => true,
        'max_age' => 86400, // 24 hours
    ],

    'response' => [
        'default_success_message' => 'Request processed successfully',
        'default_error_message' => 'An error occurred',
        'include_debug_info' => env('APP_DEBUG', false),
    ],

    'pagination' => [
        'default_per_page' => 15,
        'max_per_page' => 100,
    ],

    'cache' => [
        'ttl' => 3600, // 1 hour in seconds
        'prefix' => 'api_',
    ],

];
