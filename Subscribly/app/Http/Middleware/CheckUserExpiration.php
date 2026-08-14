<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Auth;
class CheckUserExpiration
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
         $user = $request->user();

        // No authenticated user
        if (!$user) {
            return $next($request);
        }
        // User has expired
        $plan = $user->tenant->subscription;
        
          
        if ($plan->end_date && now()->greaterThanOrEqualTo($plan->end_date)) {

             $request->user()->currentAccessToken()->delete();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            // return redirect()
            //     ->route('/')
            //     ->with('error', 'Your account has expired.');

            return response()->json([
            'message' => 'Your account has expired.',
            ], 401);
        }

        return $next($request);
    }
}
