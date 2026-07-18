<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactUs;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Validator;
class ContactController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if ($user->role_id !== 1) {
            return response()->json(['message' => 'Access Denied'], 403);
        }

        try {

            $perPage = $request->get('per_page', 50);
            $search = $request->get('search');
            $query = ContactUs::query();

            $query->orderBy('created_at', 'desc');

            if (!empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('mobile_number', 'like', "%{$search}%");
                });
            }
            $contacts = $query->paginate($perPage);

            return response()->json($contacts);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching contacts', 'error' => $e->getMessage()], 500);

        }
    }

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

     public function update(Request $request, ContactUs $contact)
    {
      
        try {
            // Strict validation (matches ENUM)
            $validated = $request->validate([
                'status' => [
                    'required',
                    Rule::in(['new', 'contacted', 'converted', 'closed'])
                ]
            ]);

            // Update safely
            $contact->update([
                'status' => $validated['status']
            ]);
 
            return response()->json([
                'message' => 'Status updated successfully'.$validated['status']
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {

            //  Validation error (user mistake)
            return response()->json([
                'message' => 'Invalid status value',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {

            //  Log real error (hidden from user)
            \Log::error('Inquire status update failed', [
                'error' => $e->getMessage(),
                'id' => $contact->id
            ]);

            return response()->json([
                'message' => 'Something went wrong. Please try again later.'
            ], 500);
        }
    }
}
