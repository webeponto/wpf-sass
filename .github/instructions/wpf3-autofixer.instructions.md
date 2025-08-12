---
applyTo: '**'
---

# 🔧 WPF3 AutoFixer - Metodologias de Diagnóstico e Resolução

## 🎯 **Protocolo de Diagnóstico WPF3**

### � **REGRA ABSOLUTA DE RESTART DO ENGINE:**
**SEMPRE que modificar `render.js`:**
1. **✅ Matar TODOS os processos Node.js**: `taskkill /F /IM node.exe`
2. **✅ Reiniciar engine completamente**: `node resources/js/panel/wpf/dynamic/render.js`
3. **✅ Aguardar regeneração**: Verificar timestamp dos arquivos de saída
4. **✅ Validar resultado**: Só então verificar se as mudanças surtiram efeito

**❌ NUNCA assumir** que mudanças no `render.js` entram em vigor automaticamente!

### 🔧 **Técnicas de Debugging Melhoradas:**
- **Verificar arquivos de debug primeiro:** `wpf-classes-debug.txt` mostra classes detectadas
- **Testar detecção antes de geração:** Se classe não aparece no debug, problema é detecção
- **Usar arquivos de teste específicos:** Criar casos isolados em `resources/test/`
- **Validar timestamps:** Verificar se arquivos foram realmente atualizados
- **Testing progressivo:** Testar uma mudança por vez, não múltiplas

### 🎯 **Padrões de Frameworks Suportados:**
- **HTML Padrão:** `class="..."`
- **React/JSX:** `className="..."`
- **Alpine.js:** `x-bind:class="..."`, `x-class="..."`
- **Vue.js:** `:class="..."`, `v-bind:class="..."`
- **Data Attributes:** `data-class="..."`

### 🔄 **Processo de Validação Completa:**
1. **Criar arquivo de teste** em diretório monitorado
2. **Verificar detecção** em `wpf-classes-debug.txt`
3. **Verificar geração** em `wpf-dynamic.scss`
4. **Testar no navegador** para confirmação final
5. **Limpar arquivos de teste** após validação

---

## 📝 **Metodologia de Correção Sistemática:**

### 🔍 **Ordem de Investigação Recomendada:**
1. **Classes detectadas?** → Verificar `wpf-classes-debug.txt`
2. **CSS gerado?** → Verificar `wpf-dynamic.scss`
3. **Engine rodando?** → `tasklist | findstr node`
4. **Diretório monitorado?** → Verificar `directoriesToWatch` no YAML
5. **Syntax válido?** → Inspecionar seletores CSS visualmente

### 🛠️ **Passos de Correção:**
1. ✅ **Identificar padrão incorreto** no CSS gerado
2. 🔄 **Analisar configuração** de diretórios monitorados
3. 🔄 **Verificar localização** de arquivos de teste
4. 🔄 **Analisar função correspondente** em `render.js`
5. 🛠️ **Corrigir lógica específica**
6. 🚨 **RESTART OBRIGATÓRIO** do engine
7. ✅ **Validar sintaxe CSS** gerada
8. ✅ **Testar funcionamento** no navegador
9. 📋 **Documentar solução** para referência futura

### 🔧 **Localização dos Arquivos Críticos:**
- **Engine Principal:** `resources/js/panel/wpf/dynamic/render.js`
- **Configuração:** `resources/js/panel/wpf/dynamic/wpf.config.yaml`
- **CSS Gerado:** `resources/scss/panel/wpf/vendor/dynamic/wpf-dynamic.scss`
- **Debug Classes:** `wpf-classes-debug.txt` (gerado automaticamente)

---

## 🎯 **Regras de Ouro para Debugging WPF3:**

### 🚨 **SEMPRE FAZER:**
- **Restart engine** após mudanças no `render.js`
- **Verificar timestamps** de arquivos gerados
- **Testar em diretórios monitorados**
- **Validar CSS syntax** visualmente
- **Documentar descobertas** no AutoFixer

### ❌ **NUNCA FAZER:**
- **Assumir que mudanças** entram em vigor automaticamente
- **Esquecer do ponto inicial** em seletores CSS (`.classe`)
- **Testar fora dos diretórios** configurados
- **Ignorar arquivos de debug** para diagnosis
- **Fazer múltiplas mudanças** simultâneas sem testar

