INSERT INTO department(department_name)
VALUES 
('Marketing'),
('Human Resources'),
('IT'),
('Finance & Accounting'),
('Operations');

INSERT INTO role(title, salary, department_id)
VALUES
('Recruiter', 60000, 2),
('Software Engineer', 120000, 3),
('Marketing Representative', 80000, 1),
('Financial Analyst', 110000, 4),
('Project Manager', 75000, 5),
('HR Manager', 95000, 2),
('Accountant', 85000, 4),
('Operations Manager', 60000, 5),
('Operations Rep', 50000, 5),
('Full Stack Developer', 95000, 3),
('Finance Manager', 100000, 1);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
('Rob', 'Miller', 2, NULL),
('Janet', 'Marino', 6, NULL),
('Michael', 'Jordan', 11, NULL),
('Ryan', 'Smith', 1, 1),
('Linda', 'Nunez', 4, 3),
('Sarah', 'Roberts', 5, NULL),
('Tom', 'Reynolds', 10, 1),
('John', 'Johnson', 4, 3)
