# WPF 2.0
## Desenvolvido por Web e Ponto

[Veja o histórico de mudanças](https://github.com/webeponto/wpf-sass/commits).

**Changelog**

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
