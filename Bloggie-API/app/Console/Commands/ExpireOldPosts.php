<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:expire-old-posts')]
#[Description('Command description')]
class ExpireOldPosts extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
    }
}
