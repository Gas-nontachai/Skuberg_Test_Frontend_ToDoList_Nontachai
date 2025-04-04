"use client";
import React, { useCallback, useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { CircularProgress, Typography, TextField, Button, List, ListItem, IconButton, Checkbox, Box, Select, Menu, MenuItem, Collapse, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff, Search, ArrowDownward, ArrowUpward, AssignmentTurnedIn } from "@mui/icons-material";
import { Delete, Edit, Sort, Clear, Add } from "@mui/icons-material";
import { formatDate } from "@/utils/date-helper"
import { generateID } from "@/utils/generator-id"
import { Task } from "@/misc/types";
import { useTask } from "@/hook/hooks";
import UpdateTask from "@/app/components/Task/Update";

const TodoListPage: React.FC = () => {
  const { getTaskBy, insertTask, updateTaskBy, deleteTaskBy } = useTask();
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

  const [task_category_option] = useState<string[]>(
    ["General", "Work", "Personal"]
  );

  const fetchTasks = useCallback(async () => {
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

  }, [filter_category, sort_order]);

  useEffect(() => {
    try {
      fetchTasks();
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchTasks]);

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
          className="w-80"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "999px",
              paddingRight: "8px",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Select
                  value={task.category || ""}
                  onChange={(e) => setTask({ ...task, category: e.target.value })}
                  displayEmpty
                  variant="standard"
                  sx={{ minWidth: "100px", marginRight: "8px" }}
                >
                  {task_category_option.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                <IconButton
                  onClick={addTask}
                  sx={{
                    backgroundColor: "green",
                    color: "white",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    "&:hover": {
                      backgroundColor: "darkgreen",
                    },
                  }}
                >
                  <Add />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
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
          className="w-full"
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "999px",
              fontSize: "14px",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={fetchTasks} sx={{ color: "#4F46E5" }}>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Select
          value={filter_category}
          onChange={(e) => setFilterCategory(e.target.value)}
          displayEmpty
          className="w-28"
          sx={{
            borderRadius: "999px",
            height: "40px",
            fontSize: "14px",
            backgroundColor: "#F3F4F6",
            "& .MuiSelect-select": {
              padding: "8px 12px",
            },
          }}
        >
          <MenuItem value="All">All</MenuItem>
          {task_category_option.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>

        <IconButton
          onClick={(event) => setAnchorEl(event.currentTarget)}
          sx={{
            backgroundColor: "#1E3A8A",
            color: "white",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            "&:hover": { backgroundColor: "#1D4ED8" },
          }}
        >
          <Sort fontSize="small" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => toggleSort("createdAt")}>
            จัดเรียงตามวันที่
            {sort_order.name === "createdAt" && (
              sort_order.order === "ASC" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
            )}
          </MenuItem>
        </Menu>

        <IconButton
          onClick={clearFilters}
          sx={{
            backgroundColor: "#EF4444",
            color: "white",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            "&:hover": { backgroundColor: "#DC2626" },
          }}
        >
          <Clear fontSize="small" />
        </IconButton>
      </div>
      {
        loading == true ? (
          <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
            <CircularProgress />
          </div>
        ) : incompleteTasks.length > 0 ? (
          <>
            {incompleteTasks.map((t, index) => (
              <List className="w-full max-w-md bg-white " key={index}>
                <ListItem
                  key={index}
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
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1">{t.text}</Typography>
                    <Box >
                      <Typography variant="body2" color="textSecondary">
                        Category: {t.category}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Created: {formatDate(t.createdAt, "dd/MM/yyyy HH:mm:ss")}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
              </List>
            ))}
          </>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            <AssignmentTurnedIn sx={{ fontSize: 48, color: "#9CA3AF" }} />
            <Typography variant="h6" color="textSecondary" sx={{ fontWeight: "500", mt: 1 }}>
              No pending tasks
            </Typography>
          </Box>
        )
      }

      {
        completedTasks.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-4 mt-8">
              <Typography variant="h6" className="font-bold text-gray-800">
                ✅ Completed Tasks
              </Typography>

              <Button
                variant="contained"
                onClick={() => setShowCompleted(!showCompleted)}
                startIcon={showCompleted ? <VisibilityOff /> : <Visibility />}
                size="small"
                sx={{
                  backgroundColor: showCompleted ? "#f87171" : "#3b82f6",
                  color: "white",
                  "&:hover": {
                    backgroundColor: showCompleted ? "#dc2626" : "#2563eb",
                  },
                  paddingX: "12px",
                  borderRadius: "10px",
                  textTransform: "none",
                  marginLeft: "10px",
                }}
              >
                {showCompleted ? "Hide" : "Show"}
              </Button>
            </div>
            <Collapse in={showCompleted} className="w-full max-w-md bg-white  " >
              <List >
                {completedTasks.map((t, index) => (
                  <ListItem
                    key={index}
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
                    <Box sx={{ textDecoration: t.completed ? "line-through" : "none", mb: 2 }}>
                      <Typography variant="body1">{t.text}</Typography>
                      <Box sx={{ pl: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                          Category: {t.category}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Created: {formatDate(t.createdAt, "dd/MM/yyyy HH:mm:ss")}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Completed: {t.completedAt ? formatDate(t.completedAt, "dd/MM/yyyy HH:mm:ss") : "Not completed"}
                        </Typography>
                      </Box>
                    </Box>
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