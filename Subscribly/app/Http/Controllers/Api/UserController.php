<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Hash;
use Illuminate\Http\Request;
use Validator;

class UserController extends Controller
{
    public function signup(Request $request)
    {
        //dd($request->all());
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'regex:/^[A-Za-z\s]+$/'],
            'email' => ['required', 'email', 'unique:users,email'],
            'company_name' => ['required', 'string'],
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[A-Z]/',         // at least one uppercase
                'regex:/[a-z]/',         // at least one lowercase
                'regex:/[0-9]/',         // at least one digit
                'regex:/[@$!%*?&\-]/'    // at least one special char (hyphen included safely)
            ],
        ], [
            'name.regex' => 'Name must only contain letters and spaces.',
            'password.regex' => 'Password must have at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

       // Hash the password before storing
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'company_name'=>$request->company_name,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['success' => 'User Created!'], 201);
    }//signup
}//UserController
