const express = require('express');
const app = express();
const cors = require('cors');
require("dotenv").config();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.etbjr0z.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        // await client.connect();

        const userCollection = client.db("taskDB").collection("user");
        const taskCollection = client.db("taskDB").collection("task");

        app.get("/task", async (req, res) => {
            const cursor = taskCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get("/task/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.findOne(query);
            res.send(result);
        })

        app.post("/task", async (req, res) => {
            const newTask = req.body;
            console.log(newTask);
            const result = await taskCollection.insertOne(newTask);
            res.send(result);
        })

        app.put("/task/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const updatedClass = req.body;
            const updatedDoc = {
                $set: {
                    title: updatedClass.title,
                    description: updatedClass.description,
                    deadline: updatedClass.deadline,
                    priority: updatedClass.priority,
                }
            }
            const result = await taskCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        app.delete("/task/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })

        app.get("/user", async (req, res) => {
            const cursor = userCollection.find();
            const users = await cursor.toArray();
            res.send(users);
        })

        app.post("/user", async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Task Management')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})