import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  id: string;
  title: string;
  coinValue: number;
  isCompleted: boolean;
  createdAt: number;
}

interface TasksContextType {
  tasks: Task[];
  addTask: (title: string, coinValue: number) => void;
  toggleTaskCompletion: (id: string) => boolean; // Returns true if it was just completed
  deleteTask: (id: string) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveTasks(tasks);
    }
  }, [tasks, isLoaded]);

  const loadTasks = async () => {
    try {
      const stored = await AsyncStorage.getItem('@tasks');
      if (stored) {
        setTasks(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load tasks', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveTasks = async (currentTasks: Task[]) => {
    try {
      await AsyncStorage.setItem('@tasks', JSON.stringify(currentTasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  };

  const addTask = (title: string, coinValue: number) => {
    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      coinValue,
      isCompleted: false,
      createdAt: Date.now(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const toggleTaskCompletion = (id: string) => {
    let wasCompleted = false;
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        if (!task.isCompleted) {
          wasCompleted = true; // We are checking it off right now
        }
        return { ...task, isCompleted: !task.isCompleted };
      }
      return task;
    }));
    return wasCompleted;
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, toggleTaskCompletion, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
