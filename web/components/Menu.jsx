import { Home, DollarSign, BarChart2, Settings, Plus } from "lucide-react";
import { useState } from "react";

const menuItems = [
  { icon: Home, label: "Home" },
  { icon: DollarSign, label: "Budget" },
  { icon: Plus, label: "Add", isCenter: true },
  { icon: BarChart2, label: "Reflect" },
  { icon: Settings, label: "Settings" },
];

const Menu = () => {
  const [activeItem, setActiveItem] = useState("Home");

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full border-t bg-white/80 backdrop-blur-md dark:bg-gray-800/90">
      <div className="mx-auto max-w-lg w-full">
        <div className="flex items-center justify-between px-4">
          {menuItems.map(({ icon: Icon, label, isCenter }) => (
            <button
              key={label}
              onClick={() => setActiveItem(label)}
              className={`group flex flex-1 flex-col items-center py-2 ${
                isCenter ? "relative -mt-8" : ""
              }`}
            >
              {isCenter ? (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg transition-transform hover:scale-105 active:scale-95">
                  <Icon className="h-6 w-6 text-white" />
                </div>
              ) : (
                <>
                  <Icon
                    className={`h-6 w-6 transition-colors ${
                      activeItem === label
                        ? "text-green-500"
                        : "text-muted-foreground group-hover:text-green-400"
                    }`}
                  />
                  <span
                    className={`mt-1 text-xs font-medium transition-colors ${
                      activeItem === label
                        ? "text-green-500"
                        : "text-muted-foreground group-hover:text-green-400"
                    }`}
                  >
                    {label}
                  </span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Menu;
