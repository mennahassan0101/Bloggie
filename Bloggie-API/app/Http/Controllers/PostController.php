<?php

namespace App\Http\Controllers;
 
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Requests\UpdatePostTagsRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $posts = Post::with(['author', 'tags'])
            ->withCount('comments')
            ->latest()
            ->paginate(2);

        return PostResource::collection($posts);
    }

    public function store(StorePostRequest $request)
    {
        $post = DB::transaction(function () use ($request) {
            $post = $request->user()->posts()->create([
                'title' => $request->title,
                'body' => $request->body,
            ]);

            $this->syncTags($post, $request->tags);

            return $post;
        });

        $post->load(['author', 'tags']);
        return new PostResource($post);
    }

    public function show(Post $post)
    {
        $post->load(['author', 'tags', 'comments.author']);

        return new PostResource($post);
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        $post->update($request->only('title', 'body'));
        $post->load(['author', 'tags']);

        return new PostResource($post);
    }

    public function destroy(Request $request, Post $post)
    {
        $this->authorize('delete', $post);

        $post->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }

    public function updateTags(UpdatePostTagsRequest $request, Post $post)
    {
        DB::transaction(function () use ($request, $post) {
            $this->syncTags($post, $request->tags);
        });
 
        $post->load(['author', 'tags']);
 
        return new PostResource($post);
    }

    private function syncTags(Post $post, array $tagNames): void
    {
        $tagIds = collect($tagNames)
            ->map(fn ($name) => trim($name))
            ->filter()
            ->unique()
            ->map(fn ($name) => Tag::firstOrCreate(
                ['name' => $name],
                ['slug' => Str::slug($name)]
            )->id);

        $post->tags()->sync($tagIds);
    }
}