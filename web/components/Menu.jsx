import {
  Home,
  DollarSign,
  BarChart2,
  Settings,
  Plus,
  Camera,
  Image,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAction } from "@gadgetinc/react";
import { api } from "../api";

const menuItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: DollarSign, label: "Budget", path: "/budget" },
  { icon: BarChart2, label: "Reflect", path: "/reflection" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isPurchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [purchaseForm, setPurchaseForm] = useState({
    itemName: "",
    quantity: "",
    receiptId: "",
    totalCost: "",
  });
  const [{ fetching: creating }, createPurchase] = useAction(api.purchases.create);

  const handleNavigation = (path) => {
    setActiveItem(path);
    navigate(path);
  };

  const handleFileUpload = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.capture = "environment";
    fileInput.onchange = (event) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        console.log("File selected:", files[0]); // Handle the uploaded file here
      }
    };
    fileInput.click();
  };

  const handleTakePicture = () => {
    setDropdownOpen(false);
    navigate("/add");
  };

  const handlePurchaseInputChange = (e) => {
    const { name, value } = e.target;
    setPurchaseForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handlePurchaseSubmit = async () => {
    if (!purchaseForm.itemName || !purchaseForm.totalCost) {
      alert("Please fill in the mandatory fields: Item Name and Total Cost.");
      return;
    }

    try {
      await createPurchase({
        itemName: purchaseForm.itemName,
        quantity: purchaseForm.quantity ? parseInt(purchaseForm.quantity) : undefined,
        receiptId: purchaseForm.receiptId || undefined,
        totalCost: parseFloat(purchaseForm.totalCost),
      });
      setPurchaseForm({ itemName: "", quantity: "", receiptId: "", totalCost: "" });
      setPurchaseDialogOpen(false);
      setDropdownOpen(false);
      alert("Purchase successfully created!");
    } catch (error) {
      console.error("Error creating purchase:", error);
      alert("Failed to create purchase. Please try again.");
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full border-t bg-white/80 backdrop-blur-md dark:bg-gray-800/90">
      <div className="mx-auto max-w-lg w-full">
        <div className="flex items-center justify-between px-4 relative">
          {menuItems.slice(0, 2).map(({ icon: Icon, label, path }) => (
            <button
              key={label}
              onClick={() => handleNavigation(path)}
              className={`group flex flex-1 flex-col items-center py-2`}
            >
              <Icon
                className={`h-6 w-6 transition-colors ${
                  activeItem === path
                    ? "text-sage-green"
                    : "text-muted-foreground group-hover:text-sage-green"
                }`}
              />
              <span
                className={`mt-1 text-xs font-medium transition-colors ${
                  activeItem === path
                    ? "text-sage-green"
                    : "text-muted-foreground group-hover:text-sage-green"
                }`}
              >
                {label}
              </span>
            </button>
          ))}

          {/* Plus button with dropdown */}
          <div className="relative flex flex-1 items-center justify-center">
            <div className="relative -mt-8">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-green shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <Plus className="h-6 w-6 text-white" />
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute bottom-[4.5rem] left-1/2 transform -translate-x-1/2 flex flex-col space-y-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 w-40">
                  <button
                    onClick={handleTakePicture}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Camera className="h-5 w-5 text-sage-green mr-2" />
                    <span className="text-sm font-medium">Take a Picture</span>
                  </button>
                  <button
                    onClick={handleFileUpload}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Image className="h-5 w-5 text-sage-green mr-2" />
                    <span className="text-sm font-medium">Import from Gallery</span>
                  </button>
                  <button
                    onClick={() => setPurchaseDialogOpen(true)}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ShoppingCart className="h-5 w-5 text-sage-green mr-2" />
                    <span className="text-sm font-medium">Input Purchase</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {menuItems.slice(2).map(({ icon: Icon, label, path }) => (
            <button
              key={label}
              onClick={() => handleNavigation(path)}
              className={`group flex flex-1 flex-col items-center py-2`}
            >
              <Icon
                className={`h-6 w-6 transition-colors ${
                  activeItem === path
                    ? "text-sage-green"
                    : "text-muted-foreground group-hover:text-sage-green"
                }`}
              />
              <span
                className={`mt-1 text-xs font-medium transition-colors ${
                  activeItem === path
                    ? "text-sage-green"
                    : "text-muted-foreground group-hover:text-sage-green"
                }`}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Purchase Dialog */}
      {isPurchaseDialogOpen && (
  <div
    className="fixed inset-0 flex items-center bg-black/50 z-50"
    style={{ justifyContent: "flex-start", paddingTop: "10vh" }} // Offset the dialog higher
  >
    <div
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-10/12 max-w-xs"
      style={{
        maxHeight: "90vh", // Ensure it doesn't exceed viewport height
        overflowY: "auto", // Scroll if content exceeds max height
      }}
    >
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Input Purchase
      </h2>
      <div className="mb-4">
        <label
          htmlFor="itemName"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Item Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="itemName"
          value={purchaseForm.itemName}
          onChange={(e) =>
            setPurchaseForm((prev) => ({ ...prev, itemName: e.target.value }))
          }
          className="w-full px-3 py-2 border rounded-md focus:ring-sage-green focus:border-sage-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter item name"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Quantity
        </label>
        <input
          type="number"
          id="quantity"
          value={purchaseForm.quantity || ""}
          onChange={(e) =>
            setPurchaseForm((prev) => ({
              ...prev,
              quantity: parseInt(e.target.value, 10) || 0,
            }))
          }
          className="w-full px-3 py-2 border rounded-md focus:ring-sage-green focus:border-sage-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter quantity (optional)"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="receiptId"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Receipt ID
        </label>
        <input
          type="text"
          id="receiptId"
          value={purchaseForm.receiptId || ""}
          onChange={(e) =>
            setPurchaseForm((prev) => ({ ...prev, receiptId: e.target.value }))
          }
          className="w-full px-3 py-2 border rounded-md focus:ring-sage-green focus:border-sage-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter receipt ID (optional)"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="totalCost"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Total Cost <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="totalCost"
          value={purchaseForm.totalCost || ""}
          onChange={(e) =>
            setPurchaseForm((prev) => ({
              ...prev,
              totalCost: parseFloat(e.target.value) || 0,
            }))
          }
          className="w-full px-3 py-2 border rounded-md focus:ring-sage-green focus:border-sage-green dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter total cost"
          required
        />
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setDialogOpen(false)}
          className="px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
          onClick={handlePurchaseSubmit}
          className="px-4 py-2 text-white bg-sage-green rounded-md hover:bg-green-700 transition"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}

    </nav>
  );
};

export default Menu;
