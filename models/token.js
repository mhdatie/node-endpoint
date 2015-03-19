// Load required packages
var mongoose = require('mongoose');

// Define our token schema
var TokenSchema   = new mongoose.Schema({
  value: { type: String, required: true },
  userId: { type: String, required: true }, //if null -> client only
  clientId: { type: String, required: true },
  expirationDate: {type: Date, required: true}, //todo config part
  scope: {type: String, required: true}
});

// Export the Mongoose model
module.exports = mongoose.model('Token', TokenSchema);
