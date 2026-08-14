# HEBREW CALENDAR ANALYSIS - DETAILED RESEARCH
# Reference Date: May 15, 2026 (Gregorian)
# Branch: feature/hebrew-calendar-shemitah-jubilee

## 1. HEBREW YEAR CALCULATION (Anno Mundi - AM)

### Formula:
Hebrew Year = Gregorian Year + 3760 (approximate offset from Jewish tradition)

### For May 15, 2026:
- Hebrew Year = 2026 + 3760 = 5786
- Note: Hebrew year begins in Tishrei (Sept/Oct)
- May 2026 falls in Hebrew Year 5786 (which runs from Oct 2025 to Sep 2026)

---

## 2. SHEMITAH CYCLE (7-YEAR SABBATICAL)

### Biblical Basis:
- Leviticus 25:1-7 - The land must rest every 7th year
- Exodus 23:10-11 - Field shall rest and lie fallow
- Deuteronomy 15:1-11 - Debts cancelled in Shemitah year

### Calculation Method:
- Shemitah Year = Hebrew Year mod 7
- If result = 1, it's a Shemitah year
- Some traditions use different baselines

### Known Shemitah Years (Rabbinic Tradition):
- 5769 (2008-2009) - Shemitah
- 5776 (2015-2016) - Shemitah
- 5783 (2022-2023) - Shemitah
- 5790 (2029-2030) - Next Shemitah

### For May 15, 2026 (Year 5786):
- 5786 mod 7 = 5786 - (5786 ÷ 7 × 7)
- 5786 ÷ 7 = 826.57... → 826 × 7 = 5782
- 5786 - 5782 = 4
- Result: Year 4 of Shemitah cycle
- Status: REGULAR YEAR (Planting allowed)

### Shemitah Cycle Breakdown:
Year 1 (Year after Shemitah): Planting
Year 2: Planting & Growth
Year 3: Planting & Growth
Year 4: Planting & Growth ← **We are here (5786)**
Year 5: Planting & Growth
Year 6: Planting & Growth
Year 7: SHEMITAH - Rest & Spontaneous Growth

---

## 3. JUBILEE CYCLE (50-YEAR CYCLE)

### Biblical Basis:
- Leviticus 25:8-55 - Seven sabbaths = 49 years, then Jubilee
- Leviticus 25:10 - Proclaim liberty throughout the land
- Isaiah 61:1-2 - Year of Jubilee restoration

### Calculation Method:
- Jubilee Year = (Hebrew Year) mod 50
- If result = 0 (or 50), it's a Jubilee year

### For May 15, 2026 (Year 5786):
- 5786 mod 50 = 5786 - (5786 ÷ 50 × 50)
- 5786 ÷ 50 = 115.72 → 115 × 50 = 5750
- 5786 - 5750 = 36
- Result: Year 36 of Jubilee cycle
- Status: REGULAR YEAR (Not Jubilee)

### Recent Jubilee History:
- 5750 (1989-1990) - Previous Jubilee
- 5800 (2039-2040) - Next Jubilee
- Gap: 50 years between Jubilees

---

## 4. ETHIOPIAN BIBLE (GE'EZ) CONSIDERATIONS

### Key Points:
- Ethiopian Orthodox tradition follows Septuagint chronology
- Anno Mundi calculations may differ slightly from Rabbinic tradition
- Ethiopian calendar also uses different year count (Amharic calendar)
- For our purposes, we use traditional Hebrew calendar (Rabbinic)

### Integration:
- Reference Ethiopian Bible for verification
- Use Septuagint-based calculations as secondary verification
- Primary calculation: Rabbinic Hebrew calendar tradition

---

## 5. AGRICULTURAL STATUS FOR MAY 15, 2026

### Summary:
| Parameter | Value | Status |
|-----------|-------|--------|
| Hebrew Year | 5786 | Normal |
| Shemitah Cycle | Year 4 of 7 | Regular Year |
| Jubilee Cycle | Year 36 of 50 | Regular Year |
| Land Status | PLANTING ALLOWED | ✓ Plant crops |
| Debts | Normal | Debts not cancelled |
| Slaves | Normal | Normal laws apply |

### Period Duration:
- Current Shemitah Year 4 ends: September 2026
- Current Jubilee Cycle ends: August 2039
- Next Shemitah: September 2029 - September 2030

---

## 6. FEAST INTEGRATION NOTES

### Consistency with Existing Code:
- Sunrise/Dawn timing: Matches existing "at dawn" logic
- Sunset timing: Matches existing Pesach & Yom Kippur logic
- Shabbat timing: Extends existing Shabbat logic

### New Code Structure:
```javascript
// Land Cycle Calculation
const hebrewYear = gregorianYear + 3760;
const shemitahYear = hebrewYear % 7;  // 1-7 range (1 = Shemitah year)
const jubileeYear = hebrewYear % 50;  // 1-50 range (50 = Jubilee year)

const landStatus = {
  hebrewYear: hebrewYear,
  shemitahCycle: shemitahYear,
  jubileeCycle: jubileeYear,
  isShmitah: shemitahYear === 1,
  isJubilee: jubileeYear === 0 || jubileeYear === 50,
  canPlant: !(shemitahYear === 1 || jubileeYear === 0),
  biblicalRef: "Leviticus 25"
};
```

---

## 7. IMPLEMENTATION PLAN (NO COMMITS YET)

### Step 1: Add JavaScript Functions
- `calculateHebrewYear(gregorianDate)`
- `getShemitahStatus(hebrewYear)`
- `getJubileeStatus(hebrewYear)`
- `getLandStatus(gregorianDate)`

### Step 2: Add HTML Display Section
- New card: "Land Cycle Status"
- Show: Hebrew Year, Shemitah/Jubilee status, Agricultural permissions
- Display: Biblical reference

### Step 3: Integrate with Calendar
- Show land status on all date conversions
- Highlight Shemitah & Jubilee years
- Add biblical references

### Step 4: Testing (No Commits)
- Visual verification before any merge
- Cross-check calculations
- Verify feast logic consistency

---

## VERIFICATION REQUIRED BEFORE MERGE:
- [ ] Hebrew year calculations accurate
- [ ] Shemitah cycle correct
- [ ] Jubilee cycle correct
- [ ] UI displays correctly
- [ ] No conflicts with existing feast logic
- [ ] All languages display properly

Status: **AWAITING VISUAL VERIFICATION**
