#!/usr/bin/env node

import inquirer from "inquirer"
import chalk from "chalk";

let listMode = true;
let tasks: string[] = [];



console.log(chalk.rgb(255,255,0)("\n===>>  WELCOME IN TODO LIST  <<==="))
do {
    const userChoice = await inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "\n\nChoose what do you want",
            choices: ["Add tasks", "Delete tasks", "Delete all tasks", "Edit tasks", "View tasks", "Mark task as Completed/Uncompleted","Quit"],
            prefix: "" 
            //By default inquirer shows question mark so just to remove that we use 'prefix' property.  
            //We can also use other symbol entering in that empty string.
        }
    ])


    if (userChoice.choice === "Add tasks") {
        let addMoreTask = true;
        while (addMoreTask) {
            addMoreTask = await addTask();
        }
    }
    else if (userChoice.choice === "Delete tasks") {
        await deleteTask();
    }
    else if (userChoice.choice === "Delete all tasks") {
        await deleteAllTask();
    }
    else if (userChoice.choice === "Edit tasks") {
        await editTask();
    }
    else if (userChoice.choice === "View tasks") {
        viewTask();
    }
    else if (userChoice.choice === "Mark task as Completed/Uncompleted") {
        await markTask();
    }
    else if (userChoice.choice === "Quit") {
        console.log(chalk.rgb(0,255,0)("\n\n===>>   Thanks for using my app :)    <<==="));
        listMode = false;
    }
} while (listMode);


//All functions declaration below 

async function addTask() {
    const userAddTask = await inquirer.prompt([
        {
            type: "input",
            name: "userAdd",
            message: "\nEnter task you want to add: ",
            prefix: ""
        }
    ])
    if(userAddTask.userAdd === ""){
        console.log(chalk.rgb(255, 0, 0)("\n==> Please enter the task..."));
        return;
    }
    
    tasks.push(userAddTask.userAdd);

    const addTaskAgain = await inquirer.prompt([
        {
            type: "confirm",
            name: "addAgain",   
            message: "Want to add more task? ",
            prefix: ""
        }
    ])

    return addTaskAgain.addAgain;
}

async function deleteTask() {
    if (tasks.length === 0) {
        console.log(chalk.rgb(255,0,0)("\n==> No task available!\n==> Please add some task first.. !")); 
    }
    else {
        viewTask();
        const userDeleteTask = await inquirer.prompt([
            {
                type: "input",
                name: "userDelete",
                message: "\nPlease enter the number of task you want to delete: ",
                prefix: ""
            }
        ])
        let found = false;
        for (let i = 0; i < tasks.length; i++) {
            if (i + 1 == userDeleteTask.userDelete) {
                let removedElement = tasks.splice(i, 1);
                console.log(chalk.rgb(0,255,0)(`\n==> Your task has been Deleted succesfully...`));
                found = true;
                break;
            }
        }

        if (found === false) {
            console.log(chalk.rgb(255,0,0)("\n ==> Incorrect task number!, please enter a valid number."));
        }
    }
}

async function deleteAllTask(){
    if (tasks.length === 0) {
        console.log(chalk.rgb(255,0,0)("\n==> No task available!\n==> Please add some task first.. !")); 
    }
    else {
        tasks = [];
        console.log(chalk.rgb(0, 255, 0)("\n==> All the tasks has been deleted successfully."));
    }
}

async function editTask() {
    if (tasks.length === 0) {
        console.log(chalk.rgb(255,0,0)("\n==> No task available!\n==> Please add some task first.. !"));
    }
    else {
        viewTask();
            const userEditTask = await inquirer.prompt([
                {
                    type: "input",
                    name: "userEdit",
                    message: "\nPlease enter the number of task you want to edit or change: ",
                    prefix: ""
                }
            ])
            let taskToEdit = parseInt(userEditTask.userEdit);
            let found = false;
            for (let i = 0; i<tasks.length; i++) {
                if (i + 1 === taskToEdit) {
                    const userEditNewTask = await inquirer.prompt([
                        {
                            type: "input",
                            name: "userNewEdit",
                            message: "Please enter the new task now: ",
                            prefix: ""
                        }
                    ])

                    let newTask = userEditNewTask.userNewEdit;


                    let oldElement = tasks.splice(i, 1, newTask);
                    console.log(chalk.rgb(0,255,0)(`\n==> \'${newTask}\' successfully replaced!`));
                    console.log(chalk.rgb(0,255,0)("==> Now you can check your updated list of tasks."));
                    found = true;
                    break;
                }
            }
            if (found === false){
                console.log(chalk.rgb(255,0,0)("\n ==> Incorrect task number!, please enter a valid number."));
            }
    }
}

async function markTask(){
    if (tasks.length === 0) {
        console.log(chalk.rgb(255,0,0)("\n==> No task available!\n==> Please add some task first.. !"));
    }
    else {
        viewTask();
        const userMarkTask = await inquirer.prompt([
            {
                type: "input",
                name: "userMarkTask",
                message: "\nEnter the number of task you want to mark: ",
                prefix: ""
            }
        ])
        let userMark = parseInt(userMarkTask.userMarkTask);
        let found = false;

        for (let i = 0; i<tasks.length; i++){
            if (i+1 === userMark){
                
                const userMarkChoice = await inquirer.prompt([
                    {
                        type: "list",
                        name: "userMarkChoice",
                        message: `\nYour task has been?`,
                        choices: ["Completed", "Uncompleted"],
                        prefix: ""
                    }
                ])
                
                if (userMarkChoice.userMarkChoice === "Completed"){
                    if (tasks[i].includes("[Completed]")) {
                        console.log("\n==> Already completed!");
                    } else {
                        tasks[i] = tasks[i].replace("\t[Uncompleted]", "").trim() + chalk.rgb(0, 255, 0)("\t[Completed]");
                        console.log(chalk.rgb(0, 255, 0)("\n==> Task marked as completed..."));
                    }
                } else if (userMarkChoice.userMarkChoice === "Uncompleted") {
                    if (tasks[i].includes("[Uncompleted]")) {
                        console.log("\n==> Already Uncompleted!");
                    } else {
                        tasks[i] = tasks[i].replace("\t[Completed]", "").trim() + chalk.rgb(255, 0, 0)("\t[Uncompleted]");
                        console.log(chalk.rgb(0, 255, 0)("\n==> Task marked as Uncompleted..."));
                    }
                }
                found = true;
                break;
            }
        }
        if(found === false){
            console.log(chalk.rgb(255,0,0)("\n ==> Incorrect task number!, please enter a valid number."));
        }

        

        
    }
}

async function viewTask() {
    if (tasks.length === 0) {
        console.log(chalk.rgb(255,0,0)("\n==> No task available!\n==> Please add some task first.. !"));
    }
    else {
        console.log(chalk.rgb(255,255,0)("\n========>>  Your Tasks  <<=========\n"));
        for (let i = 0; i < tasks.length; i++) {
            console.log(chalk.rgb(255,255,0)(`${i + 1} ${tasks[i]}`));
        }
    }

}


