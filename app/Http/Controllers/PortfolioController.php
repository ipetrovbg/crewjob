<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use DB;

class PortfolioController extends Controller
{
    public function updateUserCategory(Request $request){
    	$count = 0;
    	$categories = json_decode($request['categories']);	/**/

        /*delete all user categories*/
        $result = DB::table('users_categories')
                                ->where('user_id', '=', $request->session()->get('ID'))
                                ->delete();
        /*/delete all user categories*/
        if(count($categories) > 0){
            foreach ($categories->category as $category) {
            
                $result = DB::table('users_categories')->insert([
                        'user_id' => $request->session()->get('ID'), 'category_id' => $category, 'created_at' => date('Y-m-d H:m:s'), 'updated_at' => date('Y-m-d H:m:s')
                    ]);
                    if($result){
                        $count++;
                    }       
            }
        }
    	

    	if($count > 0){    		
    	 	return response()->json(['status' => true]);
    	}else{
    		return response()->json(['status' => false]);
    	}
    }

    public function insertLink(Request $request){
        $result = DB::table('links')->insert([
            'user_id' => $request->session()->get('ID'), 'link_note' => $request['link_note'], 'link' => $request['link'],
            'created_at' => date('Y-m-d H:m:s'), 'updated_at' => date('Y-m-d H:m:s')
        ]);
        if($result){
            return response()->json(['status' => true]);
        }else{
            return response()->json(['status' => false]);
        }
    }
    public function getLinks(Request $request){
        if($request->session()->get('ID')){
            $links = DB::table('links')
                    ->where('user_id', $request->session()->get('ID'))->get();
            return response()->json(['links' => $links, 'auth' => true]);
        }else{
            return response()->json(['auth' => false]);
        }
        
    }

    public function deleteLink(Request $request){
        if($request->session()->get('ID')){
            $result = DB::table('links')
                                ->where('user_id', '=', $request->session()->get('ID'))
                                ->where('link_id', '=', $request['link_id'])
                                ->delete();
            if($result){
                return response()->json(['status' => true, 'auth' => true]);
            }else{
                return response()->json(['status' => false, 'auth' => true]);
            }
            
        }else{
            return response()->json(['auth' => false]);
        }
        
    }
}
