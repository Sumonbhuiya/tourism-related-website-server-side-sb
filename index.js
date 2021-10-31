const express = require('express')
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e8ysq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('travel_agency');
        const serviceCollection = database.collection('services');
        const expertsCollection = database.collection('experts');
        const feedbackCollection = database.collection('users_feedback');
        const useServiceCollection = database.collection('use_services');

        // get api for service
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // post api for service
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.json(result);
        })


        // get api for experts guide
        app.get('/experts', async (req, res) => {
            const cursor = expertsCollection.find({});
            const experts = await cursor.toArray();
            res.send(experts);
        })

        //add orders api
        app.post('/place_order', async (req, res) => {
            const order = req.body;
            const result = await useServiceCollection.insertOne(order);
            res.json(result)
        })

        // get single service 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // get api for manage all orders
        app.get('/use_services', async (req, res) => {
            const cursor = useServiceCollection.find({});
            const manage = await cursor.toArray();
            res.send(manage);
        })

        // update api status 
        app.put('/use_services/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: "Accept"
                },
            };
            const result = await useServiceCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })

        // delete api from use_service 
        app.delete('/use_services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await useServiceCollection.deleteOne(query);
            res.json(result);
        })

        //add feedback api
        app.post('/feedback', async (req, res) => {
            const feedback = req.body;
            const result = await feedbackCollection.insertOne(feedback);
            res.json(result)
        })

        // get api for see all users_feedback
        app.get('/users_feedback', async (req, res) => {
            const cursor = feedbackCollection.find({});
            const manage = await cursor.toArray();
            res.send(manage);
        })

        // delete api from users_feedback 
        app.delete('/users_feedback/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await feedbackCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Tourism server is running ...');
})

app.listen(port, () => {
    console.log('Server running...', port)
})