"""Validate and export the public aggregate benchmark catalog."""

from __future__ import annotations

import csv
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "results" / "public-benchmark-catalog.json"
CSV_PATH = ROOT / "results" / "primary-comparisons.csv"
PAGES_DATA = ROOT / "docs" / "data" / "public-benchmark-catalog.json"


def load_catalog(path: Path = CATALOG) -> dict:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def validate(data: dict) -> list[str]:
    errors: list[str] = []
    if data.get("schema_version") != "mat-nexus-public-benchmark-catalog-v1":
        errors.append("unsupported schema_version")

    seen: set[str] = set()
    allowed = {"GAIN", "LOSS", "INCONCLUSIVE"}
    for row in data.get("primary_comparisons", []):
        row_id = row.get("id")
        if not row_id or row_id in seen:
            errors.append(f"duplicate or missing id: {row_id!r}")
        seen.add(row_id)
        count = row.get("questions", 0)
        raw = row.get("raw_correct", -1)
        nexus = row.get("nexus_correct", -1)
        if not isinstance(count, int) or count <= 0:
            errors.append(f"{row_id}: invalid question count")
        if not (0 <= raw <= count and 0 <= nexus <= count):
            errors.append(f"{row_id}: score outside [0, questions]")
        if row.get("classification") not in allowed:
            errors.append(f"{row_id}: invalid classification")
        if row.get("evidence_status") not in {"AUDITED", "AUDITED_SMALL_SAMPLE"}:
            errors.append(f"{row_id}: primary comparison is not audited")
        if not row.get("report_sha256") or len(row["report_sha256"]) != 64:
            errors.append(f"{row_id}: missing report hash")

    excluded_ids = {row.get("id") for row in data.get("excluded_campaigns", [])}
    if seen & excluded_ids:
        errors.append("excluded campaign appears in primary comparisons")
    return errors


def write_csv(data: dict, path: Path = CSV_PATH) -> None:
    fields = [
        "id", "campaign_id", "model", "domain", "questions", "raw_correct",
        "nexus_correct", "wins", "losses", "classification",
        "two_sided_exact_p_value", "evidence_status",
    ]
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        for row in data["primary_comparisons"]:
            writer.writerow({field: row.get(field) for field in fields})


def write_pages_data(data: dict, path: Path = PAGES_DATA) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    # Pages serves the exact same audited artifact as the reusable catalog.
    # Byte-for-byte identity makes drift detectable with a single SHA-256.
    path.write_bytes(CATALOG.read_bytes())


def main() -> int:
    data = load_catalog()
    errors = validate(data)
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1
    write_csv(data)
    write_pages_data(data)
    print(
        "PASS: "
        f"{len(data['primary_comparisons'])} primary, "
        f"{len(data['diagnostic_campaigns'])} diagnostic, "
        f"{len(data['excluded_campaigns'])} excluded"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
