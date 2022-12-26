// loading in packages 
const mysql = require('mysql2');
const express = require('express');
const { default: inquirer } = require('inquirer');
const PORT = process.env.PORT || 3001;
const app = express();
const consTable = require('console.table');
const inquirer = require('inquirer');
// using .env for password storage
require('dotenv').config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: 'employee_db'
    },
    console.log(`Connected to the employees_db Database.`)
);
db.connect(err => {
    if(err) throw err;    
});

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});


userInit = () => {
    let exit = false;
    while(exit === false){
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'initPrompt',
                message: 'Please select one of the following:',
                choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Exit'] 
            }
        ])
        .then((data) => {
            const { answers } = data;
            // switch statement to run correct function based on user answer
            switch (answers) {
                case 'View All Departments':
                    viewDepartments();
                  break;
                case 'View All Roles': 
                    viewRoles();
                  break;
                case 'View All Employees':
                    viewEmployees();
                  break;
                case 'Add Department':
                    addDepartment();
                  break;
                case 'Add Role':
                    addRole();
                  break;
                case 'Add Employee':
                    addEmp();
                  break;
                case 'Update Employee Role':
                    updateEmp();
                    break;
                case 'Exit':
                    exit = true;
                  break;    
                default: 
                    console.log(err);
            };

        });
    };
};


viewDepartments = () => {
    console.log("Currently Viewing All Departments..")
    let dbQuery = `SELECT id, department_name FROM department`;

    db.query(dbQuery, (err, rowData) => {
        if(err) {
            console.log(err.message);
        } else {
        console.table(rowData);
        };
        userInit();
    });
};

viewRoles = () => {
    console.log("Currently Viewing All Roles..")
    let dbQuery = `SELECT id, title, department_id, salary FROM role`;

    db.query(dbQuery, (err, rowData) => {
        if(err) {
            console.log(err.message);
        } else {
        console.table(rowData);
        };
        userInit();
    });
};

viewEmployees = () => {
    console.log("Currently Viewing All Employees..");
    let dbQuery = `SELECT id, department_name FROM departments`;

    db.query(dbQuery, (err, rowData) => {
        if(err) {
            console.log(err.message);
        } else {
        console.table(rowData);
    };
        userInit();
    });
};

addDepartment = () => {
    inquirer
        .prompt([
            {
                type: `input`,
                name: `dName`,
                message: `Please Enter Name of Department:`
            }
            .then((data) => {
                let dbQuery = `INSERT INTO department(department_name) VALUES(?)`
                
                db.query(dbQuery, (err) => {
                    if(err) {
                        console.log(err.message);
                    };
                });

            })
        ]);
}

addRole = () => {
    inquirer
        .prompt([
            {
                type: `input`,
                name: `rName`,
                message: `Please Enter Name for the Role:`
            },
            {
                type: `input`,
                mame: `rSalary`,
                message: `Please Enter a Salary for the Role:`
            },
            {
                type: `input`,
                name: `rDept`,
                message: `Please Enter a Department for the Role:`
            }
            .then((data) => {
                
            })
        ])
}

