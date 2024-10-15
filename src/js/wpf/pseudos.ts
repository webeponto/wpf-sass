/**
	*#					Pseudos
	* @description		A classe *Pseudos* permite que você manipule elementos HTML utilizando pseudo-classes diretamente nas suas classes, proporcionando um controle fino sobre as interações do usuário com os elementos da página.
	*
	* @version 			2.X
	* @author 			Web e Ponto, Blaster Lizard Co.
*/

import { Painter } from './painter';

export class Pseudos {
	private appliedElements = new Set<HTMLElement>();
	private pseudoPrefixes = ['hover:', 'active:', 'focus:', 'placeholder:', 'group-hover:', 'remote-hover:'];
	private painter = new Painter();
	private originalStyles = new Map<HTMLElement, { bg?: string; color?: string; borderColor?: string }>();

	/**
		*#					Start
		* @description		Inicializa a ferramenta do Pseudos
		*
		* @param boolean 	**[useMutationObserver]**	Parâmetro que define se a ferramenta deve utilizar o Observador para ficar de olho em todos os elementos do site;
		*
		* @version 			2.0.8
		* @access public
	*/
	start(useMutationObserver: boolean = true): void {
		document.addEventListener("DOMContentLoaded", (): void => {
			const applyListenersToElement = (element: HTMLElement): void => {
				if (this.appliedElements.has(element)) return;

				const pseudoClasses = this.pseudoPrefixes
					.map(prefix => ({
						prefix,
						classes: Array.from(element.classList).filter(c => c.includes(prefix))
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
			const [device, pseudo, classToAdd] = this.extractPseudoAndClass(cls);

			if (!this.isDeviceCompatible(device)) return;

			if (this.isPaintClass(classToAdd)) {
				const color = this.extractColor(classToAdd);
				if (color) {
					this.storeOriginalStyle(element);
					this.applyDynamicStyle(element, classToAdd, color);
					console.log(this.applyDynamicStyle(element, classToAdd, color));
				} else {
					element.classList.add(classToAdd);
				}
			} else {
				element.classList.add(classToAdd);
			}
		});
	}

	private handleMouseOut(element: HTMLElement, classes: string[]): void {
		classes.forEach(cls => {
			const [device, pseudo, classToRemove] = this.extractPseudoAndClass(cls);

			if (!this.isDeviceCompatible(device)) return;

			if (this.isPaintClass(classToRemove)) {
				const color = this.extractColor(classToRemove);
				if (color) {
					this.removeDynamicStyle(element, classToRemove);
					this.restoreOriginalStyle(element);
				} else {
					element.classList.remove(classToRemove);
				}
			} else {
				element.classList.remove(classToRemove);
			}
		});
	}

	private extractPseudoAndClass(fullClass: string): [string, string, string] {
		const parts = fullClass.split(':');
		if (parts.length === 3) {
			return [parts[0], parts[1], parts[2]];
		} else if (parts.length === 2) {
			return ['', parts[0], parts[1]];
		}
		return ['', '', parts[0]];
	}

	private isDeviceCompatible(device: string): boolean {
		if (device === 'mob') {
			return window.innerWidth < 1024;
		}
		return true;
	}

	private storeOriginalStyle(element: HTMLElement): void {
		if (!this.originalStyles.has(element)) {
			this.originalStyles.set(element, {
				bg: element.style.backgroundColor || '',
				color: element.style.color || '',
				borderColor: element.style.borderColor || ''
			});
		}
	}

	private restoreOriginalStyle(element: HTMLElement): void {
		const originalStyle = this.originalStyles.get(element);
		if (originalStyle) {
			element.style.backgroundColor = originalStyle.bg;
			element.style.color = originalStyle.color;
			element.style.borderColor = originalStyle.borderColor;
		}
	}

	private debounce(func: Function, wait: number) {
		let timeout: ReturnType<typeof setTimeout>;
		return (...args: any[]) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	}

	private isPaintClass(className: string): boolean {
		return className.startsWith('bg(') || className.startsWith('c(') || className.startsWith('bc(');
	}

	private extractColor(className: string): string | null {
		const colorMatch = className.match(/\((#[0-9a-fA-F]{3,6})\)/);
		return colorMatch ? colorMatch[1] : null;
	}

	private applyDynamicStyle(element: HTMLElement, classToAdd: string, color: string): void {
		if (classToAdd.startsWith('bg(')) {
			element.style.backgroundColor = color;
		} else if (classToAdd.startsWith('c(')) {
			element.style.color = color;
		} else if (classToAdd.startsWith('bc(')) {
			element.style.borderColor = color;
		}
	}

	private removeDynamicStyle(element: HTMLElement, classToRemove: string): void {
		if (classToRemove.startsWith('bg(')) {
			element.style.backgroundColor = '';
		} else if (classToRemove.startsWith('c(')) {
			element.style.color = '';
		} else if (classToRemove.startsWith('bc(')) {
			element.style.borderColor = '';
		}
	}

	private applyGroupHoverEffect(element: HTMLElement, classes: string[]): void {
		const parent = element.closest('.group');
		if (parent) {
			classes.forEach(cls => {
				const [, , classToAdd] = this.extractPseudoAndClass(cls);
				if (!this.isPaintClass(classToAdd)) {
					parent.classList.add(classToAdd);
				} else {
					const color = this.extractColor(classToAdd);
					if (color) {
						this.storeOriginalStyle(parent);
						this.applyDynamicStyle(parent, classToAdd, color);
					} else {
						parent.classList.add(classToAdd);
					}
				}
			});
		}
	}

	private removeGroupHoverEffect(element: HTMLElement, classes: string[]): void {
		const parent = element.closest('.group');
		if (parent) {
			classes.forEach(cls => {
				const [, , classToRemove] = this.extractPseudoAndClass(cls);
				if (!this.isPaintClass(classToRemove)) {
					parent.classList.remove(classToRemove);
				} else {
					this.removeDynamicStyle(parent, classToRemove);
					this.restoreOriginalStyle(parent);
				}
			});
		}
	}

	private applyRemoteHoverEffect(element: HTMLElement, classes: string[]): void {
		const targets = document.querySelectorAll('.hover-ref');
		classes.forEach(cls => {
			const [, , classToAdd] = this.extractPseudoAndClass(cls);
			targets.forEach(target => {
				if (!this.isPaintClass(classToAdd)) {
					target.classList.add(classToAdd);
				} else {
					const color = this.extractColor(classToAdd);
					if (color) {
						this.storeOriginalStyle(target as HTMLElement);
						this.applyDynamicStyle(target as HTMLElement, classToAdd, color);
					} else {
						target.classList.add(classToAdd);
					}
				}
			});
		});
	}

	private removeRemoteHoverEffect(element: HTMLElement, classes: string[]): void {
		const targets = document.querySelectorAll('.hover-ref');
		classes.forEach(cls => {
			const [, , classToRemove] = this.extractPseudoAndClass(cls);
			targets.forEach(target => {
				if (!this.isPaintClass(classToRemove)) {
					target.classList.remove(classToRemove);
				} else {
					this.removeDynamicStyle(target as HTMLElement, classToRemove);
					this.restoreOriginalStyle(target as HTMLElement);
				}
			});
		});
	}

}
