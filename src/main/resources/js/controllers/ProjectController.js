angular.module('WorkView').controller('projectController', ['$rootScope', '$scope', '$date', '$utilities', 'ProjectsFactory', function($rootScope, $scope, $date, $utilities, projectsFactory) {
    // Returns the number of completed stories for the project
    $scope.getCompletedStories = function(project) {
        return $utilities.storyCount(project, true);
    };

    // Return the difference between the current time and the given time,
    // as a list of a number and a string
    // returns a shorter string if short is true
    $scope.millisecondToString = function(milli, shorten) {
        currentTime = $date.now();
        lastUpdated = currentTime - milli;
        seconds = Math.round(lastUpdated / 1000);
        if (seconds < 60) {
            return shorten ? [seconds, "s"] : $scope.pluralize(seconds, "second");
        }
        minutes = Math.round(seconds / 60);
        if (minutes < 60) {
            return shorten ? [minutes, "m"] : $scope.pluralize(minutes, "minute");
        }
        hours = Math.round(minutes / 60);
        if (hours < 24) {
            return shorten ? [hours, "h"] : $scope.pluralize(hours, "hour");
        }
        days = Math.round(hours / 24);
        return shorten ? [days, "d"] : $scope.pluralize(days, "day");
    };

    // appends an "s" to the unit if the number is greater than one
    $scope.pluralize = function(num, unit) {
        if (num === 1) {
            return [num, unit];
        }
        return [num, unit + "s"];
    };

    // The max number of contributors to display
    var maxContributors = 16;

    // returns all contributors for this project in order of time worked on project
    $scope.getContributors = function(project) {
        var contributors = $utilities.getContributors(project);
        // sort contributors
        contributors.sort(function(a, b){
        	return b.timestamp - a.timestamp;
        });

        // set project's contributor count
        project.contributorCount = contributors.length;

        // slice off any more than max
        if (contributors.length > maxContributors) {
            return contributors.slice(0, maxContributors - 1);
        }

        return contributors;
    };

    // Return how many extra contributors there are for the project after
    // the max contributor count
    $scope.extraContributorCount = function(project) {
        if (project.contributorCount === undefined) {
            return 0;
        }
        return project.contributorCount - maxContributors + 1;
    };

    $scope.clickedEpic = null;

    $scope.toggleEpic = function(e, epic) {
        e.stopPropagation();
        if($scope.isClicked(epic)) {
            $scope.clickedEpic = null;
            projectsFactory.setRefresh(true);
        }
        else {
            $scope.clickedEpic = epic;
            projectsFactory.setRefresh(false);
        }

        $rootScope.$emit('hideEpics', epic);
    };

    $rootScope.$on('hideEpics', function(event, epic) {
        if(epic === null || epic !== $scope.clickedEpic) {
            $scope.clickedEpic = null;
        }
    });

    $scope.isClicked = function(epic) {
        return $scope.clickedEpic ? $scope.clickedEpic.id === epic.id : false;
    };

    // Returns a list of post it positions to use for the background of the
    // given name.
    $scope.getPostItOffsets = function(epicName) {
        var list = [];
        for (var i = 0; i < epicName.length / 6; i++) {
            list[i] = i * 22;
        }
        return list;
    };

    // returns a shortened version of the given sentence
    $scope.shorten = function(name) {
        return name.length > 32 ? name.substring(0, 32) + "..." : name;
    };

    //returns true if this project is showing epic info
    $scope.showEpicInfo = function() {
        return $scope.clickedEpic !== null;
    };

    $scope.getStories = function(completed) {
        if($scope.showEpicInfo()) {
            var result = [];
            angular.forEach($scope.clickedEpic.children, function(story) {
                if(completed === story.completed) {
                    result.push(story);
                }
            });
            return result;
        }
        return null;
    };
}]);
