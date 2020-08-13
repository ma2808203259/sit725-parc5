var express = require("express"),
  app = express();

const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
var port = process.env.PORT || 8080;

//uri connect to the database
//const uri = "mongodb+srv://ray:1998@cluster0.ho33k.mongodb.net/Sitboard?retryWrites=true&w=majority";
const uri = "mongodb://ray:1998@cluster0-shard-00-00.ho33k.mongodb.net:27017,cluster0-shard-00-01.ho33k.mongodb.net:27017,cluster0-shard-00-02.ho33k.mongodb.net:27017/Sitboard?ssl=true&replicaSet=atlas-k8w5gq-shard-0&authSource=admin&retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})


app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());




//endpoint to create a journal
app.post('/journals', (req, res) => {
  console.log('body', req.body);
  let journal = req.body;
  insertJournal(journal, res);
});

//endpoint to serve the journals
app.get('/journals', (req, res) => {
  getJournals(res)
});

//endpoint to update a journal with a comment
app.put('/journals', (req, res) => {

});
//connect to the database
let journalsCollection
const openConnection = () => {
  client.connect(err => {
    journalsCollection = client.db("Sitboard").collection("journals");
    if (!err) {
      console.log('connected to the database');
    }

  })
}

//database function to get the journals
//retrieve all journals
const getJournals = (res) => {
  journalsCollection.find().toArray((err, result) => {
    if (err) throw err;
    res.send(result);
  })
}

//database function to create a journal
const insertJournal = (journal, res) => {
  //append date to journal object
  let date = new Date();
  journal.date = date;
  journal.comments = [];
  //insert into the collection
  journalsCollection.insert(journal, (err, result) => {
    console.log('Journal Inserted ', result);
    //send 200 to user if success
    res.send({
      result: 200
    })
  })
}
//database function to update a journal

app.get("/test", function (request, response) {
  var user_name = request.query.user_name;
  response.end("Hello " + user_name + "!");
});


openConnection()

app.listen(port);
console.log("Listening on port ", port);

require("cf-deployment-tracker-client").track();