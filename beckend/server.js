const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(bodyParser.json());

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',      
    user: 'root',           
    password: '',           
    database: 'app_db',     
});

// Conectando ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL.');
});

// Rota para cadastro de usuários
app.post('/users', (req, res) => {
    const { cpf, nome, idade, cep } = req.body;

    if (!cpf || !nome || !idade || !cep) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    const sql = 'INSERT INTO users (cpf, nome, idade, cep) VALUES (?, ?, ?, ?)';
    db.query(sql, [cpf, nome, idade, cep], (err, result) => {
        if (err) {
            console.error('Erro ao inserir usuário:', err);
            return res.status(500).json({ error: 'Erro ao salvar o usuário!' });
        }
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    });
});

// Rota para listar usuários
app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            return res.status(500).json({ error: 'Erro ao buscar usuários!' });
        }
        res.json(results);
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


