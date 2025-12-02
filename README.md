# Sistema de E-commerce

Sistema completo de e-commerce desenvolvido com Node.js, Express, MySQL e JavaScript vanilla. Projeto da disciplina de Programação Web - UNIVALI.

## Tecnologias Utilizadas

### Backend
- Node.js
- Express
- MySQL
- mysql2
- cors
- dotenv
- node-fetch

### Frontend
- HTML5
- CSS3
- Bootstrap 5
- JavaScript (ES6 Modules)
- Font Awesome

##  Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (v14 ou superior)
- [XAMPP](https://www.apachefriends.org/) (Apache + MySQL + phpMyAdmin)

##  Instalação e Configuração

### 1️ Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/ecommerce-projeto.git
cd ecommerce-projeto
```

### 2️ Configurar o Banco de Dados

1. Abra o **XAMPP Control Panel**
2. Inicie o **Apache** e o **MySQL**
3. Acesse: `http://localhost/phpmyadmin`
4. Clique na aba **"SQL"**
5. Copie e cole todo o conteúdo do arquivo `database/schema.sql`
6. Clique em **"Executar"**

Isso criará o banco de dados `ecommerce_db` com todas as tabelas necessárias.

### 3️ Configurar o Backend

1. Navegue até a pasta backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` na pasta `backend/` com o seguinte conteúdo:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ecommerce_db
DB_PORT=3306
FAKESTORE_API_URL=https://fakestoreapi.com
```

**⚠️ Importante:** No XAMPP, a senha padrão do MySQL é **vazia** (deixe `DB_PASSWORD=` sem nada depois do `=`)

### 4️ Copiar o Frontend para o XAMPP

Copie a pasta `frontend` para dentro da pasta `htdocs` do XAMPP:

**Windows:**
```
Copie: frontend/
Para: C:\xampp\htdocs\ecommerce-projeto\frontend\
```

**Mac/Linux:**
```
Copie: frontend/
Para: /Applications/XAMPP/htdocs/ecommerce-projeto/frontend/
```

## Executando o Projeto

### 1️ Iniciar o Backend

No terminal, dentro da pasta `backend`:
```bash
npm start
```

Você deve ver:
```
✅ Conectado ao banco de dados MySQL
🚀 Servidor rodando na porta 3000
```

**⚠️ Mantenha este terminal aberto!**

### Importar os Produtos

**Opção 1 - PowerShell:**
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/import/fakestore -Method POST
```

**Opção 2 - Via Navegador:**
1. Abra: `http://localhost:3000`
2. Abra o Console (F12)
3. Cole e execute:
```javascript
fetch('http://localhost:3000/api/import/fakestore', {method: 'POST'})
  .then(r => r.json())
  .then(d => console.log(d))
```

Você deve ver: `"message": "20 produtos importados com sucesso"`

### Acessar o Frontend

Com o Apache rodando no XAMPP, abra o navegador:
```
http://localhost/ecommerce-projeto/frontend/
```

## Funcionalidades

- ✅ Catálogo de produtos com filtros e busca
- ✅ Sistema de carrinho de compras
- ✅ Validação de estoque em tempo real
- ✅ Checkout e finalização de pedidos
- ✅ Consulta de pedidos por email
- ✅ Importação de produtos da FakeStore API
- ✅ Controle de estoque automático

## Endpoints da API

### Produtos
- `GET /api/produtos` - Lista todos os produtos
- `GET /api/produtos/:id` - Detalhes de um produto
- `GET /api/produtos/categorias` - Lista categorias
- `POST /api/produtos/validar-estoque` - Valida estoque

### Pedidos
- `POST /api/pedidos` - Criar novo pedido
- `GET /api/pedidos?email=cliente@email.com` - Lista pedidos do cliente

### Importação
- `POST /api/import/fakestore` - Importa produtos da FakeStore API


##  Solução de Problemas

### Backend não conecta ao MySQL
- Verifique se o MySQL está rodando no XAMPP (verde)
- Confirme que a senha no `.env` está vazia (`DB_PASSWORD=`)

### Frontend não abre
- Certifique-se que o Apache está rodando no XAMPP
- Verifique se copiou o frontend para `C:\xampp\htdocs\`
- URL correta: `http://localhost/ecommerce-projeto/frontend/`

### Produtos não aparecem
- Execute a importação de produtos (passo 2️ da execução)
- Verifique se o backend está rodando
- Abra o Console do navegador (F12) para ver erros

## Autores

[Joao Pedro Ferreira Dias] 
[Pedro Padilha] 

Este projeto foi desenvolvido para fins educacionais.
Projeto da disciplina de Programação Web - UNIVALI
