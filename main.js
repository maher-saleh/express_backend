import { handle } from "workers-express";
import express from "express";

const app = express();
app.use(express.json());

const errorChance = 0.1;
let navData = [
        {id: 1, title: "Dashboard", target: "/"},
        {
            id: 2,
            title: "Job Applications",
            target: "/applications",
            children: [
                {id: 7, title: "John Doe", target: "/applications/john-doe"},
                {id: 10, title: "James Bond", target: "/applications/james-bond"},
                {id: 20, title: "Scarlett Johansson", target: "/applications/scarlett-johansson", visible: false},
            ],
        },
        {
            id: 3,
            title: "Companies",
            target: "/companies",
            visible: false,
            children: [
                {id: 8, title: "Tanqeeb", target: "/companies/1"},
                {id: 9, title: "Daftra", target: "/companies/2"},
                {id: 11, title: "TBD", target: "/companies/14"},
            ],
        },
        {
            id: 4,
            title: "Qualifications",
            children: [
                {id: 14, title: "Q1", target: "/q1"},
                {id: 15, title: "Q2", target: "/q2"},
            ],
        },
        {id: 5, title: "About", target: "/about"},
        {id: 6, title: "Contact", target: "/contact"},
    ];

// Middleware to simulate random errors
app.use((req, res, next) => {
    if (Math.random() <= errorChance) return res.status(500).send("Internal Server Error");
    else next();
});

// POST /track
app.post("/track", (req, res) => {
    const { id, from, to } = req.body;
    if (!id || from === undefined || to === undefined) {
        return res.status(400).json({ error: "Bad Request" });
    }
    return res.status(204).send();
});

// GET /nav
app.get("/nav", (req, res) => {
    res.json(navData);
});

// POST /nav (update the in-memory nav data)
app.post("/nav", (req, res) => {
    const items = req.body;
    if (!Array.isArray(items)) {
        return res.status(400).json({ error: "Bad Request" });
    }
    navData = items;
    return res.status(204).send();
});

// Export Cloudflare Worker
export default {
    fetch: handle(app),
};
