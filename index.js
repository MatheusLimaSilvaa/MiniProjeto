const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware para requisição.json
app.use(bodyParser.json());

//Middleware para registrar
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
});

const logHoraMiddleware = (req, res, next) => {
    const horaAtual = new Date().toISOString();
    console.log(
      `[${horaAtual}] Nova solicitação: ${req.method} ${req.originalUrl}`
      );
    next(); 
  };

//ListaProdutos
let Produtos = [];

//Rota POST
app.post('/produto', (req, res) => {
    const {nome, preço, descrição} = req.body;

    //Validação campos obrigatórios
    if (!nome || !preço || !descrição) {
        return res.status(400).json({error: 'Todos os campos são obrigatórios.'});
    }

    //IDproduto
    const id = Produtos.length + 1;

    //Adicionar
    const novoProduto = {id, nome, preço, descrição};
    Produtos.push(novoProduto);

    //ProdutoAdicionado
    res.status(201).json({message: 'Produto adicionado.', produto: novoProduto});
});

//Rota GET
app.get('/produtos', logHoraMiddleware, (req, res) => {
    res.json(Produtos);
});

//Rota PUT
app.put('/produto/:id', (req, res) => {
    const {id} = req.params;
    const {nome, preço, descrição} = req.body;

    //IDprodutos
    const produtoIndex = Produtos.findIndex(produto => produto.id == id);

    //Erro 404 - produto nao encontrado.
    if (produtoIndex === -1) {
        return res.status(404).json({error: 'Produto não encontrado'});
    }

    //Atualizar
    Produtos[produtoIndex] = {...Produtos[produtoIndex], nome, preço, descrição};

    res.json({message: 'Produto atualizado.', produto: Produtos[produtoIndex]});
});

//Rota DELETE
app.delete('/produto/:id', (req, res) => {
    const {id} = req.params;

    //Lista de produto ID
    const produtoIndex = Produtos.findIndex(produto => produto.id == id);

    //Erro 404 - produto nao encontrado.
    if (produtoIndex === -1) {
        return res.status(404).json({error: 'Produto não encontrado'});
    }

    //Remove o produto da lista
    Produtos.splice(produtoIndex, 1);

    //Retorna - produto excluido.
    res.json({message: 'Produto excluído'});
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log('Servidor rodando', {PORT});
});
