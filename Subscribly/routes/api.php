<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\Invoice\InvoiceController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\PlanController;
use App\Http\Controllers\Api\Product\ProductController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/get-appname', function () {
    return response()->json(['name' => config('app.name', 'app.env')]);
});

Route::controller(UserController::class)->group(function () {
    Route::post('/signup', 'signup');
    Route::post('/signin', 'singin');
    Route::post('/subscriptions', 'planSelection');
    Route::get('/company-details','fetchComapnyDetails');
    Route::post('/company-details', 'companyDetails');
    Route::get('/dashboard-details','dashboardDetails');
     Route::post('/sub-vendors', 'addSubVendor');
   
});

Route::controller(LocationController::class)->group(function(){
    Route::get('/countries','getCountries');
    Route::post('/states',  'getStates');
    Route::post('/cities', 'getCities');
});

Route::get('/plans', PlanController::class);

Route::controller(InvoiceController::class)->group(function(){
    Route::post('/basic-invoice','storeBasic');
    Route::get('/invoice/{encryptedId}',  'showBasicInvoice');
    Route::get('/invoices','fetchAllInvoice');

    Route::post('/pro-invoice','storePro');
    Route::get('/pro-invoices','fetchAllProInvoice');
     Route::get('/pro-invoice/{encryptedId}',  'showProInvoice');
})->middleware('auth:sanctum');

Route::controller(CategoryController::class)->group(function(){
    Route::get('/categories','index');
    Route::post('/categories','store'); 
})->middleware('auth:sanctum');

Route::controller(ProductController::class)->group(function(){
    Route::get('/products','index');
    Route::post('/products','storeProduct');
    Route::post('/update-stock','updateStock');
})->middleware('auth:sanctum');