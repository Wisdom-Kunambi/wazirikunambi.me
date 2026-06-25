<?php

use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::get('/projects', function () {
    return Inertia::render('projects');
})->name('projects');

Route::get('/resume', function () {
    return Inertia::render('resume');
})->name('resume');

Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
