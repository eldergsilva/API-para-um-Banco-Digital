const bancodedados = require('../bancodedados');  
let {identificadorContas}= require('../bancodedados');
const { format } = require('date-fns');
let idProximoContaCriada = 1



const listarContas = (req, res) => {
    const senhaBanco = req.query.senha_banco;
    if (!senhaBanco || senhaBanco !== bancodedados.banco.senha) {
      return res.status(400).json({ mensagem: "A senha do banco informada é inválida!" });
    }  
    const contas = bancodedados.contas;    
    return res.status(200).json(contas);
    
}


const excluirConta = (req, res) => {  
  const numeroConta = req.params.numeroConta; 
  const contaExistente = bancodedados.contas.some((conta) => conta.numero === numeroConta);

  if (!contaExistente) {
    return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
  }


  const conta = bancodedados.contas.find((conta) => conta.numero === numeroConta);

  if (conta.saldo !== 0) {
    return res.status(400).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" });
  }


  bancodedados.contas = bancodedados.contas.filter((conta) => conta.numero !== numeroConta);

  return res.status(204).send();
  }


  const criarConta = (req, res) => {  
    const {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha
    } = req.body;
  
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
      return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
    }
  
    const contaExistente = bancodedados.contas.find(
      (conta) => conta.cpf === cpf || conta.usuario.email === email
    );
  
    if (contaExistente) {
      return res.status(400).json({ mensagem: "Já existe uma conta com o CPF ou e-mail informado!" });
    }    
  
    const ultimaConta = bancodedados.contas[bancodedados.contas.length - 1];
    idProximoContaCriada = ultimaConta ? parseInt(ultimaConta.numero) + 1 : idProximoContaCriada;
  
    const novaConta = {
      numero: idProximoContaCriada.toString(),
      saldo: 0,
      transferencias: [],
      usuario: {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha,
      },
    };
    
    idProximoContaCriada++;
    bancodedados.contas.push(novaConta);
  
    return res.status(201).send();
  }

  const AtualizarUsuarioContaBancaria = async (req, res) => {
    const numeroConta = req.params.numeroConta;
    const {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    } = req.body;

    try {
        
        bancodedados.contas = bancodedados.contas.filter((conta) => conta.numero !== numeroConta);

        
        const conta = bancodedados.contas.find((conta) => conta.numero === numeroConta);

        if (!conta) {
            return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
        }

        if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
            return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
        }

        const cpfExistente = bancodedados.contas.some((outraConta) => outraConta.usuario.cpf === cpf);
        if (cpfExistente) {
            return res.status(400).json({ mensagem: "O CPF informado já existe cadastrado!" });
        }

        const emailExistente = bancodedados.contas.some((outraConta) => outraConta.usuario.email === email);
        if (emailExistente) {
            return res.status(400).json({ mensagem: "O E-mail informado já existe cadastrado!" });
        }

       
        conta.usuario = {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha,
        };

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
}
  
  

module.exports = {
    listarContas,
    excluirConta,
    criarConta,
    AtualizarUsuarioContaBancaria
  }