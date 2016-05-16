<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use DB;

class CategoryController extends Controller
{
    public function getAll(){

    	$categories = DB::table('category')->get();
    	return response()->json(['categories' => $categories]);
    }
}
