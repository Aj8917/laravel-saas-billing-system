<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\categories;
use Illuminate\Http\Request;
use Validator;

class CategoryController extends Controller
{public function index()
    {
        $categories = categories::all();

        return response()->json([
            'categories' => $categories,
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->only('name'), [
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $category = categories::create([
            'name' => $request->name,
        ]);

        return response()->json([
            'message' => 'Category created successfully.',
            'category' => $category,
        ], 201);
    }
}//CategoryController
