
/**
 *  Specials Unit Test
 *  Created by create-test script @ Tue Aug 16 2011 08:04:49 GMT+0000 (UTC)
 **/
/**
 * Dependencies
 */
var     should = require('should')
	  , mongoose = require('mongoose')
	  , example = require('models/Special')
	  , Schema = mongoose.Schema
	  , SchemaType = mongoose.SchemaType
	  , ValidatorError = SchemaType.ValidatorError
	  , DocumentObjectId = mongoose.Types.ObjectId
	  , MongooseError = mongoose.Error;

/**
 * Simple expresso tests for the Special model
 */
module.exports = {
		    
  'Test that a model can be created': function(){
	    var Special = mongoose.model('Special');
	    var model = new Special();
	    model.isNew.should.be.true;    
   },
  'Test that the model is an instance of a mongoose schema': function(){
    var Special = mongoose.model('Special');
    Special.schema.should.be.an.instanceof(Schema);
    Special.prototype.schema.should.be.an.instanceof(Schema);
  },
  'Test that an Special has all of the default fields and values': function(){
    
    var Special = mongoose.model('Special');

    var model = new Special();
    model.isNew.should.be.true;

    model.get('_id').should.be.an.instanceof(DocumentObjectId);
    should.equal(undefined, model.get('name'));
    
   },
  'Test that saving a record with invalid fields returns a validation error': function(){
	  
	    var Special = mongoose.model('Special');	    
	    var model = new Special();
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