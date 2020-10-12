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
  title: { type: String, required: true },
  body: { type: String, required: true },
  createdBy: { type: Number, required: true  },
})

schema.plugin(autoIncrement.plugin, 'Report');

let Report = connection.model('Report', schema);

module.exports = Report;