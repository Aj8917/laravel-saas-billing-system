<?php

use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\PlanController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/get-appname',function(){
    return response()->json(['name'=>config('app.name','app.env')]);
});


Route::post('/signup',[UserController::class,'signup']);
Route::post('/signin',[UserController::class,'singin']);

Route::get('/countries', [LocationController::class, 'getCountries']);
Route::post('/states', [LocationController::class, 'getStates']);
Route::post('/cities', [LocationController::class, 'getCities']);

Route::get('/plans',PlanController::class);
Route::post('/subscriptions',[UserController::class,'planSelection']);