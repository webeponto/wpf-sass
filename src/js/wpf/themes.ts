import { Painter } from "./painter";

export class Themes {
    private appliedElements = new Set<HTMLElement>();
    private themePrefix = 'theme.';
    private painter: Painter; // Referência ao Painter

    constructor(painter: Painter) {
        this.painter = painter;
    }

    /**
		*#					Start
		* @description		Inicializa a ferramenta do Themes
		*
		* @version 			2.0.
		* @access public
	*/
    start(useMutationObserver: boolean = true): void {
        document.addEventListener('DOMContentLoaded', (): void => {
            // console.log('DOM Content Loaded');
            this.applyThemes();
            this.observeThemeChanges();

            if (useMutationObserver) {
                const observer = new MutationObserver(this.debounce((mutations: MutationRecord[]): void => {
                    mutations.forEach((mutation: MutationRecord): void => {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach((node: Node): void => {
                                if (node instanceof HTMLElement) {
                                    this.processElement(node);
                                }
                            });
                        }

                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            const target = mutation.target as HTMLElement;
                            this.applyThemeToElement(target);
                        }
                    });
                }, 100));

                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class'],
                });
            }
        });
    }

    private observeThemeChanges(): void {
        const htmlElement = document.documentElement;

        this.recalculateThemes();

        const themeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    console.log('HTML class changed, recalculating themes');
                    this.recalculateThemes();
                }
            });
        });

        themeObserver.observe(htmlElement, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    private recalculateThemes(): void {
        const elementsWithThemes = document.querySelectorAll(`[class*="${this.themePrefix}"]`);

        elementsWithThemes.forEach((element: Element) => {
            this.applyThemeToElement(element as HTMLElement);
        });
    }

    private processElement(element: HTMLElement): void {
        this.applyThemeToElement(element);
        element.querySelectorAll(`[class*="${this.themePrefix}"]`).forEach((child: Element) => {
            this.applyThemeToElement(child as HTMLElement);
        });
    }

    private applyThemes(): void {
        const elements = document.querySelectorAll(`[class*="${this.themePrefix}"]`);
        elements.forEach((element: Element) => {
            this.applyThemeToElement(element as HTMLElement);
        });
    }

    private applyThemeToElement(element: HTMLElement): void {
        const classList = Array.from(element.classList);

        // Rastrear todas as classes de tema para aplicar/remover
        const themeClasses: { themeName: string, classToApply: string }[] = [];

        classList.forEach(className => {
            const themeMatch = className.match(/theme\.([a-zA-Z0-9_-]+)\[(.*?)\]/);

            if (themeMatch) {
                const themeName = themeMatch[1];
                const classToApply = themeMatch[2];
                themeClasses.push({ themeName, classToApply });
            }
        });

        // Processar todas as classes de tema
        themeClasses.forEach(({ themeName, classToApply }) => {
            if (this.isThemeActive(themeName)) {
                // Adiciona a classe do tema
                element.classList.add(classToApply);
                console.log(`Theme ${themeName} active: applied ${classToApply}`);

                // Força o Painter a processar essas novas classes
                this.painter.applyPaints();
            } else {
                // Remove a classe do tema
                element.classList.remove(classToApply);
                console.log(`Theme ${themeName} inactive: removed ${classToApply}`);
            }
        });
    }

    private isThemeActive(themeName: string): boolean {
        const htmlElement = document.documentElement;

        // Se for o tema default, verifica se NÃO existe nenhuma classe com sufixo "-theme"
        if (themeName === 'default') {
            const hasThemeClasses = Array.from(htmlElement.classList).some(cls => cls.endsWith('-theme'));
            const isActive = !hasThemeClasses;

            console.log(`Checking default theme, Any theme classes present: ${hasThemeClasses}, Active: ${isActive}`);

            return isActive;
        }

        // Para outros temas, mantém a lógica original
        const themeClass = `${themeName}-theme`;
        const isActive = htmlElement.classList.contains(themeClass);

        console.log(`Checking theme: ${themeClass}, Active: ${isActive}`);

        return isActive;
    }

    private debounce(func: (mutations: MutationRecord[]) => void, wait: number) {
        let timeout: ReturnType<typeof setTimeout>;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}
