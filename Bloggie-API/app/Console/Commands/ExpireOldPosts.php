<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use App\Models\Post;

#[Signature('posts:expire')]
#[Description('Soft-delete posts older than 2 hours')]
class ExpireOldPosts extends Command
{
    /**
     * Execute the console command.
     */
    public function handle() : void
    {
        $count = Post::where('created_at', '<=', now()->subHours(24))->delete(); 
        $this->info("Expired {$count} post(s).");
    }
}
