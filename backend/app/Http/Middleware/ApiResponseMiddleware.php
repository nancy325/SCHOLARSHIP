<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiResponseMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Add common headers for API responses
        $response->headers->set('Content-Type', 'application/json');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Add CORS headers if not already present
        if (!$response->headers->has('Access-Control-Allow-Origin')) {
            $response->headers->set('Access-Control-Allow-Origin', '*');
        }

        // Ensure consistent JSON response format for API routes
        if ($request->is('api/*') && $response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {
            $content = $response->getContent();
            
            // If response is not already JSON, wrap it
            if (!empty($content) && !$this->isJson($content)) {
                $response->setContent(json_encode([
                    'success' => true,
                    'message' => 'Request processed successfully',
                    'data' => json_decode($content, true) ?: $content
                ]));
            }
        }

        return $response;
    }

    /**
     * Check if content is valid JSON
     */
    private function isJson($string): bool
    {
        json_decode($string);
        return json_last_error() === JSON_ERROR_NONE;
    }
}
