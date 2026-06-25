<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessage;
use App\Models\Contact;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        // Honeypot spam check
        if ($request->filled('company')) {
            return back()->with('status', 'sent');
        }

        $data = $request->validate([
            'name'    => ['required', 'string', 'max:255'],
            'email'   => ['required', 'email', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        // Always save to database first
        Contact::create([
            'name'       => $data['name'],
            'email'      => $data['email'],
            'message'    => $data['message'],
            'ip_address' => $request->ip(),
        ]);

        // Send notification email — non-fatal so DB save always succeeds
        try {
            Mail::to('kunambiwaziri1@gmail.com')->send(new ContactMessage(
                name: $data['name'],
                email: $data['email'],
                body: $data['message'],
            ));
        } catch (\Throwable $e) {
            Log::error('Contact email failed: '.$e->getMessage());
        }

        return back()->with('status', 'sent');
    }
}
