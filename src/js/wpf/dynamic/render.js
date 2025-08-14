/**
	*# 	@property WPF3 - Framework CSS Dinâmico
	* 	@version Versão: 3.0.3
	* 	@authors Lyautey Maluf Neto, Matheus Patrignani Quaiat, David Henderson
	* 	@copyright 2023
	*
	* 	@license MIT
*/

// Define as bibliotecas e frameworks tercerizados:
const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const { glob } = require("glob");
const yaml = require("js-yaml");
const util = require("util");

// 'Promisifica' as operações de arquivos:
//? 'Promisificar' é um termo que define a chamada de funções após a conclusão de determinados processos assíncronos.
const readFileAsync = util.promisify(fs.readFile);

// Limitar a frequência de atualizações para evitar sobrecarga:
const THROTTLE_INTERVAL = 800;
let lastRun = 0;

// Carregar e ler as configurações do YAML:
/*
	? config.patterns: Representa os padrões comuns e independentes de classes utilitárias do WPF3.
	? config.contextPatterns: Representa padrões mais complexos que dependem de contextos específicos, como mediadores e propriedades.
*/
const configPath = path.join(__dirname, "wpf.config.yaml");
let config;
try {
	config = yaml.load(fs.readFileSync(configPath, "utf8"));
	console.log("🔧 Config YAML carregada:",
		Object.keys(config.patterns).length, "padrões,",
		Object.keys(config.contextPatterns || {}).length, "contextos");
} catch (e) {
	console.error("❌ Erro ao carregar o YAML:", e);
	process.exit(1);
}

// Garante que o diretório de saída exista:
const outDir = path.join(process.cwd(), 'resources/scss/panel/wpf/vendor/dynamic');
fs.mkdirSync(outDir, { recursive: true });

// Pastas que estão sendo monitoradas:
const directoriesToWatch = ["resources"];
const directoryPaths = directoriesToWatch.map(d => path.join(process.cwd(), d));
console.log("🗂️ Monitorando:", directoryPaths);

// Definições de status de processamento:
let isProcessing = false;
let pendingUpdate = false;
const cssCache = new Map();

/** 
	*#	Reset Configuration and Cache
	*	Reinicia a leitura do arquivo YAML para renderizar as mudanças mais recentes.
	*
	* 	@returns {bool} - Uma resposta se a execução da tarefa foi ou não bem sucedida.
*/
function resetConfigAndCache() {
	try {
		cssCache.clear();
		config = yaml.load(fs.readFileSync(configPath, "utf8"));
		console.log("🔄 Config recarregada e cache limpo:",
			Object.keys(config.patterns).length, "padrões,",
			Object.keys(config.contextPatterns || {}).length, "contextos");
		return true;
	} catch (e) {
		console.error("❌ Erro ao recarregar config:", e);
		return false;
	}
}

//* ====================== FUNÇÕES UTILITÁRIAS ====================== //

