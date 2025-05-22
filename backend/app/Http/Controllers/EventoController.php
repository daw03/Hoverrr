<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use App\Models\Categoria;
use App\Models\EventFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;


class EventoController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show']]);
    }
    public function store(Request $request)
    {
        try {
            $this->validate($request, [
                'nombre' => 'required|max:255',
                'descripcion' => 'required',
                'fecha_evento' => 'required|date',
                'categoria_id' => 'required|exists:categorias,id',
                'ubicacion' => 'required|string',
                'precio' => 'nullable|numeric',
                'premios' => 'nullable|string',
                'inscripcion_abierta' => 'nullable|boolean',
                'file' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $input = $request->all();
            $category = Categoria::findOrFail($request->input('categoria_id'));
            $user = Auth::user();

            $evento = new Evento($input);
            $evento->user()->associate($user);
            $evento->categoria()->associate($category);
            $res = $evento->save();

            if ($res) {
                $res_file = $this->fileUpload($request, $evento->id);

                if ($res_file) {
                    return response()->json($evento, 201);
                }

                return response()->json(['error' => 'Error al subir la imagen del evento'], 500);
            }

            return response()->json($evento, 201);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function fileUpload(Request $req, $evento_id = null)
    {
        $file = $req->file('file');
        $fileModel = new EventFile();
        $fileModel->evento_id = $evento_id;
        if ($req->file('file')) {
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->move('storage/', $filename);
            $fileModel->name = $filename;
            $fileModel->file_path = $filename;
            $res = $fileModel->save();
            if ($res) {
                return $fileModel;
            } else {
                return false;
            }
        }
        return false;
    }
    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();
            if (!$user || $user->role_id !== "2") {
                return response()->json(['error' => 'No tienes permiso de administrador.'], 403);
            }

            $evento = Evento::query()->findOrFail($id);

            // Validación
            $this->validate($request, [
                'nombre' => 'required|max:255',
                'descripcion' => 'required',
                'fecha_evento' => 'required|date',
                'categoria_id' => 'required|exists:categorias,id',
                'ubicacion' => 'required|string',
                'precio' => 'nullable|numeric',
                'premios' => 'nullable|string',
                'inscripcion_abierta' => 'nullable|boolean',
                'file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // Asociar categoría si cambia
            if ($request->has('categoria_id')) {
                $categoria = Categoria::findOrFail($request->input('categoria_id'));
                $evento->categoria()->associate($categoria);
            }

            // Actualizar los campos del evento
            $evento->fill($request->except('file'));
            $evento->save();

            // Si se ha subido nueva imagen
            if ($request->hasFile('file')) {
                $evento->file()->delete(); // borra imagen antigua
                $this->fileUpload($request, $evento->id);
            }

            return response()->json($evento, 200);

        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function delete(Request $request, $id)
    {
        try {
            $evento = Evento::findOrFail($id);

            //Compruebo el user
            $user = Auth::user();
            if ($evento->user_id !== $user->id or $user->rol_id == 3) {
                return response()->json(['error' => 'No tienes permisos para actualizar este evento.'], 403);
            }

            $evento->delete();
            return $evento;
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()]);
        }
    }

    public function index()
    {
        try {
            $eventos = Evento::with('file', 'user', 'categoria')->get(); //Con file
            //$eventos = Evento::with('user', 'categoria')->get(); //Sin file
            return $eventos;
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()]);
        }
    }
    public function listmine()
    {
        try {
            $user = Auth::user();
            $eventos = Evento::with('file', 'user', 'categoria')->where('user_id', $user->id)->get(); //Con file
            //$eventos = Evento::with('user', 'categoria')->where('user_id', $user->id)->get(); //Sin file
            return $eventos;
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()]);
        }
    }
    public function show(Request $request, $id)
    {
        try {
            $evento = Evento::with('file', 'user', 'categoria')->findOrFail($id); //Con file
            //$evento = Evento::with('user', 'categoria')->findOrFail($id); //Sin file
            return $evento;
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()]);
        }
    }

    public function inscribirse(Request $request, $id)
    {
        try {
            $ok = false;
            $evento = Evento::findOrFail($id);
            $user = Auth::user();
            $user_id = [$user->id];

            if (!$evento->inscripcion_abierta) {
                return response()->json(['error' => 'La inscripción para este evento está cerrada.'], 403);
            }

            // Compruebo que el usuario no se haya inscrito antes
            if ($evento->inscripciones()->where('user_id', $user->id)->exists()) {
                return response()->json(['error' => 'Ya te has inscrito a este evento.'], 403);
            }

            $evento->inscripciones()->attach($user_id);
            $evento->save();
            return response()->json(['message' => 'Inscripción exitosa.'], 200);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()]);
        }
    }

    public function misinscripciones()
    {
        try {
            $user = Auth::user();
            $eventosInscritos = $user->inscripciones()->with('file', 'user', 'categoria')->get();
            return response()->json($eventosInscritos);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function cambiarEstadoInscripcion($id)
    {
        try {
            $user = Auth::user();
            $evento = Evento::findOrFail($id);

            // Solo el admin puede cambiar el estado
            if ($user->role_id != "2") {
                return response()->json(['error' => 'No tienes permisos para cambiar el estado de este evento.'], 403);
            }

            $evento->inscripcion_abierta = $evento->inscripcion_abierta ? 0 : 1;
            $evento->save();

            return response()->json([
                'message' => 'Estado de inscripción actualizado correctamente.',
                'inscripcion_abierta' => $evento->inscripcion_abierta
            ], 200);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
