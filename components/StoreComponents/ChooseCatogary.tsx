"use client";

import { useRouter } from "next/navigation";

interface ChooseCategoryProps {
  setCategory: (category: string) => void;
}

export default function ChooseCategory({ setCategory }: ChooseCategoryProps) {
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push("/Student/Dashboard");
  };

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div className="flex justify-start mb-6">
        <button
          onClick={handleBackToDashboard}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 
                     hover:bg-gray-100 rounded-lg transition-all duration-200 
                     focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Back</span>
        </button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Choose Category
        </h2>
        <p className="text-gray-600 text-lg">Select what you&apos;re looking for</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Teacher Option */}
        <button
          onClick={() => setCategory("teacher")}
          className="group p-8 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 
                     border-2 border-blue-200 hover:border-blue-300 rounded-xl transition-all duration-300 
                     hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-700">
              Teacher Resources
            </h3>
            <p className="text-gray-600 group-hover:text-gray-700">
              Access teaching materials, lesson plans, and educational content
            </p>
          </div>
        </button>

        {/* Object Option */}
        <button
          onClick={() => setCategory("object")}
          className="group p-8 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 
                     border-2 border-green-200 hover:border-green-300 rounded-xl transition-all duration-300 
                     hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-700">
              Learning Objects
            </h3>
            <p className="text-gray-600 group-hover:text-gray-700">
              Explore interactive learning materials, tools, and resources
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