/** 
	*#	Escape Selector
	*	Escapa caracteres especiais em seletores CSS.
	*
	* 	@param {string} cls - A classe a ser escapada.
	*
	* 	@returns {string} - A classe escapada, pronta para uso em seletores CSS.
*/
function escapeSelector(cls) {
	return cls.replace(/([()\[\]!#%:,\.\,\/\\])/g, "\\$1");
}

/**
	*#	Extract Breakpoint
	*	Recupera os padrões de definição (breakpoint ou importância) em uma classe CSS e compara com as configurações definidas disponíveis pelo arquivo de comparação YAML.
	*
	*	@param {string} className - A classe CSS a ser analisada.
	*
	*	@returns {Object} - Um objeto contendo o breakpoint encontrado, a classe base e definições como importância.
*/
function extractBreakpoint(className) {
	let breakpoint = null;
	let baseName = className;
	let isImportant = false;

	// Primeiro verifica se tem importância (em qualquer posição):
	if (baseName.includes('!')) {
		isImportant = true;
	}

	// Agora verifica os breakpoints:
	for (const bp in config.breakpoints) {
		const prefix = `${bp}:`;
		if (baseName.startsWith(prefix)) {
			breakpoint = bp;
			baseName = baseName.slice(prefix.length);
			break;
		}
	}

	// Retorna o objeto com as informações necessárias:
	return {
		breakpoint,
		baseClass: baseName,
		originalClass: className,
		isImportant
	};
}

/**
	*# 	Create Rule Signature
	*	Cria uma assinatura única para uma regra CSS com base no seletor e nas propriedades. Isso impede que a mesma regra seja preenchida múltiplas vezes no arquivo final.
	*
	* 	@param {string} selector - O seletor CSS.
	* 	@param {string} properties - As propriedades CSS.
	*
	* 	@returns {string} - A assinatura da regra CSS.
*/
function createRuleSignature(selector, properties) {
	return `${selector}::${properties.replace(/\s+/g, '')}`;
}

//* ====================== PROCESSAMENTO PRINCIPAL ====================== //

/**
	*# 	Generate CSS From Class
	*	Lê e processa um conjunto de instruções regulares que incluem a instrução de nomeação da classe utilitária presente no arquivo YAML, possíveis breakpoints e regras extras e define uma versão final daquela classe e atributos inclusos.
	*
	* 	@param {string} originalClass - A classe original inserida pelo usuário.
	* 	@param {string} baseClass - A classe base sem variações de breakpoint ou importância.
	* 	@param {string} patternConfig - A padronagem permitida definida no arquivo de configuração YAML.
	* 	@param {string} patternName - O nome dessa padronagem.
	* 	@param {string} processedRules - As regras de uso explícitas pelo conjunto de instruções inclusas na classe.
	*
	* 	@returns {string} - O CSS gerado para a classe, ou uma string vazia se não houver correspondência.
*/
function generateCSSFromClass(originalClass, baseClass, patternConfig, patternName, processedRules) {
	let cls = baseClass;
	const isImportant = cls.startsWith('!') ? (cls = cls.slice(1), true) : false;

	// Tenta validar e processar o conjunto descrito pelo usuário, descoberto pelo interpretador de padrões:
	try {
		// Faz a leitura do regex e verifica se a classe bate com o padrão:
		const regex = new RegExp(patternConfig.regex);
		const match = regex.exec(cls);
		if (!match) return '';

		const sel = `.${escapeSelector(originalClass)}`;
		let ruleContent = '';

		// Se a configuração tiver um Template CSS (disponível em casos mais básicos da folha de estilos), usa ele:
		if (patternConfig.cssTemplate) {
			let rule = patternConfig.cssTemplate;
			rule = rule.replace(/\{selector\}/g, sel);

			// Substitui os grupos capturados no regex pelo template:
			for (let i = 1; i < match.length; i++) {
				rule = rule.replace(new RegExp(`\\$${i}`, 'g'), match[i] || '');
			}

			// Se o padrão descoberto possuir a instrução '!', adiciona a importância no resultado final:
			if (isImportant) rule = rule.replace(/;/g, ' !important;');

			ruleContent = rule + '\n';
		} 
		
		// Se um Template CSS não estiver disponível, procura por uma definição 'default' especificada no YAML:
		//? (Este é um caso que na versão atual não é utilizado, mas pode ser útil em ocasiões futuras)
		else {
			const groups = match.slice(1);
			let prop = patternConfig.properties?.default || '';
			prop = prop.replace(/\$(\d+)/g, (_, i) => groups[parseInt(i, 10) - 1] || '');

			let val = groups.join(' ').trim();
			if (isImportant) val += ' !important';
			ruleContent = `${sel} { ${prop}: ${val}; }\n`;
		}

		// Verificar duplicata e cria uma assinatura única para a regra:
		const ruleSig = createRuleSignature(sel, ruleContent);
		if (processedRules.has(ruleSig)) return '';

		processedRules.add(ruleSig);
		return ruleContent;
	} 
	
	// Se algo impedir esse procedimento, captura o erro, informa o usuário e retorna uma string vazia:
	catch (error) {
		console.error(`❌ Erro ao processar '${originalClass}' com '${patternName}':`, error);
		return '';
	}
}

/**
	*# 	Generate Contextual CSS
	*	Lê e processa um conjunto de instruções regulares contextuais que incluem a instrução de nomeação da classe utilitária presente no arquivo YAML, conjunto de regras contextuais (como outras classes obrigatórias em conjunto com a classe original), possíveis breakpoints e regras extras e define uma versão final daquela classe contextual, com seus atributos inclusos.
	*
	* 	@param {Array} group - O grupo de classes que contém a classe original e outras classes relacionadas.
	* 	@param {Set} classSet - Um conjunto de classes únicas do grupo.
	* 	@param {Set} processedRules - Um conjunto de regras processadas para evitar duplicatas.
	*
	* 	@returns {string} - O CSS gerado para as classes
*/
function generateContextualCSS(group, classSet, processedRules) {
	// Se não possível identificar a presença de padrões contextuais no arquivo de configuração, cancela a geração de CSS Contextuais:
	if (!config.contextPatterns) return '';

	let css = '';
	const classes = Array.from(classSet);

	// Percorre a lista completa de referência dos padrões contextuais, buscando por casos que se encaixam com classes vistas em arquivos monitorados:
	Object.entries(config.contextPatterns).forEach(([contextName, context]) => {
		const hasRequirements = !context.requires ||
			context.requires.some(reqBase =>
				classes.some(cls => getBaseClass(cls) === reqBase)
			);

		if (!hasRequirements) return;

		// Verifica se o contexto possuí mediadores (classes que atuam como intermediários e modificam o atributo final do padrão):
		Object.keys(context.mediators || {}).forEach(mediatorBase => {
			const mediatorVariations = classes.filter(cls =>
				getBaseClass(cls) === mediatorBase
			);

			// Para cada variação...
			mediatorVariations.forEach(mediatorFull => {
				const mediatorInfo = extractBreakpoint(mediatorFull);

				// ... É extraído os atributos finais possíveis:
				Object.keys(context.properties || {}).forEach(propBase => {
					const propVariations = classes.filter(cls =>
						getBaseClass(cls) === propBase
					);

					// ... E também é verificado a presença de modificadores (como breakpoints e importância):
					propVariations.forEach(propFull => {
						const propInfo = extractBreakpoint(propFull);

						// Criar seletor usando apenas classes obrigatórias (required classes)
						const requiredClasses = context.requires || [];
						const baseSelector = '.' + requiredClasses.map(escapeSelector).join('.');

						let selector = context.properties[propBase].selector
							.replace(/\$mediator/g, escapeSelector(mediatorFull))
							.replace(/\$prop/g, escapeSelector(propFull))
							.replace(/&/g, baseSelector);

						let rule = context.properties[propBase].rules?.[mediatorBase] ||
							context.properties[propBase].rules?.default ||
							context.properties[propBase].rule;

						if (context.properties[propBase].valuePattern) {
							const valueRegex = new RegExp(context.properties[propBase].valuePattern);
							const match = propFull.match(valueRegex);
							if (match?.[1]) rule = rule.replace(/\{value\}/g, match[1]);
						}

						// Aplica importância APENAS se a propriedade tinha '!'
						if (propInfo.isImportant) {
							rule = rule.split(';')
								.filter(part => part.trim() !== '')
								.map(declaration => declaration.trim() + ' !important')
								.join('; ') + ';';
						}

						const breakpoint = propInfo.breakpoint || mediatorInfo.breakpoint;
						let cssRule = `${selector} { ${rule} }\n`;

						if (breakpoint) {
							cssRule = `@media (max-width: ${config.breakpoints[breakpoint]}px) {${cssRule.replace(/\n/g, '\n    ')}}\n`;
						}

						const ruleSig = createRuleSignature(selector, rule);
						if (!processedRules.has(ruleSig)) {
							processedRules.add(ruleSig);
							css += cssRule;
						}
					});
				});
			});
		});
	});

	return css;
}

/**
	*# 	Generate CSS
	*	Realiza todo o procedimento inicial da geração de CSS dinâmico, processando os grupos de classes encontrados em arquivos monitorados e verificando, classe por classe, se elas se adequam a padrões comuns ou contextuais, buscando também a extração de regras extras (como breakpoints ou atribuição de importância).
	*
	* 	@param {Array} allClassGroups - Um array de grupos de classes, onde cada grupo é um array de strings representando classes.
	*
	* 	@returns {string} - O CSS gerado, pronto para ser escrito em um arquivo.
*/
function generateCSS(allClassGroups) {
	// Gera uma chave única de cachê para evitar que o mesmo processo seja executado várias vezes com grupos repetidos:
	const cacheKey = JSON.stringify(allClassGroups.map(g => g.sort()));
	if (cssCache.has(cacheKey)) {
		console.log("♻️ Usando CSS do cache");
		return cssCache.get(cacheKey);
	}

	let defaultRules = '';
	const bpRules = {};
	for (const bp in config.breakpoints) bpRules[bp] = '';
	const allClasses = new Set();
	const processedRules = new Set();

	console.log(`🔍 Iniciando geração de CSS para ${allClassGroups.length} grupos`);

	// Processa os grupos de classes:
	allClassGroups.forEach((group, index) => {
		const classSet = new Set(group);
		group.forEach(cls => allClasses.add(cls));

		// CSS Contextual (com controle de duplicatas):
		const contextualCSS = generateContextualCSS(group, classSet, processedRules);
		if (contextualCSS) {
			defaultRules += contextualCSS;
		}

		// Processa as classes individualmente:
		group.forEach(clsName => {
			// Extraí as variações de regra como breakpoints e importância:
			const { breakpoint, baseClass, originalClass } = extractBreakpoint(clsName);

			for (const [patternName, patternConfig] of Object.entries(config.patterns)) {
				// Gera o o nome da classe, o atributo final com seu valor especificado e aplica sob as circustâncias e regras definidas pelo usuário:
				const rule = generateCSSFromClass(
					originalClass,
					baseClass,
					patternConfig,
					patternName,
					processedRules
				);

				// Organiza cada regra encontrada por breakpoints, facilitando a organização do código final:
				if (rule) {
					if (breakpoint) {
						bpRules[breakpoint] += rule;
					} else {
						defaultRules += rule;
					}
				}
			}
		});
	});

	// Informa ao usuário o número de classes ÚNICAS que o interpretador foi capaz de encontrar:
	//? É válido lembrar que o número de classes processadas não vão incluir duplicatas, então não vão representar o número total de classes que existem nos arquivos processados.
	console.log(`📊 ${allClasses.size} classes processadas, ${processedRules.size} regras únicas`);

	// Começa a montagem do arquivo CSS final:
	let out = `// Arquivo gerado automaticamente - NÃO EDITAR\n\n${defaultRules}`;

	// Define, no final do arquivo, as regras simples (não incluí as regras contextuais) que pertencem em grupos de breakpoints:
	//? Por questão de otimização, as regras contextuais mais complexas não são separadas no final do arquivo como as simples. Elas podem ser muito extensas e diferentes, o que dificulta o processo de automatização da máquina.
	for (const bp in bpRules) {
		if (bpRules[bp].trim()) {
			out += `\n@media (max-width: ${config.breakpoints[bp]}px) {\n${bpRules[bp]}}\n`;
		}
	}

	cssCache.set(cacheKey, out);
	return out;
}

//* ====================== PROCESSAMENTO DE ARQUIVOS ====================== //

/**
	*# 	Extract Class Groups From File
	*	Lê um arquivo com base no seu caminho de pastas e extraí todo o conteúdo que é possível graças à folha de estilos comparativa definida pelo YAML.
	* 	@async
	*
	* 	@param {string} filePath - O caminho do arquivo à ser processado.
	*
	* 	@returns {string} - Pode gerar um array de grupos de classes encontrados no arquivo, ou uma string vazia se não houver correspondência.
*/
async function extractClassGroupsFromFile(filePath) {
	// Tenta ler os arquivos assíncronamente e processar o conteúdo...
	try {
		const content = await readFileAsync(filePath, 'utf-8');
		const classGroups = [];

		// Padrões para encontrar classes em atributos com diferentes delimitadores (suporta aspas internas em objetos Alpine/Vue)
		const classAttrPatterns = [
			/(?:class|className|data-class|x-bind:class|:class|x-class)="([^"]+)"/g, // "..."
			/(?:class|className|data-class|x-bind:class|:class|x-class)='([^']+)'/g,     // '...'
			/(?:class|className|data-class|x-bind:class|:class|x-class)=`([^`]+)`/g,     // `...`
			/(?:class|className|data-class|x-bind:class|:class|x-class)=\{([^}]*)\}/g   // { ... }
		];

		// Função utilitária para normalizar e splitar uma string de classes em um array único
		const extractClassesFromString = (raw) => {
			let extractedClasses = [];
			
			// PRIMEIRO: Extrair classes de dentro de expressões Blade condicionais antes de removê-las
			// Ex: {{ !empty($ratio) ? 'ratio-(ratio)' : '' }} → captura 'ratio-(ratio)'
			const bladeClassPattern = /\{\{[^}]*['"`]([^'"`\s]+)['"`][^}]*\}\}/g;
			let bladeMatch;
			while ((bladeMatch = bladeClassPattern.exec(raw)) !== null) {
				const foundClasses = bladeMatch[1].split(/\s+/).filter(cls => cls.trim());
				extractedClasses.push(...foundClasses);
			}
			
			// SEGUNDO: Processar o resto da string normalmente
			const classString = raw
				// Protege vírgulas dentro de parênteses (ex: rgba(255,255,255,0.5)) para não virarem separadores de classes
				.replace(/\(([^)]*)\)/g, (_, inner) => `(${inner.replace(/,/g, '\u0007')})`)
				.replace(/\${[^}]*}/g, '')        	// Remove expressões de JavaScript.
				.replace(/\{\{[^}]+\}\}/g, '')    	// Remove expressões do Blade.
				.replace(/@[a-zA-Z0-9_]+/g, '')   	// Remove directivas.
				.replace(/[{}]/g, ' ')            	// Remove chaves de objetos Alpine.js
				.replace(/["']/g, ' ')           	// Remove apenas aspas simples e duplas (preserva :) 
				.replace(/\s*,\s*/g, ' ')         	// Remove vírgulas (fora dos parênteses, já protegidas)
				.replace(/\u0007/g, ',')          	// Restaura vírgulas protegidas
				.replace(/\s+/g, ' ');            	// Normaliza espaços

			const normalClasses = classString
				.split(/\s+/)
				// Normaliza tokens vindos de objetos Alpine/Vue, removendo dois-pontos finais (separadores de chave:valor)
				.map(tok => tok.replace(/:$/, ''))
				.filter(cls => {
					const trimmed = cls.trim();
					return trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*');
				});

			// Combina classes extraídas de Blade + classes normais e remove duplicatas
			return [...new Set([...extractedClasses, ...normalClasses])];
		};

		// 1) Atributos padrão (class, className, etc.) cobrindo todos os delimitadores
		classAttrPatterns.forEach((pattern) => {
			let match;
			while ((match = pattern.exec(content)) !== null) {
				const classes = extractClassesFromString(match[1]);
				if (classes.length > 0) classGroups.push(classes);
			}
		});

		// 2) Funções Blade conhecidas que recebem classes como segundo argumento (ex: @svg('name', 'classes ...'))
		//    Suporta somente string simples como 2º parâmetro, sem espaços dentro das aspas.
		const bladeFuncPatterns = [
			/@svg\(\s*['"][^'"]+['"]\s*,\s*['"]([^'"]+)['"]\s*\)/g
		];

		bladeFuncPatterns.forEach((pattern) => {
			let m;
			while ((m = pattern.exec(content)) !== null) {
				const classes = extractClassesFromString(m[1]);
				if (classes.length > 0) classGroups.push(classes);
			}
		});

		// Retorna o grupo de classes relacionados à esse arquivo:
		return classGroups;
	} 
	
	// Caso não seja possível realizar alguma etapa do processo de leitura e triagem...
	catch (err) {
		// ...Informa o usuário que um caminho de arquivo específico não pode ser lido e processado:
		console.error(`❌ Erro ao processar ${filePath}:`, err);
		return [];
	}
}

