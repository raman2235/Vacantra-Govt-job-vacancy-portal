import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, Search, User, Menu, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, [location.pathname]); // update navbar when route changes

const handleLogout = () => {
  localStorage.removeItem("token");
  setToken(null);
  toast.success("Logged out successfully!");
  navigate("/");
};


  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/jobs", label: "Jobs" },
    { path: "/alerts", label: "Alerts" },
    { path: "/profile", label: "Profile" },
    { path: "/about", label: "About" }
  ];

  return (
    <nav className="bg-background border-b border-border shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 px-6">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Search className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">RozgarNow</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-lg font-semibold transition-colors duration-200 ${
                  isActive(item.path)
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">

            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>

            {/* ✅ Conditional Rendering Login / Logout */}
            {!token ? (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Login
                  </Button>
                </Link>

                <Link to="/register">
                  <Button
                    size="sm"
                    className="bg-gradient-primary hover:bg-primary-hover"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
