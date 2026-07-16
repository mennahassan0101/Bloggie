<?php

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewCommentNotification extends Notification
{
    use Queueable;

    public function __construct(public Comment $comment)
    {
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New comment on your post')
            ->line($this->comment->author->name . ' commented on "' . $this->comment->post->title . '"')
            ->line($this->comment->body)
            ->action('View Post', rtrim(config('app.frontend_url'), '/') . '/posts/' . $this->comment->post_id);
    }
}