/***********************
 * Date-only utilities (no timezone drift)
 ***********************/
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function isoToDayNum(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / MS_PER_DAY);
}

function dayNumToUTCDate(dayNum) {
  return new Date(dayNum * MS_PER_DAY);
}

function formatUTC(dayNum) {
  return dayNumToUTCDate(dayNum).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function localTodayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/***********************
 * Moon rule (your correction)
 ***********************/
const FULL_MOON_THRESHOLD = 0.98; // 98% illumination minimum

// Cache illumination computations (performance)
const illumCache = new Map();

/**
 * Returns the maximum moon illumination fraction for the given civil day (UTC day).
 * We sample hourly across that day to approximate “closest to 100% illumination”.
 */
function maxIlluminationForDay(dayNum) {
  if (illumCache.has(dayNum)) return illumCache.get(dayNum);

  let max = 0;
  const baseMs = dayNum * MS_PER_DAY;

  for (let hour = 0; hour < 24; hour++) {
    const t = new Date(baseMs + hour * 60 * 60 * 1000);
    const frac = SunCalc.getMoonIllumination(t).fraction; // 0..1
    if (frac > max) max = frac;
  }

  illumCache.set(dayNum, max);
  return max;
}

/**
 * Decide month length using your logic:
 * - Evaluate Scriptural Day 29 and Day 30 (relative to month start).
 * - Full moon is when max illumination >= 98%.
 *
 * Interpretation to match your text:
 * - If Day 29 is full (>=98%):
 *    - and Day 30 is also full (>=98%): month can still have Day 30
 *    - else: month ends on Day 29
 * - If Day 29 is NOT full: month must have Day 30 (try to reach full there)
 */
function decideMonthLengthAndFullMoonDay(startDayNum) {
  const day29Civil = startDayNum + 28; // scriptural day 29 starts at dawn of this civil day
  const day30Civil = startDayNum + 29;

  const i29 = maxIlluminationForDay(day29Civil);
  const i30 = maxIlluminationForDay(day30Civil);

  // Case: full moon reached on Day 29
  if (i29 >= FULL_MOON_THRESHOLD) {
    // If still "full" on Day 30 too, allow a 30th day to exist after the full moon day
    if (i30 >= FULL_MOON_THRESHOLD) {
      return {
        monthLength: 30,
        fullMoonDayInMonth: 29, // full moon on day 29, then "30th day still"
        debug: { i29, i30 }
      };
    }
    // Otherwise month ends at 29
    return {
      monthLength: 29,
      fullMoonDayInMonth: 29,
      debug: { i29, i30 }
    };
  }

  // Case: Day 29 not full -> month must have Day 30
  // Full moon marker becomes Day 30 if it reaches threshold; otherwise it's still the closest day.
  return {
    monthLength: 30,
    fullMoonDayInMonth: (i30 >= i29 ? 30 : 29),
    debug: { i29, i30 }
  };
}

/***********************
 * Build scriptural calendar from an anchor
 ***********************/

// Your declared anchor from the print:
const ANCHOR = {
  scripturalYear: 2026,
  abib1Iso: "2026-05-02" // Pagan May 2 = Scriptural 1st day of 1st month
};

// Build N months forward (functional MVP)
const MONTHS_TO_GENERATE = 15;

let generatedMonths = []; // each: {year, month, startDayNum, length, fullMoonDayInMonth}

function buildFromAnchor() {
  generatedMonths = [];

  let startDayNum = isoToDayNum(ANCHOR.abib1Iso);
  let month = 1;

  for (let i = 0; i < MONTHS_TO_GENERATE; i++) {
    const { monthLength, fullMoonDayInMonth } = decideMonthLengthAndFullMoonDay(startDayNum);

    generatedMonths.push({
      scripturalYear: ANCHOR.scripturalYear, // MVP: keep same label; we can add year-rollover later
      month,
      startDayNum,
      length: monthLength,
      fullMoonDayInMonth
    });

    startDayNum = startDayNum + monthLength; // next month begins next dawn after day 29/30 ends
    month++;
  }
}

function findMonthForDay(dayNum) {
  // Find the latest month whose startDayNum <= dayNum
  for (let i = generatedMonths.length - 1; i >= 0; i--) {
    const m = generatedMonths[i];
    if (dayNum >= m.startDayNum) return m;
  }
  return null;
}

/***********************
 * Convert input date -> Scriptural date
 ***********************/
function convertToScriptural(isoDate) {
  const dayNum = isoToDayNum(isoDate);

  const m = findMonthForDay(dayNum);
  if (!m) return { error: "Date is before the supported generated range." };

  const dayInMonth = (dayNum - m.startDayNum) + 1;
  if (dayInMonth < 1 || dayInMonth > m.length) {
    return { error: "Date falls outside computed month bounds (data issue)." };
  }

  const specialDays = [];

  // New Moon Day (Day 1 of the month) begins at dawn of this pagan day
  if (dayInMonth === 1) {
    specialDays.push({ text: "New Moon Day (Month Day 1) — begins at dawn", type: "new-moon" });
  }

  // Full Moon marker (>=98% illumination rule)
  if (dayInMonth === m.fullMoonDayInMonth) {
    specialDays.push({ text: "Full Moon marker (≥98% illumination)", type: "feast" });
  }

  // Weekly Shabbats (lunar count): 8, 15, 22, 29
  if ([8, 15, 22, 29].includes(dayInMonth)) {
    specialDays.push({ text: "Shabbat (Weekly Shabbat)", type: "sabbath" });
  }

  // Feasts (same as before, based on appointed days)
  if (m.month === 1) {
    if (dayInMonth === 14) specialDays.push({ text: "Pesach — begins at sunset of this day", type: "feast" });
    if (dayInMonth >= 15 && dayInMonth <= 21) {
      specialDays.push({ text: "Chag HaMatzot (Unleavened Bread)", type: "feast" });
      if (dayInMonth === 15 || dayInMonth === 21) {
        specialDays.push({ text: "High Sabbath (no servile work)", type: "sabbath" });
      }
    }
    if (dayInMonth === 16) specialDays.push({ text: "Yom HaBikkurim (First Fruits)", type: "feast" });
  }

  if (m.month === 7) {
    if (dayInMonth === 1) {
      specialDays.push({ text: "Yom Teruah — High Sabbath", type: "feast" });
      specialDays.push({ text: "High Sabbath (no servile work)", type: "sabbath" });
    }
    if (dayInMonth === 10) {
      specialDays.push({ text: "Yom Kippur — High Sabbath", type: "feast" });
      specialDays.push({ text: "High Sabbath (no servile work)", type: "sabbath" });
    }
    if (dayInMonth >= 15 && dayInMonth <= 21) {
      specialDays.push({ text: "Sukkot (Feast of Booths)", type: "feast" });
      if (dayInMonth === 15) {
        specialDays.push({ text: "High Sabbath (no servile work)", type: "sabbath" });
      }
    }
    if (dayInMonth === 22) {
      specialDays.push({ text: "Shemini Atzeret — High Sabbath", type: "feast" });
      specialDays.push({ text: "High Sabbath (no servile work)", type: "sabbath" });
    }
  }

  return {
    paganPretty: formatUTC(dayNum),
    scripturalYear: m.scripturalYear,
    scripturalMonth: m.month,
    scripturalDay: dayInMonth,
    monthLength: m.length,
    specialDays
  };
}

/***********************
 * UI
 ***********************/
function displayCalendar() {
  const iso = document.getElementById("gregorianDate").value;

  const resultsDiv = document.getElementById("results");
  const paganDateSpan = document.getElementById("paganDate");
  const scripturalYearSpan = document.getElementById("scripturalYear");
  const scripturalMonthSpan = document.getElementById("scripturalMonth");
  const scripturalDaySpan = document.getElementById("scripturalDay");
  const monthLengthSpan = document.getElementById("monthLength");
  const specialDaysDiv = document.getElementById("specialDays");

  specialDaysDiv.innerHTML = "";
  resultsDiv.style.display = "none";

  if (!iso) {
    alert("Please select a date.");
    return;
  }

  const r = convertToScriptural(iso);
  if (r.error) {
    alert(r.error);
    return;
  }

  resultsDiv.style.display = "block";
  paganDateSpan.textContent = r.paganPretty;
  scripturalYearSpan.textContent = r.scripturalYear;
  scripturalMonthSpan.textContent = r.scripturalMonth;
  scripturalDaySpan.textContent = r.scripturalDay;
  monthLengthSpan.textContent = r.monthLength;

  if (r.specialDays.length === 0) {
    specialDaysDiv.textContent = "No special days today.";
    return;
  }

  for (const item of r.specialDays) {
    const span = document.createElement("span");
    span.textContent = item.text;

    if (item.type === "new-moon") span.classList.add("new-moon");
    if (item.type === "sabbath") span.classList.add("sabbath");
    if (item.type === "feast") span.classList.add("feast");

    specialDaysDiv.appendChild(span);
  }
}

// Build calendar once, then run UI
window.addEventListener("load", () => {
  buildFromAnchor();
  document.getElementById("gregorianDate").value = localTodayISO();
  displayCalendar();
});