import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingBag, User, Menu, X, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-candy-pink/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-candy-pink to-candy-purple flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-lg">🍭</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-candy-pink to-candy-purple bg-clip-text text-transparent">
              Sweet Shop
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate("/")}
              className={`font-medium transition-colors hover:text-candy-pink ${
                isActive("/") ? "text-candy-pink" : "text-foreground"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigate("/catalog")}
              className={`font-medium transition-colors hover:text-candy-pink ${
                isActive("/catalog") ? "text-candy-pink" : "text-foreground"
              }`}
            >
              Catalog
            </button>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center max-w-sm flex-1 mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sweets..."
                className="pl-10 border-candy-pink/20 focus:border-candy-pink"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <ShoppingBag className="h-5 w-5" />
            </Button>
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user?.username}
                  </span>
                  {user?.role === 'admin' && (
                    <span className="px-2 py-1 text-xs font-medium bg-candy-purple/20 text-candy-purple rounded-full border border-candy-purple/30">
                      Admin
                    </span>
                  )}
                  {user?.role === 'admin' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/admin")}
                      className="text-xs border-candy-pink/30 hover:border-candy-pink"
                    >
                      Admin Panel
                    </Button>
                  )}
                </div>
                <Button 
                  variant="sweet" 
                  size="sm"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                variant="sweet" 
                size="sm"
                onClick={() => navigate("/auth")}
              >
                <User className="h-4 w-4" />
                Sign In
              </Button>
            )}
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-candy-pink/20">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sweets..."
                  className="pl-10 border-candy-pink/20 focus:border-candy-pink"
                />
              </div>
              
              <button
                onClick={() => {
                  navigate("/");
                  setIsMenuOpen(false);
                }}
                className="text-left font-medium py-2 hover:text-candy-pink transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => {
                  navigate("/catalog");
                  setIsMenuOpen(false);
                }}
                className="text-left font-medium py-2 hover:text-candy-pink transition-colors"
              >
                Catalog
              </button>
              
              {/* Admin access in mobile menu */}
              {isAuthenticated && user?.role === 'admin' && (
                <button
                  onClick={() => {
                    navigate("/admin");
                    setIsMenuOpen(false);
                  }}
                  className="text-left font-medium py-2 hover:text-candy-pink transition-colors flex items-center space-x-2"
                >
                  <span>Admin Panel</span>
                  <span className="px-2 py-1 text-xs font-medium bg-candy-purple/20 text-candy-purple rounded-full border border-candy-purple/30">
                    Admin
                  </span>
                </button>
              )}

              {/* User info in mobile */}
              {isAuthenticated && (
                <div className="pt-2 border-t border-candy-pink/20">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">
                      {user?.username} ({user?.role})
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};