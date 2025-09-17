<?php

namespace App\Http\Controllers;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(){
        $categories = Category::all();

        return response()->json($categories);
    }

    public function store(Request $request){

        $validatedData = $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $category = Category::create($validatedData);
        return response()->json($category);
    }

    public function delete($id){
        $category = Category::find($id);
        if($category==null){
            return response()->json(['message'=> 'category not found'],404);
        }
        
        $category->delete();
        return response()->json(['message'=> 'category succesfully deleted'],200);
    }
}
