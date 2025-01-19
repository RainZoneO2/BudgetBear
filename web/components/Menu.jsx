import { Home, DollarSign, BarChart2, Settings, Plus, Camera, Image } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
    </nav>
  );
};

export default Menu;
