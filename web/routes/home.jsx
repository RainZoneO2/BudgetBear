import React from 'react';
import { useUser, useSignOut } from "@gadgetinc/react";
import { useFindMany } from "@gadgetinc/react";
import { api } from "../api";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";

// Register required chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Home = () => {
  // Fetch user
  const user = useUser(api);

  // Fetch purchases and categories
  const [{ data: purchases, fetching: purchasesFetching, error: purchasesError }] =
    useFindMany(api.purchases);

  const [{ data: categories, fetching: categoriesFetching, error: categoriesError }] =
    useFindMany(api.categories);

  // Handle loading and error states
  if (purchasesFetching || categoriesFetching) return <div>Loading...</div>;
  if (purchasesError || categoriesError)
    return (
      <div>
        Error:{" "}
        {purchasesError
          ? purchasesError.message
          : categoriesError.message}
      </div>
    );

  // Process data for weekly spending
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklySpending = Array(7).fill(0);

  purchases.forEach(({ totalCost, createdAt }) => {
    const day = new Date(createdAt).getDay();
    weeklySpending[day] += totalCost;
  });

  const weeklyData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: "Spending ($)",
        data: weeklySpending,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Process data for spending by category
  const categoryData = {
  labels: categories.map((category) => category.name),
  datasets: [
    {
      label: "Spending by Category",
      data: categories.map((category) => {
        // Sum purchases based on matching categoryId
        return purchases
          .filter((purchase) => purchase.categoryId === category.id)
          .reduce((sum, purchase) => sum + purchase.totalCost, 0);
      }),
      backgroundColor: categories.map((category) => category.color || "#CCCCCC"), // Use category color, fallback to gray
    },
  ],
};

  // Calculate total spent for the week dynamically
  const totalSpent = purchases.reduce((sum, { totalCost }) => sum + totalCost, 0);

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">
          Welcome, {user.firstName}! You've spent{" "}
          <span className="text-green-500">${totalSpent.toFixed(2)}</span> this week.
        </h1>

        {/* Weekly Spending Bar Chart */}
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-2">Weekly Spending</h2>
          <Bar
            data={weeklyData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
              },
            }}
          />
        </div>

        {/* Spending by Category Pie Chart */}
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Spending by Category</h2>
          <Pie
            data={categoryData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
