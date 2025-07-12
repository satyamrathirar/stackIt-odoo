import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, ChevronUp, MessageSquare, User, Bell, Plus } from "lucide-react";
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

// Extended mock questions to demonstrate pagination
const mockQuestions = [
  {
    id: 1,
    title: "Introduce yourself",
    description: "Please give a brief introduction about yourself including your background, interests, and experience...",
    tags: ["Introduction", "General"],
    votes: 5,
    answers: 3,
    views: "3 ans",
    author: "User Name",
    timeAgo: "2 hours ago"
  },
  {
    id: 2,
    title: "React useState hook not updating state immediately",
    description: "I'm trying to update state in React but the component doesn't re-render with the new value...",
    tags: ["React", "Hooks"],
    votes: 12,
    answers: 2,
    views: "2 ans", 
    author: "Developer123",
    timeAgo: "4 hours ago"
  },
  {
    id: 3,
    title: "How to implement authentication in Next.js",
    description: "I need to add user authentication to my Next.js application. What's the best approach...",
    tags: ["Next.js", "Authentication"],
    votes: 8,
    answers: 5,
    views: "1 ans",
    author: "NextDev",
    timeAgo: "6 hours ago"
  },
  {
    id: 4,
    title: "TypeScript interface vs type",
    description: "What's the difference between interface and type in TypeScript? When should I use each?",
    tags: ["TypeScript"],
    votes: 15,
    answers: 7,
    views: "4 ans",
    author: "TSUser",
    timeAgo: "1 day ago"
  },
  {
    id: 5,
    title: "CSS Grid layout tutorial",
    description: "Can someone explain CSS Grid layout with practical examples?",
    tags: ["CSS", "Grid"],
    votes: 3,
    answers: 1,
    views: "1 ans",
    author: "CSSLearner",
    timeAgo: "2 days ago"
  },
  {
    id: 6,
    title: "Database optimization techniques",
    description: "What are the best practices for optimizing database queries and performance?",
    tags: ["Database", "Performance"],
    votes: 22,
    answers: 9,
    views: "6 ans",
    author: "DBExpert",
    timeAgo: "3 days ago"
  },
  {
    id: 7,
    title: "Docker container management",
    description: "How do I manage multiple Docker containers efficiently?",
    tags: ["Docker", "DevOps"],
    votes: 7,
    answers: 4,
    views: "2 ans",
    author: "DevOpsUser",
    timeAgo: "4 days ago"
  },
  {
    id: 8,
    title: "API rate limiting implementation",
    description: "What's the best way to implement rate limiting in a REST API?",
    tags: ["API", "Security"],
    votes: 18,
    answers: 6,
    views: "3 ans",
    author: "APIDev",
    timeAgo: "5 days ago"
  },
  {
    id: 9,
    title: "Vue.js vs React comparison",
    description: "I'm choosing between Vue.js and React for a new project. What are the pros and cons?",
    tags: ["Vue.js", "React", "Frontend"],
    votes: 25,
    answers: 12,
    views: "8 ans",
    author: "FrameworkFan",
    timeAgo: "1 week ago"
  },
  {
    id: 10,
    title: "Microservices architecture patterns",
    description: "What are the common patterns and best practices for microservices architecture?",
    tags: ["Microservices", "Architecture"],
    votes: 31,
    answers: 15,
    views: "10 ans",
    author: "ArchitectUser",
    timeAgo: "1 week ago"
  },
  {
    id: 11,
    title: "Git workflow strategies",
    description: "What's the best Git workflow for a team of 10 developers?",
    tags: ["Git", "Workflow"],
    votes: 14,
    answers: 8,
    views: "5 ans",
    author: "GitMaster",
    timeAgo: "1 week ago"
  },
  {
    id: 12,
    title: "Machine learning model deployment",
    description: "How do I deploy a machine learning model to production?",
    tags: ["Machine Learning", "Deployment"],
    votes: 28,
    answers: 11,
    views: "7 ans",
    author: "MLDev",
    timeAgo: "2 weeks ago"
  },
  {
    id: 13,
    title: "Web accessibility guidelines",
    description: "What are the key accessibility guidelines for web development?",
    tags: ["Accessibility", "Web Development"],
    votes: 9,
    answers: 3,
    views: "2 ans",
    author: "A11yDev",
    timeAgo: "2 weeks ago"
  },
  {
    id: 14,
    title: "GraphQL vs REST API",
    description: "When should I choose GraphQL over REST API?",
    tags: ["GraphQL", "REST", "API"],
    votes: 19,
    answers: 7,
    views: "4 ans",
    author: "APIArchitect",
    timeAgo: "2 weeks ago"
  },
  {
    id: 15,
    title: "Serverless function optimization",
    description: "How do I optimize serverless functions for better performance?",
    tags: ["Serverless", "Performance"],
    votes: 11,
    answers: 5,
    views: "3 ans",
    author: "ServerlessDev",
    timeAgo: "3 weeks ago"
  }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Newest");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Pagination settings
  const questionsPerPage = 5; // Show 5 questions per page
  const predefinedPages = [1, 2, 3, 4, 5, 6, 7];
  
  // Calculate pagination
  const totalQuestions = mockQuestions.length;
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
        const questionsOnPage = mockQuestions.slice(startIndex, endIndex);
        
        if (questionsOnPage.length > 0) {
          pages.push(i);
        }
      }
      
      return pages;
    }
  };
  
  const visiblePages = getVisiblePages();
  
  // Get current page questions
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = mockQuestions.slice(startIndex, endIndex);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors">
            StackIt
          </Link>
          
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <div className="relative">
                  <Bell className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center text-white">
                    2
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm">User Name</span>
                </div>
              </>
            ) : (
              <Button 
                onClick={() => setIsLoggedIn(true)}
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-gray-400 focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
            >
              <Link to="/ask" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ask New Question
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-slate-600 text-black hover:bg-slate-700">
                  <Filter className="h-4 w-4 mr-2" />
                  {selectedFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-600">
                <DropdownMenuItem onClick={() => setSelectedFilter("Newest")} className="text-white hover:bg-slate-700">
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("Unanswered")} className="text-white hover:bg-slate-700">
                  Unanswered
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("Most Voted")} className="text-white hover:bg-slate-700">
                  Most Voted
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {currentQuestions.map((question) => (
            <Card key={question.id} className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Vote and Stats */}
                  <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-2 min-w-[120px]">
                    <div className="flex items-center gap-1 text-sm">
                      <ChevronUp className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 font-medium">{question.votes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <MessageSquare className="h-4 w-4" />
                      <span>{question.answers}</span>
                    </div>
                    <Badge variant="secondary" className="bg-slate-700 text-gray-300">
                      {question.views}
                    </Badge>
                  </div>

                  {/* Question Content */}
                  <div className="flex-1">
                    <Link 
                      to={`/question/${question.id}`}
                      className="text-xl font-semibold text-blue-400 hover:text-blue-300 transition-colors mb-2 block"
                    >
                      {question.title}
                    </Link>
                    <p className="text-gray-300 mb-3 line-clamp-2">
                      {question.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-2">
                        {question.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            className="bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 transition-colors"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="text-sm text-gray-400">
                        asked by <span className="text-blue-400">{question.author}</span> {question.timeAgo}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-600 text-black hover:bg-slate-700"
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
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "border-slate-600 text-black hover:bg-slate-700"
                }
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="border-slate-600 text-black hover:bg-slate-700"
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