"use client";
import React, { useState } from "react";
import { TextField, Button, List, ListItem, ListItemText, IconButton, Checkbox } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Task {
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

const TodoListPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState<string>("");

  const addTask = () => {
    if (task.trim() !== "") {
      setTasks([
        ...tasks,
        { text: task, completed: false, createdAt: new Date().toLocaleString() },
      ]);
      setTask("");
    }
  };

  const deleteTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const toggleTaskCompletion = (index: number) => {
    const newTasks = tasks.map((t, i) =>
      i === index
        ? {
          ...t,
          completed: !t.completed,
          completedAt: !t.completed ? new Date().toLocaleString() : undefined,
        }
        : t
    );
    setTasks(newTasks);
  };

  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">To-Do List</h1>
      <div className="flex items-center gap-2 mb-4">
        <TextField
          label="New Task"
          variant="outlined"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-64"
        />
        <Button variant="contained" color="primary" onClick={addTask}>
          Add
        </Button>
      </div>
      <List className="w-full max-w-md bg-white rounded-lg shadow-md mb-4">
        {incompleteTasks.map((t, index) => (
          <ListItem
            key={index}
            className="border-b last:border-b-0 border-gray-200"
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(index)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <Checkbox
              checked={t.completed}
              onChange={() => toggleTaskCompletion(index)}
            />
            <ListItemText
              primary={t.text}
              secondary={
                <>
                  <div>Created: {t.createdAt}</div>
                </>
              }
              style={{
                textDecoration: t.completed ? "line-through" : "none",
              }}
            />
          </ListItem>
        ))}
      </List>
      <h2 className="text-xl font-bold mb-2">Completed Tasks</h2>
      <List className="w-full max-w-md bg-white rounded-lg shadow-md">
        {completedTasks.map((t, index) => (
          <ListItem
            key={index}
            className="border-b last:border-b-0 border-gray-200"
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(index)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <Checkbox
              checked={t.completed}
              onChange={() => toggleTaskCompletion(index)}
            />
            <ListItemText
              primary={t.text}
              secondary={
                <>
                  <div>Created: {t.createdAt}</div>
                  <div>Completed: {t.completedAt}</div>
                </>
              }
              style={{
                textDecoration: t.completed ? "line-through" : "none",
              }}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TodoListPage;