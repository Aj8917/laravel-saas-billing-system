<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactUs;
use Illuminate\Http\Request;
use Validator;
class ContactController extends Controller
{
    public function store(Request $request)
    { //return response()->json($request->all()); // dd($request->all());
        $validator = Validator::make(
            $request->all(),
            [
                'name' => ['required', 'regex:/^[A-Za-z\s]+$/'],
                'email' => ['required', 'email', 'unique:contact_us,email'],
                'mobile' => ['required', 'numeric', 'digits:10'],
            ]
        );
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
         try {
        $contact = ContactUs::create([
            'name' => $request->name,
            'email' => $request->email,
            'mobile_number' => $request->mobile,
        ]);

        return response()->json([
            'message' => 'We will contact you shortly!',
            'data' => $contact
        ], 201);

    } catch (\Exception $e) {

        \Log::error('Contact form error: ' . $e->getMessage());

        return response()->json([
            'message' => 'Something went wrong. Please try again later.'
        ], 500);
    }
    }//store
}
