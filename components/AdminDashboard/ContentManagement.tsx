"use client";

import React, { useState } from "react";
import {
  Globe,
  FileText,
  Star,
  BookOpen,
  Clock,
  Search,
  Filter,
  User,
  Calendar,
  Award,
  Upload,
  X,
  Plus,
  Trash2,
  DollarSign,
  Tag,
  Link as LinkIcon,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";

// ----------------------------------------------------------------------
// --- PLACEHOLDERS & LOCAL DEFINITIONS (REQUIRED TO COMPILE) ---
// IMPORTANT: These mocks should be removed in your local project after resolving the imports.

// Placeholder components
const LessonLibraryManager = ({ onConceptClick }: { onConceptClick: (conceptId: string) => void }) => (
  <div className="text-center p-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-300">
    <h4 className="text-lg font-semibold text-gray-700">
      Lesson Library Manager Placeholder
    </h4>
    <button
      onClick={() => onConceptClick("placeholder-concept")}
      className="mt-4 text-blue-500 hover:text-blue-700"
    >
      View Concept Graph
    </button>
  </div>
);
const ConceptViewer = ({ conceptId, onBack }: { conceptId: string; onBack: () => void }) => (
  <div className="p-12 bg-gray-50 rounded-xl border-dashed border-2 border-gray-300">
    <h4 className="text-lg font-semibold text-gray-700 mb-4">
      Concept Viewer for: {conceptId}
    </h4>
    <button
      onClick={onBack}
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
    >
      Back to Library
    </button>
  </div>
);

// MOCK SERVICE FUNCTION - Mimics external call and SUCCESS response contract
const createResource = async (data: CreateResourceDto) => {
  console.warn(
    "Using local service implementation to bypass compilation error. Data submitted:",
    data
  );
  await new Promise((resolve) => setTimeout(resolve, 1500));
  // Returns the expected ResourceResponse structure
  return {
    resourceId: data.resourceId,
    uploadUrl: "https://simulated.upload.url/" + data.resourceId,
  };
};

// Assuming the DTO interfaces were defined in your service file:
interface CreateResourceDto {
  resourceId: string;
  name: string;
  type: "video" | "document" | "audio" | "interactive" | "quiz";
  description: string;
  url: string;
  conceptId: string;
  isPublic: boolean;
  price?: number;
  tags: string[];
  gradeLevel: string;
  subject: string;
}
interface _ResourceResponse {
  resourceId: string;
  uploadUrl: string;
}

// --- UPDATED INTERFACE for displaying the resource list ---
interface ContentItem {
  id: number; // Local temporary ID for React key/deletion logging
  resourceId: string; // The UUID from the API
  title: string; // Resource Name
  subject: string;
  teacher: string;
  uploadDate: string; // Creation Time
  nodeType: string; // Resource Type
  url: string; // Resource Link
}

// Initial mock data is now only used to seed the initial state,
// ensuring data structure is correct.
const initialMockContent: ContentItem[] = [
  {
    id: 1,
    resourceId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    title: "Advanced Calculus - Integration Techniques",
    subject: "Mathematics",
    teacher: "Dr. Smith",
    uploadDate: "2024-01-15T10:00:00Z",
    nodeType: "video",
    url: "https://example.com/videos/calculus",
  },
  {
    id: 2,
    resourceId: "b8c2d9e1-12a3-4f5g-6h7i-111111111111",
    title: "Quantum Mechanics Fundamentals",
    subject: "Physics",
    teacher: "Prof. Johnson",
    uploadDate: "2024-01-14T15:30:00Z",
    nodeType: "document",
    url: "https://example.com/docs/quantum",
  },
];

// ----------------------------------------------------------------------

const ContentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(
    null
  );
  const [showConceptViewer, setShowConceptViewer] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // STATE TO HOLD UPLOADED AND INITIAL RESOURCES
  const [uploadedResources, setUploadedResources] =
    useState<ContentItem[]>(initialMockContent);

  // NEW STATE for status messages and loading
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "video",
    description: "",
    url: "",
    conceptId: "",
    isPublic: true,
    price: "",
    tags: "",
    gradeLevel: "",
    subject: "",
  });

  const handleConceptView = (conceptId: string) => {
    setSelectedConceptId(conceptId);
    setShowConceptViewer(true);
  };

  const handleBackToKnowledgeGraph = () => {
    setShowConceptViewer(false);
    setSelectedConceptId(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setUploadStatus({ type: null, message: "" });

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // UPDATED handleSubmit to persist data to the local list
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadStatus({ type: null, message: "" });
    setIsLoading(true);

    const generatedId = crypto.randomUUID();
    const currentTimestamp = new Date().toISOString();

    try {
      // 1. Prepare and send DTO to the service layer
      const requestBody: CreateResourceDto = {
        resourceId: generatedId,
        name: formData.name,
        type: formData.type as CreateResourceDto['type'], // Cast union type
        description: formData.description,
        url: formData.url,
        conceptId: formData.conceptId,
        isPublic: formData.isPublic,
        price: formData.price ? parseFloat(formData.price) : undefined,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
        gradeLevel: formData.gradeLevel,
        subject: formData.subject,
      };

      // 2. Call the service function (this uses the local mock in this environment, but the real one in your project)
      const response = await createResource(requestBody);
      console.warn("✅ Resource creation confirmed by service:", response);

      // 3. Create the full display object and prepend it to the list
      const newResource: ContentItem = {
        id: Date.now(), // Use a unique temporary ID for the list item
        resourceId: response.resourceId,
        title: requestBody.name,
        subject: requestBody.subject,
        teacher: "Admin Uploader", // Mocked user name
        uploadDate: currentTimestamp,
        nodeType: requestBody.type,
        url: requestBody.url,
      };

      setUploadedResources((prev) => [newResource, ...prev]);

      // 4. Update status and reset form
      setUploadStatus({
        type: "success",
        message: `Resource '${newResource.title}' uploaded! (ID: ${response.resourceId})`,
      });

      setFormData({
        // Reset form fields
        name: "",
        type: "video",
        description: "",
        url: "",
        conceptId: "",
        isPublic: true,
        price: "",
        tags: "",
        gradeLevel: "",
        subject: "",
      });
      setShowUploadForm(false);
    } catch (error) {
      console.error("❌ Error uploading resource:", error);
      setUploadStatus({
        type: "error",
        message: `Failed to upload content. Error: ${
          error instanceof Error ? error.message : "Unknown network error"
        }`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    // In a real app, this would trigger a deleteResource API call
    console.warn(`Delete content with id: ${id}`);
    setUploadedResources((prev) => prev.filter((item) => item.id !== id));
  };

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-12 animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 tracking-tight leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Content & Knowledge Graph
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Manage educational content, moderate uploads, and maintain the
          knowledge graph
        </p>
      </div>

      {/* ... Statistics Cards (unchanged) ... */}
      <div
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        {[
          {
            label: "Total Content",
            value:
              uploadedResources.length > 0
                ? uploadedResources.length + initialMockContent.length
                : "1,234",
            icon: BookOpen,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
          },
          {
            label: "Pending Review",
            value: "23",
            icon: Clock,
            color: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-50",
            textColor: "text-orange-600",
          },
          {
            label: "Knowledge Nodes",
            value: "5,678",
            icon: Globe,
            color: "from-purple-600 to-purple-700",
            bgColor: "bg-purple-50",
            textColor: "text-purple-600",
          },
          {
            label: "Quality Score",
            value: "8.7/10",
            icon: Star,
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-50",
            textColor: "text-green-600",
          },
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-102 transition-all duration-300 cursor-pointer overflow-hidden relative"
            >
              <div
                className={`absolute inset-0 ${stat.bgColor}/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              ></div>
              <div className="relative flex items-center justify-between mb-4">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium mb-2">
                  {stat.label}
                </p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {/* ... End Statistics Cards ... */}

      {/* Upload Content Button (unchanged) */}
      <div
        className="flex justify-end mb-8 animate-fade-in-up"
        style={{ animationDelay: "0.3s" }}
      >
        <button
          onClick={() => {
            setShowUploadForm(!showUploadForm);
            setUploadStatus({ type: null, message: "" });
          }}
          className="group relative flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          {showUploadForm ? (
            <>
              <X className="w-5 h-5" />
              <span className="font-semibold">Cancel Upload</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span className="font-semibold">Upload New Resource</span>
            </>
          )}
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div
          className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300 mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              Upload New Resource 🚀
            </h3>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Upload className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Status Message Display (unchanged) */}
          {uploadStatus.type && (
            <div
              className={`p-4 rounded-xl mb-6 flex items-center space-x-3 ${
                uploadStatus.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {uploadStatus.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
              <p className="font-medium text-sm">{uploadStatus.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                  placeholder="Enter content name"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                >
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                  <option value="audio">Audio</option>
                  <option value="interactive">Interactive</option>
                  <option value="quiz">Quiz</option>
                </select>
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource URL *
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                    placeholder="https://example.com/content"
                  />
                </div>
              </div>

              {/* Concept ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Concept ID *
                </label>
                <input
                  type="text"
                  name="conceptId"
                  value={formData.conceptId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                  placeholder="concept-calculus-001"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                  placeholder="Advanced Mathematics"
                />
              </div>

              {/* Grade Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade Level *
                </label>
                <input
                  type="text"
                  name="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                  placeholder="Grade 12"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (optional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                    placeholder="29.99"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                    placeholder="mathematics, calculus, derivatives"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                placeholder="Enter a detailed description of the content"
              />
            </div>

            {/* Is Public Checkbox */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleInputChange}
                className="w-5 h-5 text-blue-600 bg-gray-50 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label className="text-sm font-medium text-gray-700">
                Make this content publicly accessible
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-all duration-300 font-semibold"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="group relative flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                <span>{isLoading ? "Uploading..." : "Upload Resource"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter (unchanged) */}
      <div
        className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300 mb-8 animate-fade-in-up"
        style={{ animationDelay: "0.5s" }}
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search content by title, subject, or teacher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="video">Video</option>
              <option value="document">Document</option>
              <option value="audio">Audio</option>
              <option value="interactive">Interactive</option>
              <option value="quiz">Quiz</option>
            </select>
            <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Content Items - NOW USING REAL LIST STATE */}
      <div
        className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
        style={{ animationDelay: "0.6s" }}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-800">
              Recent Resource Uploads
            </h3>
            <div className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full border border-blue-200">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">
                {uploadedResources.length} Items
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {uploadedResources.length === 0 ? (
              <div className="text-center p-10 text-gray-500 bg-gray-50 rounded-xl">
                No resources uploaded yet. Start by clicking &ldquo;Upload New
                Resource&rdquo;!
              </div>
            ) : (
              uploadedResources.map((content) => (
                <div
                  key={content.resourceId} // Use resourceId as key
                  className="group bg-gray-50 rounded-xl border border-gray-200 p-6 hover:bg-gray-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Content Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-800 mb-2">
                            {content.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            {/* Subject */}
                            <div className="flex items-center space-x-2">
                              <Award className="w-4 h-4 text-blue-500" />
                              <span>{content.subject}</span>
                            </div>

                            {/* Uploader */}
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-purple-500" />
                              <span>{content.teacher}</span>
                            </div>

                            {/* Creation Date */}
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-indigo-500" />
                              <span>
                                Uploaded: {formatDate(content.uploadDate)}
                              </span>
                            </div>

                            {/* Resource Type */}
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-green-500" />
                              <span className="capitalize">
                                {content.nodeType}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button & Link */}
                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-3">
                      <a
                        href={content.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold text-sm"
                      >
                        <LinkIcon className="w-5 h-5 text-gray-500 group-hover:text-gray-900 transition-colors" />
                        <span>View Resource</span>
                      </a>
                      <button
                        onClick={() => handleDelete(content.id)}
                        className="group relative flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span className="font-semibold">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Knowledge Graph Management / Concept Viewer (now using placeholders) */}
      <div className="animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
        {showConceptViewer && selectedConceptId ? (
          <ConceptViewer
            conceptId={selectedConceptId}
            onBack={handleBackToKnowledgeGraph}
          />
        ) : (
          <LessonLibraryManager onConceptClick={handleConceptView} />
        )}
      </div>

      {/* Content Quality (unchanged) */}
      <div
        className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
        style={{ animationDelay: "1.0s" }}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          Content Quality
        </h3>
        <div className="space-y-4">
          {[
            {
              label: "Average Score",
              value: "8.7/10",
              color: "text-green-600",
              bgColor: "bg-green-50",
            },
            {
              label: "Flagged Content",
              value: "2.3%",
              color: "text-orange-600",
              bgColor: "bg-orange-50",
            },
            {
              label: "Approval Rate",
              value: "94.2%",
              color: "text-blue-600",
              bgColor: "bg-blue-50",
            },
            {
              label: "Teacher Rating",
              value: "4.8/5",
              color: "text-purple-600",
              bgColor: "bg-purple-50",
            },
          ].map((metric, index) => (
            <div
              key={index}
              className={`flex justify-between items-center p-4 rounded-xl border border-gray-100 hover:${metric.bgColor} transition-all duration-300`}
            >
              <span className="text-gray-700 font-medium">{metric.label}</span>
              <span className={`font-bold text-lg ${metric.color}`}>
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom animations (unchanged) */}
      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default ContentManagement;
