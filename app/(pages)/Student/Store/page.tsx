"use client";

import ChooseCategory from "@/components/StoreComponents/ChooseCatogary";
import { useState } from "react";

import TeachersStore from "@/components/StoreComponents/teachers";

export default function Store() {
  const [category, setCategory] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-white flex items-center justify-center p-4">
      {category === "" && (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-10">
          <ChooseCategory setCategory={setCategory} />
        </div>
      )}

      {category === "teacher" && (
        <TeachersStore />
      )}

      {category === "object" && (
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Learning Objects
          </h1>
          <div className="text-center text-gray-600">
            <p>Learning objects and materials will be displayed here</p>
          </div>
        </div>
      )}
    </div>
  );
}
