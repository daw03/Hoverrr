<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
class CategoriaController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role_id !== "2") {
                return response()->json(['error' => 'No tienes permiso de administrador.'], 403);
            }

            $categorias = Categoria::all();
            return response()->json($categorias);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role_id !== "2") {
                return response()->json(['error' => 'No tienes permiso de administrador.'], 403);
            }

            $validator = Validator::make($request->all(), [
                'nombre' => 'required|unique:categorias|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $categoria = Categoria::create($request->all());
            return response()->json($categoria, 201);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role_id !== "2") {
                return response()->json(['error' => 'No tienes permiso de administrador.'], 403);
            }

            $categoria = Categoria::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'nombre' => 'required|unique:categorias,nombre,' . $id . '|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $categoria->update($request->all());
            return response()->json([
                'message' => 'Categoría actualizada correctamente',
                'categoria' => $categoria
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Categoría no encontrada'], 404);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role_id !== "2") {
                return response()->json(['error' => 'No tienes permiso de administrador.'], 403);
            }

            $categoria = Categoria::findOrFail($id);
            $categoria->delete();
            return response()->json(['message' => 'Categoría eliminada correctamente'], 204);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Categoría no encontrada'], 404);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
    public function show($id)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role_id !== "2") {
                return response()->json(['error' => 'No tienes permiso de administrador.'], 403);
            }

            $categoria = Categoria::findOrFail($id);
            return response()->json($categoria);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Categoría no encontrada'], 404);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
