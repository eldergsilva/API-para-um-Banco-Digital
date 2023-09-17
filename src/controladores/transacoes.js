const contas = require('./contas');
const bancodedados = require('../bancodedados');
const  {format } = require('date-fns'); 
const date  = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

const depositarEmConta = async (req, res) => {
  const { numero_conta, valor } = req.body;

  try {
    if (!numero_conta || !valor) {
      return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios!" });
    }

    const conta = bancodedados.contas.find((conta) => conta.numero === numero_conta);

    if (!conta) {
      return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
    }

    if (valor <= 0) {
      return res.status(400).json({ mensagem: "O valor do depósito deve ser maior que zero!" });
    }

    conta.saldo += valor;

    const transacao = {
      tipo: "Depósito",
      valor: valor,
      data: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
      
    };
    conta.transferencias.push(transacao);

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}

const sacarDeUmaConta = async (req, res) => {
  const { numero_conta, valor, senha } = req.body;

  try {
    if (!numero_conta || !valor || !senha) {
      return res.status(400).json({ mensagem: "O número da conta, o valor do saque e a senha são obrigatórios!" });
    }

    const conta = bancodedados.contas.find((conta) => conta.numero === numero_conta);

    if (!conta) {
      return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
    }

    
    if (senha !== conta.usuario.senha) {
      return res.status(401).json({ mensagem: "Senha incorreta!" });
    }

    if (valor <= 0) {
      return res.status(400).json({ mensagem: "O valor do saque não pode ser menor ou igual a zero!" });
    }

    if (valor > conta.saldo) {
      return res.status(400).json({ mensagem: "Saldo insuficiente para realizar o saque!" });
    }


    if (!conta.transferencias || !Array.isArray(conta.transferencias)) {
      conta.transferencias = [];
    }
    
    conta.saldo -= valor;

    
    const transacao = {
      data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      numero_conta,
      valor,
    };
    conta.transferencias.push(transacao);

    return res.status(204).send();
  } catch (error) {
    console.error(error); 
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const obterExtratoDeUmaConta = async (req, res) => {
  const { numero_conta, senha } = req.query;

  try {
    
    if (!numero_conta || !senha) {
      return res.status(400).json({ mensagem: "Número da conta e senha são obrigatórios!" });
    }

    
    const conta = bancodedados.contas.find((conta) => conta.numero === numero_conta);

    if (!conta) {
      return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
    }

    
    if (senha !== conta.usuario.senha) {
      return res.status(401).json({ mensagem: "Senha incorreta!" });
    }

    
    const depositos = conta.transferencias.filter((transacao) => transacao.valor > 0);
    const saques = conta.transferencias.filter((transacao) => transacao.valor < 0);
    const transferenciasEnviadas = conta.transferencias.filter(
      (transacao) => transacao.numero_conta_origem === numero_conta
    );
    const transferenciasRecebidas = conta.transferencias.filter(
      (transacao) => transacao.numero_conta_destino === numero_conta
    );

    
    const extrato = {
      depositos,
      saques,
      transferenciasEnviadas,
      transferenciasRecebidas,
    };

    return res.status(200).json(extrato);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}


const obterSaldoDeUmaConta = async (req, res) => {
  const { numero_conta, senha } = req.query;

  try {
     
    if (!numero_conta || !senha) {
      return res.status(400).json({ mensagem: "Número da conta e senha são obrigatórios!" });
    }

     
    const conta = bancodedados.contas.find((conta) => conta.numero === numero_conta);

    if (!conta) {
      return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
    }

     
    if (senha !== conta.usuario.senha) {
      return res.status(401).json({ mensagem: "Senha incorreta!" });
    }

     
    const saldo = conta.saldo;

    return res.status(200).json({ saldo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}

const transferirParaUmaConta = async (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

  try {
     
    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
      return res.status(400).json({ mensagem: "Número de conta de origem, número de conta de destino, valor e senha são obrigatórios!" });
    }

     
    const contaOrigem = bancodedados.contas.find((conta) => conta.numero === numero_conta_origem);
    const contaDestino = bancodedados.contas.find((conta) => conta.numero === numero_conta_destino);

    if (!contaOrigem || !contaDestino) {
      return res.status(404).json({ mensagem: "Conta bancária de origem ou de destino não encontrada!" });
    }

     
    if (senha !== contaOrigem.usuario.senha) {
      return res.status(401).json({ mensagem: "Senha incorreta!" });
    }

    
    if (valor > contaOrigem.saldo) {
      return res.status(400).json({ mensagem: "Saldo insuficiente!" });
    }

     
    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;

     
    const transacao = {
      data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      numero_conta_origem,
      numero_conta_destino,
      valor,
    };

    bancodedados.transferencias.push(transacao);

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}

  module.exports={
    depositarEmConta,
    sacarDeUmaConta,
    obterExtratoDeUmaConta,
    obterSaldoDeUmaConta,
    transferirParaUmaConta
  }