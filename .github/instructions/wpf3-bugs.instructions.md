---
applyTo: '**'
---
WPF3 Bug Tracking and Resolution Guidelines

# 🐛 BUG #001: Classes Contextuais dp-flex Gerando CSS Incorreto

## 📋 Descrição do Problema
- **Descoberto em**: Inspetor de elementos do site em produção
- **Sintoma**: Classes contextuais não estão sendo geradas corretamente
- **Área Afetada**: Sistema de classes contextuais, especificamente `dp-flex`
- **Impacto**: Quebra de funcionalidade em layouts flexbox contextuais

## 🔍 Análise Comparativa WPF2 vs WPF3

### WPF2 (Funcionamento Perfeito - Arcaico mas Funcional)
- **Localização**: `resources/scss/site/wpf/vendor/_wpf.scss`
- **Método**: Classes contextuais geradas manualmente via SCSS
- **Status**: ✅ Funciona perfeitamente, mas não otimizado

### WPF3 (Funcionalidade Quebrada - Necessita Correção)
- **Engine**: `resources/js/panel/wpf/dynamic/render.js` - Função `generateContextualCSS()`
- **Config**: `resources/js/panel/wpf/dynamic/wpf.config.yaml` - Seção `contextPatterns`
- **Status**: ❌ Gerando CSS incorreto

## 🎯 Objetivos da Correção
1. **Estudar minuciosamente** o funcionamento das classes contextuais no WPF2
2. **Identificar discrepâncias** entre WPF2 e WPF3
3. **Corrigir o algoritmo** de geração contextual no render.js
4. **Validar configuração** contextPatterns no YAML
5. **Testar extensively** com casos reais das views anexadas

## 🔧 Arquivos para Investigação Detalhada
- `_wpf.scss` (linhas das classes contextuais dp-flex)
- `render.js` (função generateContextualCSS e relacionadas)
- `wpf.config.yaml` (seção contextPatterns > flex-context)
- Views anexadas (casos de uso reais)

## 📝 Status da Investigação
- [x] ✅ Análise completa do funcionamento WPF2  
- [x] ✅ Identificação da falha específica no WPF3
- [x] ✅ Desenvolvimento da correção
- [x] ✅ Testes com casos reais  
- [x] ✅ Validação final

## 🔧 **SOLUÇÃO IMPLEMENTADA**

### **Problema Identificado:**
1. **❌ Seletor Incorreto no YAML**: `".$mediator .$prop, .$mediator.$prop"` gerava `.row .v-center, .row.v-center` (sem classe base `.dp-flex`)
2. **❌ Lógica de Substituição**: A substituição `&` não estava sendo usada corretamente

### **Correção Aplicada:**
1. **✅ Seletor Corrigido**: `"&.$mediator.$prop"` agora gera `.dp-flex.row.v-center` (com classe base)
2. **✅ Lógica dos Eixos Mantida**: Row/Col + v/h funcionando corretamente
3. **✅ Escape de Caracteres**: Funcionando perfeitamente

### **Arquivos Alterados:**
- ✅ `wpf.config.yaml` - Seção `contextPatterns > flex-context > properties`
- ✅ Todas as propriedades atualizadas: `v-top`, `v-center`, `v-bottom`, `v-stretch`, `h-left`, `h-center`, `h-right`, `h-stretch`, `h-between`, `h-around`, `h-evenly`, `gap`, `gap-x`, `gap-y`

### **Validação dos Resultados:**
```css
/* ✅ ANTES (QUEBRADO): */
.row.v-center { align-items: center; } /* Faltava .dp-flex */

/* ✅ DEPOIS (CORRIGIDO): */
.dp-flex.row.v-center { align-items: center; } /* Perfeito! */
```

### **Casos de Teste Validados:**
- ✅ `dp-flex row v-center` → `align-items: center`
- ✅ `dp-flex col v-center` → `justify-content: center`  
- ✅ `dp-flex row h-between` → `justify-content: space-between`
- ✅ `dp-flex col h-center` → `align-items: center`

## 🎯 **IMPACTO DA CORREÇÃO**

### **Funcionalidades Restauradas:**
1. **Classes Contextuais Flexbox**: Funcionando 100%
2. **Lógica de Eixos**: Row/Col comportamento correto
3. **Hierarquia de Seletores**: Especificidade adequada
4. **Compatibilidade**: Equivalente ao WPF2 funcional

### **Performance:**
- ✅ Engine WPF3 processando corretamente
- ✅ CSS gerado otimizado
- ✅ Sem duplicatas ou conflitos
- ✅ Escape de caracteres especiais funcionando

---

**⚠️ ATENÇÃO**: ✅ **BUG RESOLVIDO COM SUCESSO!** Classes contextuais funcionando perfeitamente. Este arquivo pode ser limpo.
