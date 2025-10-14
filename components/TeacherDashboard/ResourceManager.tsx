"use client";

import React, { useState } from "react";
import { Resource, uploadResource } from "@/services/teacherDashboardService";
import { updateResource, deleteResource } from "@/services/contentService";

interface ResourceManagerProps {
  resources: Resource[];
  setResources: (resources: Resource[]) => void;
}

// Search icon component
const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

// Plus icon component
const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

// Edit icon component
const EditIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

// Delete icon component
const DeleteIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

// Video icon component
const VideoIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

// Document icon component
const DocumentIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

export default function ResourceManager({
  resources,
  setResources,
}: ResourceManagerProps) {
  const [_showUploadForm, _setShowUploadForm] = useState(false);
  const [resourceSearchTerm, setResourceSearchTerm] = useState("");
  const [editingResourceId, setEditingResourceId] = useState<string | null>(
    null
  );
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "video" as "video" | "note" | "audio" | "document",
    url: "",
  });

  const _handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await uploadResource(formData);
      if (result.success && result.data) {
        setResources([...resources, result.data]);
        setFormData({ title: "", type: "video", url: "" });
        _setShowUploadForm(false);
        setIsAddingResource(false);
      }
    } catch (error) {
      console.error("Error uploading resource:", error);
    }
  };

  const handleEditResource = (resourceId: string) => {
    setEditingResourceId(resourceId);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveResource = async (editedResource: any) => {
    try {
      const result = await updateResource(editedResource);
      if (result.success) {
        const updatedResources = resources.map((r) =>
          r.id === editedResource.id
            ? { ...editedResource, topic: editedResource.topic }
            : r
        );
        setResources(updatedResources);
        setEditingResourceId(null);
      }
    } catch (error) {
      console.error("Error updating resource:", error);
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    try {
      const result = await deleteResource(resourceId);
      if (result.success) {
        const updatedResources = resources.filter((r) => r.id !== resourceId);
        setResources(updatedResources);
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  const handleCancelResource = () => {
    setEditingResourceId(null);
    setIsAddingResource(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddNewResource = async (newResource: any) => {
    try {
      const result = await uploadResource(newResource);
      if (result.success && result.data) {
        setResources([...resources, result.data]);
        setIsAddingResource(false);
      }
    } catch (error) {
      console.error("Error adding resource:", error);
    }
  };

  // Filter resources based on search term
  const filteredResources = resources.filter(
    (resource) =>
      resource.title
        ?.toLowerCase()
        .includes(resourceSearchTerm.toLowerCase()) ||
      resource.type?.toLowerCase().includes(resourceSearchTerm.toLowerCase())
  );

  const _getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return "🎥";
      case "note":
        return "📝";
      case "audio":
        return "🎵";
      case "document":
        return "📄";
      default:
        return "📁";
    }
  };

  const _getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-400/30";
      case "note":
        return "from-yellow-500/20 to-amber-500/20 text-yellow-300 border-yellow-400/30";
      case "audio":
        return "from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-400/30";
      case "document":
        return "from-green-500/20 to-emerald-500/20 text-green-300 border-green-400/30";
      default:
        return "from-slate-500/20 to-gray-500/20 text-slate-300 border-slate-400/30";
    }
  };

  const _formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Resource Card Component
  const ResourceCard = ({
    resource,
    onEdit,
    onDelete,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resource: any;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
  }) => {
    const typeDetails: {
      [key: string]: { icon: React.ReactElement; color: string; bg: string };
    } = {
      Video: {
        icon: <VideoIcon />,
        color: "text-red-600",
        bg: "bg-red-50 border-red-100",
      },
      video: {
        icon: <VideoIcon />,
        color: "text-red-600",
        bg: "bg-red-50 border-red-100",
      },
      PDF: {
        icon: <DocumentIcon />,
        color: "text-blue-600",
        bg: "bg-blue-50 border-blue-100",
      },
      document: {
        icon: <DocumentIcon />,
        color: "text-blue-600",
        bg: "bg-blue-50 border-blue-100",
      },
      Notes: {
        icon: <DocumentIcon />,
        color: "text-yellow-600",
        bg: "bg-yellow-50 border-yellow-100",
      },
      note: {
        icon: <DocumentIcon />,
        color: "text-yellow-600",
        bg: "bg-yellow-50 border-yellow-100",
      },
    };
    const { icon, color, bg } = typeDetails[resource.type] || typeDetails.note;

    return (
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-gray-200 hover:-translate-y-1 group animate-fadeIn">
        <div className="flex items-center space-x-4">
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center border transition-all duration-200 ${bg} ${color} group-hover:scale-110`}
          >
            {icon}
          </div>
          <div className="flex-grow">
            <h4 className="font-semibold text-gray-800 text-lg mb-1">
              {resource.title}
            </h4>
            <p className="text-sm text-gray-500">
              {resource.topic || resource.type}
            </p>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition-all duration-200 hover:scale-105 border border-purple-200"
            >
              View
            </a>
            <button
              onClick={() => onEdit(resource.id)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
            >
              <EditIcon />
            </button>
            <button
              onClick={() => onDelete(resource.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
            >
              <DeleteIcon />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Resource Form Component
  const EditResourceForm = ({
    resource,
    onSave,
    onCancel,
    isNew = false,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resource: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSave: (r: any) => void;
    onCancel: () => void;
    isNew?: boolean;
  }) => {
    const [editedResource, setEditedResource] = useState(resource);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleInputChange = (e: any) =>
      setEditedResource({ ...editedResource, [e.target.name]: e.target.value });

    return (
      <div className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl shadow-lg border-2 border-purple-200 space-y-6 mb-6 animate-slideDown">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <DocumentIcon />
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            {isNew ? "Add New Resource" : "Edit Resource"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Title
            </label>
            <input
              type="text"
              name="title"
              value={editedResource.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 focus:ring-2 sm:text-sm transition-all duration-200 px-4 py-3"
              placeholder="Enter resource title..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Resource Type
            </label>
            <select
              name="type"
              value={editedResource.type}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 focus:ring-2 sm:text-sm transition-all duration-200 px-4 py-3"
            >
              <option value="video">🎥 Video</option>
              <option value="document">📄 PDF/Document</option>
              <option value="note">📝 Notes</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Topic
          </label>
          <input
            type="text"
            name="topic"
            value={editedResource.topic}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 focus:ring-2 sm:text-sm transition-all duration-200 px-4 py-3"
            placeholder="Enter topic or subject..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Resource URL
          </label>
          <input
            type="text"
            name="url"
            value={editedResource.url}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 focus:ring-2 sm:text-sm transition-all duration-200 px-4 py-3"
            placeholder="https://example.com/resource..."
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-purple-200">
          <button
            onClick={onCancel}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 hover:scale-105 border border-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(editedResource)}
            className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-xl transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
          >
            {isNew ? "Add Resource" : "Save Changes"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="h-5 w-5 text-gray-400 transition-colors duration-200" />
          </span>
          <input
            type="text"
            placeholder="Search resources by title or type..."
            value={resourceSearchTerm}
            onChange={(e) => setResourceSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 shadow-sm hover:shadow-md"
          />
        </div>
        <button
          onClick={() => {
            setIsAddingResource(true);
            setEditingResourceId(null);
          }}
          className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New
        </button>
      </div>

      {isAddingResource && (
        <div className="animate-slideDown">
          <EditResourceForm
            resource={{ title: "", type: "video", topic: "", url: "" }}
            onSave={handleAddNewResource}
            onCancel={handleCancelResource}
            isNew={true}
          />
        </div>
      )}

      <div className="max-h-[calc(100vh-120px)] overflow-y-auto pr-4 space-y-4 custom-scrollbar">
        {filteredResources.length === 0 ? (
          <div className="text-center py-20 animate-fadeIn">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
              <svg
                className="w-10 h-10 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {resourceSearchTerm
                ? "No matching resources found"
                : "No Resources Yet"}
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              {resourceSearchTerm
                ? "Try adjusting your search terms"
                : "Start sharing educational materials with your students"}
            </p>
            {!resourceSearchTerm && (
              <button
                onClick={() => setIsAddingResource(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
              >
                Upload Your First Resource
              </button>
            )}
          </div>
        ) : (
          filteredResources.map((r, index) => (
            <div
              key={r.id}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="animate-slideUp"
            >
              {editingResourceId === r.id ? (
                <EditResourceForm
                  resource={r}
                  onSave={handleSaveResource}
                  onCancel={handleCancelResource}
                />
              ) : (
                <ResourceCard
                  resource={r}
                  onEdit={handleEditResource}
                  onDelete={handleDeleteResource}
                />
              )}
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
