<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $user = Auth::user();
        if ($user->role_id !== "2") {
            return response()->json(['error' => 'No tienes permiso de administrador.'], 403);
        }
        $users = User::all();
        return response()->json($users);
    }

    public function show($id)
    {
        try{
            $user = Auth::user();
            if ($user->role_id !== "2" && $user->id != $id) { 
                return response()->json(['error' => 'No tienes permisos'], 403);
            }
    
            $user = User::findOrFail($id);
            return response()->json($user);
        }
        catch(\Exception $e){
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }
    }

    public function updateAdmin(Request $request, $id)
    {
        $actualUser = Auth::user(); 
        if ($actualUser->role_id !== "2" && $actualUser->id != $id) { 
            return response()->json(['error' => 'No tienes permisos'], 403);
        }

        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'role_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user->name = $request->name;
        $user->email = $request->email;
        $user->role_id = $request->role_id;
        $user->save();

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'user' => $user
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $actualUser = Auth::user(); 
        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user->name = $request->name;
        $user->email = $request->email;
        $user->save();

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'user' => $user
        ], 200);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        if ($user->role_id !== "2" && $user->id != $id) {
            return response()->json(['error' => 'No tienes permisos'], 403);
        }
        $userToDelete = User::findOrFail($id);
        $userToDelete->delete();

        return response()->json(['message' => 'Usuario eliminado correctamente'], 204);
    }
}
