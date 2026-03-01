// mooncalc.js
// mooncalc.org-style usage name: expose the astronomy engine as "MoonCalc".
// We load SunCalc from CDN in index.html, then alias it here.
(function () {
  if (typeof window.SunCalc === "undefined") {
    throw new Error("SunCalc not loaded. Ensure suncalc.js is loaded before mooncalc.js.");
  }
  window.MoonCalc = window.SunCalc;
})();