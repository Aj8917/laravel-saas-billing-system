<?php

namespace App\Services;

use App\Models\ProductVariant;
use Illuminate\Support\Str;

class SkuService
{
    /**
     * Generate a unique SKU based on the product name and optional vendor/category.
     *
     * @param string $productName
     * @param int|null $vendorId
     * @param int|null $categoryId
     * @return string
     */
    public function generate(string $productName, ?int $vendorId = null, ?int $categoryId = null): string
    {
        // Build the base SKU from name + vendor + category
        $slug = strtoupper(Str::slug($productName));
        $baseSku = $slug;

        if ($vendorId) {
            $baseSku .= '-V' . $vendorId;
        }

        if ($categoryId) {
            $baseSku .= '-C' . $categoryId;
        }

        // Ensure uniqueness
        $sku = $baseSku;
        
        //$count = 1;
        // while (Product::where('sku', $sku)->exists()) {
        //     $sku = $baseSku . '-' . $count++;
        // }
       
        $existsSku=ProductVariant::where('base_sku', $sku)->exists();
        if($existsSku){     
            $sku =$existsSku;
        }
        return $sku;
    }
}
