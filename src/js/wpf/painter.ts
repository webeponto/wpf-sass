export class Painter {
	/**
		*#					Start
		* @description		Inicializa a ferramenta do Painter
		*
		* @version 			2.0.8
		* @access public
	*/
	start(): void {
		// Inicia o processo ao carregar o DOM
		document.addEventListener("DOMContentLoaded", () => {
			this.applyPaints();
		});
	}

	/**
	 * Aplica as pinturas nos elementos que possuem classes específicas
	 */
	applyPaints(): void {
		// Seleciona todos os elementos que possuem classes que iniciam com bg(, c( ou bc(
		const elements: NodeListOf<HTMLElement> = document.querySelectorAll("[class*='bg('], [class*='c('], [class*='bc(']");

		elements.forEach((element: HTMLElement) => {
			const classList = Array.from(element.classList);

			classList.forEach(className => {
				// Verifica se a classe é uma cor de background
				if (className.startsWith("bg(")) {
					const color = this.extractColor(className);
					if (color) element.style.backgroundColor = color;
				}

				// Verifica se a classe é uma cor de texto
				if (className.startsWith("c(")) {
					const color = this.extractColor(className);
					if (color) element.style.color = color;
				}

				// Verifica se a classe é uma cor de borda
				if (className.startsWith("bc(")) {
					const color = this.extractColor(className);
					if (color) element.style.borderColor = color;
				}
			});
		});
	}

	/**
	 * Extrai a cor de uma classe no formato bg(#hex) ou similar
	 * @param className - O nome da classe que contém a cor
	 * @returns string | null
	 */
	extractColor(className: string): string | null {
		// Extrai a parte dentro dos parênteses
		const colorMatch = className.match(/\((#[0-9a-fA-F]{3,6})\)/);
		return colorMatch ? colorMatch[1] : null;
	}
}
