import { getCliClient } from "sanity/cli";

// Field-only, idempotent migration: preserve every existing editorial value and
// all unrelated draft work. Do not publish the whole home document.
const client = getCliClient({ apiVersion: "2025-01-01" });
async function main() {
  const documents = await client.fetch<
    Array<{
      _id: string;
      _rev: string;
      floorPlans?: {
        floors?: Array<{
          _key: string;
          configurations?: Array<{
            _key: string;
            levelLabel?: string;
            informationNote?: string;
          }>;
        }>;
      };
    }>
  >('*[_id in ["homePage", "drafts.homePage"]]{_id,_rev,floorPlans}');
  for (const document of documents) {
    const missing: Record<string, string> = {};
    for (const floor of document.floorPlans?.floors ?? []) {
      for (const configuration of floor.configurations ?? []) {
        if (
          configuration.levelLabel !== "Mezzanine" ||
          configuration.informationNote
        )
          continue;
        const path = `floorPlans.floors[_key==${JSON.stringify(floor._key)}].configurations[_key==${JSON.stringify(configuration._key)}].informationNote`;
        missing[path] =
          "This mezzanine is independently rentable. Room and seating schedules are not included in the source study.";
      }
    }
    if (Object.keys(missing).length)
      await client
        .patch(document._id)
        .ifRevisionId(document._rev)
        .setIfMissing(missing)
        .commit();
    console.log(
      `${document._id}: populated ${Object.keys(missing).length} missing information notes`,
    );
  }
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
