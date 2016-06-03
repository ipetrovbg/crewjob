<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\User;
use App\Http\Requests;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Intervention\Image\ImageManagerStatic as Image;
use DB;

class FileController extends Controller
{
    public function upload_profile(Request $request)
    {
        $time = time();
        if ($request->session()->get('ID')) {
            $fileToDelete = DB::table('users')
                ->where('id', $request->session()->get('ID'))
                ->get();
            File::delete('uploads/profiles/' . $fileToDelete[0]->avatar);
            File::delete('uploads/profiles/thumbs/' . $fileToDelete[0]->avatar);


            $realfiles = Input::file('file');
            $ext = $realfiles->getClientOriginalExtension();
            $allowedTypes = ['jpg', 'JPG', 'JPEG', 'jpeg', 'png', 'gif'];
            if (in_array($ext, $allowedTypes)) {
                $resp = Storage::disk('local_avatar')->put($time . '-user-' . $request->session()->get('ID') . '.' . $ext, File::get($realfiles));

                if ($resp) {
                    $profileThumb = Image::make('uploads/profiles/' .  $time . '-user-' . $request->session()->get('ID') . '.' . $ext);

                    $orgWidth = $profileThumb->width();
                    $orgHeight = $profileThumb->height();

                    if($orgWidth >= $orgHeight){
                        $profileThumb->resize(null, 100, function ($constraint) {
                            $constraint->aspectRatio();
                        });

                        $width = ($profileThumb->width()-100)/2;
                        if($width < 0){
                            $width = 0;
                        }
                        $profileThumb->crop(100, 100, round($width, 0), 0)->save('uploads/profiles/thumbs/' . $profileThumb->basename);

                    }else{
                        $profileThumb->resize(100, null, function ($constraint) {
                            $constraint->aspectRatio();
                        });

                        $height = ($profileThumb->height()-100)/2;
                        if($height < 0){
                            $height = 0;
                        }
                        $profileThumb->crop(100, 100, 0, round($height, 0))->save('uploads/profiles/thumbs/' . $profileThumb->basename);
                    }


                    $dbResp = DB::table('users')
                        ->where('id', $request->session()->get('ID'))
                        ->update(['avatar' => $time . '-user-' . $request->session()->get('ID') . '.' . $ext]);
                    if ($dbResp) {
                        return response()->json(array('upload' => $resp, 'avatar' => $time . '-user-' . $request->session()->get('ID') . '.' . $ext), 200);
                    }
                }
            }else{
                return response()->json(array('status' => false, 'auth' => true), 200);
            }

        }else{
            return response()->json(array('status' => false, 'auth' => false), 200);
        }
    }

