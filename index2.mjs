import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

dotenv.config()
const db_username = process.env.MONGO_DB_USERNAME;
const db_password = process.env.MONGO_DB_PASSWORD;
const db_url = process.env.MONGO_DB_URL;
const app = express();

const uri =
  `mongodb+srv://${db_username}:${db_password}@${db_url}?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

app.set('port', 3000);
app.use(cors());
app.use(express.json());

app.post('/findone', async (req, res) => {
  try {
    console.log(req.body);
    const { database, collection, filter, projection } = req.body;
    const client = await MongoClient.connect(uri);
    const databaseObj = client.db(database);
    const collectionObj = databaseObj.collection(collection); ///collection object
    const result = await collectionObj.findOne(filter, { projection });

    res.type('json');
    res.status(200);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.use((req, res) => {
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not found');
});

app.listen(app.get('port'), () => {
  console.log('Express started');
});
