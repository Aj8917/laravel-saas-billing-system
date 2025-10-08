<?php

namespace App\Http\Controllers\Api\Invoice;

use App\Http\Controllers\Controller;
use App\Models\BasicInvoice;
use App\Models\Customer;
use App\Models\products;
use Auth;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Validator;

class InvoiceController extends Controller
{
    
    public function storeBasic(Request $request)
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

        if (!$customer) {
            //  Create new customer if not found
            $customer = Customer::create([
                'name' => $validated['customerName'],
                'mobile' => $validated['customerMobile'],
                'vendor_id' => $user->id,
            ]);
        }

        //  Process each product
        foreach ($validated['products'] as $product) {
            $quantity = $product['quantity'];
            $price = $product['price'];
            $lineTotal = $quantity * $price;
            $taxTotal = round($lineTotal * 0.18, 2); // 18% GST
            $total = round($lineTotal + $taxTotal, 2);

            BasicInvoice::create([
                'cust_id' => $customer->id,
                'vendor_id' => $user->id,
                'product_name' => $product['productName'],
                'sell_quantity' => $quantity,
                'price' => $price,
                'subtotal' => $lineTotal,
                'tax_total' => $taxTotal,
                'total' => $total,
                'issued_at' => Carbon::now(),
            ]);
        }

        return response()->json([
            'message' => 'Invoice stored successfully',
            
        ], 201);
    }//storeBasic


}//InvoiceController