    public function upload_files(Request $request)
    {
        if ($request->session()->get('ID')) {
            $time =  time();
            $realfiles = Input::file('files');
            $ext = $realfiles->getClientOriginalExtension();
            $resp = Storage::disk('local_files')->put($time . '-user-' . $request->session()->get('ID') . '.' . $ext, File::get($realfiles));
            $allowedTypes = ['jpg', 'JPG', 'JPEG', 'jpeg', 'png', 'gif'];
            if (in_array($ext, $allowedTypes)) {
                $thumb = Image::make('uploads/files/' .  $time . '-user-' . $request->session()->get('ID') . '.' . $ext);
                if($thumb->width() > 1500){
                    $thumb->resize(1500, null, function ($constraint) {
                        $constraint->aspectRatio();
                    })->save('uploads/files/thumbs/' . $thumb->basename);
                }else{
                    $thumb->save('uploads/files/thumbs/' . $thumb->basename);
                }
            }
            if ($resp) {
                $dbResp = DB::table('files')
                    ->insert(['user_id' => $request->session()->get('ID'), 'file_key' => 0, 'file_name' => $time . '-user-' . $request->session()->get('ID') . '.' . $ext,
                        'org_filename' => $realfiles->getClientOriginalName(), 'crop_file' => '', 'file_type' => $ext, 'project_id'=> 0, 'created_at' => date('Y-m-d H:m:s'), 'updated_at' => date('Y-m-d H:m:s')]);
                if ($dbResp) {
                    return response()->json(array('status' => true, 'file' => $time . '-user-' . $request->session()->get('ID') . '.' . $ext, 'auth' => true, 'org' =>$realfiles->getClientOriginalName()), 200);
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
            $time = time();
            $realfiles = Input::file('pfile');
           $explodeFileType = explode('.', $realfiles->getClientOriginalName());
            $ext = $realfiles->getClientOriginalExtension();
            $resp = Storage::disk('local_project_files')->put($time . '-' . preg_replace('/\s+/', '', $explodeFileType[0]) . '-user-' . $request->session()->get('ID') . '.' . $ext, File::get($realfiles));

            if ($resp) {
                $allowedTypes = ['jpg', 'JPG', 'JPEG', 'jpeg', 'png', 'gif'];
                if (in_array($ext, $allowedTypes)) {
                    $thumb = Image::make('uploads/project/' .  $time . '-' . preg_replace('/\s+/', '', $explodeFileType[0]) . '-user-' . $request->session()->get('ID') . '.' . $ext);
                    if($thumb->width() > 1400){
                        $thumb->resize(1400, null, function ($constraint) {
                            $constraint->aspectRatio();
                        })->save('uploads/project/thumbs/' . $thumb->basename);


                        $orgWidth = $thumb->width();
                        $orgHeight = $thumb->height();

                        if($orgWidth >= $orgHeight){
                            $thumb->resize(290, null, function ($constraint) {
                                $constraint->aspectRatio();
                            });

                            $height = round(($thumb->height()-130)/2, 0);
                            if($height < 0){
                                $height = 0;
                            }
                            $thumb->crop(290, 130, 0, $height)->save('uploads/project/thumbs/small/' . $thumb->basename);

                        }else{
                            $thumb->resize(290, null, function ($constraint) {
                                $constraint->aspectRatio();
                            });

                            $height = round(($thumb->height()-130)/2, 0);
                            if($height < 0){
                                $height = 0;
                            }
                            $thumb->crop(290, 130, 0, $height)->save('uploads/project/thumbs/small/' . $thumb->basename);
                        }

                    }else{
                        $thumb->save('uploads/project/thumbs/' . $thumb->basename);

                        $orgWidth = $thumb->width();
                        $orgHeight = $thumb->height();

                        if($orgWidth >= $orgHeight){
                            $thumb->resize(290, null, function ($constraint) {
                                $constraint->aspectRatio();
                            });

                            $height = round(($thumb->height()-130)/2, 0);
                            if($height < 0){
                                $height = 0;
                            }
                            $thumb->crop(290, 130, 0, $height)->save('uploads/project/thumbs/small/' . $thumb->basename);

                        }else{
                            $thumb->resize(290, null, function ($constraint) {
                                $constraint->aspectRatio();
                            });

                            $height = round(($thumb->height()-130)/2, 0);
                            if($height < 0){
                                $height = 0;
                            }
                            $thumb->crop(290, 130, 0, $height)->save('uploads/project/thumbs/small/' . $thumb->basename);
                        }

                    }
                }
                $dbResp = DB::table('files')
                    ->insert(['user_id' => $request->session()->get('ID'), 'file_key' => 0, 'file_name' => $time . '-' .  preg_replace('/\s+/', '', $explodeFileType[0]) . '-user-' . $request->session()->get('ID') . '.' . $ext,
                        'org_filename' => $realfiles->getClientOriginalName(), 'crop_file' => '', 'file_type' => $ext, 'project_id'=> $request->header('projectID'), 'created_at' => date('Y-m-d H:m:s'), 'updated_at' => date('Y-m-d H:m:s')]);
                if ($dbResp) {
                    return response()->json(array('status' => true, 'file' => $time . '-user-' . $request->session()->get('ID') . '.' . $ext, 'auth' => true, 'org' =>$realfiles->getClientOriginalName(), 'pr'=>$request->header('projectID')), 200);
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
