<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\User;
use App\Http\Requests;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use DB;

class projectController extends Controller
{
    public function createEmptyProject(Request $request)
    {
        if ($request->session()->get('ID')) {
            $project = DB::table('projects')->insertGetId(
                ['user_id'=> $request->session()->get('ID'), 'created_at' => date('Y-m-d H:m:s'), 'updated_at' => date('Y-m-d H:m:s')]
            );
            if($project){
                return response()->json(array('project' => $project, 'status' => true, 'auth' => true), 200);
            }else{
                return response()->json(array('auth' => true, 'status' => false), 200);
            }
        }else{
            return response()->json(array('auth' => false, 'status' => false), 200);
        }
    }

    public function createProject(Request $request)
    {
        if ($request->session()->get('ID')) {
            if($request['projectID']){
                $categories = json_decode($request['categories']);	/**/
                if(count($categories) > 0){
                    $updateProject = DB::table('projects')
                        ->where('id', $request['projectID'])
                        ->update(['name' => $request['title'], 'description'=> $request['description'], 'created_at' => date('Y-m-d H:m:s'), 'updated_at' => date('Y-m-d H:m:s')]);

                    foreach ($categories->category as $category) {
                        $pcat = DB::table('project_category_relation')
                            ->insert(['category_ID' => $category, 'project_ID'=>$request['projectID'], 'created_at' => date('Y-m-d H:m:s'), 'updated_at' => date('Y-m-d H:m:s')]);
                    }

                    if($updateProject){
                        return response()->json(array('auth' => true, 'status' => true), 200);
                    }
                }else{
                    return response()->json(array('auth' => true, 'status' => false), 200);
                }
            }else{
                return response()->json(array('auth' => true, 'status' => false), 200);
            }
        }else{
            return response()->json(array('auth' => false, 'status' => false), 200);
        }
    }

    public function getproject(Request $request)
    {
        if ($request->session()->get('ID')) {
            $project = DB::table('projects')
                ->where('user_id', $request->session()->get('ID'))
                ->where('id', $request['pr_ID'])
                ->first();
            if($project){
                return response()->json(array('auth' => true, 'status' => true, 'project'=>$project), 200);
            }else{
                return response()->json(array('auth' => true, 'status' => false), 200);
            }
        }else{
            return response()->json(array('auth' => false, 'status' => false), 200);
        }
    }

    public function deleteProject(Request $request)
    {
        if($request->session()->get('ID')) {
            $result = DB::table('projects')
                ->where('user_id', '=', $request->session()->get('ID'))
                ->where('id', '=', $request['project_ID'])
                ->delete();
            if($result){
                return response()->json(array('auth' => true, 'status' => true), 200);
            }else{
                return response()->json(array('auth' => true, 'status' => false), 200);
            }
        }else{
            return response()->json(array('auth' => false, 'status' => false), 200);
        }
    }
}
