const Discord = require("discord.js");
const client = new Discord.Client();
var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var auth = require('./auth.json');
var fs = require('fs');

client.on("ready", () => {
	/* Log */ console.log("DimaVision is now hosted on this machine.");
	client.user.setActivity('image databases', { type: 'WATCHING' })
	.then(presence => 
		/* Log */ console.log(`Status updated succesfully.\n==================================================`))
  	.catch("There was an error updating the status");
});

client.on("message", (message) => {
  	if (message.content.startsWith("!dimavision")) {
        var args = message.content.substring(1).split(' ')[1];

        try {
        	if (!args.includes("grabify")){
        		if(args.includes("http") || args.includes("www") && ((args.includes("jpeg") || args.includes("jpg") || args.includes("png") || args.includes("image")))) {
	        		/* Log */ console.log("Valid image found.");
	   				message.channel.startTyping(3);
					message.channel.send("This seems legit. Lemme analyze it with my 3 human neurons...")
					var imageID = Math.floor(Math.random()*9000000000) + 1000000000;
					/* Log */ console.log("Generated random ID for the image. (" + imageID + ")")
					var request = require('request');
					const stream = request(args).pipe(fs.createWriteStream("./temp/" + imageID + '.png'))
					stream.on('finish', () => {
				      console.log("Image downloaded.\nRunning IBM's API.");
					    var visualRecognition = new VisualRecognitionV3({
							url: 'https://gateway.watsonplatform.net/visual-recognition/api',
			   				version: '2018-03-19',
			    			iam_apikey: auth.watson_apikey
						});
				      	var images_file= fs.createReadStream("./temp/" + imageID + ".png");
						var params = {
							images_file: images_file,
							threshold: 0.5
						};
						visualRecognition.classify(params, function(err, response) {
							if (err){
								/* Log */ console.log("Image recognition failed!");
							}
							else{
								var stringResult = (JSON.stringify(response.images[0].classifiers[0].classes[0].class, null, 2)).replace(/"/g,"");
								/* Log */ console.log("Prediction: " + stringResult);
								switch(stringResult.charAt(0)){
									case "a": case "e": case "i": case "o": case "u":
										message.channel.send("Okay, my advanced mind thinks it is an " + stringResult);
										break;
									default:
										message.channel.send("Okay, my advanced mind thinks it is a " + stringResult);
										break;
								}
								/* Log */ console.log("==================================================")
							}		
						});
						fs.unlink("./temp/" + imageID + ".png", (err) => {
		        			if (err) {
		            			/* Log */ console.log("There was an error deleting the image :(");
		        			} else {
		            			/* Log */ console.log('Image deleted succesfully!');                                
		        			}
		        			message.channel.stopTyping(true);
						});
				    });	
				} else if (args.includes("shut") || args.includes("fuck") || args.includes("ass") || args.includes("nigger") || args.includes("bitch") || args.includes("kid") || args.includes("retard")){
					message.guild.fetchMember(message.author).then(member => {
		    			message.channel.send("you nigger have big gay " + member, {
							file: "./content/boi.mp3"
						});
		  			});		
		        } 
				else if (args.includes("http") || args.includes("www") && !(args.includes("jpeg") || args.includes("jpg") || args.includes("png") || args.includes("image"))){
					message.channel.send("Your link is broke as fuck bro");
				}  
				else {
					message.channel.send("wtf I think someone just mistook me for Google Assistant", {
						file: "./content/wat.png"
					});
					setTimeout(function () {
		        		message.channel.send("bitch");
		    		}, 2500);
				}     
	        }
	        else
	        {
	        	message.channel.send("good try");
	        }
        }
        catch (err){
        	message.channel.send("Oof, I crashed");
        } 
    }
});

client.login(auth.discord_token);