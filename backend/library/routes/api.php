<?php

use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\VersionController;
use Illuminate\Support\Facades\Route;

Route::get('/version', VersionController::class);

Route::controller(BookController::class)->prefix('books')->group(function () {
    Route::get('/', 'index');
    Route::post('/', 'store');
    Route::get('/{id}', 'show')->whereNumber('id');
    Route::put('/{id}', 'update')->whereNumber('id');
    Route::delete('/{id}', 'destroy')->whereNumber('id');
});

Route::controller(CategoryController::class)->prefix('categories')->group(function () {
    Route::get('/', 'index');
    Route::post('/', 'store');
    Route::get('/{id}', 'show')->whereNumber('id');
    Route::put('/{id}', 'update')->whereNumber('id');
    Route::delete('/{id}', 'destroy')->whereNumber('id');
});
