import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, ChevronUp, MessageSquare, User, Bell, Plus, TrendingUp, Clock, Award, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { supabase } from '../lib/supabase';
import { Question, Answer, Vote } from '../types/database';
import { api } from '../services/api';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const navigate = useNavigate();
  
  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserName(user.displayName || user.email || "User");
      } else {
        setIsLoggedIn(false);
        setUserName("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Pagination settings
  const questionsPerPage = 10; // Show 10 questions per page
  const predefinedPages = [1, 2, 3, 4, 5, 6, 7];
  
  // Calculate pagination
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);
  
  // Determine which pages to show
  const getVisiblePages = () => {
    if (totalPages <= 7) {
      // If total pages is 7 or less, show all pages
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // If more than 7 pages, show predefined pages 1-7 plus additional pages only if they have content
      const pages = [...predefinedPages];
      
      // Add additional pages only if they have questions
      for (let i = 8; i <= totalPages; i++) {
        const startIndex = (i - 1) * questionsPerPage;
        const endIndex = startIndex + questionsPerPage;
        // const questionsOnPage = mockQuestions.slice(startIndex, endIndex); // This line is no longer needed
        
        // if (questionsOnPage.length > 0) { // This line is no longer needed
          pages.push(i);
        // }
      }
      
      return pages;
    }
  };
  
  const visiblePages = getVisiblePages();
  
  // Get current page questions
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions; // Use questions from API
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true)
      const { data, error, count } = await api.getQuestions(currentPage, questionsPerPage, debouncedSearchQuery)
      if (data) {
        setQuestions(data)
        setTotalQuestions(count || 0)
      }
      setLoading(false)
    }
    
    fetchQuestions()
  }, [currentPage, debouncedSearchQuery])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="glass-dark border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-3xl font-bold gradient-text hover:scale-105 transition-transform duration-300">
            StackIt
          </Link>
          
          <div className="flex items-center gap-6">
            {isLoggedIn ? (
              <>
                <div className="relative group">
                  <Bell className="h-6 w-6 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 group-hover:scale-110" />
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-xs rounded-full h-5 w-5 flex items-center justify-center text-white font-medium pulse-glow">
                    2
                  </span>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-glow group-hover:shadow-glow-purple transition-all duration-300 group-hover:scale-110">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{userName}</span>
                </div>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="border-slate-600/50 text-white hover:bg-slate-700/50 transition-all duration-300"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => navigate("/login")}
                className="gradient-primary hover:shadow-glow transform hover:scale-105 transition-all duration-300 font-medium px-6 py-2"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-400 transition-colors duration-300" />
            <Input
              placeholder="Search questions, tags, or users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 bg-slate-800/50 border-slate-600/50 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="gradient-primary text-white border-transparent hover:shadow-glow transform hover:scale-105 transition-all duration-300 font-medium"
            >
              <Link to="/ask" className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Ask New Question
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-slate-800/50 border-slate-600/50 text-white hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-300 backdrop-blur-sm">
                  <Filter className="h-5 w-5 mr-2" />
                  {selectedFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800/90 border-slate-600/50 backdrop-blur-xl">
                <DropdownMenuItem onClick={() => setSelectedFilter("Newest")} className="text-white hover:bg-slate-700/50 transition-colors">
                  <Clock className="h-4 w-4 mr-2" />
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("Unanswered")} className="text-white hover:bg-slate-700/50 transition-colors">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Unanswered
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("Most Voted")} className="text-white hover:bg-slate-700/50 transition-colors">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Most Voted
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search Results Info */}
        {debouncedSearchQuery && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-300">
              Search results for: <span className="font-semibold">"{debouncedSearchQuery}"</span>
              {totalQuestions > 0 && (
                <span className="ml-2 text-gray-400">
                  ({totalQuestions} result{totalQuestions !== 1 ? 's' : ''})
                </span>
              )}
            </p>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-300">Searching questions...</p>
            </div>
          ) : currentQuestions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-2">
                {debouncedSearchQuery ? 'No questions found for your search.' : 'No questions available.'}
              </p>
              {debouncedSearchQuery && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery('')}
                  className="mt-4"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            currentQuestions.map((question, index) => (
              <Card 
                key={question.id} 
                className="glass-dark border-white/10 hover:border-blue-500/30 card-hover group fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Vote and Stats */}
                    <div className="flex lg:flex-col items-center lg:items-start gap-6 lg:gap-3 min-w-[140px]">
                      <div className="flex items-center gap-2 text-sm group-hover:scale-110 transition-transform duration-300">
                        <ChevronUp className="h-5 w-5 text-green-400" />
                        <span className="text-green-400 font-semibold text-lg">{question.votes}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        <MessageSquare className="h-5 w-5" />
                        <span className="font-medium">{question.answers}</span>
                      </div>
                      <Badge variant="secondary" className="bg-slate-700/50 text-gray-300 border-slate-600/50">
                        {question.views}
                      </Badge>
                      {question.isHot && (
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                          <Award className="h-3 w-3 mr-1" />
                          Hot
                        </Badge>
                      )}
                    </div>

                    {/* Question Content */}
                    <div className="flex-1">
                      <Link 
                        to={`/question/${question.id}`}
                        className="text-xl font-semibold text-gradient-primary hover:scale-105 transition-all duration-300 mb-3 block"
                      >
                        {question.title}
                      </Link>
                      <div 
                        className="text-gray-300 mb-4 line-clamp-2 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: question.description
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                            .replace(/~~(.*?)~~/g, '<del class="line-through">$1</del>')
                            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">$1</a>')
                            .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
                            .replace(/\n• (.*?)(?=\n|$)/g, '<li>$1</li>')
                            .replace(/\n\d+\. (.*?)(?=\n|$)/g, '<li>$1</li>')
                            .replace(/(<li>.*?<\/li>)/s, '<ul class="list-disc list-inside space-y-1 my-4">$1</ul>')
                            .replace(/\n/g, '<br />')
                        }}
                      />
                      
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                          {question.tags.map((tag) => (
                            <Badge 
                              key={tag} 
                              className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40 cursor-pointer transform hover:scale-105"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="text-sm text-gray-400 flex items-center gap-2">
                          <span>asked by</span>
                          <span className="text-gradient-primary font-medium">{question.author}</span>
                          <span>{question.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm rounded-xl p-2 border border-white/10">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-600/50 text-white hover:bg-slate-700/50 transition-all duration-300"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {visiblePages.map((page) => (
              <Button 
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                className={page === currentPage 
                  ? "gradient-primary hover:shadow-glow" 
                  : "border-slate-600/50 text-white hover:bg-slate-700/50 transition-all duration-300"
                }
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-600/50 text-white hover:bg-slate-700/50 transition-all duration-300"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
        
        {/* Debug info - remove in production */}
        <div className="mt-4 text-center text-sm text-gray-400">
          Showing {currentQuestions.length} of {totalQuestions} questions (Page {currentPage} of {totalPages})
        </div>
      </div>
    </div>
  );
};

export default Index;