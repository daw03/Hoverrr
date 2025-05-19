<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EventoUserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function destroy(Request $request, $eventoId, $userId)
    {
        $user = Auth::user();

        if ($user->id !== (int) $userId && $user->role_id !== 2) {
            return response()->json(['error' => 'No tienes permiso para eliminar esta inscripción.'], 403);
        }

        try {
            $deleted = DB::table('evento_user')
                ->where('evento_id', $eventoId)
                ->where('user_id', $userId)
                ->delete();

            if ($deleted) {
                return response()->json(['message' => 'Inscripción eliminada correctamente.'], 200);
            } else {
                return response()->json(['error' => 'No se encontró la inscripción para eliminar.'], 404);
            }
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function cambiarEstado(Request $request, $eventoId, $userId)
    {
        $user = Auth::user();

        if ($user->role_id == 0) {
            return response()->json(['error' => 'No tienes permiso para cambiar el estado de la inscripción.'], 403);
        }

        try {
            $inscripcion = DB::table('evento_user')
                ->where('evento_id', $eventoId)
                ->where('user_id', $userId)
                ->first();

            if (!$inscripcion) {
                return response()->json(['error' => 'No se encontró la inscripción para actualizar.'], 404);
            }

            $nuevoEstado = $inscripcion->estado == 0 ? 1 : 0;

            $updated = DB::table('evento_user')
                ->where('evento_id', $eventoId)
                ->where('user_id', $userId)
                ->update(['estado' => $nuevoEstado]);

            if ($updated) {
                return response()->json(['message' => 'Estado de la inscripción actualizado correctamente.', 'data' => ['evento_id' => $eventoId, 'user_id' => $userId, 'estado' => $nuevoEstado]], 200);
            } else {
                return response()->json(['error' => 'No se pudo actualizar el estado de la inscripción.'], 500);
            }
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}