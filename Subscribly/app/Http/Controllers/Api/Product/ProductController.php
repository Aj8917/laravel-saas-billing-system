<?php

namespace App\Http\Controllers\Api\Product;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\attributes;
use App\Models\Product;
use App\Models\product_variants;
use App\Models\products;
use App\Models\ProductVariant;
use App\Models\variant_attributes;
use App\Models\VariantAttribute;
use App\Models\vendor_offers;
use App\Models\VendorOffer;
use Auth;
use DB;
use Illuminate\Http\Request;
use Validator;
use App\Services\SkuService;

class ProductController extends Controller
{

    public function index()
    {
        $vendor = Auth::user();
        try {
            $VendorOffer = VendorOffer::where('vendor_id', $vendor->id)
                ->with(['variant.product']) 
                ->get();

            return response()->json(['products' => $VendorOffer]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching products', 'error' => $e->getMessage()], 500);

        }
    }
    public function storeProduct(Request $request, SkuService $skuService)
    {
        $vendor = Auth::user();

        $validator = Validator::make($request->all(), [
            'products' => 'required|array|min:1',

            'products.*.productName' => 'required|string|max:255',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.price' => 'required|numeric|min:0',
            'products.*.stock' => 'required|integer|min:0',
            'products.*.batchNo' => 'required|string|max:255',
            'products.*.unit' => 'required|string|max:255',
            'products.*.category_id' => 'required|integer|exists:categories,id',

            'products.*.attributes' => 'required|array',
            'products.*.attributes.*.attribute' => 'required|string|max:255',
            'products.*.attributes.*.value' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();

        try {
            foreach ($request->products as $productData) {
                // Generate SKU once per product
                $variantSku = $skuService->generate(
                    $productData['productName'],
                    null,
                    $productData['category_id']
                );
                $vendorSku = $skuService->generate(
                    $productData['productName'],
                    $vendor->id,
                    $productData['category_id']
                );
                // Create or get the product
                $product = Product::firstOrCreate(
                    ['name' => $productData['productName']],
                    ['category_id' => $productData['category_id']]
                );

                // Create or get the product variant by SKU
                $variant = ProductVariant::firstOrCreate(
                    [
                        'product_id' => $product->id,
                        'base_sku' => $variantSku,
                    ],
                    [
                        'batch_no' => $productData['batchNo'],
                        'unit' => $productData['unit'],
                        'quantity' => $productData['quantity'],
                    ]
                );

                // Save attributes for the variant
                foreach ($productData['attributes'] as $attrData) {
                    $attribute = Attribute::firstOrCreate(['name' => $attrData['attribute'], 'category_id' => $productData['category_id'],]);

                    VariantAttribute::firstOrCreate([
                        'attribute_id' => $attribute->id,
                        'value' => $attrData['value'],
                    ]);
                }

                // Save vendor offer for the variant
                VendorOffer::updateOrCreate(
                    [
                        'variant_id' => $variant->id,
                        'vendor_id' => $vendor->id,
                    ],
                    [
                        'vendor_sku' => $vendorSku,
                        'price' => $productData['price'],
                        'stock_qty' => $productData['stock'],
                        'is_active' => 1,
                    ]
                );
            }

            DB::commit();

            return response()->json(['message' => 'Products saved successfully.'], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to save products.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }//storeProduct
}
