<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EventoUserController;
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

Route::controller(EventoController::class)->group(function () {
    Route::get('eventos', 'index'); // Listar todos los eventos
    Route::get('eventoslist', 'list'); // Listar eventos filtrados
    Route::get('eventos/mine', 'listmine'); // Listar eventos del usuario autenticado
    Route::get('eventos/inscrito', 'misinscripciones'); // Mis eventos inscritos
    Route::get('eventos/{id}', 'show'); // Ver detalles de un evento específico
    Route::post('eventos', 'store'); // Crear nuevo evento
    Route::put('eventos/{id}', 'update'); // Actualizar evento
    Route::put('eventos/{id}/cambiar-estado', 'cambiarEstado'); // Cambiar estado de inscripción
    Route::delete('eventos/{id}', 'delete'); // Eliminar evento
    Route::post('eventos/{id}/inscribirse', 'inscribirse'); // Inscribirse en evento
    Route::get('eventos/{id}/estainscrito', 'estaInscrito'); // Ver si el usuario está inscrito en un evento
});

Route::controller(AuthController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('register', 'register');
    Route::post('logout', 'logout');
    Route::post('refresh', 'refresh');
    Route::get('me', 'me');
});

Route::controller(CategoriaController::class)->group(function () {
    Route::get('categorias', 'index'); 
    Route::post('categorias', 'store'); 
    Route::put('categorias/{id}', 'update');
    Route::delete('categorias/{id}', 'destroy');
    Route::get('categorias/{id}', 'show');
});

Route::controller(UserController::class)->group(function () {
    Route::get('users', 'index'); 
    Route::get('users/{id}', 'show');
    Route::put('usersAdmin/{id}', 'updateAdmin'); 
    Route::put('users/{id}', 'update'); 
    Route::delete('users/{id}', 'destroy');
});

Route::controller(EventoUserController::class)->group(function () {
    Route::delete('/eventos/{eventoId}/usuarios/{userId}/desinscribir', 'destroy');
    Route::put('/eventos/{eventoId}/usuarios/{userId}/estado', 'cambiarEstado');
    Route::get('/eventos/{eventoId}/usuarios', 'index');
});

use App\Http\Controllers\MailController;

Route::post('/sendmail', [MailController::class, 'send']);