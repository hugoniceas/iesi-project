npm install
docker run -d --name meu-rabbitmq -p 15672:15672 -p 5672:5672 rabbitmq:3-management
docker start meu-rabbitmq
npm run dev
## PoC - Serviço de Agendamento Eletrônico

Projeto para a disciplina de Integração e Evolução de Sistemas de Informação
Curso: Ciências da Computação - 25.1 - CIn UFPE

### Grupo responsável pelo projeto

- André Vinícius Nascimento
- Cássio Diniz
- Diego Lyra
- Emmanuel Silva
- Gabriel Almeida
- Gabriel Bezerra
- Guilherme Siqueira
- Ivo Neto
- Hugo Nicéas
- Pedro Fischer
- Renato Correia
- Walter Crasto

---

## Como rodar o projeto

1. Instale as dependências na pasta raiz do projeto:

	```bash
	npm install
	```

2. Instale o Docker. Caso ainda não tenha o RabbitMQ instalado como imagem no Docker, utilize o comando:

	```bash
	docker run -d --name meu-rabbitmq -p 15672:15672 -p 5672:5672 rabbitmq:3-management
	```

	Se já tiver a imagem do RabbitMQ, basta usar:

	```bash
	docker start meu-rabbitmq
	```

3. Inicialize o worker do projeto, entrando na pasta raiz e executando:

	```bash
	node workers/agendamentoWorker.js
	```

4. Abra outro terminal e execute:

	```bash
	npm run dev
	```

---

Pronto! O projeto estará rodando.