/*
 * @Author: Vinod Selvin
 */
var server = Server;

/*
 * @Desc: JOB TEMPLATE
 */
var Job = function (props) {

    this.props = props;
    this.id = props.id;

    var template = document.createElement("div");

    var html = `
        <div class="job" data-id="${this.id}">
            <div class="progress-container">
                <div class="progress" value="${props.percentageCompleted}" max="100"> <div class="label">${props.percentageCompleted == 0 ? "waiting..." : props.percentageCompleted}</div> </div>
            </div>
            <span class="delete-icon flex-1" data-id="${this.id}" onClick="deleteTask(${this.id})"><i class="fa fa-trash"></i></span>
        </div>
    `;

    template.innerHTML = html;

    this.html = template;
}

/*
 * @DESC: Add New Server to the server pool
 */
function addServer() {
    server.addServer = 0; //id "0" means no jobId assigned
}

/*
 * @DESC: Add New Tasks to the tasks pool
 */
function addNewTasks() {

    var $input = document.querySelector("#task");

    number = $input.value;

    $input.value = 0;

    var task = {
        executionTime: 20,
        percentageCompleted: 0,
        id: server.counter,
        active: false,
    };

    if (number) {
        for (var i = 0; i <= number - 1; i++) {

            server.counter += 1;

            task.id = server.counter;

            var job = new Job({ ...task });

            server.job.add(job, function () {
                document.querySelector("#job-list").appendChild(job.html);
            });
        }
        server.assign();
    }
}
/*
 * @DESC: Delete task from Task pool if idle or not running
 */
function deleteTask(taskId) {
    server.job.delete(taskId, function () { });
}
/*
 * @DESC: Remove server from server pool if idle or not running
 */
function removeServer() {
    server.delete();
}

function serverCount(){
    setInterval(function(){
        document.querySelector(".total-servers").innerHTML = server.activeServers.length;
    }, 200);        
}

serverCount();