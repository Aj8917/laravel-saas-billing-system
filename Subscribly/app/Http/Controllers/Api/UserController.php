<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\companyDetailsRequest;
use App\Mail\PremiumWelcomeMail;
use App\Models\BasicInvoice;
use App\Models\CompanyDetail;
use App\Models\Plan;
use App\Models\ProInvoice;
use App\Models\Subscriptions;
use App\Models\Tenant;
use App\Models\User;
use App\Models\VendorOffer;
use Auth;
use DB;
use Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Validator;
use Carbon\Carbon;

class UserController extends Controller
{
    public function singin(Request $request)
    {

        $credentials = $request->only('email', 'password');

        if (Auth::guard('web')->attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            $company = CompanyDetail::with('tenant')->where('tenant_id', $user->tenant_id)->first();
            $plan = Subscriptions::with('tenant')
                ->where('tenant_id', $user->tenant_id)->first();

            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user->name,
                'plan' => $plan->plan->name,
                'company_name' => $company->tenant->business_name,
                'permissions' => $user->role?->getCachedPermissions() ?? [],

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
            'role_id' => 2,
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

        $tenantId = decrypt($request->tenant_id);
        // ----------------------------Fetch the plan from the database------------------------
        $plan = Plan::where('id', $request->plan_id)
            ->where('name', $request->planName)
            ->first();

        if (!$plan) {
            return response()->json(['error' => 'Plan not found'], 404);
        }

        //------------------------------premimum mail----------------------------------------
        if ($plan->id == 3 && $plan->name === "Premium") {
            $user = User::whereTenantId($tenantId)
                         ->whereRoleId(2)
                         ->first();

            if ($user) {
                Mail::to($user->email)->send(new PremiumWelcomeMail($user));
            }
        }
        //------------------------------subscrioption details --------------------------------
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
            'tenant_id' => $tenantId,
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
    }//companyDetails

    public function dashboardDetails()
    {
        $user = Auth::user();

        $plan = Subscriptions::with('tenant')
            ->where('tenant_id', $user->tenant_id)
            ->first();

        $details = [
            'name' => 'user',
            'orders' => 0,
            'revenue' => 0,
            'total_tax' => 0,
        ];

        if ($plan->plan->name == "Basic") {
            $summary = BasicInvoice::summaryForVendor($user->id)->first();

            if ($summary) {
                $details = [
                    'name' => $user->name,
                    'orders' => (int) ($summary?->orders ?? 0),
                    'revenue' => (float) ($summary->revenue ?? 0),
                    'total_tax' => (float) ($summary->total_tax ?? 0),
                ];
            }
        }

        if ($plan->plan->name == "Pro") {

            $vendorIds = $user->parent_id
                ? [$user->parent_id, $user->id]
                : [$user->id];
            $summary = ProInvoice::whereHas(
                'offer',
                fn($q) =>
                $q->whereIn('vendor_id', $vendorIds)
            )
                ->selectRaw('COUNT(DISTINCT invoice_no) as orders, SUM(subtotal) as revenue, SUM(tax_total) as total_tax')
                ->first();

            // Start $details with summary info
            $details = [
                'name' => $user->name,
                'orders' => (int) ($summary->orders ?? 0),
                'revenue' => (float) ($summary->revenue ?? 0),
                'total_tax' => (float) ($summary->total_tax ?? 0),
            ];

            // Add low stock data
            $low_stock = VendorOffer::with('variant.product')
                ->whereIn('vendor_id', $vendorIds)
                ->where('stock_qty', '<', 5)
                ->select('id', 'variant_id', 'stock_qty')
                ->get();

            $details['low_stock'] = $low_stock->map(function ($item) {
                return [
                    'product_name' => $item->variant->product->name ?? 'N/A',
                    'stock_qty' => $item->stock_qty,
                ];
            });
        }

        return response()->json(['details' => $details]);


    }//dashboardDetails



    //-------------------------------------------------- Business Account ----------------------------------------------------------


    public function fetchComapnyDetails()
    {
        $user = Auth::user();

        $company_details = Tenant::with('companyDetails', 'users')
            ->where('id', $user->tenant_id)
            ->first();

        return response()->json(['details' => $company_details]);
    }//fetchComapnyDetails
    public function addSubVendor(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'name' => ['required', 'regex:/^[A-Za-z\s]+$/'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[A-Z]/',         // at least one uppercase
                'regex:/[a-z]/',         // at least one lowercase
                'regex:/[0-9]/',         // at least one digit
                'regex:/[@$!%*?&\-]/'    // at least one special char (hyphen included safely)
            ],
            'confirmPassword' => ['required', 'same:password'],
        ], [
            'name.regex' => 'Name must only contain letters and spaces.',
            'password.regex' => 'Password must have at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character.',
            'confirmPassword.same' => 'Confirm password must match the password',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }



        // Hash the password before storing
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'tenant_id' => $user->tenant->id,
            'password' => Hash::make($request->password),
            'parent_id' => $user->id,
            'role_id' => 3,
        ]);

        return response()->json([
            'success' => 'User Created!',
        ], 201);
    }//addSubVendor
}//UserController
