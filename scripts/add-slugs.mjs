import { readFileSync, writeFileSync } from "fs";

function toSlug(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 60);
}

const data = JSON.parse(readFileSync(new URL("../data/islamic-history.json", import.meta.url), "utf-8"));

data.forEach(era => {
    era.events.forEach((event, idx) => {
        event.slug = toSlug(event.title_en) || `event-${idx}`;
    });
});

writeFileSync(
    new URL("../data/islamic-history.json", import.meta.url),
    JSON.stringify(data, null, 2),
    "utf-8"
);

console.log("✅ Slugs added to all events!");
data.forEach(era => {
    console.log(`  ${era.id}: ${era.events.map(e => e.slug).join(", ")}`);
});
