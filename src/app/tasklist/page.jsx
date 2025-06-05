"use client";
import { useState } from "react";
import {
  Plus,
  Bell,
  MoreHorizontal,
  X,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Circle,
  User,
  Clock,
} from "lucide-react";

export default function TaskManagementPage() {
  const [taskGroups, setTaskGroups] = useState([
    {
      id: 1,
      name: "Development",
      tasks: [
        {
          id: 1,
          title: "Fix login bug",
          completed: false,
          dueDate: "2025-06-10",
          details: "Users unable to login with special characters in password",
        },
        {
          id: 2,
          title: "Update API documentation",
          completed: true,
          dueDate: "2025-06-08",
          details: "Add new endpoints to documentation",
        },
        {
          id: 3,
          title: "Code review",
          completed: false,
          dueDate: null,
          details: "Review pull request #124",
        },
      ],
    },
    {
      id: 2,
      name: "Marketing",
      tasks: [
        {
          id: 4,
          title: "Create social media campaign",
          completed: false,
          dueDate: "2025-06-15",
          details: "Plan Q3 social media strategy",
        },
        {
          id: 5,
          title: "Update website copy",
          completed: false,
          dueDate: "2025-06-12",
          details: "Refresh landing page content",
        },
      ],
    },
    {
      id: 3,
      name: "Design",
      tasks: [
        {
          id: 6,
          title: "Mobile app wireframes",
          completed: true,
          dueDate: "2025-06-05",
          details: "Create wireframes for new mobile features",
        },
      ],
    },
  ]);

  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showNewTaskForm, setShowNewTaskForm] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Task modal states
  const [taskDetails, setTaskDetails] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [moveToGroup, setMoveToGroup] = useState("");

  const addNewGroup = () => {
    if (newGroupName.trim()) {
      const newGroup = {
        id: Date.now(),
        name: newGroupName,
        tasks: [],
      };
      setTaskGroups([...taskGroups, newGroup]);
      setNewGroupName("");
      setShowNewGroupForm(false);
    }
  };

  const addNewTask = (groupId) => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: Date.now(),
        title: newTaskTitle,
        completed: false,
        dueDate: null,
        details: "",
      };

      setTaskGroups(
        taskGroups.map((group) =>
          group.id === groupId
            ? { ...group, tasks: [...group.tasks, newTask] }
            : group
        )
      );

      setNewTaskTitle("");
      setShowNewTaskForm(null);
    }
  };

  const openTaskModal = (task, groupId) => {
    setSelectedTask({ ...task, groupId });
    setTaskDetails(task.details || "");
    setTaskDueDate(task.dueDate || "");
    setMoveToGroup(groupId.toString());
    setShowTaskModal(true);
  };

  const updateTask = () => {
    if (!selectedTask) return;

    const updatedTask = {
      ...selectedTask,
      details: taskDetails,
      dueDate: taskDueDate || null,
    };

    // If moving to different group
    if (parseInt(moveToGroup) !== selectedTask.groupId) {
      // Remove from current group
      setTaskGroups(
        taskGroups.map((group) => {
          if (group.id === selectedTask.groupId) {
            return {
              ...group,
              tasks: group.tasks.filter((t) => t.id !== selectedTask.id),
            };
          }
          if (group.id === parseInt(moveToGroup)) {
            return { ...group, tasks: [...group.tasks, updatedTask] };
          }
          return group;
        })
      );
    } else {
      // Update in same group
      setTaskGroups(
        taskGroups.map((group) =>
          group.id === selectedTask.groupId
            ? {
                ...group,
                tasks: group.tasks.map((t) =>
                  t.id === selectedTask.id ? updatedTask : t
                ),
              }
            : group
        )
      );
    }

    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const toggleTaskComplete = (taskId, groupId) => {
    setTaskGroups(
      taskGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              ),
            }
          : group
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>

              {/* Floating Add Group Button */}
              <button
                onClick={() => setShowNewGroupForm(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 z-40"
              >
                <Plus className="w-6 h-6" />
              </button>
              <span className="text-xl font-bold text-gray-900">TaskFlow</span>
            </div>

            {/* Notification Icon */}
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
          <p className="text-gray-600">
            Organize and manage your daily tasks efficiently
          </p>
        </div>

        {/* Task Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {taskGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
            >
              {/* Group Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {group.name}
                </h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {group.tasks.length} tasks
                </span>
              </div>

              {/* Add New Task Button */}
              <div className="mb-4">
                {showNewTaskForm === group.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Enter task title..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => addNewTask(group.id)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowNewTaskForm(null)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowNewTaskForm(group.id)}
                    className="w-full flex items-center justify-center space-x-2 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Add new task</span>
                  </button>
                )}
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {group.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                      task.completed
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <button
                      onClick={() => toggleTaskComplete(task.id, group.id)}
                      className="flex-shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          task.completed
                            ? "text-gray-500 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.dueDate && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {task.dueDate}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => openTaskModal(task, group.id)}
                      className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Group Form Modal */}
      {showNewGroupForm && (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Create New Group
              </h3>
              <button
                onClick={() => {
                  setShowNewGroupForm(false);
                  setNewGroupName("");
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter group name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowNewGroupForm(false);
                    setNewGroupName("");
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={addNewGroup}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Add Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Task Details
              </h3>
              <button
                onClick={() => setShowTaskModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Task Title */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {selectedTask.title}
                </h4>
              </div>

              {/* Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Details
                </label>
                <textarea
                  value={taskDetails}
                  onChange={(e) => setTaskDetails(e.target.value)}
                  placeholder="Add task details..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Move to Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Move to Group
                </label>
                <select
                  value={moveToGroup}
                  onChange={(e) => setMoveToGroup(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {taskGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowTaskModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={updateTask}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
