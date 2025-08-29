"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "localhost";
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("public"));
const upload = (0, multer_1.default)({ dest: "uploads/" });
const outputDir = path_1.default.join(__dirname, "output");
if (!fs_1.default.existsSync(outputDir)) {
    fs_1.default.mkdirSync(outputDir);
}
app.post("/api/process-video", upload.single("video"), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: "No video file uploaded" });
    }
    const outputFilePath = path_1.default.join(outputDir, `${Date.now()}_output.mp4`);
    (0, fluent_ffmpeg_1.default)(file.path)
        .outputOptions("-vf", "scale=-1:360")
        .on("end", () => {
        console.log("Video processing completed");
        res.download(outputFilePath, (err) => {
            if (err) {
                console.error("Error during download:", err);
                res.status(500).json({ error: "Download failed" });
            }
            else {
                console.log("File sent successfully");
            }
        });
    })
        .on("error", (err) => {
        console.error("Error processing video:", err);
        res.status(500).json({ error: "Error processing video" });
    })
        .save(outputFilePath);
});
app.listen(PORT, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`);
});