/**
	*# 	Find All Files
	*	Encontra todos os arquivos que deverão ser lidos e processados, passando pelo processo de triagem.
	* 	@async
	*
	* 	@returns {Array} - Retorna um array com todos os arquivos que devem ser lidos.
*/
async function findAllFiles() {
	// Define quais são as extensões permitidas para leitura:
	const allowedExtensions = ['.html', '.php', '.js', '.jsx', '.tsx', '.vue', '.blade.php', '.svg'];
	const allFiles = [];

	// Busca arquivos válidos nos diretórios definidos pelo arquivo de configuração YAML: 
	for (const dir of directoryPaths) {
		const files = await glob(`${dir}/**/*.*`);
		const filteredFiles = files.filter(file =>
			allowedExtensions.includes(path.extname(file).toLowerCase())
		);
		allFiles.push(...filteredFiles);
	}

	// Informa o usuário sobre a quantidade total de arquivos encontrados, seguindo o filtro de 'pastas mãe' impostas no arquivo de configuração:
	console.log(`🔍 Encontrados ${allFiles.length} arquivos`);
	return allFiles;
}

//* ====================== FLUXO DE TRABALHO PRINCIPAL ====================== //

/**
	*# 	Update Dynamic SCSS
	*	Atualiza o arquivo SCSS dinâmico final.
	* 	@async
*/
async function updateDynamicSCSS() {
	// Define um mediador para o processo de rechamadas:
	//? No caso, utilizamos o momento atual como mediador.
	const now = Date.now();

	// Se a chamada aconteceu novamente em um intervalo menor que o definido pelo THROTTLE_INTERVAL, ignora:
	if (now - lastRun < THROTTLE_INTERVAL) {
		pendingUpdate = true;
		return;
	}

	// Se o processo de atualização da última chamada da função ainda está em progresso, ignora:
	if (isProcessing) {
		pendingUpdate = true;
		return;
	}

	// Define o início do processamento:
	lastRun = now;
	isProcessing = true;
	console.log("\n⏳ Iniciando processamento...");

	try {
		// Aguarda o método de busca por arquivos compatíveis terminar seu processamento:
		const allFiles = await findAllFiles();

		// Aguarda o método de extração de classes terminar o seu processamento em um arquivo específico...: 
		const classGroupsPerFile = await Promise.all(allFiles.map(extractClassGroupsFromFile));
		
		//...Então concatena ele em um grupo maior que aborda todos os conjuntos de classes de todos os arquivos:
		const allClassGroups = classGroupsPerFile.flat();

		// Informa ao usuário quantos desses grupos foram corretamente encontrados e extraídos:
		console.log(`📝 ${allClassGroups.length} grupos de classes encontrados`);

		// Leva todo esse conteúdo para um método que vai gerar o SCSS final:
		const css = generateCSS(allClassGroups);

		// Utiliza o caminho de saída especificado no arquivo de configuração do YAML para criar um arquivo único para receber os estilos convertidos:
		const outPath = path.join(outDir, 'wpf-dynamic.scss');
		
		// Imprime nesse arquivo final de saída a data da última conversão de estilos e gera um cabeçalho com informações:
		const timestamp = new Date().toLocaleString();
		const header = `// Gerado em ${timestamp}\n// ${allClassGroups.length} grupos\n\n`;

		// Escreve tudo isso nesse arquivo final e informa o usuário que o processo foi concluído:
		fs.writeFileSync(outPath, header + css, 'utf-8');
		console.log(`🟢 ${outPath} atualizado!`);

		//? Para fins de depuração, você pode incluir a formatação de mais um arquivo extra:
		// Cria um arquivo extra de depuração que informa os nomes de todas as classes detectadas, sem definir seus estilos ou regras:
		const allClasses = new Set();
		allClassGroups.forEach(group => group.forEach(cls => allClasses.add(cls)));
		const debugPath = path.join(outDir, 'wpf-classes-debug.txt');
		fs.writeFileSync(debugPath, `Classes detectadas:\n${Array.from(allClasses).sort().join('\n')}`, 'utf-8');
	} 
	
	// Caso alguma das etapas não tenha sido concluída, o processo inteiro desmorona, portanto...
	catch (error) {
		//...Um erro crítico é informado ao usuário:
		console.error("❌ Erro crítico:", error);
	} 
	
	// Quando tudo está terminado...
	finally {
		// Informa este próprio método que ele está pronto para a próxima chamada:
		isProcessing = false;
		if (pendingUpdate) {
			pendingUpdate = false;
			console.log("🔄 Executando atualização pendente...");
			setTimeout(updateDynamicSCSS, THROTTLE_INTERVAL);
		}
	}
}

