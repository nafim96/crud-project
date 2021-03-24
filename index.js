const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const password = "nasir123456";
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const uri =
  "mongodb+srv://nasir96:nasir123456@cluster0.ifi4b.mongodb.net/mongostar?retryWrites=true&w=majority";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const collection = client.db("mongostar").collection("star");

  app.get("/products", (req, res) => {
    collection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // product update database function
  app.get("/product/:id", (req, res) => {
    collection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  app.patch("/update/:id", (req, res) => {
    collection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: { price: req.body.price, quantity: req.body.quantity },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });

  app.post("/addProduct", (req, res) => {
    const product = req.body;
    collection.insertOne(product).then((result) => {
      console.log("data successfully submitted");
      res.redirect("/");
    });
  });

  console.log(err);

  app.delete("/delete/:id", (req, res) => {
    collection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((err, result) => {
        res.send(result.deletedCount > 0);
      });
  });
});

app.listen(3000);
