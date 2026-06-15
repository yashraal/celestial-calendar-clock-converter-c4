# Análise do Calendário Hebraico: Shemitah e Jubileu
## Status: EM ELABORAÇÃO - Aguardando Verificação Visual

### Objetivos desta Análise:
1. Determinar o ano correto do calendário hebraico (não gregoriano)
2. Identificar o ano de Shemitah (7º ano - descanso da terra)
3. Identificar o ano de Jubileu (50º ano)
4. Indicar se é tempo de plantar ou descansar a terra
5. Integrar esta lógica no calendário da aplicação

### Fontes Bíblicas Relevantes:
- **Shemitah (Sábado da Terra)**: Êxodo 23:10-11, Levítico 25:1-7, Deuteronômio 15:1-11
- **Jubileu**: Levítico 25:8-55
- **Bíblia Etíope (Ge'ez)**: Referência canônica para cálculos

### Cronologia da Bíblia Etíope:
A Bíblia Etíope segue a tradição de Septuaginta com algumas variações.
Referências de datas importantes:
- Era no calendário etíope (AM - Anno Mundi)
- Conversão para anos gregoriano/escritural

### PESQUISA EM PROGRESSO:

#### 1. Determinação do Ano Atual
- Data de referência: 15 de maio de 2026 (gregoriano)
- Cálculo do ano no calendário escritural
- Verificação contra tradições hebraicas

#### 2. Shemitah (Anos de Descanso):
- Ciclo de 7 anos
- Anos conhecidos de Shemitah (baseado em tradição rabínica):
  - 5783 AM (2023): Shemitah
  - 5790 AM (2030): Próximo Shemitah
  
#### 3. Jubileu:
- Ciclo de 50 anos (7 Shemitahs + 1)
- Último Jubileu confirmado
- Próximo Jubileu esperado

#### 4. Implicações Agrícolas:
**Anos de Shemitah:**
- Terra em descanso
- Sem plantio comercial
- Colheita espontânea permitida
- Perdão de dívidas

**Anos normais (não-Shemitah):**
- Plantio e colheita normais
- Cultivo da terra

**Anos de Jubileu:**
- Descanso dobrado (como Shemitah)
- Retorno de terras
- Libertação de escravos
- Celebração especial

---

## IMPLEMENTAÇÃO PLANEJADA:

### Estrutura de Dados a Adicionar:
```javascript
const hebrewCalendarInfo = {
  currentHebrewYear: XXXXX,
  yearInCycle: X,
  isShmitah: boolean,
  isJubilee: boolean,
  landStatus: "planting" | "resting" | "jubilee",
  cycleDescription: string,
  biblicalReference: string
};
```

### Mudanças no HTML:
- Nova seção: "Land Cycle Status" / "Status do Ciclo da Terra"
- Indicador visual do estado (plantio/descanso/jubileu)
- Referências bíblicas

### Mudanças no JavaScript:
- Função para calcular o ano hebraico
- Função para determinar Shemitah
- Função para determinar Jubileu
- Integração com sistema de festas existente

---

## PRÓXIMOS PASSOS (Aguardando Verificação):
1. ✅ Criar branch feature isolada
2. ⏳ Confirmação dos cálculos de ano hebraico
3. ⏳ Implementação da lógica no código
4. ⏳ Testes visuais
5. ⏳ Merge apenas após aprovação visual

---

**STATUS ATUAL**: Aguardando análise detalhada e verificação visual antes de qualquer implementação

