import fs from "fs";
import path from "path";

function scanDirectory(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            scanDirectory(fullPath);
        } else if (fullPath.endsWith(".js")) {
            fixImports(fullPath);
        }
    });
}

function fixImports(filePath) {
    let content = fs.readFileSync(filePath, "utf8");

    let updatedContent = content.replace(
        /import\s+([\s\S]+?)\s+from\s+["'](\.\/[^"']+)["']/g,
        (match, imports, importPath) => {
            if (!importPath.endsWith(".js") && !importPath.endsWith("/")) {
                return `import ${imports} from "${importPath}.js"`;
            }
            return match;
        }
    );

    if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, "utf8");
        console.log(`✅ Fixed imports in: ${filePath}`);
    }
}

scanDirectory("./src");
console.log("🎯 All imports have been checked and fixed!");
