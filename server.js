/*
 * @Author: Vinod Selvin
 */
var Server = {
    counter: 0,
    tasks: {}, //all task which running and not-running will be found here
    activeServers: [0],  //If active then array element will have job Id
    job: {
        add(job, callback) {
            server.tasks[job.id] = job; //add job to tasks
            callback(); //callback after add job to tasks
        },
        delete(jobId, callback) {

            var currentTask = server.tasks[jobId];
            
            if (currentTask && currentTask.props.active == false) {
                server.tasks[jobId] = null; //delete task if present
            
                setTimeout(function(){
                    server.render.delete({jobId}); //remove element from dom
                }, 300);
                
                callback();
            }
        }
    },
    set addServer(jobId) {
        this.activeServers.push(jobId); //add new job to server
        server.assign(); //assign job
    },
    get idleServer() {
        return server.activeServers.indexOf(0); //get idle server id
    },
    assign: function () { //check and assign task to idle server

        var tasks = server.tasks;

        for (var key of Object.keys(tasks)) { //all tasks

            if (tasks.hasOwnProperty(key) && tasks[key] != null && tasks[key].props.active == false) { //only pending tasks

                var task = tasks[key];

                //get server id which is free
                var serverId = this.idleServer;

                //if free then assign job to that server
                if (serverId !== -1) {
                    server.activeServers[serverId] = task.id; //assign task to the server
                    server.tasks[key].props.active = true; //mark as task is running
                    server.run(serverId, task); //run the server

                }

            }
        }
    },
    run: function (serverId, job) { //Run the task assigned 

        var that = this;

        var currentTime = 0;
        
        var myVar = setInterval(executeJob, 1000); //every one second call update view

        function executeJob() {

            var percentage = ((currentTime / job.props.executionTime) * 100).toFixed(2);

            that.render.update({ //update dom regarding percentage and values as options loading
                jobId: job.id,
                percentage,
                serverId,
            });

            if (job.props.executionTime == currentTime) { //Delete Job from server if execution time finished
                destroyJob();
            }

            currentTime++; //executed time in sec
        }

        function destroyJob(j) { //Delete Job from server

            clearInterval(myVar); //stop the interval

            server.tasks[job.id].props.active = false; //mark as task finished

            server.job.delete(job.id, function () {

                server.activeServers[serverId] = 0; //free server
                server.assign(); //Start again with new task
            })
        }
    },
    delete: function () { //delete idle server
        var serverId = this.idleServer;

        if (serverId !== -1) {
            server.activeServers.splice(serverId, 1);
        }
    },
    render: { //html releated rending elements / updating elements
        update: function(options){ //update loader/ JOB values
            document.querySelector(".job[data-id='" + options.jobId + "'] > .progress-container > .progress").style.width = options.percentage + "%";
            document.querySelector(".job[data-id='" + options.jobId + "'] > .progress-container > .progress > .label").innerHTML = "Server: " + (options.serverId + 1) + ", Job Id: " + options.jobId + ", " + options.percentage + "%";
        },
        delete: function(options){ //remove loader/ JOB
            document.querySelector(".job[data-id='" + options.jobId + "']").remove();
        }
    }
};