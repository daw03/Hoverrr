<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventFile extends Model 
{
    use HasFactory;
    protected $fillable = ['name', 'file_path', 'evento_id']; 
    public function evento()
    {
        return $this->belongsTo(Evento::class);
    }
}