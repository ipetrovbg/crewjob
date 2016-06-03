(function(){    var projectServices = function ($http) {        var createEmptyProject = function(){            return $http({                url: 'http://localhost:8000/create-empty-project',                method: 'POST'            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        var createProject = function(categories, title, description, projectID, la, lo, adress, token){            //var data = {            //            //};            return $http({                method: 'POST',                url: 'http://localhost:8000/create-project',                processData: false,                headers: {'Content-Type': 'application/json'},                data: {                    categories: categories,                    title: title,                    description: description,                    projectID: projectID,                    la: la,                    lo: lo,                    adress: adress                }            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        var getProject = function(pr_ID){            return $http({                url: 'http://localhost:8000/get-project',                method: 'POST',                params: {                    pr_ID:pr_ID                }            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        var deleteProject = function(project_ID){            return $http({                url: 'http://localhost:8000/delete-project',                method: 'POST',                params: {                    project_ID:project_ID                }            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        var getProjectCategories = function(project){            return $http({                url: 'http://localhost:8000/get-project-cat',                method: 'POST',                params: {                    project:project                }            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        var getLast = function(){            return $http({                url: 'http://localhost:8000/get-last-projects',                method: 'POST'            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        var getAll = function(id){            return $http({                url: 'http://localhost:8000/get-all-projects',                method: 'POST'            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        var getLimitProjects = function(lastId, catId){            return $http({                url: 'http://localhost:8000/get-limit-projects',                method: 'POST',                params: {                    lastId: lastId,                    catId: catId                }            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        var applying = function(id){            return $http({                url: 'http://localhost:8000/applying-for-project',                method: 'POST',                params: {                    id: id                }            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        var getAllMyProjects = function(){            return $http({                url: 'http://localhost:8000/get-all-my-projects',                method: 'POST'            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        var editProject = function(id, title, description, categories, address, la, lo, status){            return $http({                url: 'http://localhost:8000/edit-project',                method: 'POST',                processData: false,                headers: {'Content-Type': 'application/json'},                data: {                    id: id,                    title:title,                    description:description,                    categories:categories,                    address:address,                    la:la,                    lo:lo,                    status:status                }            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        var deleteprojectFile = function (id) {            return $http({                url: 'http://localhost:8000/delete-project-file',                method: 'POST',                params:{                    id:id                }            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        var getProjectApply = function(id){            return $http({                url: 'http://localhost:8000/project-apply',                method: 'POST',                params:{                    id:id                }            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        var stageClose = function(id){            return $http({                url: 'http://localhost:8000/project-staged-close',                method: 'POST',                params:{                    id:id                }            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        var final = function(id){            return $http({                url: 'http://localhost:8000/project-final',                method: 'POST',                params:{                    id:id                }            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        var getByCategory = function(catID){            return $http({                url: 'http://localhost:8000/get-project-by-cat',                method: 'POST',                params:{                    catID:catID                }            }).success(function(response){                return response.data;            }).error(function(promise){                return promise;            });        };        return{            createEmptyProject: createEmptyProject,            createProject: createProject,            getProject: getProject,            deleteProject: deleteProject,            getProjectCategories: getProjectCategories,            getLast: getLast,            getAll: getAll,            getAllMyProjects: getAllMyProjects,            getLimitProjects: getLimitProjects,            applying: applying,            editProject: editProject,            deleteprojectFile: deleteprojectFile,            getProjectApply: getProjectApply,            stageClose: stageClose,            final: final,            getByCategory: getByCategory        };    };    var module = angular.module("crewjob");    module.factory("projectServices", projectServices);}());