const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.twtll.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const productCollection = client.db('emaJohn').collection('products')

        app.get('/products', async(req, res) =>{
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            console.log(page, size);
            const query = {}
            const cursor = productCollection.find(query);
            const products = await cursor.skip(page*size).limit(size).toArray();
            const count = await productCollection.estimatedDocumentCount();
            res.send({count, products});
        });

        app.post('/productsByIds', async(req, res) =>{
            const ids = req.body;
            const objectIds = ids.map(id => ObjectId(id))
            const query = {_id: {$in: objectIds}};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

    }
    finally{

    }
} 
run().catch(err => console.error(err));

app.get('/', (req, res) =>{
    res.send('ema john server is running');
})

app.listen(port, () =>{
    console.log(`ema john running on: ${port}`)
})