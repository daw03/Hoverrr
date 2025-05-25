<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'descripcion',
        'fecha_evento',
        'categoria_id',
        'premios',
        'inscripcion_abierta',
        'verParticipantes',
        'precio',
        'ubicacion',
    ];

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function inscripciones(){
        return $this->belongsToMany(User::class, 'evento_user');
    }
    public function file()
    {
        return $this->hasOne(EventFile::class);
    }
}
