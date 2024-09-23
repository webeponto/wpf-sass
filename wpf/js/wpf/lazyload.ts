/**
	*#					LazyLoad
	* @description		A ferramenta *LazyLoad* do WPF permite o carregamento dinâmico de imagens e elementos, otimizando o desempenho do site ao carregar conteúdo apenas quando ele está visível para o usuário. Esse recurso é especialmente útil para sites com muitos elementos de mídia, pois evita o carregamento desnecessário de imagens fora da tela.
	*
	* @version 			2.X
	* @author 			Web e Ponto, Blaster Lizard Co.
*/
export class LazyLoad {
	/**
		*#					Start
		* @description		Inicializa a ferramenta do LazyLoad
		*
		* @param boolean 	**[convertAllImages]**		Parâmetro que define se a ferramenta deve automaticamente converter todas as imagens do site para serem compatíveis com essa funcionalidade;
		* @param boolean 	**[allowRemoving]**			Parâmetro que define se a ferramenta deve remover as imagens novamente quando fora de visibilidade;
		*
		* @version 			2.0.8
		* @access public
	*/
	start(convertAllImages: boolean = false, allowRemoving: boolean = false): void {
		document.addEventListener("DOMContentLoaded", function (): void {
			
			let allElements: NodeListOf<HTMLElement> = document.querySelectorAll(".wpf-lazy-load");
			let allImages: NodeListOf<HTMLImageElement> = document.querySelectorAll("img");

			// Verifica se é para converter todas as imagens
			if (convertAllImages) {
				allImages.forEach(function (img: HTMLImageElement): void {
					// Só adiciona a classe 'wpf-lazy-load' se a imagem não a tiver
					if (!img.classList.contains("wpf-lazy-load")) {
						img.classList.add("wpf-lazy-load");
					}
				});
			}

			// Se a imagem possuir a classe 'wpf-lazy-load' e possuir um atributo src, faz a conversão para data-src.
			allImages.forEach(function (img: HTMLImageElement): void {
				if (img.classList.contains("wpf-lazy-load")) {
					if (img.getAttribute("src")) {
						// Transfere o valor de 'src' para 'data-src'
						img.setAttribute("data-src", img.getAttribute("src") as string);
						img.removeAttribute("src");
					}
				}
			});

			// Seleciona os elementos com a classe 'wpf-lazy-load'
			if ("IntersectionObserver" in window) {
				let lazyLoadObserver: IntersectionObserver = new IntersectionObserver(function (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void {
					entries.forEach(function (entry: IntersectionObserverEntry): void {
						let element: HTMLElement = entry.target as HTMLElement;

						if( element.classList.contains("wpf-lazy-ignore") )
							return;

						if (entry.isIntersecting) {
							if (element.tagName === "IMG") {
								// Se for uma imagem, carrega o 'src'
								let img = element as HTMLImageElement;
								img.src = img.getAttribute("data-src") as string;
								img.classList.add("fade-in");
							} else {
								// Outros elementos apenas aparecem
								let item = element as HTMLElement;
								item.style.opacity = "1";
								item.style.visibility = "visible";
							}
						} 
						
						else {
							if (allowRemoving) {
								if (element.tagName === "IMG") {
									// Remove o 'src' para imagens
									let img = element as HTMLImageElement;
									img.removeAttribute("src");
									img.classList.remove("fade-in");
								} else {
									// Oculta outros elementos
									let item = element as HTMLElement;
									item.style.opacity = "0";
									item.style.visibility = "hidden";
								}
							}
						}
					});
				});

				// Observa todos os elementos com a classe 'wpf-lazy-load'
				allElements.forEach(function (element: HTMLElement): void {
					lazyLoadObserver.observe(element);
				});
			} 
			
			else {
				// Fallback se o IntersectionObserver não for suportado
				allElements.forEach(function (element: HTMLElement): void {
					if (element.tagName === "IMG") {
						let img = element as HTMLImageElement;
						img.src = img.getAttribute("data-src") as string;
					} else {
						element.style.opacity = "1";
						element.style.display = "block";
					}
				});
			}
		});
	}
}
