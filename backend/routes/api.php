<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::controller(\App\Http\Controllers\EventoController::class)->group(function () {
    Route::get('eventos', 'index'); // Listar todos los eventos
    Route::get('eventos/mine', 'listmine'); // Listar eventos del usuario autenticado
    Route::get('eventos/{id}', 'show'); // Ver detalles de un evento específico
    Route::post('eventos', 'store'); // Crear nuevo evento
    Route::put('eventos/{id}', 'update'); // Actualizar evento
    Route::delete('eventos/{id}', 'delete'); // Eliminar evento
    Route::post('eventos/{id}/inscribirse', 'inscribirse'); // Inscribirse en evento
    //Route::post('eventos/{id}/file', 'fileUpload'); // Subir archivo para evento
});

Route::controller(AuthController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('register', 'register');
    Route::post('logout', 'logout');
    Route::post('refresh', 'refresh');
    Route::get('me', 'me');
});
