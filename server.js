var mongo = require('mongodb');
var http = require('http');
var dispatcher = require('./dispatcher');
var mongoClient = mongo.MongoClient;
var fs = require('fs');

dispatcher.addListener("POST", "/api/insert", function(request, response){
    var header = {"Content-Type" : 'text/html;charset=utf-8'};
	
    mongoClient.connect('mongodb://127.0.0.1:27017', function (err, client) {
        if (err) {
            response.writeHead(500, header );
            response.end("Errore connessione database");
        }
        else {
            //console.log("Parametri da addListener: " + request.parametriGET['txtNome']);
            //Estrae tutte le collection inserite nel db unicorns
			var db=client.db('unicorns');
			var collection = db.collection('unicorns');
			//setto il campo vamp per vedere se è un vampiro o no
			var pPost=request["post"];
			let vampiro=pPost["vampires"];
			console.log(vampiro);
			let vamp;
            if(vampiro=="SI")
                vamp=1;
            else
                vamp=0;
            //al posto del valore fisso inserisco il parametro letto dalla pagina web
            collection.insert({	_id: parseInt(pPost['txtId']),
                    name: pPost['txtNome'],
                    gender: pPost['sex'],
                    weight: parseInt(pPost['txtWeight']),
                    loves: ['grape', 'watermelon'],
                    vampires: vamp},
                function(err, results) {
					if(!err){
						response.writeHead(200, header );
						//stampa la stringa json di inserimento sul db
						response.write(JSON.stringify(results));
					}
					else{
						//response.write("Errore durante la scrittura su db<br>" + err.message);
						error(response,{"code":500,"message":"Errore durante l'esecuione della query. " + err.message});
					}
					response.write('<br><a href="/">Torna alla home</a>');
					response.end();
					client.close();
                });
        }
    });
});

dispatcher.addListener("GET", "/api/select", function(request, response){
	var header = {"Content-Type" : 'text/html;charset=utf-8'};
	mongoClient.connect('mongodb://127.0.0.1:27017', {useNewUrlParser:true}, function (err, client) {
		if (err) {
			response.writeHead(500, header );
			response.end("Errore connessione database");
		}
		else {
            var db=client.db('unicorns');
			var collection = db.collection('unicorns');
			collection.find({gender:"m"}, {name:1, gender:1}).toArray(function(err, results) {
					response.writeHead(200, header );
					//response.write(JSON.stringify(results));
					for (var obj of results){
						for (var k of Object.keys(results[0]))
							response.write(k + ": " + obj[k] + " - ");
						response.write("<br>");
					}
					response.write('<br><a href="/">Torna alla home</a>');
					response.end();
					client.close();
			});
		}
	});
});
	
dispatcher.addListener("GET", "/api/count", function(request, response){
	var header = {"Content-Type" : 'text/html;charset=utf-8'};
	mongoClient.connect('mongodb://127.0.0.1:27017', function (err, client) {
		if (err) {
			response.writeHead(500, header );
			response.end("Errore connessione database"); 
		}
		else {
            var db=client.db('unicorns');
			var collection = db.collection('unicorns');		
			collection.count(function(err, results) {
				response.writeHead(200, header );
				response.write("Il numero di unicorni presenti nel db è: " + JSON.stringify(results)); 
				response.write('<br><a href="/">Torna alla home</a>');
				response.end();
				//response.end(require('util').format("count = %s", results)); 
				client.close();
			});
		}
	});
});

dispatcher.addListener("GET", "/api/select2", function(request, response){
	var header = {"Content-Type" : 'text/html;charset=utf-8'};
	mongoClient.connect('mongodb://127.0.0.1:27017', function (err, client) {
		if (err) {
			response.writeHead(500, header );
			response.end("Errore connessione database"); 
		}
		else {
            var db=client.db('unicorns');
			var collection = db.collection('unicorns');		
			collection.find({gender:"f"}, {name:1}).toArray(function(err, results) {
				response.writeHead(200, header );
				response.write("Risultato query " + JSON.stringify(results) + "<br>");
				var s = "";
				for(var i=0; i<results.length; i++)
					s += results[i].name + "  " + results[i].gender + "<br>";
				response.write(s); 	
				response.write('<br><a href="/">Torna alla home</a>');
				response.end();
				client.close();
			});	
		}
	});
});

