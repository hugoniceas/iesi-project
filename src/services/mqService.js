import amqplib from 'amqplib';

let connection = null;
let channel = null;

async function connect() {
    if (channel) {
        return;
    }

    try {
        const url = process.env.RABBITMQ_URL;
        connection = await amqplib.connect(url);
        channel = await connection.createChannel();
        console.log('RabbitMQ conectado');
    } catch (error) {
        console.error('Falha ao conectar-se ao RabbitMQ', error);
        throw error;
    }
}

async function publishMessage(queue, message) {
    try {
        await connect();
        await channel.assertQueue(queue , {durable:true});
        const messageBuffer = Buffer.from(JSON.stringify(message));
        channel.sendToQueue(queue, messageBuffer, { persistent: true });
        console.log(`Mensagem enviada para a fila '${queue}': ${message}`);
    } catch (error) {
        console.error(`Erro ao publicar mensagem na fila ${queue}: ${error}`);
        throw error;
    }
}

async function consumeMessage(queue, callback) {
    try {
        await connect();
        await channel.assertQueue(queue, {durable:true});

        console.log('Aguardando mensagens na fila:', queue);
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                const messageContent = JSON.parse(msg.content.toString());
                console.log('Mensagem Recebida:', messageContent);

                callback(messageContent);
                channel.ack(msg);
            }
        }, {
            noAck: false
        });

    } catch(error) {
        console.error(`Erro ao consumir a fila ${queue}: ${error}`);
    }
}

export const mqService = {
    publishMessage,
    consumeMessage
};