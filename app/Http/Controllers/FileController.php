<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\User;
use App\Http\Requests;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use DB;

class FileController extends Controller
{
   	public function upload_profile(Request $request){
   		$realfiles = Input::file('file');
    	$ext = $realfiles->getClientOriginalExtension();

    	$resp = Storage::disk('local_avatar')->put(time() . '-user-' . $request->session()->get('ID') . '.' .$ext, File::get($realfiles));

    	if($resp){    	

    		$dbResp = DB::table('users')
            ->where('id', $request->session()->get('ID'))
            ->update(['avatar' => time() . '-user-' . $request->session()->get('ID') . '.' .$ext]);
            if($dbResp){
            	return response()->json(array('upload'=> $resp, 'avatar' => time() . '-user-' . $request->session()->get('ID') . '.' .$ext), 200);
            }

    	 	
    	}
   	}
}
