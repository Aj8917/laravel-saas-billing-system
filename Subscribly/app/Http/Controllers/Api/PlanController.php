<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use DB;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
         $plans = DB::table('plans')->get();

        // Return as JSON (for API) or pass to view
        return response()->json($plans);
    }
}
