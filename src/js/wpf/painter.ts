export class Painter {
    /**
     * Inicia a ferramenta do Painter.
     * Observa o carregamento do DOM e também as mutações (novos elementos ou alterações nas classes)
     * para aplicar as cores dinamicamente.
     *
     * @version 2.0.9
     * @access public
     */
    start(): void {
        document.addEventListener("DOMContentLoaded", () => {
            // Processa os elementos presentes na carga inicial
            this.applyPaints(document);
            // Inicia o observador para capturar novas adições/alterações no DOM
            this.observeMutations();
        });
    }

    /**
     * Aplica as pinturas aos elementos que possuam classes com "bg(", "c(" ou "bc(".
     * Pode ser aplicado a um nó raiz (document ou um elemento específico)
     *
     * @param root O nó onde procurar elementos (pode ser o document ou um elemento específico)
     */
    applyPaints(root: ParentNode): void {
        // Seleciona elementos que possuem classes com os padrões especificados
        const elements: NodeListOf<HTMLElement> = root.querySelectorAll("[class*='bg('], [class*='c('], [class*='bc(']");

        elements.forEach((element: HTMLElement) => {
            const classList = Array.from(element.classList);
            classList.forEach(className => {
                if (className.startsWith("bg(")) {
                    const color = this.extractColor(className);
                    if (color) {
                        element.style.backgroundColor = color;
                    }
                }
                if (className.startsWith("c(")) {
                    const color = this.extractColor(className);
                    if (color) {
                        element.style.color = color;
                    }
                }
                if (className.startsWith("bc(")) {
                    const color = this.extractColor(className);
                    if (color) {
                        element.style.borderColor = color;
                    }
                }
            });
        });
    }

    /**
     * Extrai o valor hexadecimal de uma classe no formato bg(#hex) ou similar.
     *
     * @param className - Nome da classe (ex.: "bg(#ff0000)")
     * @returns O valor da cor (ex.: "#ff0000") ou null se não encontrar.
     */
    extractColor(className: string): string | null {
        // A regex procura padrões como (#123) ou (#112233)
        const colorMatch = className.match(/\((#[0-9a-fA-F]{3,6})\)/);
        return colorMatch ? colorMatch[1] : null;
    }

    /**
     * Inicia um MutationObserver para monitorar alterações no DOM:
     * - Se novos elementos forem adicionados, aplica as pinturas a eles.
     * - Se o atributo "class" for alterado, reaplica as pinturas.
     */
    observeMutations(): void {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    // Para cada nó adicionado, se for um elemento, processa as classes
                    mutation.addedNodes.forEach(node => {
                        if (node instanceof HTMLElement) {
                            this.applyPaints(node);
                        }
                    });
                }
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    // Se houve mudança no atributo "class", reaplica para o elemento alvo
                    const target = mutation.target as HTMLElement;
                    // Aqui você pode optar por processar apenas o elemento ou também seus filhos
                    this.applyPaints(target.parentNode || document);
                }
            });
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }
}
