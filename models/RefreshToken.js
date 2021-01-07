const config = require('config')

let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
    
const connection = mongoose.createConnection(config.get("mongoUri"), {  
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

autoIncrement.initialize(connection);

const schema = new Schema({
  user: { type: Number, required: true  },
  token: { type: String, required: true  },
  created: { type: Date, default: Date.now },
})

schema.plugin(autoIncrement.plugin, 'RefreshToken');

let RefreshToken = connection.model('RefreshToken', schema);

module.exports = RefreshToken;