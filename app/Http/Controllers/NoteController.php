<?php
namespace App\Http\Controllers;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\Note; // o Nota si tu modelo se llama así

class NoteController extends Controller
{
    // Método para probar
   
    // Lista todas las notas
    public function index()
    {
        $notes = Note::all(); // trae todos los registros de la tabla notes
        return response()->json($notes);
    }
    
    public function getNote(string $id){
        $note = Note::with('categories')->find($id);
        if (!$note) {
            return response()->json(['message' => 'Nota no encontrada'], 404);
        }
        return response()->json($note);
    }

    // Crea una nueva nota
    public function store(Request $request)
    {
        // Valida los datos
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        // Crea la nota
        $note = Note::create($validatedData);

        return response()->json($note, 201);
    }

    public function deleteNote(string $id){
        $note = Note::find( $id );
        if (!$note) {
            return response()->json(['message'=> ''],404);
        }
        $note->delete();
        return response()->json($note,204);
    }
    public function updateNote(Request $request, string $id)
{
    // 1. Validation: Use request validation to check the data.
    $validatedData = $request->validate([
        'title' => 'sometimes|string|max:255',
        'content' => 'sometimes|string',
    ]);

    // 2. Find the note: Check if the note exists.
    $note = Note::find($id);

    // 3. Handle 'Not Found': If the note doesn't exist, return a 404 error.
    if (!$note) {
        return response()->json(['message' => 'Note not found'], 404);
    }

    // 4. Update the note: Update the note with the validated data.
    $note->update($validatedData);

    // 5. Return a response: Return the updated note with a 200 OK status.
    return response()->json($note, 200);
}

   public function addCategory(Request $request, $id)
    {

        $note = Note::find($id);
        if($note==null) {
            return response()->json(['message'=> 'The note doesnt exists'],404);
        }

        $request->validate([
            'category_id' => 'required|exists:categories,id',
        ]);
        $category = Category::find($request->category_id);
        if(!$category) {
            return response()->json(['message'=> 'That category doesnt exists'],404);
        }
        


        $note->categories()->attach($request->category_id);

        // Devolver una respuesta exitosa
        return response()->json([
            'message' => 'Category sucessfully attached to the Note',
        ], 200);
        
    }
    public function removeCategory(Note $note, Category $category)
    {
        $note->categories()->detach($category->id);

        return response()->json([
            'message' => 'Categoría removida exitosamente de la nota.',
        ], 200);
    }

}