### 🎯 **Comandos Úteis para Diagnosis:**
```bash
# Verificar processos Node.js rodando
tasklist | findstr node

# Matar todos os processos Node.js
taskkill /F /IM node.exe

# Iniciar engine WPF3
node resources/js/panel/wpf/dynamic/render.js

# Compilar SCSS
npm run sass:build

# Build completo
npm run dev
```

### 🔍 **Arquivos para Investigação:**
- **Engine Core:** `render.js` - Funções `extractClasses`, `generateContextualCSS`
- **Patterns:** `wpf.config.yaml` - Seções `patterns` e `contextPatterns`
- **Debug Output:** `wpf-classes-debug.txt` - Classes detectadas pelo engine
- **CSS Output:** `wpf-dynamic.scss` - CSS gerado automaticamente

### 📋 **Checklist de Validação:**
- [ ] Engine WPF3 está rodando corretamente
- [ ] Arquivos de teste estão em diretórios monitorados
- [ ] Classes aparecem em `wpf-classes-debug.txt`
- [ ] CSS é gerado em `wpf-dynamic.scss`
- [ ] Seletores CSS têm sintaxe válida (com ponto inicial)
- [ ] Classes funcionam no navegador
- [ ] Timestamps dos arquivos foram atualizados

---

**� Referência Rápida:** Este documento contém metodologias genéricas para resolução de problemas no WPF3. Para casos específicos, aplicar estas metodologias sistematicamente para identificar e corrigir issues.

---

## ♻️ Padrões de Refatoração e Consolidação (WPF3 YAML)

Para manter `wpf.config.yaml` enxuto e fácil de editar, consolide padrões semelhantes APENAS quando não requerem propriedades CSS diferentes. **REGRA CRÍTICA**: render.js faz apenas substituição de strings simples - não processa condicionais SCSS como `#{if()}`.

### 🚨 **REGRAS DE CONSOLIDAÇÃO:**

**✅ PODE consolidar quando:**
- Mesmo tipo de propriedade CSS (ex: `direction: ltr` vs `direction: rtl`)
- Valores diretos capturados pelo regex (ex: `$1` já é o valor correto)
- Exemplo: `^(ltr|rtl)$` → `direction: $1`

**❌ NÃO consolidar quando:**
- Propriedades CSS diferentes (ex: `row-gap` vs `column-gap`)
- Valores precisam de transformação (ex: `col` → `column` no grid-auto-flow)
- Estruturas condicionais complexas

### 📝 **Abordagens Corretas:**

**Simples (Valores Diretos):**
```yaml
direction:
  regex: '^(ltr|rtl)$'
  cssTemplate: "{selector} { direction: $1; }"
```

**Propriedades Diferentes (Manter Separado):**
```yaml
gap-row-alias:
  regex: '^gap-r-(-?\d*\.?\d+)(px|em|rem|%)$'
  cssTemplate: "{selector} { row-gap: $1$2; }"

gap-col-alias:
  regex: '^gap-c-(-?\d*\.?\d+)(px|em|rem|%)$'
  cssTemplate: "{selector} { column-gap: $1$2; }"
```

**Valores com Transformação (Manter Separado):**
```yaml
grid-flow-col:
  regex: '^flow-col$'
  cssTemplate: "{selector} { grid-auto-flow: column; }"

grid-flow-dense-row:
  regex: '^flow-dense-row$'
  cssTemplate: "{selector} { grid-auto-flow: row dense; }"
```

### 🔍 **Validação Pós-Refatoração:**
1. **Engine carrega sem erros**: Contagem de padrões aumenta corretamente
2. **CSS válido gerado**: Sem `#{if()}` no output final
3. **Propriedades corretas**: `row-gap`, `column-gap`, etc. aparecem corretamente
4. **Teste funcional**: Classes funcionam no navegador

### 📊 **Métricas de Qualidade:**
- **Antes da correção**: 119 padrões, CSS com `#{if(c=='r','row-gap','column-gap')}`
- **Após correção**: 128 padrões, CSS limpo: `.gap-c-10px { column-gap: 10px; }`

**Prioridade**: Funcionalidade > Consolidação. Melhor ter padrões separados funcionais que consolidados quebrados.
