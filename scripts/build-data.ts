import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import JSZip from "jszip";
import { csvContracts, loadDataset } from "./lib/load-data";
import { createMasterCsv } from "./lib/public-data";
import { validateDataset, validateHeaderPrivacy } from "./lib/validate-dataset";

const root = process.cwd();
const generatedDir = join(root, "src", "generated");
const publicDataDir = join(root, "public", "data");
const dataset = loadDataset(root);
const errors = [...validateDataset(dataset), ...validateHeaderPrivacy(csvContracts)];

if (errors.length > 0) {
  throw new Error(`Cannot build invalid data:\n${errors.map((error) => `- ${error}`).join("\n")}`);
}

mkdirSync(generatedDir, { recursive: true });
mkdirSync(publicDataDir, { recursive: true });

const publicDataset = {
  ...dataset,
  generatedAt: dataset.release.releasedAt,
};

writeFileSync(
  join(generatedDir, "data.json"),
  `${JSON.stringify(publicDataset, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  join(generatedDir, "index.ts"),
  [
    'import data from "./data.json";',
    'import type { Dataset } from "../../scripts/lib/load-data";',
    "",
    "export const generatedData = data as Dataset & { generatedAt: string };",
    "",
  ].join("\n"),
  "utf8",
);

for (const fileName of Object.keys(csvContracts)) {
  const source = readFileSync(join(root, "data", fileName));
  writeFileSync(join(publicDataDir, fileName), source);
}
writeFileSync(
  join(publicDataDir, "dataset-release.json"),
  readFileSync(join(root, "data", "dataset-release.json")),
);

writeFileSync(join(publicDataDir, "master-financing-records.csv"), createMasterCsv(dataset));

const zip = new JSZip();
for (const fileName of Object.keys(csvContracts)) {
  zip.file(fileName, readFileSync(join(root, "data", fileName)));
}
zip.file("dataset-release.json", readFileSync(join(root, "data", "dataset-release.json")));
zip.file("LICENSE-DATA", readFileSync(join(root, "LICENSE-DATA")));
const dictionaryPath = join(root, "docs", "data-dictionary.md");
try {
  zip.file("data-dictionary.md", readFileSync(dictionaryPath));
} catch {
  // The dictionary is added as soon as documentation is created.
}

async function finishBuild(): Promise<void> {
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  writeFileSync(join(publicDataDir, "meeyfo-hakesef-normalized.zip"), zipBuffer);

  const manifest = {
    version: dataset.release.version,
    releasedAt: dataset.release.releasedAt,
    counts: {
      parties: dataset.parties.length,
      financingRecords: dataset.financingRecords.length,
      persons: dataset.persons.length,
      organizations: dataset.organizations.length,
      sources: dataset.sources.length,
      profileChecks: dataset.profileChecks.length,
    },
    files: [
      "master-financing-records.csv",
      "meeyfo-hakesef-normalized.zip",
      ...Object.keys(csvContracts),
      "dataset-release.json",
    ],
  };
  writeFileSync(join(publicDataDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(
    `Built data release ${dataset.release.version}: ${dataset.parties.length} parties and ${dataset.financingRecords.length} records.`,
  );
}

finishBuild().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
