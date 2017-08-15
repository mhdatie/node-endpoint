'use strict';

//used to interact with DB
import {Token} from "../models/token";

//not tested
export const removeExpired = cb => {
	Token.find({}, (err, tokens) => {
		tokens.forEach(token => {
			if(new Date() > token.expirationDate){
				//remove token
				Token.findByIdAndRemove({_id: token._id}, err => {
					if(err){
						return cb(err);
					}
				});
			}
		});
	});
};