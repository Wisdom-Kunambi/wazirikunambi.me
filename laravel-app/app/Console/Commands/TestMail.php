<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestMail extends Command
{
    protected $signature = 'mail:test {--to= : Recipient address (defaults to ADMIN_EMAIL)}';
    protected $description = 'Send a test email to diagnose mail configuration on this server';

    public function handle(): int
    {
        $to  = $this->option('to') ?: env('ADMIN_EMAIL', 'kunambiwaziri1@gmail.com');
        $cfg = config('mail.mailers.smtp');

        $this->info('Mail config:');
        $this->line("  Mailer    : " . config('mail.default'));
        $this->line("  Host      : " . ($cfg['host'] ?? '—'));
        $this->line("  Port      : " . ($cfg['port'] ?? '—'));
        $this->line("  Encryption: " . ($cfg['encryption'] ?? 'none'));
        $this->line("  Username  : " . ($cfg['username'] ?? '—'));
        $this->line("  From      : " . config('mail.from.address'));
        $this->line("  To        : {$to}");
        $this->newLine();

        try {
            Mail::raw('Test from ' . config('app.url') . ' at ' . now(), function ($msg) use ($to) {
                $msg->to($to)->subject('[wazirikunambi.me] Mail test — ' . now());
            });

            $this->info('✅ Email sent successfully. Check your inbox.');
            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error('❌ Mail failed: ' . $e->getMessage());
            $this->newLine();
            $this->warn('Possible causes:');
            $this->line('  1. Port 587 blocked by host → try MAIL_PORT=465 + MAIL_ENCRYPTION=ssl');
            $this->line('  2. Gmail App Password wrong or revoked');
            $this->line('  3. PHP openssl extension missing');
            $this->line('  4. Host requires its own SMTP relay');
            return self::FAILURE;
        }
    }
}
