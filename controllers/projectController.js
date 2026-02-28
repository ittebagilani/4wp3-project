const express = require("express");
const router = express.Router();

const model = require("../models/projectModel");

// view all projects
router.get("/", (req, res) => {
    model.getAll((err, rows) => {
        res.render("index", { projects: rows });
    });
});

// view single project
router.get("/project/:id", (req, res) => {
    model.getById(req.params.id, (err, row) => {
        res.render("project", row);
    });
});

// show project form
router.get("/create", (req, res) => {
    res.render("create");
});

// create project form
router.post("/create", (req, res) => {
    const { priority, progress_percent, deadline } = req.body;
    let errors = [];

    if (priority < 1 || priority > 5)
        errors.push("Priority must be between 1 and 5");

    if (progress_percent < 0 || progress_percent > 100)
        errors.push("Deadline must be a future date.");

    if (new Date(deadline) <= new Date())
        errors.push("Deadline must be a future date.");

    if (errors.length > 0)
        return res.render("create", { errors });

    model.create(req.body, () => {
        res.redirect('/');
    });
});

//edit page
router.get("/edit/:id", (req, res) => {
    model.getById(req.params.id, (err, row) => {
        res.render("edit", row);
    });
});

// update page
router.post("/update/:id", (req, res) => {
    model.update(req.params.id, req.body, () => {
        res.redirect("/");
    });
});

// delete page
router.get("/delete/:id", (req, res) => {
    model.delete(req.params.id, () => {
        res.redirect("/");
    });
});

// delete finished
router.get("/delete-completed", (req, res) => {
    model.deleteCompleted(() => {
        res.redirect("/");
    });
});

// filter
router.get("/filter/:status", (req, res) => {
    model.filterByStatus(req.params.status, (err, rows) => {
        res.render("index", { projects: rows });
    });
});

// sort
router.get("/sort/deadline", (req, res) => {
    model.sortByDeadline((err, rows) => {
        res.render("index", { projects: rows });
    });
});

module.exports = router;



