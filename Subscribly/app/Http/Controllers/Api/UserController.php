<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\companyDetailsRequest;
use App\Models\CompanyDetail;
use App\Models\Tenant;
use App\Models\User;
use Auth;
use DB;
use Hash;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Email;
use Validator;
use Carbon\Carbon;
class UserController extends Controller
{
    public function singin(Request $request)
    {
        //   dd($request->all())  ;
        $credentials = $request->only('email', 'password');
        //   return response()->json(['credentials'=>$credentials]);


        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user->name,
                'company_name' => $user->company_name

            ]);

        }

        return response()->json(['errors' => 'Invalid Credential please check again!'], 401);


    }//singin
    public function signup(Request $request)
    {
        //return response()->json($request->all());
        // dd($request->all());
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

        $tenant = Tenant::create(['business_name' => $request->company_name]);

        // Hash the password before storing
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'tenant_id' => $tenant->id,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'success' => 'User Created!',
            'tenant_id' => encrypt($tenant->id)
        ], 201);
    }//signup

    public function planSelection(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tenant_id' => ['required'],
            'plan_id' => ['required', 'exists:plans,id'],
            'status' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Fetch the plan from the database
        $plan = DB::table('plans')
            ->where('id', $request->plan_id)
            ->where('name', $request->planName)
            ->first();

        if (!$plan) {
            return response()->json(['error' => 'Plan not found'], 404);
        }

        $now = Carbon::now(); // Server time
        $startDate = $now;

        // Set end date based on plan name
        if (strtolower($plan->name) === 'basic') {
            $endDate = $now->copy()->addDays(7);
        } else {
            $endDate = $now->copy()->addMonth();
        }

        $nextBillingDate = $endDate->copy();

        // Insert subscription into the database
        DB::table('subscriptions')->insert([
            'tenant_id' => decrypt($request->tenant_id),
            'plan_id' => $request->plan_id,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'next_billing_date' => $nextBillingDate,
            'is_active' => true,
            'status' => $request->status,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['success' => 'Plan selected successfully'], 200);
    }//planselection

    public function companyDetails(CompanyDetailsRequest $request)
{
    DB::beginTransaction();

    try {
        

        // Replace tenant_id with decrypted one
        
        $data = $request->validated();

        // Replace the encrypted tenant_id with the decrypted one
        

        // Create the company detail record
        CompanyDetail::create($data);

        DB::commit();

        return response()->json([
            'message' => 'Company details saved successfully!'
        ], 201);

    } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
        DB::rollBack();

        return response()->json([
            'error' => 'Invalid tenant_id provided',
            'message' => $e->getMessage()
        ], 403); // Forbidden
    } catch (\Exception $e) {
        DB::rollBack();

        return response()->json([
            'error' => 'Failed to save company details',
            'message' => $e->getMessage()
        ], 500);
    }
}
}//UserController
