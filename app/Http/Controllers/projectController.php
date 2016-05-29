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
                ['user_id' => $request->session()->get('ID'), 'created_at' => date('Y-m-d H:m:s'), 'updated_at' => date('Y-m-d H:m:s')]
            );
            if ($project) {
                return response()->json(array('project' => $project, 'status' => true, 'auth' => true, 'token' => csrf_token()), 200);
            } else {
                return response()->json(array('auth' => true, 'status' => false), 200);
            }
        } else {
            return response()->json(array('auth' => false, 'status' => false), 200);
        }
    }

    public function createProject(Request $request)
    {
        if ($request->session()->get('ID')) {

            if ($request->input('projectID')) {
                $categories = $request->input('categories');    /**/
                if (count($categories['category']) > 0) {
                    $updateProject = DB::table('projects')
                        ->where('id', $request->input('projectID'))
                        ->update(['name' => $request->input('title'), 'description' => htmlspecialchars(addslashes($request->input('description'))), 'status' => '1',
                            'latitude' => $request->input('la'), 'longitude' => $request->input('lo'), 'location' => $request->input('adress'), 'updated_at' => date('Y-m-d H:m:s')]);

                    foreach ($categories['category'] as $category) {
                        $pcat = DB::table('project_category_relation')
                            ->insert(['category_ID' => $category, 'project_ID' => $request['projectID'], 'updated_at' => date('Y-m-d H:m:s')]);
                    }

                    if ($updateProject) {
                        return response()->json(array('auth' => true, 'status' => true), 200);
                    }
                } else {
                    return response()->json(array('auth' => true, 'status' => false), 200);
                }
            } else {
                return response()->json(array('auth' => true, 'status' => false), 200);
            }
        } else {
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
            ->where('status', '<=', 1)
            ->first();



        if ($project) {

            $categories = DB::table('project_category_relation')
                ->leftJoin('category', 'project_category_relation.category_ID', '=', 'category.id')
                ->where('project_category_relation.project_ID', $project->id)
                ->get();

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
            $project->categories = $categories;
            $project->images = $images;
            return response()->json(array('auth' => true, 'status' => true, 'project' => $project), 200);

        } else {
            return response()->json(array('auth' => true, 'status' => false), 200);
        }
//        }else{
//            return response()->json(array('auth' => false, 'status' => false), 200);
//        }
    }

    public function deleteProject(Request $request)
    {
        if ($request->session()->get('ID')) {

            $prCat = DB::table('project_category_relation')
                ->where('project_ID', '=', $request['project_ID'])
                ->delete();

            $delProjectFile = DB::table('files')
                ->where('project_id', '=', $request['project_ID'])
                ->get();
            if(count($delProjectFile) > 0){
                foreach ($delProjectFile as $item) {
                    File::delete('uploads/project/' . $item->file_name);
                }
                DB::table('files')
                    ->where('project_id', '=', $request['project_ID'])
                    ->delete();
            }

            $deleteApplications = DB::table('project_application')
                ->where('project_id', '=', $request['project_ID'])
                ->delete();


            $result = DB::table('projects')
                ->where('user_id', '=', $request->session()->get('ID'))
                ->where('id', '=', $request['project_ID'])
                ->delete();
            if ($result) {
                return response()->json(array('auth' => true, 'status' => true), 200);
            } else {
                return response()->json(array('auth' => true, 'status' => false), 200);
            }
        } else {
            return response()->json(array('auth' => false, 'status' => false), 200);
        }
    }

    public function getProjectCat(Request $request)
    {
        $categories = DB::table('project_category_relation')
            ->leftJoin('category', 'project_category_relation.category_ID', '=', 'category.id')
            ->where('project_category_relation.project_ID', $request['project'])
            ->get();
        if ($categories) {
            return response()->json(array('status' => true, 'categories' => $categories), 200);
        } else {
            return response()->json(array('status' => false), 200);
        }
    }

    public function getLastProjects(Request $request)
    {
        $lastProjects = DB::table('projects')
//            ->leftJoin('project_application', 'projects.id', '=', 'project_application.project_id')
//            ->where('project_application.status', '=', 0)
            ->where('projects.status', '=', 1)
            ->skip(0)->take(6)->orderBy('projects.id', 'desc')->get();
        for ($i = 0; $i < count($lastProjects); $i++) {

            $files = DB::table('files')
                ->where('project_id', '=', $lastProjects[$i]->id)
                ->where(function ($query) {
                    $query->where('file_type', '=', 'jpg')
                        ->orWhere('file_type', '=', 'png')
                        ->orWhere('file_type', '=', 'gif');
                })
                ->first();
            $lastProjects[$i]->files = [];
//            for ($j = 0; $j < count($files); $j++) {
//                array_push($lastProjects[$i]->files, $files[$j]);
//            }
            array_push($lastProjects[$i]->files, $files);
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


        if ($lastProjects) {
            return response()->json(array('status' => true, 'last' => $lastProjects), 200);
        } else {
            return response()->json(array('status' => false), 200);
        }
    }

    public function getAllProjects()
    {
        $allProjects = DB::table('projects')
//            ->leftJoin('project_application', 'projects.id', '=', 'project_application.project_id')
//            ->where('project_application.status', '=', 0)
            ->where('projects.status', '=', 1)
            ->take(6)->orderBy('projects.id', 'desc')->get();
        if (count($allProjects) > 0) {

            for ($i = 0; $i < count($allProjects); $i++) {

                $files = DB::table('files')
                    ->where('project_id', '=', $allProjects[$i]->id)
                    ->where(function ($query) {
                        $query->where('file_type', '=', 'jpg')
                            ->orWhere('file_type', '=', 'png')
                            ->orWhere('file_type', '=', 'gif');
                    })
                    ->first();
                $allProjects[$i]->images = [];
//                for ($j = 0; $j < count($files); $j++) {
//                    array_push($allProjects[$i]->images, $files[$j]);
//                }
                array_push($allProjects[$i]->images, $files);
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
        $limitedProjects = DB::table('projects')
            ->leftJoin('project_category_relation', 'projects.id', '=', 'project_category_relation.project_ID')
            ->where('id', '<', $request['lastId'])
            ->where('projects.status', '=', 1)
            ->where('project_category_relation.category_ID', '=', $request['catId'])
            ->take(3)->orderBy('projects.id', 'desc')->get();
        if (count($limitedProjects) > 0) {
            for ($i = 0; $i < count($limitedProjects); $i++) {

                $files = DB::table('files')
                    ->where('project_id', '=', $limitedProjects[$i]->id)
                    ->where(function ($query) {
                        $query->where('file_type', '=', 'jpg')
                            ->orWhere('file_type', '=', 'png')
                            ->orWhere('file_type', '=', 'gif');
                    })
                    ->first();
                $limitedProjects[$i]->images = [];

                array_push($limitedProjects[$i]->images, $files);

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

    public function applying(Request $request)
    {
        if ($request->session()->get('ID')) {
            $projectStatus = DB::table('projects')
                ->where('id', '=', $request['id'])
                ->first();

            if($projectStatus->status < 2){
                $isApply = DB::table('project_application')
                    ->where('project_application.project_id', '=', $request['id'])
                    ->where('project_application.user_id', '=', $request->session()->get('ID'))
                    ->count();
                if ($isApply == 0) {
                    $apply = DB::table('project_application')
                        ->insert([
                            'project_id' => $request['id'],
                            'user_id' => $request->session()->get('ID'),
                            'created_at' => date('Y-m-d H:m:s'),
                            'updated_at' => date('Y-m-d H:m:s')
                        ]);
                    if ($apply) {
                        return response()->json(array('auth' => true, 'status' => true, 'isApplying' => false, 'project_status' => true), 200);
                    } else {
                        return response()->json(array('auth' => true, 'status' => false, 'isApplying' => false, 'project_status' => true), 200);
                    }
                } else {
                    return response()->json(array('auth' => true, 'status' => false, 'isApplying' => true, 'project_status' => true), 200);
                }
            }else{
                return response()->json(array('auth' => true, 'status' => true, 'project_status' => false), 200);
            }



        } else {
            return response()->json(array('auth' => false, 'status' => false), 200);
        }
    }

    public function getMyAll(Request $request)
    {
        if ($request->session()->get('ID')) {



            $myAll = DB::table('projects')
                ->where('user_id', '=', $request->session()->get('ID'))
                ->where('status', '<=', 2)
                ->get();
            $c = 0;
            foreach ($myAll as $item) {
                $pApply = DB::table('project_application')
                    ->where('project_id', '=', $item->id)
                    ->first();

//                $myAll[$c]->apply = [];
//
//                array_push($myAll[$c]->apply, $pApply);
                $myAll[$c]->apply = $pApply;

                $c++;
            }

            if ($myAll) {
                return response()->json(array('auth' => true, 'status' => true, 'myProjects' => $myAll), 200);
            } else {
                return response()->json(array('auth' => true, 'status' => false), 200);
            }
        } else {
            return response()->json(array('auth' => false, 'status' => false), 200);
        }
    }

    public function edit(Request $request)
    {
        if ($request->session()->get('ID')) {
            $deleteProjectCategories = DB::table('project_category_relation')
                ->where('project_ID', '=', $request->input('id'))
                ->delete();
            foreach ($request->input('categories') as $item) {
                DB::table('project_category_relation')
                    ->insert(['category_ID'=>$item, 'project_ID' => $request->input('id'), 'created_at' => date('Y-m-d H:m:s'), 'updated_at' => date('Y-m-d H:m:s')]);
            }
//            $data = [$request->input('id'), $request->input('title'), $request->input('description'), $request->input('categories'), $request->input('address'),
//                $request->input('la'), $request->input('lo')];
            $updateProject = DB::table('projects')
                ->where('id', '=', $request->input('id'))
                ->where('user_id', '=', $request->session()->get('ID'))
                ->update(['name' => $request->input('title'), 'description'=>$request->input('description'),
                'updated_at' => date('Y-m-d H:m:s'), 'latitude'=>$request->input('la'),
                'longitude' => $request->input('lo'), 'location'=>$request->input('address'),
                'status'=> $request->input('status')]);
            if($updateProject){
                return response()->json(array('auth' => true, 'status' => true), 200);
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
                ->where('file_id', $request['id'])
                ->first();
            $realDeleting = File::delete('uploads/project/' . $fileToDelete->file_name);
            if($realDeleting){
                $delete = DB::table('files')
                    ->where('file_id', '=', $request['id'])
                    ->where('user_id', '=', $request->session()->get('ID'))
                    ->delete();
                if($delete){
                    return response()->json(array('auth' => true, 'status' => true), 200);
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

    public function getApply(Request $request)
    {
        if($request->session()->get('ID')){
            $projectApply = DB::table('project_application')
                ->select(DB::raw('project_application.status as app_status, project_application.rating as rating, project_application.created_at as date, users.id as uid, users.name as uname, projects.id as pid, projects.name as pname, projects.status as status, users.email as email, users.avatar as avatar'))
                ->leftJoin('projects', 'project_application.project_id', '=', 'projects.id')
                ->leftJoin('users', 'project_application.user_id', '=', 'users.id')
                ->where('project_application.project_id', '=', $request['id'])
                ->groupBy('users.id')
                ->get();
            return response()->json(array('auth' => true, 'status' => true, 'apply'=>$projectApply), 200);

        }else{
            return response()->json(array('auth' => false, 'status' => false), 200);
        }
    }

    public function closeStaged(Request $request)
    {
        if($request->session()->get('ID')){
            $cStaged = DB::table('project_application')
                ->where('project_id', '=', $request['id'])
                ->update(['status'=> 1]);
            $updateprojectStatus = DB::table('projects')
                ->where('id', '=', $request['id'])
                ->update(['status' => 2]);
            if($cStaged){


                return response()->json(array('auth' => true, 'status' => true), 200);
            }else{
                return response()->json(array('auth' => true, 'status' => false), 200);
            }
        }else{
            return response()->json(array('auth' => false, 'status' => false), 200);
        }
    }

    public function makeFinal(Request $request)
    {
        if($request->session()->get('ID')){

            $checkFinal = DB::table('project_application')
                ->where('project_id', '=', $request['id'])
                ->where('rating', '=', null)
                ->count();
            if($checkFinal < 1){
                DB::table('project_application')
                    ->where('project_id', '=', $request['id'])
                    ->update(['status' => 2, 'updated_at' => date('Y-m-d H:m:s')]);
                return response()->json(array('auth' => true, 'status' => true, 'final'=> true), 200);
            }else{
                return response()->json(array('auth' => true, 'status' => true, 'final'=> false), 200);
            }



        }else{
            return response()->json(array('auth' => false, 'status' => false), 200);
        }
    }
}
