const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connection = process.env.MONGO_URI || 'mongodb+srv://vinicius:yuOw8dukzeDxn8Zd@cards.jx44f.mongodb.net/?retryWrites=true&w=majority&appName=Cards'

        await mongoose.connect(connection, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conexão com MongoDB realizada com sucesso!');
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;

module.exports = {
    mongoUri: process.env.MONGO_URI,
};