/**
	*# 	Generate Class Variations
	*	Com base em uma classe base, gera todas as possíveis alterações que ela pode possuir, considerando tipos diferentes de regras implementadas no WPF ou breakpoints definidos pelo usuário.
	*	@ignore A classe não é importante para o funcionamento crítico da ferramenta. É utilizada para fins de debug.
	*
	* 	@param {string} baseClass - A classe básica original.
	*
	*	@returns {Array} - Retorna um array com todas as variações possíveis daquela classe.
*/
function generateClassVariations(baseClass) {
	const variations = [];
	const breakpoints = Object.keys(config.breakpoints);

	// Gera a sua versão padrão original:
	variations.push(baseClass);

	// Gera uma variação com importância:
	variations.push(`!${baseClass}`);

	// Gera variações que incluem regras de breakpoints:
	breakpoints.forEach(bp => {
		variations.push(`${bp}:${baseClass}`);
		variations.push(`${bp}:!${baseClass}`);
		variations.push(`!${bp}:${baseClass}`);
	});

	// Retorna as variações:
	return variations;
}

/**
	*# 	Get Base Class
	*	Extrai a classe base independente de variações.
	*
	* 	@param {string} className - O nome da classe sem formatação, digitada pelo usuário.
	*
	*	@returns {string} - Retorna a classe formatada completamente limpa de regras.
*/
function getBaseClass(className) {
	// Remove a atribuição de importância:
	let base = className.replace(/^!/, '');

	// Remove as atribuições de breakpoints:
	for (const bp in config.breakpoints) {
		if (base.startsWith(`${bp}:`)) {
			base = base.substring(bp.length + 1);
			// Remover importância após breakpoint se existir
			base = base.replace(/^!/, '');
			break;
		}
	}

	// Retorna a classe formatada:
	return base;
}

