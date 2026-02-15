// Version: 2.0 - Fixed Jira API integration
"use client";
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, RefreshCw, Loader2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
}

const columns = [
  { id: 'To Do', title: 'To Do', color: 'bg-blue-400', jiraStatus: 'To Do' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-amber-400', jiraStatus: 'In Progress' },
  { id: 'Done', title: 'Done', color: 'bg-emerald-400', jiraStatus: 'Done' },
];

interface KanbanBoardProps {
  projectId?: string | null;
}

export default function KanbanBoard({ projectId }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [projectTicketKeys, setProjectTicketKeys] = useState<string[]>([]);

  // Fetch project data if projectId is provided
  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      const project = data.projects?.find((p: any) => p.id === projectId);

      if (project && project.jiraTickets) {
        const ticketKeys = project.jiraTickets.map((t: any) => t.key);
        setProjectTicketKeys(ticketKeys);
      }
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };

  // Fetch tasks from Jira API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/kanban');

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        // Filter tasks if we have a project with specific tickets
        let filteredTasks = data;
        if (projectId && projectTicketKeys.length > 0) {
          filteredTasks = data.filter((task: Task) =>
            projectTicketKeys.includes(task.id)
          );
        }
        setTasks(filteredTasks);
      } else {
        console.error('Invalid data format:', data);
        setTasks([]);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      alert('Failed to connect to Jira. Check console for details.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount and when project tickets are loaded
  useEffect(() => {
    fetchTasks();

    // Auto-refresh every 10 seconds for real-time sync
    const interval = setInterval(fetchTasks, 10000);
    return () => clearInterval(interval);
  }, [projectTicketKeys]);

  // Handle drag and drop
  const handleDragEnd = async (result: any) => {
    const { draggableId, destination, source } = result;

    // Dropped outside
    if (!destination) return;

    // No movement
    if (destination.droppableId === source.droppableId) return;

    const taskId = draggableId;
    const newStatus = destination.droppableId;

    console.log(`Moving ${taskId} to ${newStatus}`);

    // Optimistic UI update
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    // Update Jira
    try {
      const response = await fetch('/api/kanban/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueKey: taskId, targetStatus: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update Jira');
      }

      console.log(`✅ Successfully moved ${taskId} to ${newStatus}`);
    } catch (error) {
      console.error('Failed to move task:', error);
      alert('Failed to update Jira. Reverting changes.');
      // Revert on failure
      fetchTasks();
    }
  };

  // Create new task
  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;

    setCreating(true);
    try {
      const response = await fetch('/api/kanban/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: newTaskTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      console.log('✅ Created task:', newTask);

      // Clear form and refresh
      setNewTaskTitle('');
      setShowCreateForm(false);
      await fetchTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create Jira ticket. Check console.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <span className="ml-3 text-slate-500 font-medium">Loading from Jira...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={fetchTasks}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-sm font-semibold text-slate-700"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <span className="text-xs text-slate-500">{tasks.length} tasks</span>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-sm font-bold"
        >
          <Plus size={16} />
          Create Task
        </button>
      </div>

      {/* Create Task Form */}
      {showCreateForm && (
        <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
          <input
            type="text"
            placeholder="Enter task summary..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
            className="w-full p-3 border border-blue-300 rounded-xl mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateTask}
              disabled={creating || !newTaskTitle.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold disabled:opacity-50 hover:bg-blue-700"
            >
              {creating ? 'Creating...' : 'Create in Jira'}
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewTaskTitle('');
              }}
              className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Kanban Board with Drag & Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {columns.map((col) => (
            <Droppable key={col.id} droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-slate-50/50 rounded-2xl p-4 min-h-[400px] border-2 transition-colors ${
                    snapshot.isDraggingOver ? 'border-blue-400 bg-blue-50/30' : 'border-slate-100'
                  }`}
                >
                  {/* Column Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {col.title}
                    </h3>
                    <span className="ml-auto text-xs font-bold text-slate-400">
                      {tasks.filter((t) => t.status === col.id).length}
                    </span>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-3">
                    {tasks
                      .filter((t) => t.status === col.id)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing transition-shadow ${
                                snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                              }`}
                            >
                              <span className="text-[10px] font-bold text-blue-600 uppercase">
                                {task.id}
                              </span>
                              <p className="text-sm font-semibold text-slate-700 leading-tight mt-1">
                                {task.title}
                              </p>
                              {task.assignee && (
                                <p className="text-[10px] text-slate-500 mt-2">👤 {task.assignee}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <span
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                                    task.priority === 'High'
                                      ? 'bg-red-100 text-red-700'
                                      : task.priority === 'Medium'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-green-100 text-green-700'
                                  }`}
                                >
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
