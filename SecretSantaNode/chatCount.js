var firebase = require('./firebase_config').firebase;
var _ = require("underscore");
var reports = [];
var msgCount =0; var pokeCount = 0; var giftCount =0;
function chatCount() {
    
        var dbRefForChats = firebase.database().ref('/rooms/').once('value').then(function(snapshot) {
            getReportForChats(snapshot);
            
            console.log(msgCount);
            console.log(pokeCount);
            // var sendEmail = require("./send_email").sendEmail;
            // sendEmail(null, null, null, null, 'reports', reports);
        });
        var dbRefForTasks = firebase.database().ref('/tasks/').once('value').then(function(snapshot) {
            getReportForTasks(snapshot);
            var tasksCount = reports.tasks.length;
            var completedCount = 0;
            console.log(reports);     
            for(var i =0 ; i< reports.tasks.length; i++) {
                tasksCount = tasksCount + reports.tasks[i].santaTaskCount - 1;
                completedCount = completedCount + reports.tasks[i].childTaskCompletedCount;
            }       
            console.log(tasksCount);
            console.log(completedCount);
        });
          
};
function getReportForChats(snapshot) {
    var chatRate;
    reports['chat']=[];
    for(var room in snapshot.val())
    {
        var chats = snapshot.val()[room];
        if((room).indexOf("_")!=-1) {
            // var chatObj =
            for(var obj in snapshot.val()[room]) 
            {
                if(snapshot.val()[room].hasOwnProperty(obj))
                {
                 
                    console.log(snapshot.val()[room][obj].text+"".indexOf("poke"));
                    if((snapshot.val()[room][obj].text+"").indexOf("poke") != -1)
                    {
                        pokeCount++;
                    }
                    else if((snapshot.val()[room][obj].text+"").indexOf("gift") != -1)
                    {
                        giftCount++;
                    }
                    else{
                        msgCount++;
                    }
                }
            }
            
        }
    }
};


function getReportForTasks(snapshot) {
    reports['tasks']=[];        
    for(var obj in snapshot.val())
    {
        if(obj != 'room')
        {
            // console.log(count(snapshot.val()[obj]));
            var santaTaskCount = countSantaTasks(snapshot.val()[obj].santa);
            var childTaskCompletedCount = countChildCompletedTasks(snapshot.val()[obj].santa);
            reports['tasks'].push({'santaTaskCount' : santaTaskCount,
                                    'childTaskCompletedCount' : childTaskCompletedCount,
                                    'room' : obj
                                    });                
            
            // if(santaTaskCount > maxNumberOfTasksBySanta)
            // {
            //     maxNumberOfTasksBySanta = santaTaskCount;
            //     roomWithMaxSantaTasks.push(obj.slice(0));                        
            // }
            // else
            // {
            //     roomWithMaxSantaTasks=[];
            // }
            // if(santaTaskCount < minNumberOfTasksBySanta)
            // {
            //     minNumberOfTasksBySanta = santaTaskCount;
            //     roomWithMinSantaTasks.push(obj.slice(0));
            // }
            // else
            // {
            //     roomWithMinSantaTasks=[];
            // }

            // if(childTaskCompletedCount > maxNumberOfTasksCompletedByChild)
            // {
            //     maxNumberOfTasksCompletedByChild = childTaskCompletedCount;
            //     roomWithMaxChildTasksCompleted.push(obj.slice(0));
            // }
            // else
            // {
            //     roomWithMaxChildTasksCompleted=[];
            // }
            // if(childTaskCompletedCount < minNumberOfTaskCompletedByChild)
            // {
            //     minNumberOfTaskCompletedByChild = childTaskCompletedCount;
            //     roomWithMinChildTasksCompleted.push(obj.slice(0))
            // }
            // else
            // {
            //     roomWithMinChildTasksCompleted=[];
            // }                    
        }
        else {
            // roomWithMinSantaTasks.push(snapshot.val()[obj]);
            // minNumberOfTasksBySanta = 0;   
            reports['tasks'].push({'santaTaskCount' : 0,
                                    'childTaskCompletedCount' : 0,
                                    'room' : obj});
        }    
    }
};


function countSantaTasks(foo) {
    var count = 0;
    var santaObj = foo;
    for (var k in santaObj) {
        if (santaObj.hasOwnProperty(k)) {
           ++count;
        }
    }
    return count;
};
function countChildCompletedTasks(foo) {
    var count = 0;
    for(var k in foo)
    {
        console.log(foo[k].completed);
        if(foo.hasOwnProperty(k) && foo[k].completed == true)
        {
            ++count;
        }
    }
    return count;
};



chatCount();