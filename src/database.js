const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://vinicius:yuOw8dukzeDxn8Zd@cards.jx44f.mongodb.net/?retryWrites=true&w=majority&appName=Cards', {
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

