export class Pseudos {
    private appliedElements = new Set<HTMLElement>();
    private pseudoPrefixes = ['hover:', 'active:', 'focus:', 'placeholder:', 'group-hover:', 'remote-hover:'];

    start(useMutationObserver: boolean = true): void {
        document.addEventListener("DOMContentLoaded", (): void => {
            const applyListenersToElement = (element: HTMLElement): void => {
                if (this.appliedElements.has(element)) return;

                const pseudoClasses = this.pseudoPrefixes
                    .map(prefix => ({
                        prefix,
                        classes: Array.from(element.classList).filter(c => c.startsWith(prefix))
                    }))
                    .filter(({ classes }) => classes.length > 0);

                if (pseudoClasses.length > 0) {
                    pseudoClasses.forEach(({ prefix, classes }) => {
                        switch (prefix) {
                            case 'hover:':
                                element.addEventListener('mouseover', () => this.handleMouseOver(element, classes));
                                element.addEventListener('mouseout', () => this.handleMouseOut(element, classes));
                                break;
                            case 'active:':
                                element.addEventListener('mousedown', () => this.handleMouseOver(element, classes));
                                element.addEventListener('mouseup', () => this.handleMouseOut(element, classes));
                                element.addEventListener('mouseleave', () => this.handleMouseOut(element, classes));
                                break;
                            case 'focus:':
                                element.addEventListener('focus', () => this.handleMouseOver(element, classes));
                                element.addEventListener('blur', () => this.handleMouseOut(element, classes));
                                break;
                            case 'placeholder:':
                                if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
                                    const originalPlaceholder = element.placeholder;
                                    element.addEventListener('focus', () => {
                                        element.classList.add(...classes.map(cls => cls.replace('placeholder:', '')));
                                    });
                                    element.addEventListener('blur', () => {
                                        element.classList.remove(...classes.map(cls => cls.replace('placeholder:', '')));
                                        element.placeholder = originalPlaceholder;
                                    });
                                }
                                break;
                            case 'group-hover:':
                                element.addEventListener('mouseover', () => this.applyGroupHoverEffect(element, classes));
                                element.addEventListener('mouseout', () => this.removeGroupHoverEffect(element, classes));
                                break;
                            case 'remote-hover:':
                                element.addEventListener('mouseover', () => this.applyRemoteHoverEffect(element, classes));
                                element.addEventListener('mouseout', () => this.removeRemoteHoverEffect(element, classes));
                                break;
                        }
                    });
                    this.appliedElements.add(element);
                }
            };

            const applyEffects = (): void => {
                const elements = document.querySelectorAll(this.pseudoPrefixes.map(prefix => `[class*="${prefix}"]`).join(','));
                elements.forEach((element: Element): void => {
                    applyListenersToElement(element as HTMLElement);
                });
            };

            applyEffects();

            if (useMutationObserver) {
                const observer = new MutationObserver(this.debounce((mutations: MutationRecord[]): void => {
                    mutations.forEach((mutation: MutationRecord): void => {
                        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                            mutation.addedNodes.forEach((node: Node): void => {
                                if (node instanceof HTMLElement) {
                                    applyListenersToElement(node);
                                    node.querySelectorAll(this.pseudoPrefixes.map(prefix => `[class*="${prefix}"]`).join(',')).forEach((child: Element) => {
                                        applyListenersToElement(child as HTMLElement);
                                    });
                                }
                            });
                        }

                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            const target = mutation.target as HTMLElement;
                            applyListenersToElement(target);
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

    private handleMouseOver(element: HTMLElement, classes: string[]): void {
        classes.forEach(cls => {
            const classToAdd = cls.split(':')[1];
            element.classList.add(classToAdd);
        });
    }

    private handleMouseOut(element: HTMLElement, classes: string[]): void {
        classes.forEach(cls => {
            const classToRemove = cls.split(':')[1];
            element.classList.remove(classToRemove);
        });
    }

    private applyGroupHoverEffect(element: HTMLElement, classes: string[]): void {
        const children = element.querySelectorAll('*');
        children.forEach(child => {
            classes.forEach(cls => {
                const classToAdd = cls.split(':')[1];
                (child as HTMLElement).classList.add(classToAdd);
            });
        });
    }

    private removeGroupHoverEffect(element: HTMLElement, classes: string[]): void {
        const children = element.querySelectorAll('*');
        children.forEach(child => {
            classes.forEach(cls => {
                const classToRemove = cls.split(':')[1];
                (child as HTMLElement).classList.remove(classToRemove);
            });
        });
    }

    private applyRemoteHoverEffect(element: HTMLElement, classes: string[]): void {
        const children = element.querySelectorAll('.hover-ref');
        children.forEach(child => {
            classes.forEach(cls => {
                const classToAdd = cls.split(':')[1];
                (child as HTMLElement).classList.add(classToAdd);
            });
        });
    }

    private removeRemoteHoverEffect(element: HTMLElement, classes: string[]): void {
        const children = element.querySelectorAll('.hover-ref');
        children.forEach(child => {
            classes.forEach(cls => {
                const classToRemove = cls.split(':')[1];
                (child as HTMLElement).classList.remove(classToRemove);
            });
        });
    }

    private debounce(func: Function, wait: number) {
        let timeout: ReturnType<typeof setTimeout>;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}
