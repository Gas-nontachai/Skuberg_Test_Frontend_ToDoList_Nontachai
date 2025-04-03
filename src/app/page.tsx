"use client";
import React, { useState } from "react";
import { Typography, TextField, Button, List, ListItem, IconButton, Checkbox, Select, MenuItem } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Task } from "@/misc/types";

const TodoListPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState<string>("");
  const [category, setCategory] = useState<string>("General");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("createdAt");
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const addTask = () => {
    if (task.trim() !== "") {
      setTasks([
        ...tasks,
        { text: task, completed: false, createdAt: new Date().toLocaleString(), category },
      ]);
      setTask("");
      setCategory("General");
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

  const startEditingTask = (index: number) => {
    setEditingIndex(index);
    setEditingText(tasks[index].text);
  };

  const saveEditedTask = () => {
    if (editingIndex !== null && editingText.trim() !== "") {
      const newTasks = tasks.map((t, i) =>
        i === editingIndex ? { ...t, text: editingText } : t
      );
      setTasks(newTasks);
      setEditingIndex(null);
      setEditingText("");
    }
  };

  const filteredTasks = tasks
    .filter((task) =>
      task.text.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((task) =>
      filterCategory === "All" ? true : task.category === filterCategory
    )
    .sort((a, b) => {
      if (sortOrder === "createdAt") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortOrder === "completed") {
        return Number(a.completed) - Number(b.completed);
      }
      return 0;
    });

  const incompleteTasks = filteredTasks.filter((task) => !task.completed);
  const completedTasks = filteredTasks.filter((task) => task.completed);

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
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-32"
        >
          <MenuItem value="General">General</MenuItem>
          <MenuItem value="Work">Work</MenuItem>
          <MenuItem value="Personal">Personal</MenuItem>
        </Select>
        <Button variant="contained" color="primary" onClick={addTask}>
          Add
        </Button>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64"
        />
        <Select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-32"
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="General">General</MenuItem>
          <MenuItem value="Work">Work</MenuItem>
          <MenuItem value="Personal">Personal</MenuItem>
        </Select>
        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-32"
        >
          <MenuItem value="createdAt">Created At</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
      </div>
      <List className="w-full max-w-md bg-white rounded-lg shadow-md mb-4">
        {incompleteTasks.map((t, index) => (
          <ListItem
            key={index}
            className="border-b last:border-b-0 border-gray-200"
            secondaryAction={
              <>
                <IconButton edge="end" aria-label="edit" onClick={() => startEditingTask(index)}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(index)}>
                  <Delete />
                </IconButton>
              </>
            }
          >
            <Checkbox
              checked={t.completed}
              onChange={() => toggleTaskCompletion(index)}
            />
            <div style={{ textDecoration: t.completed ? "line-through" : "none" }}>
              {editingIndex === index ? (
                <TextField
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={saveEditedTask}
                  autoFocus
                />
              ) : (
                t.text
              )}
              <div>
                <Typography variant="body2" color="textSecondary">
                  Category: {t.category}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Created: {t.createdAt}
                </Typography>
              </div>
            </div>
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
              <>
                <IconButton edge="end" aria-label="edit" onClick={() => startEditingTask(index)}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(index)}>
                  <Delete />
                </IconButton>
              </>
            }
          >
            <Checkbox
              checked={t.completed}
              onChange={() => toggleTaskCompletion(index)}
            />
            <div style={{ textDecoration: t.completed ? "line-through" : "none", }}>
              {editingIndex === index ? (
                <TextField
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={saveEditedTask}
                  autoFocus
                />
              ) : (
                t.text
              )}
              <div>
                <Typography variant="body2" color="textSecondary">
                  Category: {t.category}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Created: {t.createdAt}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Completed: {t.completedAt}
                </Typography>
              </div>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TodoListPage;