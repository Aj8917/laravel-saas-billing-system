<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class LocationController extends Controller
{
    public function getCountries()
    {
        $response = Http::withOptions(['verify' => false,])->get('https://countriesnow.space/api/v0.1/countries');

        $countries = collect($response->json()['data'])
            ->pluck('country') // Only get country names
            ->sort()
            ->values();

        return response()->json($countries);



    }//getCountries

    public function getStates(Request $request)
    {
        $country = $request->input('country');

        $response = Http::withOptions(['verify' => false])
            ->post('https://countriesnow.space/api/v0.1/countries/states', [
                'country' => $country
            ]);

        $data = $response->json();



        if (!isset($data['data']['states'])) {
            return response()->json(['error' => 'No states found or invalid country'], 404);
        }

        $states = collect($data['data']['states'])
            ->pluck('name')
            ->sort()
            ->values();

        return response()->json($states);
    }

    public function getCities(Request $request)
    {
        $country = $request->input('country');
        $state = $request->input('state');

        // Validate input
        if (!$country || !$state) {
            return response()->json([
                'error' => 'Country and state are required.'
            ], 400);
        }

        try {
            $response = Http::withOptions([
                'verify' => false, // Disable SSL verification (not recommended in production)
            ])->post('https://countriesnow.space/api/v0.1/countries/state/cities', [
                        'country' => $country,
                        'state' => $state
                    ]);

            // Check for success
            if ($response->successful()) {
                return response()->json([
                    'data' => $response->json()['data']
                ]);
            } else {
                return response()->json([
                    'error' => 'Failed to fetch cities.',
                    'details' => $response->json()
                ], $response->status());
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while fetching cities.',
                'message' => $e->getMessage()
            ], 500);
        }
    }//getCitties

}//LocationController
