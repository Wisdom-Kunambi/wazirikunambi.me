<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitor_heartbeats', function (Blueprint $table) {
            $table->string('visitor_id', 36)->primary();
            $table->timestamp('last_seen_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitor_heartbeats');
    }
};
