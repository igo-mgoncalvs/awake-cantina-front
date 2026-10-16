# Awake Cantina --- Frontend

Interface web da Awake Cantina, utilizada para registrar compras durante
o Awake Camp e consultar informações administrativas.

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React, para ícones (quando utilizado no código)

## Funcionalidades

- Identificação de participantes por código de barras/leitor USB.
- Busca e seleção de produtos.
- Fluxo de carrinho e finalização de vendas.
- Consulta de saldo do participante.
- Área administrativa para cadastros e acompanhamento financeiro,
  conforme os módulos disponíveis no projeto.
- Interface alinhada à identidade visual Awake, com roxo e laranja.
- Configuração da URL da API por variável de ambiente.

> A lista exata de telas e funcionalidades depende da versão presente
> neste repositório.

## Requisitos

- Node.js compatível com a versão do projeto.
- npm (ou o gerenciador de pacotes indicado pelo arquivo de lock).
- Backend da Awake Cantina acessível para utilizar os dados e
  registrar operações.

## Instalação

Na raiz do frontend, execute:

```bash
npm install
```

## Configuração do ambiente

Crie um arquivo `.env` na raiz do frontend:

```env
VITE_API_URL=http://localhost:3333
```

Troque o endereço pela URL em que a API está disponível no ambiente
atual.

O Vite só expõe ao código do navegador as variáveis com prefixo `VITE_`.
**Não coloque senhas, tokens privados ou credenciais secretas em
variáveis `VITE_*`**, porque esses valores podem ser incluídos no bundle
público.

Depois de alterar o `.env`, reinicie o servidor de desenvolvimento.

## Executar em desenvolvimento

```bash
npm run dev
```

Confira os comandos realmente disponíveis no projeto com:

```bash
npm run
```

O Vite exibirá no terminal o endereço local para abrir no navegador.

## Gerar build de produção

```bash
npm run build
```

Os arquivos gerados normalmente ficam na pasta `dist/`. Para testar
localmente a build, caso o script exista:

```bash
npm run preview
```

## Leitor de código de barras

O fluxo de leitura depende da configuração do leitor USB. Muitos
leitores HID funcionam como teclado: enviam os caracteres lidos e,
opcionalmente, uma tecla Enter ao final.

- Teste primeiro o leitor em um campo de texto simples.
- Confira se o formato do código cadastrado é o mesmo enviado pelo
  leitor.
- Evite caracteres no identificador que o leitor ou a configuração
  possam interpretar de forma inesperada.
- Garanta que o campo de leitura esteja focado durante o fluxo de
  venda, sem impedir que o usuário clique em campos de pesquisa.

## Comunicação com a API

O frontend deve usar `VITE_API_URL` para formar as chamadas à API,
conforme a implementação do projeto. Se houver erro de conexão, confira:

1.  Se a API está em execução.
2.  Se a URL e a porta estão corretas.
3.  Se o backend permite a origem do frontend via CORS.
4.  Se o navegador está bloqueando uma chamada por conteúdo misto
    (HTTP/HTTPS).

## Docker e publicação

Se houver Dockerfile ou configuração de Compose no repositório, use a
configuração versionada como referência. Em produção, configure
`VITE_API_URL` para o endereço correto da API antes de gerar a build,
pois variáveis `VITE_*` são resolvidas durante o build.

## Boas práticas

- Não versione `.env`; mantenha um `.env.example` com valores
  fictícios.
- Não coloque segredos no frontend.
- Preserve os estilos, fontes e tamanhos definidos pelo design do
  projeto ao alterar componentes.
- Teste a leitura do código de barras e o fluxo de finalização antes
  do uso no acampamento.
