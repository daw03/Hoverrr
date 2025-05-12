<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'to' => 'required|email',
            'subject' => 'required|string',
            'message' => 'required|string',
        ]);

        Mail::raw($request->message, function ($mail) use ($request) {
            $mail->to($request->to)
                 ->subject($request->subject);
        });

        return response()->json(['message' => 'Correo enviado']);
    }
}
