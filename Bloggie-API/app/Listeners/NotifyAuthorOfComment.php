<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Notifications\NewCommentNotification;

class NotifyAuthorOfComment implements ShouldQueue{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(object $event): void
    {
        $comment=$event->comment;
        $post=$comment->post;
        if($post->user_id===$comment->user_id){
            return ;
        }
        $post->author->notify(new NewCommentNotification($comment));

    }
}
