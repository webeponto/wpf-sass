# WPF 2.0
## Desenvolvido por Web e Ponto

[Veja o histórico de mudanças](https://github.com/webeponto/wpf-sass/commits).

**Changelog**

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
