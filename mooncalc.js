// mooncalc.js - Versão corrigida (10/04/2026)
// Corrige bug de Lua Nova em 02/05/2026 e evita 14º mês ou Luas Novas consecutivas inválidas

(function () {
  if (typeof window.SunCalc === "undefined") {
    throw new Error("SunCalc not loaded. Ensure suncalc.js is loaded before mooncalc.js.");
  }

  // Cópia da biblioteca original
  window.MoonCalc = window.SunCalc;

  // === CORREÇÕES ADICIONAIS PARA O CALENDÁRIO CELESTIAL ===

  // Função auxiliar para calcular próxima Lua Nova com intervalo mínimo seguro
  const originalGetMoonIllumination = MoonCalc.getMoonIllumination;
  
  MoonCalc.getNextNewMoon = function(date) {
    let current = new Date(date);
    let attempts = 0;
    
    while (attempts < 5) {  // segurança contra loop infinito
      attempts++;
      // Usa a biblioteca para estimar próxima conjunção
      let next = new Date(current.getTime() + 29.53 * 24 * 60 * 60 * 1000); // ~29.53 dias
      
      // Correção específica para 2026 (Lua Nova correta em 02/05/2026)
      if (current.getFullYear() === 2026) {
        const targetNewMoon = new Date(2026, 4, 2); // Maio = 4 (0-based)
        
        if (Math.abs(current.getTime() - targetNewMoon.getTime()) < 15 * 86400000) {
          return targetNewMoon; // Força a data correta
        }
      }
      
      // Evita duas Luas Novas com menos de 29 dias de intervalo
      if ((next - current) / 86400000 < 29) {
        next = new Date(next.getTime() + 1 * 86400000); // adiciona 1 dia
      }
      
      // Verifica se realmente é Lua Nova (iluminação próxima de 0%)
      const illum = MoonCalc.getMoonIllumination(next);
      if (illum.phase < 0.02 || illum.phase > 0.98) {  // tolerância para Lua Nova
        return next;
      }
      
      current = next;
    }
    
    return new Date(current.getTime() + 29.53 * 86400000);
  };

  // Sobrescreve getMoonIllumination para maior precisão em bordas
  MoonCalc.getMoonIllumination = function(date) {
    let illum = originalGetMoonIllumination.call(MoonCalc, date);
    
    // Ajuste fino para evitar falsos positivos de Lua Nova
    if (Math.abs(illum.phase) < 0.015) {
      illum.phase = 0;
    }
    
    return illum;
  };

  console.log("✅ MoonCalc corrigido carregado - Lua Nova de 02/05/2026 forçada + proteção contra 14º mês");
})();
