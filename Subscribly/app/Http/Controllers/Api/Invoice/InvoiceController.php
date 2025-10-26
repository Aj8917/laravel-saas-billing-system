<?php

namespace App\Http\Controllers\Api\Invoice;
use App\Http\Controllers\Controller;
use App\Models\BasicInvoice;
use App\Models\Customer;
use App\Models\ProInvoice;
use App\Models\VendorOffer;
use Auth;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\InvoiceNumberGenerator;

class InvoiceController extends Controller
{

    public function storeBasic(Request $request, InvoiceNumberGenerator $generator)
    {
        $user = Auth::user();

        //  Validate request
        $validated = $request->validate([
            'customerName' => 'required|string|max:255',
            'customerMobile' => [
                'required',
                'regex:/^[6-9]\d{9}$/',
                'digits:10'
            ],
            'products' => 'required|array|min:1',
            'products.*.productName' => 'required|string|max:255',
            'products.*.quantity' => 'required|numeric|min:1',
            'products.*.price' => 'required|numeric|min:0',
        ]);
        //  Check if customer exists for this vendor
        $customer = Customer::where('vendor_id', $user->id)
            ->where('mobile', $validated['customerMobile'])
            ->first();

        $tenant = $user->tenant;
        $invoiceNumber = $generator->generate($tenant);

        DB::beginTransaction();

        try {
            if (!$customer) {
                //  Create new customer if not found
                $customer = Customer::create([
                    'name' => $validated['customerName'],
                    'mobile' => $validated['customerMobile'],
                    'vendor_id' => $user->id,
                ]);
            }
            if (!$customer || !$user) {
                throw new \Exception("Missing customer or user");
            }
            //  Process each product
            foreach ($validated['products'] as $product) {
                $quantity = $product['quantity'];
                $price = $product['price'];
                $lineTotal = $quantity * $price;
                $taxTotal = round($lineTotal * 0.18, 2); // 18% GST
                $total = round($lineTotal + $taxTotal, 2);

                $invoice = BasicInvoice::create([
                    'cust_id' => $customer->id,
                    'vendor_id' => $user->id,
                    'product_name' => $product['productName'],
                    'sell_quantity' => $quantity,
                    'price' => $price,
                    'subtotal' => $lineTotal,
                    'tax_total' => $taxTotal,
                    'total' => $total,
                    'issued_at' => Carbon::now(),
                    'invoice_no' => $invoiceNumber
                ]);
            }
            if (!$invoice) {
                throw new \Exception("Invoice creation failed. Check fields or fillable.");
            }
            DB::commit();

            return response()->json([
                'message' => 'Invoice stored successfully',
                'invoiceNo' => $invoiceNumber,
            ], 201);

        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            DB::rollBack();

            return response()->json([
                'error' => 'something went wrong',
                'message' => $e->getMessage()
            ], 403); // Forbidden
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'error' => 'Failed to Create Invoice',
                'message' => $e->getMessage()
            ], 500);
        }
    }//storeBasic

    public function showBasicInvoice($encryptedNo)
    {

        try {
            // $invoice_no = decrypt($encryptedNo);
            $invoice = BasicInvoice::with('customer:id,name,mobile') // ✅ Include 'id'
                ->where('invoice_no', $encryptedNo)
                ->select(
                    'product_name',
                    'sell_quantity',
                    'price',
                    'invoice_no',
                    'subtotal',
                    'tax_total',
                    'total',
                    'issued_at',
                    'cust_id' // ✅ Also include the foreign key!
                )
                ->get();
            $customer = $invoice->first()->customer;
            return response()->json(['customer' => $customer, 'invoice' => $invoice]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid invoice ID.'], 404);
        }
    }//showBasicInvoice

    public function fetchAllInvoice(Request $request)
    {
        $user = Auth::user();

        try {
            $perPage = $request->get('per_page', 50);
            $search = $request->get('search');
            $query = BasicInvoice::where('vendor_id', $user->id)
                ->with(['customer:id,name,mobile'])
                ->select(
                    'product_name',
                    'sell_quantity',
                    'price',
                    'invoice_no',
                    'subtotal',
                    'tax_total',
                    'total',
                    'issued_at',
                    'cust_id' 
                );

            if (!empty($search)) {
                $query->where('invoice_no', 'like', '%' . $search . '%');
            }
            $invoices = $query->orderBy('created_at', 'desc')
                              ->paginate($perPage);
            return response()->json($invoices);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching invoices', 'error' => $e->getMessage()], 500);

        }

    }//fetchAllInvoice


    //-------------------------------------- pro ----------------------------------------------------------------------------

    public function storePro(Request $request, InvoiceNumberGenerator $generator)
    {
        $user = Auth::user();

        //  Validate request
        $validated = $request->validate([
            'customerName' => 'required|string|max:255',
            'customerMobile' => [
                'required',
                'regex:/^[6-9]\d{9}$/',
                'digits:10'
            ],
            'products' => 'required|array|min:1',
            'products.*.uuid' => 'required|uuid',
            'products.*.quantity' => 'required|numeric|min:1',

        ]);
        //  Check if customer exists for this vendor
        $customer = Customer::where('vendor_id', $user->id)
            ->where('mobile', $validated['customerMobile'])
            ->first();

        $tenant = $user->tenant;
        $invoiceNumber = $generator->generate($tenant);

        DB::beginTransaction();

        try {
            if (!$customer) {
                //  Create new customer if not found
                $customer = Customer::create([
                    'name' => $validated['customerName'],
                    'mobile' => $validated['customerMobile'],
                    'vendor_id' => $user->id,
                ]);
            }
            if (!$customer || !$user) {
                throw new \Exception("Missing customer or user");
            }

            //  Process each product
            foreach ($validated['products'] as $product) {

                $offer = VendorOffer::whereHas('variant.product', function ($query) use ($product) {
                    $query->where('uuid', $product['uuid']);
                })->with('variant.product')->firstOrFail();

                $quantity = $product['quantity'];
                $price = $offer->price;
                $lineTotal = $quantity * $price;
                $taxTotal = round($lineTotal * 0.18, 2); // 18% GST
                $total = round($lineTotal + $taxTotal, 2);

                $invoice = ProInvoice::create([
                    'cust_id' => $customer->id,
                    'offer_id' => $offer->id,
                    'invoice_no' => $invoiceNumber,
                    'sell_quantity' => $quantity,
                    'price' => $offer->price,
                    'subtotal' => $lineTotal,
                    'tax_total' => $taxTotal,
                    'total' => $total,
                    'issued_at' => Carbon::now(),

                ]);
            }
            if (!$invoice) {
                throw new \Exception("Invoice creation failed. Check fields or fillable.");
            }
            DB::commit();

            return response()->json([
                'message' => 'Invoice stored successfully',
                'invoiceNo' => $invoiceNumber,
            ], 201);

        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            //  DB::rollBack();

            return response()->json([
                'error' => 'something went wrong',
                'message' => $e->getMessage()
            ], 403); // Forbidden
        } catch (\Exception $e) {
            //  DB::rollBack();

            return response()->json([
                'error' => 'Failed to Create Invoice',
                'message' => $e->getMessage()
            ], 500);
        }
    }//storePro

    public function fetchAllProInvoice(Request $request)
    {
        $user = Auth::user();

        try {

            $perPage = $request->get('per_page', 50);
            $search = $request->get('search');
            $query = ProInvoice::with(['offer.variant.product', 'Customer'])
                ->orderBy('created_at', 'desc');

            if (!empty($search)) {
                $query->where('invoice_no', 'like', '%' . $search . '%');
            }
            $invoices = $query->orderBy('created_at', 'desc')
                ->paginate($perPage);

            return response()->json($invoices);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching invoices', 'error' => $e->getMessage()], 500);

        }

    }//fetchAllProInvoice



}//InvoiceController
