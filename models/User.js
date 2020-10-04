const config = require('config')


let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    model = mongoose.model,
    Types = mongoose.Types,
    autoIncrement = require('mongoose-auto-increment');
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false);
    
const connection = mongoose.createConnection(config.get("mongoUri"), { useNewUrlParser: true, useUnifiedTopology: true });


autoIncrement.initialize(connection);


const schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    links: [{ type: Types.ObjectId, ref: 'Link' }]
})

schema.plugin(autoIncrement.plugin, 'User');

let User = connection.model('User', schema);

// module.exports = model('User', schema)
module.exports = User