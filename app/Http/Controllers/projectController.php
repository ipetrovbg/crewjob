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
                return response()->json(array('project' => $project, 'status' => true, 'auth' => true, 'token'=>csrf_token()), 200);
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

            if($request->input('projectID')){
                $categories = $request->input('categories');	/**/
                if(count($categories['category']) > 0){
                    $updateProject = DB::table('projects')
                        ->where('id', $request->input('projectID'))
                        ->update(['name' => $request->input('title'), 'description'=> htmlspecialchars($request->input('description')), 'status' => '1',
                            'latitude' => $request->input('la'), 'longitude' => $request->input('lo'), 'location'=>$request->input('adress'), 'updated_at' => date('Y-m-d H:m:s')]);

                    foreach ($categories['category'] as $category) {
                        $pcat = DB::table('project_category_relation')
                            ->insert(['category_ID' => $category, 'project_ID'=>$request['projectID'], 'updated_at' => date('Y-m-d H:m:s')]);
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
//        print_r($request->input('categories'));
    }

    public function getproject(Request $request)
    {
//        if ($request->session()->get('ID')) {
            $project = DB::table('projects')
//                ->where('user_id', $request->session()->get('ID'))
                ->where('id', $request['pr_ID'])
                ->where('status', '>', '0')
                ->first();



            if($project){
                $files = DB::table('files')
                    ->where('project_id', '=', $project->id)
                    ->get();
                $project->files = $files;

                $images = DB::table('files')
                    ->where('project_id', '=', $project->id)
                    ->where(function ($query) {
                        $query->where('file_type', '=', 'jpg')
                            ->orWhere('file_type', '=', 'png')
                            ->orWhere('file_type', '=', 'gif');
                    })
                    ->get();

                $project->images = $images;
                return response()->json(array('auth' => true, 'status' => true, 'project'=>$project), 200);
            }else{
                return response()->json(array('auth' => true, 'status' => false), 200);
            }
//        }else{
//            return response()->json(array('auth' => false, 'status' => false), 200);
//        }
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

    public function getProjectCat(Request $request)
    {
        $categories = DB::table('project_category_relation')
            ->leftJoin('category', 'project_category_relation.category_ID', '=', 'category.id')
            ->where('project_category_relation.project_ID', $request['project'])
            ->get();
        if($categories){
            return response()->json(array('status' => true, 'categories'=>$categories), 200);
        }else{
            return response()->json(array('status' => false), 200);
        }
    }
    public function getLastProjects(Request $request)
    {
        $lastProjects = DB::table('projects')->where('status', '>', '0')->skip(0)->take(6)->orderBy('id', 'desc')->get();
        for($i = 0; $i < count($lastProjects); $i++){

            $files = DB::table('files')
                ->where('project_id', '=', $lastProjects[$i]->id)
                ->where(function ($query) {
                    $query->where('file_type', '=', 'jpg')
                        ->orWhere('file_type', '=', 'png')
                        ->orWhere('file_type', '=', 'gif');
                })
                ->get();
            $lastProjects[$i]->files = [];
            for($j = 0; $j < count($files); $j++){
                 array_push($lastProjects[$i]->files, $files[$j]);
            }

            $user = DB::table('users')
                ->select('name', 'email', 'id', 'avatar')
                ->where('id', '=', $lastProjects[$i]->user_id)
                ->first();
            $lastProjects[$i]->author = $user;
//            $lastProjects[$i]->categories = [];
            $categories = DB::table('project_category_relation')
                ->select('category.name')
                ->leftJoin('category', 'project_category_relation.category_ID', '=', 'category.id')
                ->where('project_category_relation.project_ID', '=', $lastProjects[$i]->id)
                ->get();
            $lastProjects[$i]->categories = $categories;
        }


        if($lastProjects){            
            return response()->json(array('status' => true, 'last' => $lastProjects), 200);
        }else{
            return response()->json(array('status' => false), 200);
        }
    }

    public function getAllProjects()
    {
        $allProjects = DB::table('projects')->where('status', '>', '0')->take(6)->orderBy('id', 'desc')->get();
        if(count($allProjects) > 0){

            for($i = 0; $i < count($allProjects); $i++){

                $files = DB::table('files')
                    ->where('project_id', '=', $allProjects[$i]->id)
                    ->where(function ($query) {
                        $query->where('file_type', '=', 'jpg')
                            ->orWhere('file_type', '=', 'png')
                            ->orWhere('file_type', '=', 'gif');
                    })
                    ->get();
                $allProjects[$i]->images = [];
                for($j = 0; $j < count($files); $j++){
                    array_push($allProjects[$i]->images, $files[$j]);
                }

                $user = DB::table('users')
                    ->select('name', 'email', 'id', 'avatar')
                    ->where('id', '=', $allProjects[$i]->user_id)
                    ->first();
                $allProjects[$i]->author = $user;
//            $lastProjects[$i]->categories = [];
                $categories = DB::table('project_category_relation')
                    ->select('category.name')
                    ->leftJoin('category', 'project_category_relation.category_ID', '=', 'category.id')
                    ->where('project_category_relation.project_ID', '=', $allProjects[$i]->id)
                    ->get();
                $allProjects[$i]->categories = $categories;
            }

            return response()->json(array('status' => true, 'all_projects' => $allProjects), 200);
        }
    }
    public function getLimitProjects(Request $request)
    {
        $limitedProjects = DB::table('projects')->where('id', '<', $request['lastId'])->where('status', '>', '0')->take(3)->orderBy('id', 'desc')->get();
        if(count($limitedProjects) > 0){
            for($i = 0; $i < count($limitedProjects); $i++){

                $files = DB::table('files')
                    ->where('project_id', '=', $limitedProjects[$i]->id)
                    ->where(function ($query) {
                        $query->where('file_type', '=', 'jpg')
                            ->orWhere('file_type', '=', 'png')
                            ->orWhere('file_type', '=', 'gif');
                    })
                    ->get();
                $limitedProjects[$i]->images = [];
                for($j = 0; $j < count($files); $j++){
                    array_push($limitedProjects[$i]->images, $files[$j]);
                }

                $user = DB::table('users')
                    ->select('name', 'email', 'id', 'avatar')
                    ->where('id', '=', $limitedProjects[$i]->user_id)
                    ->first();
                $limitedProjects[$i]->author = $user;
//            $lastProjects[$i]->categories = [];
                $categories = DB::table('project_category_relation')
                    ->select('category.name')
                    ->leftJoin('category', 'project_category_relation.category_ID', '=', 'category.id')
                    ->where('project_category_relation.project_ID', '=', $limitedProjects[$i]->id)
                    ->get();
                $limitedProjects[$i]->categories = $categories;
            }
            return response()->json(array('status' => true, 'limited_projects' => $limitedProjects), 200);
        }
    }
}
