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
    fileName: { type: String, required: true, unique: true },
    path: { type: String, required: true },
})

schema.plugin(autoIncrement.plugin, 'ReportImg');

let ReportImg = connection.model('ReportImg', schema);

module.exports = ReportImg;