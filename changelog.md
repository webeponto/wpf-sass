<p align="center"><a href="https://webeponto.com.br" target="_blank"><img src="logo.png" width="400" alt="WPF2"/><a></p>

# WPF 2.0
## Desenvolvido por Web e Ponto

[Veja o histórico de mudanças](https://github.com/webeponto/wpf-sass/commits).

**Changelog**

## 2.0.2 - Alpha
- `wpf/vendor/wpf`: Inserido as subpropriedades *min* e *max* para as opções de tamanho *w100* / *w-100*;
- `wpf/vendor/wpf`: Adicionado a funcionalidade de renderização de bordas através da classe auxiliar *.b*;
- `wpf/vendor/wpf`: Também foi inserido a funcionalidade de raio de borda (border-radius) através da classe auxiliar *.rounded*;
- `wpf/vendor/wpf`: Corrigido um bug com a classe auxiliar *.delay*, relacionada a atraso de transições, que equivocadamente performava o mesmo comportamento da classe auxiliar *.duration*, responsável por ditar a duração total da transição;
- Atualizado a documentação do projeto com as novas funcionalidades inseridas;

## 2.0.1 - Alpha
- `wpf/vendor/vars` / `vars/default`: Corrigido um problema onde as funções de classe não iriam conseguir gerar corretamente as classes dinâmicas baseadas nas variáveis. Agora, é obrigatório envolver todo o conteúdo das variáveis em aspas simples;
- `wpf/vendor/vars`: Agora é possível incluir variáveis de background que sejam imagens;
- `wpf/vendor/vars`: Agora também é possível utilizar a função de classe *fx()* para atribuir efeitos visuais como *box-shadow*, *text-shadow* e qualquer tipo de comportamento compatível das propriedades *filter* e *backdrop-filter*;
- `wpf/vendor/wpf`: Removido as classes auxiliares relacionadas a cursores de mouse da estrutura base do framework. Ela foi passada para o arquivo `wpf/vendor/vars` e está diretamente ligada a quais cursores estão presentes e declarados na `vars/default`, afim de criar uma estrutura muito mais homogênea e otimizada para o framework;
- `wpf/vendor/vars`: Corrigido um erro onde as variáveis CSS não eram renderizadas corretamente;
- `purgecss.config`: Incluído no repositório um template atualizado de como o purge necessita se comportar para que o WPF2 possa ser utilizado no projeto;
- Atualizado a documentação do projeto com novos dados a cerca das funcionalidades implementadas;


## 2.0.0 - Alpha
- Atualizado o arquivo `README.md` com novas informações a respeito da nova versão do WPF2;
- Completamente reformulado e reestruturado toda a funcionalidade da ferramenta, finalmente uma versão oficial da documentação do WPF é lançada junto com o framework e está disponível diretamente através do link: https://webeponto.notion.site/Documenta-o-87294a32368b42e2961ebd83eb2f7e23. Foi criado um link de referência à documentação em praticamente todos os arquivos presentes nesse framework;
- A estrutura de pastas foi totalmente repensada pensando em um modelo de desenvolvimento voltado para MVC, buscando uma vertente mais moderna e rápida que agilizasse e começasse a agregar, com o passar do tempo, a própria ferramenta, que se alimentará de conteúdo e repertório desenvolvido ao longo dos anos, se tornando cada vez mais robusta e independente com a própria ajuda do desenvolvedor;
- `wpf/vendor/wpf`: A página `core` agora foi segmentada entre duas vertentes. O seu conteúdo dinâmico, que poderia ser alterado pelo usuário desenvolvedor, permaneceu intacto em uma página presente em `base/base.scss` enquanto a verdadeira funcionalidade da ferramenta, como todas as funcionalidades do WPF, foram para uma nova página chamada `vendor/wpf.scss`;
- `vars/default`: Todas as "variáveis" que na verdade se comportavam como constantes e que não podiam ser alteradas pelo usuário desenvolvedor foram para uma nova págiga chamada `wpf`, que controla, de forma independente, o funcionamento integral da biblioteca;
- `wpf/vendor/mix`: Os mixins *setAbsolute()* e *centerAbsolute()* tiveram seus nomes alterados para *setPosition()* e *centerPosition()*;
- `.vscode/snippets/php` / `.vscode/snippets/scss`: Incluído dois arquivos JSON chamados `php.json` e `scss.json` que fazem parte de uma iniciativa de novas funcionalidades que farão parte da biblioteca WPF afim de criar comandos rápidos que geram estruturações completas que facilitam o desenvolvimento dentro do front-end e back-end com PHP ou Laravel que esteja utilizando o SCSS da WPF;
- `wpf/vendor/wpf`: Dentro das classes de auxílio para posicionamento, duas novas opções foram adicionadas: *.static* e *.sticky*;
- `wpf/vendor/wpf`: Dentro das classes de auxílio para transbordamento, que antes somente suportava a classe *.overflow-hidden/.glued*, agora todas as opções estão disponíveis e podem inclusive serem especificadas para serem renderizadas horizontalmente, verticalmente ou em ambas as direções. A variação *.glued* para especificar o atributo "overflow: hidden" foi descontinuada;
- `wpf/vendor/wpf`: Dentro das classes de auxílio para orientação de texto, a opção *.t-justify-all, .t-start e .t-end* foram adicionadas;
- `wpf/vendor/wpf`: Dentro das classes de auxílio para padding e margin, a opção de especificar o valor em EM foi adicionada. Para fazer isso, basta especificar a classe e utilizar o sufixo "em" no final. Ex: "p-5em" para um padding de 5em;
- `wpf/vendor/wpf`: Agora, sempre que for específicar uma classe auxiliar que determina um display, é obrigatório o uso do prefixo "dp-" antes. Ex: class="dp-flex row v-center h-center"
- `vendor/wpf`: Dentro das classes de auxilio para especificar displays, agora é possível especificar que, em contextos mobile, um elemento que anteriormente tinha um display específico pode passar a ter outro totalmente diferente. Ex: class="dp-flex mob:dp-grid";
- `wpf/vendor/wpf`: Na classe de auxílio para especificar 'iframes', foi removido as opções de escrita '16x9' e '4x3'. Para denominar essas classes, somente será aceito a escrita '16/9' e '4/3';
- `wpf/vendor/fun`: As funções *color()* e *ctext()* foram removidas pois já não são mais necessárias considerando a proposta de uso do WPF2 atualmente;
- `wpf/vendor/fun`: Atualizado a função *toRem()* para realizar os cálculos de conversão utilizando a função integrada matemática do próprio SASS, seguindo a convenção sugerida pela ferramenta, para evitar problemas com funcionalidades depreciadas caso novas versões do SASS sejam integradas ao WPF2;
- `wpf/mods`: Adicionado uma pasta com componentes isolados e independentes para funcionarem como recursos extras para o auxílio no desenvolvimento web durante o recorte de designs;
- `wpf/vendor/wpf`: Adicionado novas classes utilitárias para configurar o atributo line-height. A classe é *.lh* e pode ser usada junto com porcentagem ou medida EM;
- `wpf/vendor/vars`: Adicionado uma nova funcionalidade que gera classes utilitárias automaticamente baseada em qualquer variável declarada dentro de grupos de funcionalidades na `vars/default`. Essas classes utilitárias são invocadas através de *funções de classes* como *fnt()*, *bg()*, *c()* e *bc()*;
- `wpf/vendor/wpf`: Inserido uma nova funcionalidade chamada *popover* que facilitará muito a criação de menus de contexto entre outros tipos de dropdown que necessitam de um comportamento exclusivo semelhante;
- Foi corrigido inúmeros erros de funcionalidade que eram presentes e persistiam durante todas as versões v1.0 do WPF2;
- Solucionado inúmeros problemas de cache que eram persistentes quando se usava o WPF em conjunto com o plugin *Live SASS Compiler*;

## 1.5.0
- `core` Alterado alguns valores predefinidos de configuração de estilos para certos elementos em um site, como barra de rolamento, seleção de texto etc;
- `core` Definido que a cor padrão de background de um site sempre será sua primeira cor predefinida de superfície. Isso pode ser alterado manualmente caso haja necessidade;
- `core` Por padrão, a configuração *cursor: var.$mc-auto* virá comentada para evitar problemas de desempenho em sites que não utilizam cursores personalizados;
- `core` O atributo *gap*, *gap-r* e *gap-c* agora podem receber um valor zero como *gap-0* ou *mob:gap-c-0*. Isso funciona para todas as variações de porcentagem, pixels ou rem;
- `core` Reestruturado a funcionalidade das classes auxiliares do atributo *transform: rotate()*. Agora valores de -360º até 360º podem ser incluídos;
- `core` Incluído mais uma nomenclatura simplificada para referenciar as posições de um *float*. Agora, ao invés de escrever *float-left*, você pode optar por escrever *float-l*. *float-r* equivale à *float-right* e *float-0* equivale a *float-none*. As terminologias antigas ainda funcionam normalmente também;
- `vars / core` Incluído uma variável *pg-hdm-zoom* equivalente à "zoom para monitores de alta definição." Isso é uma solução opcional que pode ser atribuída à sites que precisam utilizar a solução de zoom para automaticamente aplicar um responsivo voltado à monitores de alta definição. Para ativar esse efeito, basta incluir a classe *hdm-zoom* na tag *html*;

## 1.4.2
- `core` Corrigido mais classes auxiliares de posicionamento que não estavam funcionando específicamente dentro do escopo de uso mobile;
- `core` Adicionado as classes auxiliares *container* para facilitar o uso e demarcação de contêineres na página ao utilizar o mixin `mix.container`;

## 1.4.1
- `core` Adicionado a variante *auto* para todas as classes auxiliares relacionadas com a propriedade *padding*, *margin*, *width* e *height*;
- `core` Corrigido um erro que impedia que qualquer classe auxiliar relacionado à posicionamento vertical/horizontal, tanto para desktop ou responsivo, funcionasse caso a classe "flex" estivesse acompanhada pela instrução *col-r* ou *row-r*;

## 1.4.0
- `core` Corrigido inúmeras classes auxiliares específicas para o uso mobile que não estavam funcionando corretamente;
- `core` Corrigido a classe auxiliar *grow* para o uso da propriedade CSS flex-grow;
- `core` Corrigido a declaração de espaçamentos laterais durante o uso das classes auxiliares *w* (usando % como parâmetro de largura);
- `core` Adicionado novas classes auxiliares *mc* para rapidamente especificar a exibição de um ponteiro específico do mouse em um elemento;
- `core` Adicionado novas classes auxiliares *float* para facilmente trabalhar com websites/elementos que ainda não podem usufruir de um suporte 100% dedicado à estrutura flex/grid;

## 1.3.0
- `core` Inserido a classe auxiliar opcional *inactive* para a tag *body* que impede qualquer tipo de rolagem de página;
- `core` Adicionado uma diretiva *mob:* que pode ser anexada à quase todas as classes presentes no core para configurar que uma classe só funcione em ambientes mobile;
- `core` A classe auxiliar *glued* agora também pode ser referenciada como *overflow-hidden*;
- `core` A classe auxiliar *fixed* foi adicionada;
- `core` Um erro que impedia que paddings/margins nulos fossem inseridos corretamente no código foi corrigido;
- `core` Corrigido um problema com as divisão de colunas e linhas utilizando as classes *grid-row* e *grid-col*, onde em alguns casos específicos, poderia renderizar resultados imprecisos;
- `core` Adicionado as diretivas *-min* e *-max* para específicações de altura e largura com *width* / *height* para melhor controle de tamanhos usando as classes auxiliares do WPF2;
- `core` As classes de tamanho *w-33* / *w-66* agora também podem ser referenciadas como *w-1/3* e *w-2/3*.
- `core` Não é mais obrigatório a utilização de "-" para específicar classes que caracterizam tamanhos. *w-100* por exemplo pode ser chamada de outras duas formas: *w100* e *w-full*;
- `core` O limite máximo de configurações de largura em pixels foi aumentado de 100px para 300px;
- `core` Agora é possível específicar altura de elementos usando a diretiva *h* para a propriedade CSS height;
- `core` As variações da classe *iframe* receberam reformulações no nome e agora podem ser referenciadas tanto como *4x3* e *16x9* como *4/3* e *16/9*;
- `core` Inúmeras novas classes foram adicionadas que permitem uma configuração precisa de elementos de transição diretamente via HTML. Todas elas são compatíveis com os métodos de transição do AlpineJS;
- `mix` Os mixins *setAbsolute* e *centerAbsolute* agora também são compatíveis com os tipos de posicionamento *relative* e *fixed* através de um novo parâmetro *type*;

## 1.2.0
- `anim` Adicionado o parâmetro *opacity* em algumas animações;
- `anim` Adicionado uma nova animação *ping-pulse*;
- `core` Inserido um novo e mais moderno método de otimizar e desenvolver a responsividade das aplicações/websites com WPF2, através do método *@container*;
- `core / cursors` Inserido a funcionalidade de implementar cursores customizados com WPF2;
- `core` Inserido as classes de apoio *block* e *conteiner*
- `core / vars` Alterado algumas nomenclaturas e parâmetros base;

## 1.1.0
- `anim` Adicionado uma lista de animações dinâmicas integradas em um novo arquivo presente no WPF2;
- `core` Inserido uma pré-configuração de barra de rolagem personalizada;
- `core` Inserido a classe de apoio *contents* para elementos que devem ser considerados meramente conteúdos;
- `core` Corrigido um problema onde, em alguns casos, as classes *mobile* e *desktop* não teriam o comportamento desejado;
- `core` Reajustado algumas das responsabilidades do atributo *main*;
- Removido a dependência do arquivo `anim` de alguns arquivos bases do WPF2;
- `vars` Reajustado o valor máximo padrão da largura de um projeto;

## 1.0.0
- Versão utilizável final com todos os recursos iniciais planejados.
