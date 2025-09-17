<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'content', 'category'];
    

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'note_category');
    }
}
