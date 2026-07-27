import { csvContracts, loadDataset } from "./lib/load-data";
import { validateDataset, validateHeaderPrivacy } from "./lib/validate-dataset";

try {
  const dataset = loadDataset();
  const errors = [...validateDataset(dataset), ...validateHeaderPrivacy(csvContracts)];

  if (errors.length > 0) {
    console.error("Data validation failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(
    `Data valid: ${dataset.parties.length} parties, ${dataset.financingRecords.length} financing records, ${dataset.sources.length} sources.`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
