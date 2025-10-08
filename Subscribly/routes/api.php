<?php

use App\Http\Controllers\Api\Invoice\InvoiceController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\PlanController;
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
    Route::post('/company-details', 'companyDetails');
});

Route::controller(LocationController::class)->group(function(){
    Route::get('/countries','getCountries');
    Route::post('/states',  'getStates');
    Route::post('/cities', 'getCities');
});

Route::get('/plans', PlanController::class);

Route::post('/basic-invoice', [InvoiceController::class, 'storeBasic'])->middleware('auth:sanctum');
