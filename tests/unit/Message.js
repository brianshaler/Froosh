
/**
 *  Messages Unit Test
 *  Created by create-test script @ Sat Aug 13 2011 20:01:25 GMT+0000 (UTC)
 **/
/**
 * Dependencies
 */
var     should = require('should')
	  , mongoose = require('mongoose')
	  , example = require('models/Message')
	  , Schema = mongoose.Schema
	  , SchemaType = mongoose.SchemaType
	  , ValidatorError = SchemaType.ValidatorError
	  , DocumentObjectId = mongoose.Types.ObjectId
	  , MongooseError = mongoose.Error;

/**
 * Simple expresso tests for the Message model
 */
module.exports = {
		    
  'Test that a model can be created': function(){
	    var Message = mongoose.model('Message');
	    var model = new Message();
	    model.isNew.should.be.true;    
   },
  'Test that the model is an instance of a mongoose schema': function(){
    var Message = mongoose.model('Message');
    Message.schema.should.be.an.instanceof(Schema);
    Message.prototype.schema.should.be.an.instanceof(Schema);
  },
  'Test that an Message has all of the default fields and values': function(){
    
    var Message = mongoose.model('Message');

    var model = new Message();
    model.isNew.should.be.true;

    model.get('_id').should.be.an.instanceof(DocumentObjectId);
    should.equal(undefined, model.get('name'));
    
   },
  'Test that saving a record with invalid fields returns a validation error': function(){
	  
	    var Message = mongoose.model('Message');	    
	    var model = new Message();
	    model.set('name', '');
	    model.save(function(err){
	      
	      err.should.be.an.instanceof(MongooseError);
	      err.should.be.an.instanceof(ValidatorError);
	      
	      model.set('name', 'I exist!');
	      model.save(function(err){
	        should.strictEqual(err, null);
	      });
	      
	    });	    

  }

};