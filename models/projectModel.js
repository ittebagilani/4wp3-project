const db = require("./db");

// get all projects
exports.getAll = function(callback) {
    db.all("SELECT * FROM Projects", [], callback);
};

//get project by ID
exports.getById = function(id, callback) {
    db.get("SELECT * FROM Projects WHERE id = ?", [id], callback);
};

// create project
exports.create = function(project, callback) {
    db.run(`
        INSERT INTO Projects
        (title, description, deadline, priority, status, progress_percent, created_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        `,
        [
            project.title,
            project.description,
            project.deadline,
            project.priority,
            project.status,
            project.progress_percent
        ],
        callback);
};

// update project
exports.update = function(id, project, callback) {
    db.run(`
            UPDATE Projects
            SET title=?, description=?, deadline=?, priority=?, status=?, progress_percent=?
            WHERE id=?
        `,
    [
        project.title,
        project.description,
        project.deadline,
        project.priority,
        project.status,
        project.progress_percent,
        id
    ], callback);
};

// delete project
exports.delete = function(id, callback) {
    db.run("DELETE FROM Projects WHERE id = ?", [id], callback);
};

// delete completed projects
exports.deleteCompleted = function(callback) {
    db.run("DELETE FROM Projects WHERE status = 'Completed'", [], callback);
};

