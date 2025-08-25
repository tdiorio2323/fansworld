import fs from "fs";
import fetch from "node-fetch";

const base = "http://localhost:4173";
const routes = fs.readFileSync("reports/routes.txt", "utf8").trim().split("\n");

(async () => {
    const rows = [];
    for (const r of routes) {
        if (!r) continue;
        try {
            const res = await fetch(base + r);
            const html = await res.text();
            const mounts = /id="root"|data-app-root|data-page|class="app-root"/i.test(html);
            rows.push(`${res.status}\t${r}\t${mounts ? "MOUNTED" : "MOUNT_CHECK_FAIL"}`);
        } catch (err) {
            rows.push(`ERROR\t${r}\tFETCH_FAILED`);
        }
    }
    fs.writeFileSync("reports/mount-check.tsv", rows.join("\n"));
    console.log("Wrote reports/mount-check.tsv");
})();
