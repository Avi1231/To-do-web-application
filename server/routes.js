const express = require("express");

// create an instance of our router
const router = express.Router();

const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");


const getCollection = () => {
    const client = getConnectedClient();
    const collection = client.db("todosdb").collection("todos");
    return collection;
};

module.exports = { getCollection };

// GET /todos
router.get("/todos", async (req, res) => {
    const collection = getCollection();
    const todos = await collection.find({}).toArray();

    res.status(200).json(todos);
});

// POST /todos
router.post("/todos", async (req, res) => {
    const collection = getCollection();
    let { todo } = req.body;

    if(!todo){
        return res.status(400).json({mssg: "error no todo found"});
    }
    todo = (typeof todo === "string") ? todo : JSON.stringify(todo);
    const newTodo = await collection.insertOne({ todo, status: false });
    // console.log(req.body)

    res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
})

// DELETE /todos/:id
router.delete("/todos/:id", async (req, res) => {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
  
    const deletedTodo = await collection.deleteOne({ _id });
    res.status(200).json(deletedTodo);
  })

// PUT /todos/:id
router.put('/todos/:id', async (req, res) => {
    const collection = getCollection();
    const { id } = req.params;
    const { status } = req.body;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ mssg: 'Invalid ID format' });
    }

    const _id = new ObjectId(id);

    // Validate status
    if (typeof status !== 'boolean') {
        return res.status(400).json({ mssg: 'Invalid status' });
    }

    try {
        // Perform the update
        const result = await collection.updateOne(
            { _id },
            { $set: { status: !status } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ mssg: 'Todo not found' });
        }

        // Respond with updated document or status
        res.status(200).json({ acknowledged: true, modifiedCount: result.modifiedCount });
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ mssg: 'Internal Server Error' });
    }
});
module.exports = router;