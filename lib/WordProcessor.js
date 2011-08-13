var fs = require('fs');
var words = [];

module.exports = function(message) {
	
	var i;
	var _words = message.chop();
	var Word = mongoose.model('Word');
	
	for (i=0; i<_words.length; i++)
	{
		words[i] = {str: _words[i], count: -1};
		countWordInstances(words[i].str);
	}
	
	//Word.find({word: word}, function (err, words) {
		
	//});
	
}

function countWordInstances (word) {
	Word.find({word: word}, function (err, dbword) {
  	console.log("Count: "+dbword.occurrences);
		var i;
		for (i=0; i<words.length; i++) {
			if (words[i].str == word) {
				words[i].word = dbword;
				words[i].count = dbword.occurrences;
			}
		}
		if (count == 0) {
			
		  var word = new Word({word: word, occurrences: 0});
			word.save(function(err) {
				if (err) {
					console.log("Could not save: "+word);
					return;
				}
				console.log("Saved word: "+word);
			});
		}
	}
}

if (!String.prototype.chop)
{
	String.prototype.chop = function()
	{
		var i;
		var allowed_chars = "[A-Za-z0-9#-]";
		var message = "";
		var words = [];
		
		for (i=0; i<this.length; i++)
		{
			if (this.charAt(i).match(allowed_chars))
			{
				message += this.charAt(i);
			} else
			{
				if (message.length > 0 && message.charAt(message.length-1) != " ")
				{
					message += " ";
				}
			}
		}
		if (message.charAt(message.length-1) == " ")
		{
			message = message.substring(0, message.length-1);
		}
		
		if (message.length > 0)
		{
			words = message.split(" ");
		}
		return words;
	}
}