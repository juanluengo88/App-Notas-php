<?php
namespace App\Http\Controllers;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\Note;
class NoteController extends Controller
{

    public function index(Request $request)
{
    $archived_param = $request->query("archived", 1); 
    $category_param = $request->query("category");

    $query = Note::with("categories");

    
    $query->where("archived", "=", $archived_param);

    if ($category_param) {
        $query->whereHas("categories", function ($q) use ($category_param) {
            $q->where("name", "=", $category_param);
        });
    }

    $notes = $query->get();

    return response()->json($notes);
}


    public function getNote(string $id)
    {
        $note = Note::with('categories')->find($id);

        if (!$note) {
            return response()->json(['message' => 'Nota no encontrada'], 404);
        }
        return response()->json($note);
    }


    public function store(Request $request)
    {

        $validatedData = $request->validate([
            'notes' => 'required|string'
        ]);

        $note = Note::create($validatedData);

        return response()->json($note->id, 201);
    }

    public function deleteNote(string $id)
    {
        $note = Note::find($id);
        if (!$note) {
            return response()->json(['message' => ''], 404);
        }
        $note->delete();
        return response()->json($note, 204);
    }
    public function updateNote(Request $request, string $id)
    {

        $validatedData = $request->validate([
            'notes' => 'sometimes|string',
            "archived" => 'sometimes|boolean'
        ]);


        $note = Note::find($id);


        if (!$note) {
            return response()->json(['message' => 'Note not found'], 404);
        }


        $note->update($validatedData);


        return response()->json($note, 200);
    }

    public function addCategory(Request $request, $id)
    {

        $note = Note::find($id);
        if ($note == null) {
            return response()->json(['message' => 'The note doesnt exists'], 404);
        }

        $request->validate([
            'id' => 'required|exists:categories,id',
        ]);
        $category = Category::find($request->id);
        if (!$category) {
            return response()->json(['message' => 'That category doesnt exists'], 404);
        }



        $note->categories()->attach($request->id);


        return response()->json([
            'message' => 'Category sucessfully attached to the Note',
        ], 200);

    }
    public function removeCategory(Note $note, Category $category)
    {
        $note->categories()->detach($category->id);

        return response()->json([
            'message' => 'Category sucessfully deattached from the note',
        ], 200);
    }

}
