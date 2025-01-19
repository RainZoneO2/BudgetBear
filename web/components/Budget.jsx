import React, { useState } from "react";
import { useFindMany, useAction } from "@gadgetinc/react";
import { api } from "../api";

const Budget = () => {
  const [{ data: categories, fetching, error }] = useFindMany(api.categories);
  const [{ fetching: creating, data: createResult }, createCategory] = useAction(api.categories.create);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    color: "#FF5733",
    monthlyBudgetLimit: 0,
    parentCategoryId: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCategory = async () => {
  // Ensure the monthlyBudgetLimit is passed as a number
  const budgetLimit = parseFloat(formData.monthlyBudgetLimit);

  if (isNaN(budgetLimit)) {
    alert("Please enter a valid number for the monthly budget limit.");
    return;
  }

  await createCategory({
    ...formData,
    monthlyBudgetLimit: budgetLimit, // Ensure this is a number
    parentCategoryId: formData.parentCategoryId || null,
  });
  setShowModal(false); // Close modal
  setFormData({ name: "", color: "#FF5733", monthlyBudgetLimit: 0, parentCategoryId: "" }); // Reset form
};

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium text-red-600">
          Error loading categories: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Select Categories</h1>
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="px-4 py-2 bg-sage-green text-white rounded-full text-sm font-medium cursor-pointer hover:bg-green-700 transition"
          >
            {category.name}
          </div>
        ))}
      </div>
      <button
        className="px-6 py-2 bg-sage-green text-white rounded-md font-medium shadow-md hover:bg-green-700 transition"
        onClick={() => setShowModal(true)}
      >
        Add Category
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Category Name
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-sage-green focus:border-sage-green"
                placeholder="Enter category name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="color">
                Color
              </label>
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-full h-10 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="monthlyBudgetLimit">
                Monthly Budget Limit
              </label>
              <input
                type="number"
                id="monthlyBudgetLimit"
                name="monthlyBudgetLimit"
                value={formData.monthlyBudgetLimit}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-sage-green focus:border-sage-green"
                placeholder="Enter budget limit"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="parentCategoryId">
                Parent Category (Optional)
              </label>
              <select
                id="parentCategoryId"
                name="parentCategoryId"
                value={formData.parentCategoryId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-sage-green focus:border-sage-green"
              >
                <option value="">None</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCategory}
                disabled={creating}
                className="px-4 py-2 text-white bg-sage-green rounded-md hover:bg-green-700 transition"
              >
                {creating ? "Adding..." : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
