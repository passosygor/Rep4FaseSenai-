const db = require('../config/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const {email, senha} = req.body;

        if (!email || !senha) {  
            return res.status(400).json({ message: "Email e senha são obrigatórios." });  
        }

        const [rows] = await db.query(  
            "SELECT id, nome, email, password_hash, tipo_usuario FROM usuario WHERE email = ? LIMIT 1",  
            [email]  
        );  
    
        if (rows.length === 0) {  
            return res.status(401).json({ message: "Credenciais inválidas." });  
        }  
    
        const user = rows[0];  // usuário encontrado, agora verificar a senha
    
        const ok = await bcrypt.compare(senha, user.password_hash);  // compara a senha fornecida com o hash armazenado no banco de dados
        if (!ok) {  
            return res.status(401).json({ message: "Credenciais inválidas." });  
        }  
    
        // JWT: "crachá" do usuário  
        const token = jwt.sign(  
            { 
                sub: user.id, 
                tipo_usuario: user.tipo_usuario 
            }, // payload (não coloque senha aqui)  
            process.env.JWT_SECRET,
            { 
                expiresIn: "1h" 
            }
        );  
    
        return res.json({  
            message: "Login realizado com sucesso.",  
            token,  
        });

    } catch (error) {
        res.status(500).json({message: 'Erro ao realizar login.', error: error.message});
    }
}

module.exports = {
    login
};