dispatcher.addListener("GET", "/api/elenco", function(request, response){
	var header = {"Content-Type" : 'text/html;charset=utf-8'};
	mongoClient.connect('mongodb://127.0.0.1:27017', function (err, client) {
		if (err) {
			response.writeHead(500, header );
			response.end("Errore connessione database"); 
		}
		else {
            var db=client.db('unicorns');
			var collection = db.collection('unicorns');		
			collection.find().toArray(function(err, results) {
				if(!err){
					var s = "";
					for(var i=0; i<results.length; i++)
						s += "<a href='/api/parameters?id=" + results[i]._id + "'>" + results[i]._id + " - " + results[i].name + " - " + results[i].gender + " - " + results[i].weight + " - " + results[i].loves + " - " + results[i].vampires + "</a><br>";
					response.writeHead(200, header );
					//PArte di codice che comprende una formattazione con bootstrap e una struttura compelta html
					//response.write('<html><head><link href="bootstrap/css/bootstrap.css" rel="stylesheet"><link href="bootstrap/css/creative.min.css" rel="stylesheet"><script type="text/javascript" src="bootstrap/js/bootstrap.js"></script><script type="text/javascript" src="bootstrap/js/jQuery.js"></script></head><body id="page-top">');
					response.write('<html><head><link href="../vendor/bootstrap/css/bootstrap.css" rel="stylesheet"><link href="../vendor/bootstrap/css/creative.min.css" rel="stylesheet"><script type="text/javascript" src="../vendor/bootstrap/js/bootstrap.js"></script></head><body id="page-top">');
					response.write('<section>');
					response.write('	<div class="container">');

					response.write('	</div>');
					response.write('</section>');
					response.write('<section class="bg-primary" id="about">');
					response.write('	<div class="container">');
					response.write('		<div class="row">');
					response.write('			<div class="col-lg-12 text-center  border border-success">');
					response.write('				<h2 class="section-heading">Elenco degli unicorni inseriti nel Database</h2>');
					response.write('				<hr class="light">');
					response.write('				<p class="text-faded">Consulta la lista sottostante</p>');
					response.write('				<p><a href="mailto:cicciopuzzo@vallauri.edu" class="btn btn-primary">For disclaimer mail to:  cicciopuzzo@vallauri.edu</a></p>');
					response.write('			</div>');
					response.write('		</div>');
					response.write('	</div>');
					response.write('</section>');
					response.write('<section>');
					response.write('	<div class="container-fluid text-center">');
					response.write('		<div class="row">');
					response.write('			<div class="col-lg-6 well">');
					response.write(s); 	
					response.write('			</div>');
					response.write('			<div class="col-lg-6">');
					response.write('<br><a href="/" class="torna">Torna alla home</a>'); 	
					response.write('			</div>');					
					response.write('		</div>');
					response.write('	</div>');
					response.write('</section>');
					response.write('</body></html>');
					response.end();
				}
				client.close();
			});	
		}
	});
});

dispatcher.addListener("GET", "/api/parameters", function(request, response){
    var header = {"Content-Type" : 'text/html;charset=utf-8'};
    response.writeHead(200, header );
	//var idPar=parseInt(request.parametriGET['id']);
	var idPar=request["get"]["id"];
	console.log("Par ricevuto id = " + idPar);
	response.write("Il parametro id ricevuto è: " + idPar);
	response.write('<br><a href="/">Torna alla home</a>');
	response.end();
});

dispatcher.addListener("GET", "/api/id2", function(request, response){
	var header = {"Content-Type" : 'text/html;charset=utf-8'};
	mongoClient.connect('mongodb://127.0.0.1:27017', function (err, client) {
		if (err) {
			response.writeHead(500, header );
			response.end("Errore connessione database"); 
		}
		else {
            var db=client.db('unicorns');
			var collection = db.collection('unicorns');		
			collection.find({_id: 2}).toArray(function(err, results) {
				if(!err){
					var s = "";
					for(var i=0; i<results.length; i++)
						s += results[i]._id + " - " + results[i].name + " - " + results[i].gender + " - " + results[i].weight + " - " + results[i].loves + " - " + results[i].vampires + "<br>";
					response.writeHead(200, header );
					response.write(s);	
					response.write('<br><a href="/">Torna alla home</a>');
					response.end();
				}
				client.close();
			});	
		}
	});
});

dispatcher.addListener("GET", "/api/eliminaid", function(request, response){
	var header = {"Content-Type" : 'text/html;charset=utf-8'};
	mongoClient.connect('mongodb://127.0.0.1:27017', function (err, client) {
		if (err) {
			response.writeHead(500, header );
			response.end("Errore connessione database"); 
		}
		else {	
			for(param in request["get"])
				console.log(param + ": " + request["get"][param]);
            var db=client.db('unicorns');
			var collection = db.collection('unicorns');		
			response.writeHead(200, header);
			response.write("_id: " + parseInt(request["get"]['txtIdElimina']) + "<br>");
			collection.remove({ _id: parseInt(request["get"]['txtIdElimina'])},function(err, results) {
			if(err){
				response.write("Errore durante la cancellazione!");
			}
			response.write('<br>Numero di record eliminati: '+JSON.stringify(results));
			var obj=JSON.parse(results); //trasformo il json results in un object e poi ne prelevo i campi 'n' e 'ok'
			response.write('<br>Numero di record eliminati: '+ obj.n + " Risultato: " + obj.ok);
			//response.write('<br>Numero di record eliminati: '+JSON.stringify(results));
			response.write('<br><a href="/">Torna alla home</a>');
			response.end();
			client.close();
			});	
		}
	});
});

function error(res, err) {
    res.writeHead(err.code, {"Content-Type": 'text/html;charset=utf-8'});
    res.write("Codice errore: " + err.code + " - " + err.message);
}

/* ********************************************************************** */
http.createServer(function (request, response){
	dispatcher.dispatch(request, response);
}).listen(8888);
dispatcher.showList();
console.log('Server in ascolto sulla porta 8888');