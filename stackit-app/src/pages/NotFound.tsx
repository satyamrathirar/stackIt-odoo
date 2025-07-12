import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-red-500/5 to-orange-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 glass-dark border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                      <Link to="/" className="text-3xl font-bold text-white transition-colors duration-300">
              StackIt
            </Link>
        </div>
      </header>

      <div className="text-center relative z-10 max-w-2xl mx-auto px-4">
        {/* 404 Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-glow animate-pulse">
            <AlertTriangle className="h-16 w-16 text-white" />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
                      <h1 className="text-8xl font-bold text-white animate-pulse">
            404
          </h1>
          
          <h2 className="text-3xl font-semibold text-white">
            Oops! Page Not Found
          </h2>
          
          <p className="text-xl text-gray-300 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Don't worry, you can always find your way back home.
          </p>

          <div className="text-sm text-gray-400 bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="font-mono">
              Attempted URL: <span className="text-orange-400">{location.pathname}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button 
            asChild
                            className="gradient-primary hover:shadow-glow transition-all duration-300 font-medium px-8 py-3 text-lg"
          >
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Return to Home
            </Link>
          </Button>
          
          <Button 
            variant="outline"
            asChild
            className="bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-300 backdrop-blur-sm font-medium px-8 py-3 text-lg"
          >
            <Link to="/" className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Browse Questions
            </Link>
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">
            Need Help?
          </h3>
          <p className="text-gray-300 mb-4">
            If you believe this is an error, you can:
          </p>
          <ul className="text-left text-gray-400 space-y-2 max-w-md mx-auto">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Check the URL for typos
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Use the search function to find what you're looking for
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Browse our popular questions and tags
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
