const express = require('express');
const rotas = express(); 
const contas = require('./controladores/contas');
const transacoes =require('./controladores/transacoes');

rotas.get('/contas',contas.listarContas);
rotas.post('/contas/',contas.criarConta);
rotas.delete('/contas/:numeroConta',contas.excluirConta);
rotas.put('/contas/:numeroConta',contas.AtualizarUsuarioContaBancaria);
rotas.post('/transacoes/depositar',transacoes.depositarEmConta);
rotas.post('/transacoes/sacar',transacoes.sacarDeUmaConta);
rotas.post('/transacoes/transferir',transacoes.transferirParaUmaConta,);
rotas.get('/contas/saldo',transacoes.obterSaldoDeUmaConta);
rotas.get('/contas/extrato',transacoes.obterExtratoDeUmaConta);
 

module.exports = rotas;