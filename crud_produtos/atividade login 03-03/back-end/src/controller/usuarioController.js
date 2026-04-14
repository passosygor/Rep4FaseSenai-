const db = require('../config/db.js');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {

    try {
        const {nome, email, senha, tipo_usuario} = req.body;

        if(nome.length < 5 || nome === ""){
            return res.status(400).json({message: 'O nome deve ser completo. Deve conter pelo menos 5 caracteres e não pode estar vazio.'});
        }

        if(email.length < 5 || email === ""){
            return res.status(400).json({message: 'O email deve ser completo. Deve conter pelo menos 5 caracteres e não pode estar vazio.'});
        }

        const saltRounds = 10; //numero mais comum para o bcrypt - define quantas vezes a senha será processada para gerar o hash / quanto maior o número, mais seguro, mas também mais lento
        const hashPassword = await bcrypt.hash(senha, saltRounds); //criptografa a senha

        const [result] = await db.query("INSERT INTO usuario (nome, email, password_hash, tipo_usuario, ativo) VALUES (?, ?, ?, ?, ?)", [nome, email, hashPassword, tipo_usuario, 1]);

        if(result.affectedRows === 0){
            return res.status(400).json({message: 'Não foi possível criar o usuário.'});
        }

        return res.status(201).json({message: 'Usuário criado com sucesso.'});

    } catch (error) {
        return res.status(500).json({message: 'Erro ao criar usuário.', error: error.message});
    }

};

module.exports = {
    createUser
};