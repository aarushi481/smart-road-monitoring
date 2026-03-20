const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

/* ✅ ENSURE UPLOADS FOLDER EXISTS */
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

/* 📁 STORAGE CONFIG */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    },
});

/* ✅ FILE FILTER (ONLY IMAGES) */
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files allowed"), false);
        }
    },
});

/* 📂 SERVE IMAGES */
app.use("/uploads", express.static(uploadDir));

/* 📦 IN-MEMORY DB */
let reports = [];

/* 🤖 FAKE ML */
function detectPothole() {
    return Math.random() > 0.5 ? "POTHOLE" : "CLEAR";
}

/* 📤 UPLOAD */
app.post("/upload", upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const { type, latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: "Location required" });
        }

        const newReport = {
            id: Date.now(), // ✅ UNIQUE ID (IMPORTANT)
            type: type || "Unknown",
            image: req.file.filename,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            detection: detectPothole(),
            createdAt: new Date(),
        };

        reports.push(newReport);

        res.json({
            success: true,
            report: newReport,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Upload failed" });
    }
});

/* 📥 GET REPORTS */
app.get("/reports", (req, res) => {
    res.json(reports);
});

/* ❌ DELETE BY ID (FIXED) */
app.delete("/report/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const index = reports.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Report not found" });
    }

    const report = reports[index];

    /* 🧹 DELETE IMAGE FILE */
    const filePath = path.join(uploadDir, report.image);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    reports.splice(index, 1);

    res.json({ success: true });
});

/* 🚀 SERVER */
app.listen(3001, () => {
    console.log("🚀 Server running on http://localhost:3001");
});