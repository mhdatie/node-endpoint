'use strict';

const mongoose = require('mongoose');

// Define our token schema
const TokenSchema   = new mongoose.Schema({
  value: { type: String, required: true },
  userId: { type: String, required: true }, //if null -> client only
  clientId: { type: String, required: true },
  expirationDate: {type: Date, required: true}, //todo config part
  scope: {type: String, default: null}
});

// Export the Mongoose model
export const Token = mongoose.model('Token', TokenSchema);
