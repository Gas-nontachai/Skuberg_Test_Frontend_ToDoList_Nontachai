"use client";
import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import { Task } from "@/misc/types";
import { useTask } from "@/hook/hooks";
const { getTaskByID, updateTaskBy } = useTask();

interface UpdateTaskProps {
    onClose: () => void;
    onRefresh: () => void;
    open: boolean;
    task_id: string;
}

const UpdateTask: React.FC<UpdateTaskProps> = ({ onClose, open, onRefresh, task_id }) => {
    const [task, setTask] = useState<Task>({
        task_id: "",
        text: "",
        category: "General",
        completed: false,
        createdAt: new Date(),
        completedAt: undefined,
    });

    useEffect(() => {
        if (open) fetchTask();
    }, [open]);

    const fetchTask = async () => {
        try {
            const res = await getTaskByID({ task_id });
            setTask(res);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const handleUpdate = async () => {
        try {
            await updateTaskBy(task);
            Swal.fire({
                icon: "success",
                title: "Task updated successfully!",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
            });
            onRefresh();
            onClose();
        } catch (error) {
            console.error("Error updating task:", error);
            Swal.fire({
                icon: "error",
                title: "Failed to update task!",
            });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle className="font-bold text-lg">Update Task</DialogTitle>
            <DialogContent className="space-y-4">
                <TextField
                    label="Task Name"
                    fullWidth
                    value={task.text}
                    onChange={(e) => setTask({ ...task, text: e.target.value })}
                    required
                />

                <Select
                    label="Category"
                    fullWidth
                    value={task.category}
                    onChange={(e) => setTask({ ...task, category: e.target.value })}
                >
                    <MenuItem value="General">General</MenuItem>
                    <MenuItem value="Work">Work</MenuItem>
                    <MenuItem value="Personal">Personal</MenuItem>
                </Select>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={task.completed}
                            onChange={(e) =>
                                setTask({
                                    ...task,
                                    completed: e.target.checked,
                                    completedAt: e.target.checked ? new Date() : undefined,
                                })
                            }
                        />
                    }
                    label="Mark as Completed"
                />
            </DialogContent>

            <DialogActions className="px-4 py-2">
                <Button onClick={onClose} color="error" className="font-bold">Cancel</Button>
                <Button onClick={handleUpdate} variant="contained" color="primary" className="font-bold">
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default UpdateTask