//* ====================== INICIALIZAÇÃO ====================== //

// Quando o usuário digita o comando no terminal para inicializar a ferramenta pela primeira vez:
console.log("🚀 Iniciando WPF3 Framework");
updateDynamicSCSS().catch(console.error);

// Define as configurações do observador de arquivos:
const watcher = chokidar.watch(directoryPaths, {
	// Escolhe quais são os diretórios e arquivos que nunca devem ser escolhidos pelo observador:
	ignored: [
		/(^|[\/\\])\../,
		'**/node_modules/**',
		'**/vendor/**',
		'**/*.(jpg|png|gif|pdf|zip)',
		outDir	//? Entre eles, é importante que o arquivo de saída da nossa biblioteca esteja incluso.
	],
	persistent: true,
	ignoreInitial: true,
	awaitWriteFinish: {
		stabilityThreshold: 500,
		pollInterval: 100
	},
	depth: 10
});

// Define quais serão os tipos de comportamento do observador dependendo das ações do usuário (inserir novos arquivos ou modificar arquivos existentes):
watcher
	.on('add', file => handleFileChange('add', file))
	.on('change', file => handleFileChange('change', file))
	.on('ready', () => console.log('👀 Observador ativo'));

// Adiciona monitoramento específico para o arquivo de configuração
const configWatcher = chokidar.watch(configPath, {
	persistent: true,
	ignoreInitial: true,
	awaitWriteFinish: {
		stabilityThreshold: 200,
		pollInterval: 50
	}
});

