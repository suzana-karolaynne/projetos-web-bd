console.log('Rodando app.js...');

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createPool({
  host: 'localhost',
  user: 'aluno_web',
  password: 'SenhaAluno@2025',
  database: 'escola_divertida'
});



app.get('/', (req, res) => res.send('Servidor rodando!'));

// Inserir aluno
app.post('/alunos', (req, res) => {
  const { nome, idade, turma, descricao, avatar } = req.body;

  // Validar campos obrigatórios
  if (!nome || !idade || !turma) {
    return res.status(400).json({ error: 'Preencha os campos obrigatórios: nome, idade e turma!' });
  }

  const sql = 'INSERT INTO alunos (nome, idade, turma, descricao, avatar) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [nome, idade, turma, descricao || '', avatar || ''], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao inserir aluno: ' + err.message });
    res.json({ message: 'Aluno cadastrado com sucesso!', id: result.insertId });
  });
});


// 2 Professores
app.post('/professores', (req, res) => {
  const { nome, usuario, senha } = req.body;
  if (!nome || !usuario || !senha) return res.status(400).json({ error: 'Preencha todos os campos!' });

  const sql = 'INSERT INTO professores (nome, usuario, senha) VALUES (?, ?, ?)';
  db.query(sql, [nome, usuario, senha], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Professor cadastrado!', id: result.insertId });
  });
});


// 3️ Jogos
app.post('/jogos', (req, res) => {
  const { nome_jogo, descricao, ativo } = req.body;
  if (!nome_jogo) return res.status(400).json({ error: 'Preencha o nome do jogo!' });

  const sql = 'INSERT INTO jogos (nome_jogo, descricao, ativo) VALUES (?, ?, ?)';
  db.query(sql, [nome_jogo, descricao || '', ativo || 1], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Jogo cadastrado!', id: result.insertId });
  });
});

// 4️ Perguntas
app.post('/perguntas', (req, res) => {
  const { id_jogo, enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, resposta_correta } = req.body;
  if (!id_jogo || !enunciado || !resposta_correta) return res.status(400).json({ error: 'Preencha os campos obrigatórios!' });

  const sql = `
    INSERT INTO perguntas
    (id_jogo, enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, resposta_correta)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [id_jogo, enunciado, alternativa_a || '', alternativa_b || '', alternativa_c || '', alternativa_d || '', resposta_correta], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Pergunta cadastrada!', id: result.insertId });
  });
});

// 5️ Pontuações
app.post('/pontuacoes', (req, res) => {
  const { id_aluno, id_jogo, pontos } = req.body;
  if (!id_aluno || !id_jogo) return res.status(400).json({ error: 'Informe o aluno e o jogo!' });

  const sql = 'INSERT INTO pontuacoes (id_aluno, id_jogo, pontos) VALUES (?, ?, ?)';
  db.query(sql, [id_aluno, id_jogo, pontos || 0], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Pontuação registrada!', id: result.insertId });
  });
});



// READ (GET) 
app.get('/alunos', (req, res) => {
  db.query('SELECT * FROM alunos', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/professores', (req, res) => {
  db.query('SELECT * FROM professores', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/jogos', (req, res) => {
  db.query('SELECT * FROM jogos', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/perguntas', (req, res) => {
  db.query('SELECT * FROM perguntas', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/pontuacoes', (req, res) => {
  db.query('SELECT * FROM pontuacoes', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//UPDATE (PUT) 
app.put('/alunos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, idade, turma, descricao, avatar } = req.body;
  const sql = 'UPDATE alunos SET nome=?, idade=?, turma=?, descricao=?, avatar=? WHERE id_aluno=?';
  db.query(sql, [nome, idade, turma, descricao, avatar, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Aluno atualizado com sucesso!' });
  });
});

app.put('/professores/:id', (req, res) => {
  const { id } = req.params;
  const { nome, usuario, senha } = req.body;
  const sql = 'UPDATE professores SET nome=?, usuario=?, senha=? WHERE id_professor=?';
  db.query(sql, [nome, usuario, senha, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Professor atualizado com sucesso!' });
  });
});

app.put('/jogos/:id', (req, res) => {
  const { id } = req.params;
  const { nome_jogo, descricao, ativo } = req.body;
  const sql = 'UPDATE jogos SET nome_jogo=?, descricao=?, ativo=? WHERE id_jogo=?';
  db.query(sql, [nome_jogo, descricao, ativo, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Jogo atualizado com sucesso!' });
  });
});

app.put('/perguntas/:id', (req, res) => {
  const { id } = req.params;
  const { enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, resposta_correta } = req.body;
  const sql = 'UPDATE perguntas SET enunciado=?, alternativa_a=?, alternativa_b=?, alternativa_c=?, alternativa_d=?, resposta_correta=? WHERE id_pergunta=?';
  db.query(sql, [enunciado, alternativa_a, alternativa_b, alternativa_c, alternativa_d, resposta_correta, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Pergunta atualizada com sucesso!' });
  });
});

app.put('/pontuacoes/:id', (req, res) => {
  const { id } = req.params;
  const { pontos } = req.body;
  const sql = 'UPDATE pontuacoes SET pontos=? WHERE id_pontuacao=?';
  db.query(sql, [pontos, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Pontuação atualizada com sucesso!' });
  });
});

//  DELETE 
// Deletar aluno
app.delete('/alunos/:id', (req, res) => {
  db.query('DELETE FROM alunos WHERE id_aluno=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Aluno deletado com sucesso!' });
  });
});

// Deletar professor
app.delete('/professores/:id', (req, res) => {
  db.query('DELETE FROM professores WHERE id_professor=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Professor deletado com sucesso!' });
  });
});

// Deletar jogo
app.delete('/jogos/:id', (req, res) => {
  db.query('DELETE FROM jogos WHERE id_jogo=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Jogo deletado com sucesso!' });
  });
});

// Deletar pergunta
app.delete('/perguntas/:id', (req, res) => {
  db.query('DELETE FROM perguntas WHERE id_pergunta=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Pergunta deletada com sucesso!' });
  });
});

// Deletar pontuação
app.delete('/pontuacoes/:id', (req, res) => {
  db.query('DELETE FROM pontuacoes WHERE id_pontuacao=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Pontuação deletada com sucesso!' });
  });
});
app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));