const express = require("express");
const router  = express.Router();
const model   = require("../models/projectModel");

function processRow(row) {
    if (!row) return null;
    const pri = Number(row.priority);
    return {
        ...row,
        isCompleted:  row.status === "Completed",
        isInProgress: row.status === "In Progress",
        isNotStarted: row.status === "Not Started",
        priorityHigh: pri >= 4,
        priorityMed:  pri === 3,
        priorityLow:  pri <= 2
    };
}

function computeStats(rows) {
    return {
        total:      rows.length,
        inProgress: rows.filter(r => r.status === "In Progress").length,
        completed:  rows.filter(r => r.status === "Completed").length,
        notStarted: rows.filter(r => r.status === "Not Started").length
    };
}

function renderIndex(res, rows, extra) {
    res.render("index", {
        projects: rows.map(processRow),
        stats:    computeStats(rows),
        ...extra
    });
}

function validateProject(body) {
    const errors = [];
    const { priority, progress_percent, deadline } = body;

    const pri = Number(priority);
    if (!Number.isInteger(pri) || pri < 1 || pri > 5)
        errors.push("Priority must be a whole number between 1 and 5.");

    const prog = Number(progress_percent);
    if (isNaN(prog) || prog < 0 || prog > 100)
        errors.push("Progress must be a number between 0 and 100.");

    if (!deadline || new Date(deadline) <= new Date())
        errors.push("Deadline must be a future date.");

    return errors;
}

router.get("/", (req, res) => {
    const { status, sort } = req.query;

    if (status) {
        model.filterByStatus(status, (_err, rows) => {
            renderIndex(res, rows || [], {
                filterCompleted:  status === "Completed",
                filterInProgress: status === "In Progress",
                filterNotStarted: status === "Not Started"
            });
        });
    } else if (sort === "deadline") {
        model.sortByDeadline((_err, rows) => {
            renderIndex(res, rows || [], { filterAll: true, activeSort: true });
        });
    } else {
        model.getAll((_err, rows) => {
            renderIndex(res, rows || [], { filterAll: true });
        });
    }
});

router.get("/project/:id", (req, res) => {
    model.getById(req.params.id, (_err, row) => {
        if (!row) return res.redirect("/");
        res.render("project", processRow(row));
    });
});

router.get("/create", (req, res) => {
    res.render("create");
});

router.post("/create", (req, res) => {
    const errors = validateProject(req.body);
    if (errors.length > 0)
        return res.render("create", { errors, form: req.body });

    model.create(req.body, () => res.redirect("/"));
});

router.get("/edit/:id", (req, res) => {
    model.getById(req.params.id, (_err, row) => {
        if (!row) return res.redirect("/");
        res.render("edit", processRow(row));
    });
});

router.post("/update/:id", (req, res) => {
    const errors = validateProject(req.body);
    if (errors.length > 0) {
        model.getById(req.params.id, (_err, row) => {
            const merged = processRow({ ...row, ...req.body, id: req.params.id });
            return res.render("edit", { ...merged, errors });
        });
        return;
    }
    model.update(req.params.id, req.body, () =>
        res.redirect("/project/" + req.params.id)
    );
});

router.post("/complete/:id", (req, res) => {
    model.markComplete(req.params.id, () => res.redirect("/"));
});

router.get("/delete/:id", (req, res) => {
    model.delete(req.params.id, () => res.redirect("/"));
});

router.get("/delete-completed", (req, res) => {
    model.deleteCompleted(() => res.redirect("/"));
});

module.exports = router;
