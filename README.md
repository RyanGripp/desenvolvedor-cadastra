## Para rodar a aplicação

Para instalar as dependências o comando: `npm install`

Para dar o start no server e nos processos para desenvolvimento o comando: `npm start` 

## Sobre

- Eu utilizei nodejs v18.16.1 para a realização deste teste.

- Para executar o comando `npm start` com sucesso, foi necessario retirar `node_modules/.bin/`, para que seja executado o `cross-env`,
em `package.json` -> `"scripts"` -> `"start"`.

- Para conseguir importar arquivos `.ts` foi necessário adicionar `resolve: { extensions: [".js", ".jsx", ".ts", ".tsx"], }`
  e retirar `include: path.resolve(__dirname, paths.scripts.src),` em `webpack.config.js`.


## Contato

Email: ryangrippadasilva@gmail.com