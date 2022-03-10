const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient} = require('mongodb');

const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vxcvn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("charitox");
    const donatesColllection = database.collection("donatesColllection");

    // insert to donatesColllection
    app.post('/donates', async (req, res) => {
      const donate = req.body;
      const result = await donatesColllection.insertOne(donate);
      res.json(result)
    });

    // show to donatesColllection all data who donated us
    app.get('/donates', async (req, res) => {
      const query = {};
      const cursor = donatesColllection.find(query);
      const donates = await cursor.toArray();
      res.json(donates);
    });    

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// to test
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})