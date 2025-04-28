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
        $file = $req-> file('file');
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
            $this->validate($request, [
                'nombre' => 'required|max:255',
                'descripcion' => 'required',
                'fecha_evento' => 'required|date',
                'categoria_id' => 'required|exists:categorias,id',
                'ubicacion' => 'required',
                'premios' => 'nullable',
                'inscripcion_abierta' => 'boolean',
                'precio' => 'numeric',
                'file' => 'nullable|file'
            ]);

            $evento = Evento::findOrFail($id);

            //Compruebo el user
            $user = Auth::user();
            if ($evento->user_id !== $user->id or $user->rol_id == 3) {
                return response()->json(['error' => 'No tienes permisos para actualizar este evento.'], 403);
            }

            $evento->nombre = $request->input('nombre');
            $evento->descripcion = $request->input('descripcion');
            $evento->fecha_evento = $request->input('fecha_evento');
            $evento->categoria_id = $request->input('categoria_id');
            $evento->ubicacion = $request->input('ubicacion');
            $evento->premios = $request->input('premios');
            $evento->inscripcion_abierta = $request->input('inscripcion_abierta', true);
            $evento->precio = $request->input('precio', 0);

            $evento->save();

            // Si hay un nuevo archivo, lo subimos
            if ($request->hasFile('file')) {
                $this->fileUpload($request, $evento->id);
            }

            return response()->json([
                'message' => 'Evento actualizado correctamente',
                'evento' => $evento
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
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
            $eventos = Evento::with('file','user','categoria')->get(); //Con file
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
            // Busca el evento por ID
            $evento = Evento::findOrFail($id);
            $user = Auth::user();
            $user_id = [$user->id];

            // Verifica si el evento tiene la inscripción abierta
            if (!$evento->inscripcion_abierta) {
                return response()->json(['error' => 'La inscripción para este evento está cerrada.'], 403);
            }

            // Verifica si el usuario ya está inscrito en el evento
            if ($evento->usuarios()->where('user_id', $user->id)->exists()) {
                return response()->json(['error' => 'Ya estás inscrito en este evento.'], 403);
            }

            // Inscribe al usuario
            $evento->usuarios()->attach($user_id);

            return response()->json(['message' => 'Inscripción exitosa al evento.'], 200);
        } catch (\Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
