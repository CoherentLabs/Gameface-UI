const { execSync } = require("child_process");
const path = require("path");
require("dotenv").config();

let gamefacePath = process.env.GAMEFACE_PATH;

if (!gamefacePath) {
    console.error("Gameface path is not specified. Please set the GAMEFACE_PATH environment variable.");
    process.exit(1);
}

if (!path.isAbsolute(gamefacePath)) {
    gamefacePath = path.resolve(__dirname, '..', gamefacePath);
}

try {
    execSync(`gameface-e2e --config=./tests/gameface-e2e-config.js --gamefacePath=${gamefacePath}`, {
        stdio: "inherit",
        shell: true,
    });
} catch (error) {
    process.exitCode = error.status || 1;
}