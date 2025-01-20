import React, { useState, useEffect } from "react";
import { useFindMany, useAction } from "@gadgetinc/react";
import { api } from "../api";

const Budget = () => {
  const [{ data: categories, fetching, error }, refetch] = useFindMany(api.categories);
  const [{ fetching: updating }, updateCategory] = useAction(api.categories.update);
  const [{ fetching: creating }, createCategory] = useAction(api.categories.create);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [step, setStep] = useState(1); // Step 1 = Select categories, Step 2 = Set budgets
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    color: "#FF5733",
    parentCategoryId: "",
  });

  useEffect(() => {
    // Load previous selections and budgets from localStorage
    const savedCategories = JSON.parse(localStorage.getItem("selectedCategories")) || [];
    const savedBudgets = JSON.parse(localStorage.getItem("budgets")) || {};

    if (savedCategories.length > 0) {
      setSelectedCategories(savedCategories);
      setBudgets(savedBudgets);
      setStep(2); // Skip category selection and move to budgets
    }
  }, []);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const handleNext = async () => {
    if (step === 1) {
      // Update the "selected" field for all categories
      const updatePromises = categories.map((category) =>
        updateCategory({
          id: category.id,
          selected: selectedCategories.includes(category.id),
        })
      );
      await Promise.all(updatePromises);

      // Save to localStorage
      localStorage.setItem("selectedCategories", JSON.stringify(selectedCategories));

      // Animate the transition to the next step
      setIsTransitioning(true);
      setTimeout(() => {
        setStep(2);
        setIsTransitioning(false);
      }, 500);
    } else {
      // Update monthlyBudgetLimit for selected categories
      const updateBudgetPromises = Object.keys(budgets).map((categoryId) =>
        updateCategory({
          id: categoryId,
          monthlyBudgetLimit: budgets[categoryId],
        })
      );
      await Promise.all(updateBudgetPromises);

      // Save budgets to localStorage
      localStorage.setItem("budgets", JSON.stringify(budgets));

      console.log("Budgets submitted:", budgets);
    }
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(1);
      setIsTransitioning(false);
    }, 500);
  };

  const handleBudgetChange = (categoryId, budget) => {
    setBudgets((prevBudgets) => ({
      ...prevBudgets,
      [categoryId]: parseFloat(budget) || 0,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCategory = async () => {
    await createCategory({
      ...formData,
      parentCategoryId: formData.parentCategoryId || null,
    });

    // Close modal and reset form
    setShowModal(false);
    setFormData({ name: "", color: "#FF5733", parentCategoryId: "" });

    // Refetch categories to include the newly added one
    refetch();
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
      {/* Step 1: Select Categories */}
      {step === 1 && (
        <div
          className={`flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto ${
            isTransitioning ? "opacity-0 transition-opacity duration-500" : ""
          }`}
        >
          <h1 className="text-2xl font-semibold text-gray-700 mb-6">
            Select Categories
          </h1>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition ${
                  selectedCategories.includes(category.id)
                    ? "bg-sage-green text-white"
                    : "bg-gray-200 text-gray-700"
                } hover:bg-green-700 hover:text-white`}
              >
                {category.name}
              </div>
            ))}
          </div>
          <button
            className="px-6 py-2 bg-sage-green text-white rounded-md font-medium shadow-md hover:bg-green-700 transition mb-4"
            onClick={() => setShowModal(true)}
          >
            Add Category
          </button>
          <button
            className="px-6 py-2 bg-sage-green text-white rounded-md font-medium shadow-md hover:bg-green-700 transition"
            onClick={handleNext}
            disabled={selectedCategories.length === 0 || updating}
          >
            {updating ? "Updating..." : "Next"}
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
      )}

      {/* Step 2: Set Budgets */}
      {step === 2 && (
        <div
          className={`flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto ${
            isTransitioning ? "opacity-0 transition-opacity duration-500" : ""
          }`}
        >
          <h1 className="text-2xl font-semibold text-gray-700 mb-6">
            Set Budgets
          </h1>
          <div className="flex flex-col gap-4 w-full max-w-md">
            {categories
              .filter((category) => selectedCategories.includes(category.id))
              .map((category) => (
                <div key={category.id} className="flex items-center gap-4">
                  <span className="flex-1 text-gray-700">{category.name}</span>
                  <input
                    type="number"
                    value={budgets[category.id] || ""}
                    onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md focus:ring-sage-green focus:border-sage-green"
                    placeholder="Enter budget"
                  />
                </div>
              ))}
          </div>
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md font-medium shadow-md hover:bg-gray-300 transition"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-sage-green text-white rounded-md font-medium shadow-md hover:bg-green-700 transition"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
