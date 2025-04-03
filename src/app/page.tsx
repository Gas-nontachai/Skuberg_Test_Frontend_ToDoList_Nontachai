"use client";
import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { CircularProgress, Typography, TextField, Button, List, ListItem, IconButton, Checkbox, Select, Menu, MenuItem, Collapse, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff, Search, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { Delete, Edit, Sort, Clear } from "@mui/icons-material";
import { formatDate } from "@/utils/date-helper"
import { generateID } from "@/utils/generator-id"
import { Task } from "@/misc/types";
import { useTask } from "@/hook/hooks";
import UpdateTask from "@/app/components/Task/Update";
const { getTaskBy, insertTask, updateTaskBy, deleteTaskBy } = useTask();

const TodoListPage: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [open_update, setOpenUpdate] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState<Task>({
    task_id: "",
    text: "",
    category: "General",
    completed: false,
    createdAt: new Date(),
    completedAt: undefined,
  });

  const [selected_task_id, setSelectedTaskID] = useState("");

  const [search_query, setSearchQuery] = useState<string>("");
  const [sort_order, setSortOrder] = useState<{ name: string; order: "ASC" | "DESC" }>({
    name: "createdAt",
    order: "ASC",
  });
  const [filter_category, setFilterCategory] = useState<string>("All");

  const [task_category_option, setTaskCategoryOption] = useState<string[]>(
    ["General", "Work", "Personal"]
  );

  useEffect(() => {
    try {
      fetchTasks();
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [filter_category, sort_order]);

  const fetchTasks = async () => {
    try {
      const { docs: res } = await getTaskBy();
      let filtered_tasks = res;
      if (search_query.trim() !== "") {
        filtered_tasks = filtered_tasks.filter(task =>
          task.text.toLowerCase().includes(search_query.toLowerCase())
        );
      }
      if (filter_category !== "All") {
        filtered_tasks = filtered_tasks.filter(task =>
          task.category === filter_category
        );
      }
      filtered_tasks.sort((a, b) => {
        let comparison = 0;
        if (sort_order.name === "createdAt") {
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return sort_order.order === "DESC" ? -comparison : comparison;
      });
      setTasks(filtered_tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (!task.text.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Task description cannot be empty.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    const data = {
      ...task,
      task_id: generateID(),
      createdAt: new Date(),
    };
    await insertTask(data);
    await fetchTasks();
    Swal.fire({
      icon: 'success',
      title: 'Task added successfully!',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
    });

    setTask({
      task_id: "",
      text: "",
      category: "General",
      completed: false,
      createdAt: new Date(),
      completedAt: undefined,
    });
  };

  const deleteTask = async (task_id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await deleteTaskBy({ task_id });
      await fetchTasks();
      Swal.fire({
        icon: 'success',
        title: 'Task deleted successfully!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Cancelled',
        text: 'Your task is safe!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const toggleTaskCompletion = async (task_id: string, completed: boolean) => {
    let data = tasks.find(task => task.task_id === task_id);
    if (data) {
      data = {
        ...data,
        completed: completed,
        completedAt: new Date()
      };
      await updateTaskBy(data)
      await fetchTasks();
      Swal.fire({
        icon: 'success',
        title: 'Task updated successfully!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const handleEdit = (task_id: string) => {
    setSelectedTaskID(task_id);
    setOpenUpdate(true);
  };

  const toggleSort = (value: string) => {
    setSortOrder((prevSort) => {
      if (prevSort.name === value) {
        return {
          ...prevSort,
          order: prevSort.order === "ASC" ? "DESC" : "ASC",
        };
      } else {
        return {
          name: value,
          order: "ASC",
        };
      }
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterCategory("All");
    setSortOrder({ name: "createdAt", order: "ASC" });
    fetchTasks();
  };

  const category = task_category_option[0];
  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">To-Do List</h1>
      <div className="flex items-center gap-2 mb-4">
        <TextField
          label="New Task"
          variant="outlined"
          value={task.text}
          onChange={(e) => setTask({ ...task, text: e.target.value })}
          className="w-64"
        />
        <Select
          value={category}
          onChange={(e) => setTask({ ...task, category: e.target.value })}
          className="w-32"
        >
          {
            task_category_option.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))
          }
        </Select>
        <Button variant="contained" color="primary" onClick={addTask}>
          Add
        </Button>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <TextField
          label="Search"
          variant="outlined"
          value={search_query}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchTasks();
            }
          }}
          className="w-64"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={fetchTasks} color="primary">
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Select
          value={filter_category}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-32"
        >
          <MenuItem value="All">All</MenuItem>
          {
            task_category_option.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))
          }
        </Select>
        <div className="flex gap-2">
          <Button
            className="bg-gray-200 p-2 rounded-md text-sm text-gray-700 flex items-center gap-1"
            onClick={(event) => { setAnchorEl(event.currentTarget) }}
            endIcon={<Sort />}
          >
            Sort
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => { setAnchorEl(null) }}
          >
            <MenuItem onClick={() => toggleSort("createdAt")}>
              จัดเรียงตามวันที่
              {sort_order.name === "createdAt" && (sort_order.order === "ASC" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
            </MenuItem>
          </Menu>
        </div>
        <Button
          variant="outlined"
          color="secondary"
          onClick={clearFilters}
          startIcon={<Clear />}
          className="ml-2"
        >
          Clear
        </Button>
      </div>

      {
        loading == true ? (
          <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
            <CircularProgress />
          </div>
        ) : incompleteTasks.length > 0 ? (
          <>
            {incompleteTasks.map((t, index) => (
              <List className="w-full max-w-md bg-white rounded-lg shadow-md mb-4" key={index}>
                <ListItem
                  key={index}
                  className="border-b last:border-b-0 border-gray-200"
                  secondaryAction={
                    <>
                      <IconButton edge="end" aria-label="edit" onClick={() => { handleEdit(t.task_id) }}>
                        <Edit />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(t.task_id)}>
                        <Delete />
                      </IconButton>
                    </>
                  }
                >
                  <Checkbox checked={t.completed} onChange={() => toggleTaskCompletion(t.task_id, true)} />
                  <div style={{ textDecoration: t.completed ? "line-through" : "none" }}>
                    {t.text}
                    <div>
                      <Typography variant="body2" color="textSecondary">
                        Category: {t.category}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Created: {formatDate(t.createdAt, 'dd/MM/yyyy HH:mm:ss')}
                      </Typography>
                    </div>
                  </div>
                </ListItem>
              </List>
            ))}
          </>
        ) : (
          <Typography variant="body1" color="textSecondary" align="center">
            No pending tasks
          </Typography>
        )
      }

      {
        completedTasks.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h6" className="font-bold">Completed Tasks</Typography>
              <Button
                variant="text"
                color="primary"
                onClick={() => setShowCompleted(!showCompleted)}
                className="text-blue-500"
                startIcon={showCompleted ? <VisibilityOff /> : <Visibility />}
              >
                {showCompleted ? "Hide" : "Show"}
              </Button>
            </div>
            <Collapse in={showCompleted} className="w-full max-w-md bg-white rounded-lg shadow-md" >
              <List >
                {completedTasks.map((t, index) => (
                  <ListItem
                    key={index}
                    className="border-b last:border-b-0 border-gray-200"
                    secondaryAction={
                      <>
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(t.task_id)}>
                          <Delete />
                        </IconButton>
                      </>
                    }
                  >
                    <Checkbox
                      checked={t.completed}
                      onChange={() => toggleTaskCompletion(t.task_id, false)}
                    />
                    <div style={{ textDecoration: t.completed ? "line-through" : "none" }}>
                      {t.text}
                      <div>
                        <Typography variant="body2" color="textSecondary">
                          Category: {t.category}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Created: {formatDate(t.createdAt, 'dd/MM/yyyy HH:mm:ss')}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Completed: {formatDate(t.completedAt, 'dd/MM/yyyy HH:mm:ss')}
                        </Typography>
                      </div>
                    </div>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </>
        )
      }

      <UpdateTask
        open={open_update}
        onClose={() => setOpenUpdate(false)}
        onRefresh={fetchTasks}
        task_id={selected_task_id}
      />

    </div >
  );
};

export default TodoListPage;