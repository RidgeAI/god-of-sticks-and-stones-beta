import fs from "fs";
import path from "path";

function convertFileToESM(filePath) {
    let content = fs.readFileSync(filePath, "utf8");

    content = content.replace(/const (.*?) = require\(["'](.*?)["']\);/g, (match, imports, module) => {
        return `import ${imports} from "${module}.js";`;
    });

    content = content.replace(/module\.exports = { (.*) };/g, (match, exports) => {
        return `export { ${exports} };`;
    });

    content = content.replace(/module\.exports = (.*);/g, (match, exported) => {
        return `export default ${exported};`;
    });

    content = content.replace(/(import .*? from ")(\.\/.*?)(?<!\.js)(";)/g, "$1$2.js$3");

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Converted: ${filePath}`);
}

function scanProject(directory) {
    fs.readdirSync(directory).forEach(file => {
        const fullPath = path.join(directory, file);

        if (fs.statSync(fullPath).isDirectory()) {
            scanProject(fullPath);
        } else if (fullPath.endsWith(".js")) {
            convertFileToESM(fullPath);
        }
    });
}

function ensureESMConfig() {
    const packageJsonPath = path.resolve("package.json");

    if (fs.existsSync(packageJsonPath)) {
        let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

        if (packageJson.type !== "module") {
            packageJson.type = "module";
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
            console.log("Updated package.json to use ES Modules.");
        }
    }
}

const projectPath = path.resolve("./");
scanProject(projectPath);
ensureESMConfig();

console.log("✅ Conversion to ES Modules completed!");
