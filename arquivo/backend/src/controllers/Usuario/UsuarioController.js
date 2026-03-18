import db from '../config/db.js';
import bcrypt from "bcrypt";

const createUser = async (req, res) => {
	try{

		const nome = req.body.nome;
		const email = req.body.email;
		const senha = req.body.senha;
		const tipo_usuario = req.body.tipo_usuario;	

		if(nome === " ")
			return res.status(400).json({message: "Nome não deve estar vazio. "});

		const saltRound = 10;
		const hashPassword = await bcrypt.hash(senha, saltRound); //senha convertida para hash 

		const [result] = await db.query("INSERT INTO usuario (nome, email, senha, ativo, tipo_usuario) VALUES (?, ?, ?, ?, ?)", [nome, email, hashPassword, 1, tipo_usuario ])
		if(result.affectedRows === 0)
			return res.status(400).json({message: "Não foi possivel inserir o usuario"});

		return res.status(201).json({message:"Usuario criado com sucesso"});


	}catch{
		return res.status(500).json({message:"Erro ao criar usuario", erro: error.message});
	}
}

module.exports = {
	createUser
}