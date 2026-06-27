## v0.12.0-dev (27 Juni 2026)

- Update and improvement filter bar
- Reset input file when update is success
  - BAST Penyaluran Aset
  - Issues
- Create issue page and fetch based on NOT "B" condition
- Create issue button in Inventaris Asset
- Fix query filter Asset
- Fix call function in realtime and default items when role is unit

## v0.11.0-dev (15 Juni 2026)

- Create new page kir/unit
  - Filter assets in unit by location if exist
- Improvement global style in default layout

## v0.10.0-dev (13 Juni 2026)

- Fetch issue(s) from assets by kondisi not `B`
- Add catatan issue in Inventaris Aset: create, update and detail
- Unit Kerja allowed to update kondisi and catatan issue

## v0.9.0-dev (12 Juni 2026)

- Create initial printalb page for sticker
- KIR detail preview: create pagination with load more
- Disable delete button BAST when its done

## v0.8.0-dev (11 Juni 2026)

- Reset password user list 
- Improvement

## v0.7.0-dev (7 Juni 2026)

- Improvement
- Generate sticker by Unit and SPJ
- Rounded components
- Add new page: KIR (Kartu Inventaris Ruang)
  - Fetch Unit Kerja
  - Preview assets by Unit Kerja
- Fetch assets by tahun and BA date, then throw results to Printable Sticker
- Render assets from parent by filtered

## v0.6.2-dev (1 Juni 2026)

- Set and check KIB before insert new aset
- Display KIB in detail

## v0.6.1-dev (31  Mei 2026)

- TODO: insert KIB by a year: 0001, 0002,... and reset every next year: 0001...
- Revamp a lil bit UI
- Improvement

## v0.6.0-dev (30  Mei 2026)

- Re-organize nav Item
- Protect some button, pages and nav item when role != SARPRAS
- Add new pengaturan's page
- WIP: check and auto insert KIB when add new asset item

## v0.5.1-dev (29  Mei 2026)

- Add new dependency angka/tanggal terbilang for convert date to terbilang
- Create new composable: tanggalTerbilang
- Improvement

## v0.5.0-dev (24  Mei 2026)

- Add new dependency: compress image
- Improvement
- Compress file when Add new and edit asset

## v0.4.1-dev (23  Mei 2026)

- Bug fix: duplicate composable

## v0.4-dev (23  Mei 2026)

- New component: FilterBar for BAST
- New composable: Filter BAST
- New layout printable for BAST Penyaluran Aset
- BAST Penyaluran Aset, more readable and interactive:
  - Filtering
  - List view
  - Print
  - Edit
  - Create new
  - Upload archive
- Separate BAST: Penyaluran Aset and other
- New issue page (soon)
- Remove component BASarpras

## v0.3-dev (20  Mei 2026)

- Switch display type: List / Grid (Inventaris Aset)
- Update and add some lines of global style
- Add new member of Nav Item

## v0.2-dev (15 Mei 2026)

- Display image if exist
- Fix and improve validation
- New image placeholder
- New pages

## v0.1.2-dev (13 Mei 2026)
- Fix multiple filter
- Create new composable for more flexibility multiple filter
- Add plugin multiple select

## v0.1.1-dev (12 Mei 2026)

- ⚠️ BUG ALERT! FIX LATER!
  - filter by YEAR+TW+SUMBER (#a144d07)[https://github.com/HilmiZul/sarpras/commit/a144d070e7ea09d65b91dd1a0e27a602bc5a136d]

## v0.1.0-dev (9 Mei 2026)

- init project
- ...
