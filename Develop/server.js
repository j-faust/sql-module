// loading in packages
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consTable = require("console.table");
// using .env for password storage
require("dotenv").config();

// creating connection to mysql db
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "employee_db",
  },
  console.log(`Connected to the employees_db Database.`)
);
db.connect((error) => {
  if (error) throw error;
});


// function for intial question prompt
userInit = () => {

      inquirer
      .prompt([
        {
          type: "list",
          name: "initPrompt",
          message: "Please select one of the following:",
          choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add Department",
            "Add Role",
            "Add Employee",
            "Update Employee Role",
            "Exit",
          ],
        },
      ])
      .then((data) => {
        //
        const { initPrompt } = data;
        console.log(initPrompt);
        // switch statement to run correct function based on user answer
        switch (initPrompt) {
          case "View All Departments":
            viewDepartments();
            break;
          case "View All Roles":
            viewRoles();
            break;
          case "View All Employees":
            viewEmployees();
            break;
          case "Add Department":
            addDepartment();
            break;
          case "Add Role":
            addRole();
            break;
          case "Add Employee":
            addEmp();
            break;
          case "Update Employee Role":
            updateEmp();
            break;
          case "Exit":
            exit = true;
            break;
          default:
            console.log("Invalid Selection");
        }
      });
};

userInit();


// function to view departments
viewDepartments = () => {
  console.log("Currently Viewing All Departments..");
  let dbQuery = `SELECT department.id AS id, department_name AS department FROM department`;

  db.promise().query(dbQuery) 
    .then((rowData) => {
        console.table(rowData[0]);

    }).catch((error) => {
      console.log(error.message);
    });
  userInit();
};

// function to view roles
viewRoles = () => {
  console.log("Currently Viewing All Roles..");
  let dbQuery = `SELECT role.id, role.title, department.department_name AS department, salary FROM role,
                     department WHERE role.department_id=department.id`;

      db.promise().query(dbQuery) 
      .then((rowData) => {
          console.table(rowData[0]);
  
      }).catch((error) => {
        console.log(error.message);
      });
    userInit();
  };


// function to view employees
viewEmployees = () => {
  console.log("Currently Viewing All Employees..");
//   query to join table for employee to display employee, id, title, manager, department and salary
  let dbQuery = `
  SELECT employee.id, 
  employee.first_name, 
  employee.last_name, 
  role.title, 
  department.department_name AS department,
  role.salary, 
  CONCAT (manager.first_name, " ", manager.last_name) AS manager
FROM employee
  LEFT JOIN role ON employee.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  db.promise().query(dbQuery) 
    .then((rowData) => {
        console.table(rowData[0]);

    }).catch((error) => {
      console.log(error.message);
    });
  userInit();
};

// function to add a department
addDepartment = async () => {
    // prompt to add deparment
    await inquirer
    .prompt([
      {
        type: `input`,
        name: `dName`,
        message: `Please Enter Name of Department:`,
      },
    ])
    .then( async (data) => {
      let dbQuery = `INSERT INTO department(department_name) VALUES (?)`;

      db.promise().query(dbQuery, data.dName).
        then( (data) => {
            console.log("Has been added to the Department!");
          }).catch((error) => {
            console.log(error.message);
          });

      }
      
      );
      userInit();
    };


// function to add a role
addRole = async () => {
    // prompt to add Role
   await inquirer
    .prompt([
      {
        type: `input`,
        name: `rName`,
        message: `Please Enter Name for the Role:`,
      },
      {
        type: `input`,
        mame: `rSalary`,
        message: `Please Enter a Salary for the Role:`,
      },
      {
        type: `input`,
        name: `rDept`,
        message: `Please Enter a Department for the Role:`,
      },
    ])
    .then (async (data) => {
      
      db.promise().query(dbQuery, [data.rName, data.rSalary, data.rDept])
        .then( (data) => {
            console.log("Role has been added!");
          }).catch((error) => {
            console.log(error.message);
          });
    });
  userInit();
};

// function to add employee
addEmp =  () => {
    // prompt to add employee
   inquirer
    .prompt([
      {
        type: `input`,
        name: `fName`,
        message: `Please Enter First Name for Employee:`,
      },
      {
        type: `input`,
        name: `lName`,
        message: `Please Enter Last Name for Employee:`,
      },
      {
        type: `input`,
        name: `eRole`,
        message: `Please Enter the Role for the Employee:`,
      },
      {
        type: `input`,
        nam: `eManager`,
        message: `Please Enter the Manager ID for the Employee:`,
      },
    ])
    .then((data) => {
      let dbQuery = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?)`;

      db.promise().query(
        dbQuery,
        [fName, lName, eRole, eManager],
        (error, result) => {
          if (error) {
            console.log(error.message);
          } else {
            console.log("The employee has been added!");
          }
        }
      );
    });
  userInit();
};

// function to update employee
updateEmp = () => {
    // queries to pull employee data and role data from DB
  const eQuery = `SELECT id, first_name, last_name, role_id FROM employee`;
  const rQuery = `SELECT id, title FROM role`;
  let empNamesArr = [],
    rolesArr = [];
    // making DB query
  db.promise().query(eQuery, (error, employees) => {
    if (error) {
    } else {
        // converting to array from question prompt
      empNamesArr = employees.map(
        (emp) => {
            emp.first_name + " " + emp.last_name
        });
    }
        // making DB query
    db.promise().query(rQuery, (error, roles) => {
      if (error) {
      } else {
        // converting to array for question prompt 
        rolesArr = roles.map((role) => role.title);
      }
    //   prompts to choose and update the selected employee
       inquirer
        .prompt([
          {
            type: `list`,
            name: `emp`,
            message: `Please select the employee to update:`,
            choices: empNamesArr,
          },
          {
            type: `list`,
            name: `role`,
            message: `Please select the updated role:`,
            choices: rolesArr,
          },
        ])
        .then((data) => {
          let empIdToUpdate, newRoleId;
            // updating to what the user selected
          empIdToUpdate = employees.find((e) => {
              return e.first_name + " " + e.last_name === data.emp;
          }).id;
          
          newRoleId = roles.find((r) => r.title === data.role).id;

        //   query to update database
          db.promise().query(
            "UPDATE employee SET role_id=? WHERE id=?",
            (error, results) => {
              console.log("Database has been updated!");
              console.log(results);
            }
          );
        });
    });
  });
  userInit();
};
