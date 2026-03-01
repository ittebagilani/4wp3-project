const db = require("./db");

exports.getAll = function(callback) {
    db.all("SELECT * FROM Projects", [], callback);
};

exports.getById = function(id, callback) {
    db.get("SELECT * FROM Projects WHERE id = ?", [id], callback);
};

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

exports.delete = function(id, callback) {
    db.run("DELETE FROM Projects WHERE id = ?", [id], callback);
};

exports.deleteCompleted = function(callback) {
    db.run("DELETE FROM Projects WHERE status = 'Completed'", [], callback);
};

exports.filterByStatus = (status, callback) => {
    db.all("SELECT * FROM Projects WHERE status = ?", [status], callback);
};

exports.sortByDeadline = (callback) => {
    db.all("SELECT * FROM Projects ORDER BY deadline ASC", [], callback);
};

exports.markComplete = function(id, callback) {
    db.run(
        "UPDATE Projects SET status = 'Completed', progress_percent = 100 WHERE id = ?",
        [id],
        callback
    );
};
