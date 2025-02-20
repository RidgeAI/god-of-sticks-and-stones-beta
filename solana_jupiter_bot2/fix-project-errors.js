// Ensure all imports use correct paths and ES module syntax
import cliui from "cliui";
import chalk from "chalk";
import gradient from "gradient-string";
import pkg from "../../../../package.json" assert { type: "json" };
import cache from "../cache.js";

const ui = cliui({ width: 140 });

const universeSize = 15;
const color = "white";
const startWarp = 30;
let colorsSet = [
    "#cf4884",
    "#8832b3",
    "#b5b4fa",
    "#cdadff",
    "#6d29c5",
    "#4e21d9",
    "#481ede",
];

const random = (h = 100, l = 1) => Math.floor(Math.random() * (h - l + 1)) + l;

async function intro() {
    try {
        const skipIntro = process.env.SKIP_INTRO === "true" || false;

        if (!skipIntro) {
            ui.div(" ");
            for (let i = 0; i < 200; i++) {
                const speed = i > 50 ? 100 - i : i;
                const a = colorsSet.shift();
                colorsSet.push(a);
                const g = gradient(colorsSet);

                const char =
                    i > startWarp
                        ? i > 180
                            ? g("/").repeat(random(i / 10, i / 10 - 2))
                            : "-".repeat(random(i / 10, i / 10 - 2))
                        : "•";
                await new Promise((resolve) => setTimeout(resolve, speed));

                console.clear();
                ui.resetOutput();

                for (let ii = 0; ii < universeSize; ii++) {
                    ui.div({
                        text: `${chalk[color](char)}`,
                        padding: [0, 0, 0, random()],
                    });
                }

                ui.div({
                    text: g(`ARB SOLANA BOT - ${pkg.version}`),
                    width: 50,
                    align: "center",
                    padding: [1, 0, 1, 0],
                });

                for (let ii = 0; ii < universeSize; ii++) {
                    ui.div({
                        text: `${chalk[color](char)}`,
                        padding: [0, 0, 0, random()],
                    });
                }

                console.log(ui.toString());
            }
            ui.div("");
            console.clear();
        }
    } catch (error) {
        console.log(error);
    }
}

export default intro;
