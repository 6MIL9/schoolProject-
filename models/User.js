const config = require('config')

let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    model = mongoose.model,
    Types = mongoose.Types,
    autoIncrement = require('mongoose-auto-increment');

const connection = mongoose.createConnection(config.get("mongoUri"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

autoIncrement.initialize(connection);

const schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

schema.plugin(autoIncrement.plugin, 'User');

let User = connection.model('User', schema);

module.exports = User;