configWatcher.on('change', () => {
	console.log('📝 Configuração YAML modificada - recarregando...');
	if (resetConfigAndCache()) {
		// Força regeneração completa removendo cache e arquivo de saída
		const outputPath = path.join(outDir, 'wpf-dynamic.scss');
		if (fs.existsSync(outputPath)) {
			fs.unlinkSync(outputPath);
			console.log('🗑️ Arquivo CSS removido para regeneração completa');
		}
		updateDynamicSCSS().catch(console.error);
	}
});

let debounceTimer;

/**
	*# 	Handle File Change
	*	Determina o comportamento da biblioteca perante arquivos de acordo com as ações do usuário.
	*
	* 	@param {string} event - Qual é o evento (CRUD) que foi detectado pelo observador.
	* 	@param {file} file - O arquivo específico que esse evento foi observado.
*/
function handleFileChange(event, file) {
	// Identifica qual é a extensão do arquivo:
	const ext = path.extname(file).toLowerCase();

	// Compara a extensão obtida com aquelas que são suportadas pelo WPF:
	const validExts = ['.html', '.php', '.js', '.jsx', '.tsx', '.vue', '.blade.php', '.svg'];
	if (!validExts.includes(ext)) return;

	// Informa o usuário sobre qual arquivo foi observado um comportamento e qual foi o comportamento observado:
	console.log(`🔄 ${event} em ${path.relative(process.cwd(), file)}`);
	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(updateDynamicSCSS, THROTTLE_INTERVAL);
}

// Para fins de depuração, no momento da inicialização, define no arquivo 'wpf-status.txt' o estado operacional atual da ferramenta: 
const statusPath = path.join(outDir, 'wpf-status.txt');
fs.writeFileSync(
	statusPath,
	`Operacional desde ${new Date().toLocaleString()}\nMonitorando: ${directoriesToWatch.join(', ')}`,
	'utf-8'
);
console.log("📑 Status:", statusPath);
