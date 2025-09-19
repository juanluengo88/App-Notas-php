<?php
namespace App\Http\Controllers;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\Note;
class NoteController extends Controller
{

    public function index(Request $request)
    {
        $archived_param = $request->query("archived");
        $category_param = $request->query("category");

        $notes = [];

        if ($request->has("archived") && $request->has("category")) {
            $notes = Note::with('categories')
                ->where("archived", "=", $archived_param)
                ->whereHas('categories', function ($query) use ($category_param) {
                    $query->where("name", "=", $category_param);
                })
                ->get();
        } elseif ($request->has("archived")) {
            $notes = Note::where("archived", "=", $archived_param)->get();
        } elseif ($request->has("category")) {
            $notes = Note::with('categories')
                ->where("archived", "=", $archived_param)
                ->whereHas('categories', function ($query) use ($category_param) {
                    $query->where("name", "=", $category_param);
                })
                ->get();

        } else {
            $notes = Note::with("categories")->get();
        }

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
            "active" => 'sometimes|boolean'
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
