const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let todos = [];
app.get('/todos', (req, res) => res.json(todos));
app.post('/todos', (req, res) => {
  const { task } = req.body;
  if (task) {
    todos.push({ id: todos.length + 1, task });
    res.status(201).json({ message: 'Task added', todos });
  } else {
    res.status(400).json({ error: 'Task is required' });
  }
});

describe('To-Do List API', () => {
  beforeEach(() => { todos = []; });

  it('should get empty todos list', async () => {
    const res = await request(app).get('/todos');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it('should add a new task', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ task: 'Buy milk' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.todos).toContainEqual({ id: 1, task: 'Buy milk' });
  });

  it('should return error for missing task', async () => {
    const res = await request(app)
      .post('/todos')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('Task is required');
  });
});
