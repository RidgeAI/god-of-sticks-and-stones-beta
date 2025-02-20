import fs from "fs";

const updateImports = (filePath) => {
    let content = fs.readFileSync(filePath, "utf8");
    
    content = content.replace(/(import\s+\{[^}]+\}\s+from\s+"\.\/[^"]+)(?<!\.js)(")(;)/g, "$1.js$2$3"); // Fix imports with named exports
    content = content.replace(/(import\s+[^\{][^\s]+\s+from\s+"\.\/[^"]+)(?<!\.js)(")(;)/g, "$1.js$2$3"); // Fix imports with default exports

    fs.writeFileSync(filePath, content, "utf8");
};

const scanAndFix = (dir) => {
    fs.readdirSync(dir).forEach((file) => {
        const fullPath = `${dir}/${file}`;
        if (fs.statSync(fullPath).isDirectory()) {
            scanAndFix(fullPath);
        } else if (file.endsWith(".js")) {
            updateImports(fullPath);
        }
    });
};

scanAndFix("./src");
console.log("✅ Imports updated successfully!");
