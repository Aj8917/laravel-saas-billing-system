<?php

namespace App\Http\Middleware;

use App\Models\Permission;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;


class CheckRoutePermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        $currentPath = $request->path();          // returns 'api/get-appname'

        $routeName = preg_replace('#^api/#', '', $currentPath); // now 'get-appname'

        $excluded = [
            'signin',
            'signup',
            'subscriptions',
            'company-details',
            'dashboard-details',
            'countries',
            'states',
            'cities',
            'getCities',
            'plans',
            'get-appname'
        ];



        if (in_array($routeName, $excluded)) {
            return $next($request);
        }

        // Skip excluded routes
        if ($routeName && in_array($routeName, $excluded)) {
            return $next($request);
        }
        if (!$user) {
            return response()->json(['errors' => 'Unauthorized'], 401);
        }

        
        $requiredPermissions = Permission::where('slug', $routeName)
            ->pluck('slug')
            ->toArray();
        if (empty($requiredPermissions)) {
            return $next($request); // no restriction
        }
        $userPermissions = Cache::rememberForever("user_permissions_{$user->id}", function () use ($user) {
            return $user->roles->flatMap->getCachedPermissions()->unique()->toArray();
        });

        if (!collect($requiredPermissions)->intersect($userPermissions)->count()) {
            return response()->json(['errors' => 'Forbidden'], 403);
        }

        return $next($request);
    }//handle
}
