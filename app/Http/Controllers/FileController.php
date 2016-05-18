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
    public function upload_profile(Request $request)
    {
        if ($request->session()->get('ID')) {
            $fileToDelete = DB::table('users')
                ->where('id', $request->session()->get('ID'))
                ->get();
            File::delete('uploads/profiles/' . $fileToDelete[0]->avatar);


            $realfiles = Input::file('file');
            $ext = $realfiles->getClientOriginalExtension();

            $resp = Storage::disk('local_avatar')->put(time() . '-user-' . $request->session()->get('ID') . '.' . $ext, File::get($realfiles));

            if ($resp) {

                $dbResp = DB::table('users')
                    ->where('id', $request->session()->get('ID'))
                    ->update(['avatar' => time() . '-user-' . $request->session()->get('ID') . '.' . $ext]);
                if ($dbResp) {
                    return response()->json(array('upload' => $resp, 'avatar' => time() . '-user-' . $request->session()->get('ID') . '.' . $ext), 200);
                }
            }
        }else{
            return response()->json(array('status' => false, 'auth' => false), 200);
        }
    }

    public function upload_files(Request $request)
    {
        if ($request->session()->get('ID')) {
            $realfiles = Input::file('files');
            $ext = $realfiles->getClientOriginalExtension();
            $resp = Storage::disk('local_files')->put(time() . '-user-' . $request->session()->get('ID') . '.' . $ext, File::get($realfiles));

            if ($resp) {
                $dbResp = DB::table('files')
                    ->insert(['user_id' => $request->session()->get('ID'), 'file_key' => 0, 'file_name' => time() . '-user-' . $request->session()->get('ID') . '.' . $ext,
                        'org_filename' => $realfiles->getClientOriginalName(), 'crop_file' => '', 'file_type' => $ext, 'project_id'=> 0, 'created_at' => date('Y-m-d H:m:s'), 'updated_at' => date('Y-m-d H:m:s')]);
                if ($dbResp) {
                    return response()->json(array('status' => true, 'file' => time() . '-user-' . $request->session()->get('ID') . '.' . $ext, 'auth' => true, 'org' =>$realfiles->getClientOriginalName()), 200);
//                    print_r($realfiles);
                }else{
                    return response()->json(array('status' => false, 'auth' => true), 200);
                }

            } else {
                return response()->json(array('status' => false, 'auth' => true), 200);
            }
        } else {
            return response()->json(array('auth' => false, 'status' => false), 200);
        }

    }

    public function getAllFiles(Request $request)
    {
       if($request->session()->get('ID')){
           $files = DB::table('files')
               ->where('user_id', $request->session()->get('ID'))
               ->where('project_id', 0)
               ->get();
           if($files){
               return response()->json(array('auth' => true, 'status' => true, 'files' => $files), 200);
           }else{
               return response()->json(array('auth' => true, 'status' => false), 200);
           }
       }else{
           return response()->json(array('auth' => false, 'status' => false), 200);
       }
    }

    public function deleteFile(Request $request)
    {
        if($request->session()->get('ID')){
            $fileToDelete = DB::table('files')
                ->where('user_id', $request->session()->get('ID'))
                ->where('file_id', $request['file_id'])
                ->get();
            File::delete('uploads/files/' . $fileToDelete[0]->file_name);

            $delfile = DB::table('files')
                ->where('user_id', $request->session()->get('ID'))
                ->where('file_id', $request['file_id'])
                ->delete();

            if($delfile){
                return response()->json(array('auth' => true, 'status' => true), 200);
            }else{
                return response()->json(array('auth' => true, 'status' => false), 200);
            }
        }else{
            return response()->json(array('auth' => false, 'status' => false), 200);
        }
    }

    public function upload_project_file(Request $request)
    {
        if ($request->session()->get('ID')) {

            $realfiles = Input::file('pfile');
            $ext = $realfiles->getClientOriginalExtension();
            $resp = Storage::disk('local_project_files')->put(time() . '-user-' . $request->session()->get('ID') . '.' . $ext, File::get($realfiles));

            if ($resp) {
                $dbResp = DB::table('files')
                    ->insert(['user_id' => $request->session()->get('ID'), 'file_key' => 0, 'file_name' => time() . '-user-' . $request->session()->get('ID') . '.' . $ext,
                        'org_filename' => $realfiles->getClientOriginalName(), 'crop_file' => '', 'file_type' => $ext, 'project_id'=> $request->header('projectID'), 'created_at' => date('Y-m-d H:m:s'), 'updated_at' => date('Y-m-d H:m:s')]);
                if ($dbResp) {
                    return response()->json(array('status' => true, 'file' => time() . '-user-' . $request->session()->get('ID') . '.' . $ext, 'auth' => true, 'org' =>$realfiles->getClientOriginalName(), 'pr'=>$request->header('projectID')), 200);
//                    print_r($realfiles);
                }else{
                    return response()->json(array('status' => false, 'auth' => true), 200);
                }

            } else {
                return response()->json(array('status' => false, 'auth' => true), 200);
            }
        } else {
            return response()->json(array('auth' => false, 'status' => false), 200);
        }
    }
}
