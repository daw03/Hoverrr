<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class MailController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'to' => 'required|email',
            'message' => 'required|string',
        ]);

        $to = $request->input('to');
        $messageText = $request->input('message');

        // Enviar como HTML
        Mail::html($messageText, function ($message) use ($to) {
            $message->to($to)
                    ->subject('Correo HTML desde Laravel API');
        });

        return response()->json(['message' => 'Correo enviado con éxito']);
    }
}


