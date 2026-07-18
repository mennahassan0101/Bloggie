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
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New comment on your post')
            ->line($this->comment->author->name . ' commented on "' . $this->comment->post->title . '"')
            ->line($this->comment->body)
            ->action('View Post', rtrim(config('app.frontend_url'), '/') . '/posts/' . $this->comment->post_id);
    }

        public function toArray($notifiable): array
    {
        return [
            'comment_id' => $this->comment->id,
            'post_id' => $this->comment->post_id,
            'post_title' => $this->comment->post->title,
            'commenter_name' => $this->comment->author->name,
            'body_preview' => str($this->comment->body)->limit(80)->toString(),
        ];
    }
}