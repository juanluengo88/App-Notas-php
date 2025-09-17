<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\CategoryController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::get('/notes', [NoteController::class, 'index']);

Route::get('/note/{id}', [NoteController::class,'getNote']);

Route::post('/notes', [NoteController::class, 'store']);

Route::delete('/note/{id}', [NoteController::class,'deleteNote']);

Route::patch('/note/{id}', [NoteController::class,'updateNote']);

Route::get("/category", [CategoryController::class,"index"]);

Route::post("/category", [CategoryController::class,"store"]);

Route::delete("/category/{id}", [CategoryController::class,"delete"]);

Route::post('/notes/{id}/categories', [NoteController::class, 'addCategory']);

