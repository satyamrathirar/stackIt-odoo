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

const mockQuestions = [
  {
    id: 1,
    title: "How to join 2 columns in a data set to make a separate column in SQL",
    description: "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name and column 2 consists of last name I want a column to combine...",
    tags: ["SQL", "JOIN"],
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
  }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Newest");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
                <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
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
          {mockQuestions.map((question) => (
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
            <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-700">
              Previous
            </Button>
            {[1, 2, 3, 4, 5, 6, 7].map((page) => (
              <Button 
                key={page}
                variant={page === 1 ? "default" : "outline"}
                size="sm"
                className={page === 1 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "border-slate-600 text-white hover:bg-slate-700"
                }
              >
                {page}
              </Button>
            ))}
            <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-700">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;