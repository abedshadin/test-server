const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cj9ty.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {
  try {
    await client.connect();
    const firmCollection = client.db('firm').collection('firms');
    const receiptCollection = client.db('receipts').collection('receipt');
    //get all firms list on select
    app.get('/firm', async (req, res) => {
      const query = {};
      const cursor = firmCollection.find(query);
      const firms = await cursor.toArray();
      res.send(firms);
    });

    //get all receipt
    app.get('/receipt', async (req, res) => {
      // const tokenInfo = req.headers.authorization;
      // const [email, accessToken] = tokenInfo?.split(" ");
      // const decoded = verifyToken(accessToken)
      // if (email === decoded.email) {
        const query = {};
        const cursor = receiptCollection.find(query);
        const receipt = await cursor.toArray();
        res.send(receipt);
      // }

      // else {
      //   res.send({ success: 'unauthorize' })
      // }

    });


     //delete single receipt
     app.delete("/receipt/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await receiptCollection.deleteOne(query);
      res.send(result);
    });

    //delete firm
    app.delete("/firms/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await firmCollection.deleteOne(query);
      res.send(result);
    });

    // app.post('/login', (req, res) => {
    //   const email = req.body;
    //   const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET);
    //   res.send({ token })
    // })

    app.put("/flat/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const doc = {
        $set: req.body,
      };
      const tools = await flatCollection.updateOne(query, doc, options);
      res.send(tools);
      console.log(doc);
    });

    app.put("/flat/makeGB/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: { gb_status: "Paid" },
      };
      const result = await flatCollection.updateOne(filter, updateDoc);
      res.send(result);
    });


    app.put("/flat/makeSC/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: { sc_status: "Paid" },
      };
      const result = await flatCollection.updateOne(filter, updateDoc);
      res.send(result);
    });



    //get some by total daily on homepage


    app.get("/home", async (req, res) => {
      const date = req.query.date;
      const query = { date: date };
      const reports = await receiptCollection.find(query).toArray();
      res.send(reports);
    });


    app.put('/receiptPaid/:id', async (req, res) => {
      // res.send("Working")
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true }
      const doc = {
        $set: req.body
      }
      const result = await receiptCollection.updateOne(query, doc, options);
      res.send(result);
    });


    app.put('/receipt/:id', async (req, res) => {
      // res.send("Working")
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true }
      const doc = {
        $set: req.body
      }
      const result = await receiptCollection.updateOne(query, doc, options);
      res.send(result);
    });
    //get some by total daily on homepage


    app.get("/reports/daily", async (req, res) => {
      const date = req.query.date;
      const query = { date: date };
      const reports = await receiptCollection.find(query).toArray();
      res.send(reports);
    });
    //get some by total yearly on homepage


    app.get("/reports/yearly", async (req, res) => {
      const year = req.query.year;
      const query = { year: year };
      const reports = await receiptCollection.find(query).toArray();
      res.send(reports);
    });


    //get some by total monthly on homepage


    app.get("/homes", async (req, res) => {
      const month = req.query.month;
      const query = { month: month };
      const reports = await receiptCollection.find(query).toArray();
      res.send(reports);
    });


    //get some by month


    app.get("/reports", async (req, res) => {
      const month = req.query.month;
      const query = { month: month };
      const reports = await receiptCollection.find(query).toArray();
      res.send(reports);
    });
    //get some by firmname


    app.get("/reports/firm", async (req, res) => {
      const firmName = req.query.firmName;
      const query = { firmName: firmName };
      const reports = await receiptCollection.find(query).toArray();
      res.send(reports);
    });
    //add bidder
    app.post("/addfirm", async (req, res) => {
      const newOrder = req.body;
      // const tokenInfo = req.headers.authorization;
      // const [email, accessToken] = tokenInfo?.split(" ");
      // const decoded = verifyToken(accessToken)
      // if (email === decoded.email) {
        const result = await firmCollection.insertOne(newOrder);
        res.send(result);
      // }

      // else {
      //   res.send({ success: 'unauthorize' })
      // }
    });
    //add receipt
    app.post("/receipt", async (req, res) => {
      const newOrder = req.body;
      // const tokenInfo = req.headers.authorization;
      // const [email, accessToken] = tokenInfo?.split(" ");
      // const decoded = verifyToken(accessToken)
      // if (email === decoded.email) {
        const result = await receiptCollection.insertOne(newOrder);
        res.send(result);
      // }

      // else {
      //   res.send({ success: 'unauthorize' })
      // }
    });


    //get single  details
    app.get("/receipt/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tools = await receiptCollection.findOne(query);
      res.send(tools);
    });



  }
  finally {

  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Running Rasel Server');
});

app.listen(port, () => {
  console.log('Listening to port', port);
})

// function verifyToken(token) {
//   let email =
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
//       if (err) {
//         email = 'invalid email'
//       }
//       if (decoded) {
//         email = decoded
//       }

//     })
//   return email;
// }