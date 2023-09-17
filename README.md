# API de Banco Digital

Esse projeto é uma RESTful API que permite :

-  Criar conta bancária .
-  Listar contas bancárias .
-  Atualizar os dados do usuário da conta bancária .
-  Excluir uma conta bancária .
-  Depósitar em uma conta bancária .
-  Sacar de uma conta bancária .
-  Transferir valores entre contas bancárias .
-  Consultar saldo da conta bancária .
-  Emitir extrato bancário .

## Requisitos de Instalação

- Node.js
- npm
- Express
- nodemon
- date-fns
 
 

## Rodando o Projeto

1. Clone este repositório => git init,git clone https://github.com/eldergsilva/API-para-um-Banco-Digital.git 
2. Execute `npm install` para instalar as dependências.
3. npm init -y
4. npm install express
5. npm install date-fns
6. npm install -D nodemon
 Ajuste as configurações no arquivo `.env` conforme necessário.
Execute `npm run dev` para iniciar o servidor.

## Exemplo de Uso

### Criar uma Conta Bancária

Para criar uma nova conta bancária, faça uma solicitação POST para `http://localhost:3000/contas` com os detalhes da conta no corpo da solicitação.

{
    "nome": "Elder",
    "cpf": "34111122297",
    "data_nascimento": "1984-12-19",
    "telefone": "111212314",
    "email": "euemail@gmail.com",
    "senha": "12345"
}

### Listar uma Conta Bancária
faça uma solicitação GET /
http://localhost:3000/contas?senha_banco=Cubos123Bank

### Atualizar usuário da conta bancária
faça uma solicitação PUT http://localhost:3000/contas/:numeroConta/usuario

### Excluir Conta
faça uma solicitação DELETE http://localhost:3000/contas/:numeroConta

### Depositar
faça uma solicitação POST http://localhost:3000/transacoes/depositar
e passe o numero da conta e valor ex :

{
	"numero_conta": "1",
	"valor": 10010
}

###  Sacar
faça uma solicitação POST http://localhost:3000/transacoes/sacar
e passe o numero da conta e valor e senha ex :
{
	"numero_conta": "2",
	"valor": 1942,
                 "senha": "12345"
}

###  Tranferir
 faça uma solicitação POST http://localhost:3000/transacoes/transferir
Requisição - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

numero_conta_origem
numero_conta_destino
valor
senha

ex  :
{
	"numero_conta_origem": "1",
	"numero_conta_destino": "2",
	"valor": 200,
	"senha": "123456"
}



###   Saldo

faça uma solicitação GET /contas/saldo?numero_conta=123&senha=123

Esse endpoint deverá retornar o saldo de uma conta bancária. ex :

{
    "saldo": 13000
}

###    Extrato
faça uma solicitação GET /contas/extrato?numero_conta=123&senha=123

Esse endpoint deverá listar as transações realizadas de uma conta específica.

 

 


 
