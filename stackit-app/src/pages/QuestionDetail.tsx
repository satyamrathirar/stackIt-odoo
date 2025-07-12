import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ChevronUp, ChevronDown, Check, MessageSquare, Share, Flag, Bold, Italic, List, Link as LinkIcon, Image, AlignLeft, AlignCenter, AlignRight, Eye, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MDEditor from "@uiw/react-md-editor";

const QuestionDetail = () => {
  const { id } = useParams();
  const [answer, setAnswer] = useState("");
  const [questionVote, setQuestionVote] = useState(0);
  const [answerVotes, setAnswerVotes] = useState<{[key: number]: number}>({1: 5, 2: -2});

  const mockQuestion = {
    id: 1,
    title: "How to combine two columns in SQL with CONCAT function?",
    description: "I'm working with a database table that has separate columns for first_name and last_name. I need to combine these two columns into a single full_name column using SQL. I've heard about the CONCAT function but I'm not sure how to use it properly. Can someone show me the correct syntax and provide some examples?",
    tags: ["SQL", "Database", "CONCAT"],
    votes: 15,
    views: 342,
    author: "DatabaseNewbie",
    timeAgo: "2 hours ago"
  };

  const mockAnswers = [
    {
      id: 1,
      content: "You can use the CONCAT function in SQL to combine two columns:\n\n```sql\nSELECT CONCAT(first_name, ' ', last_name) AS full_name\nFROM your_table;\n```\n\nThis will create a new column called 'full_name' that combines the first_name and last_name columns with a space in between.\n\n**Example with sample data:**\n```sql\nSELECT \n  first_name,\n  last_name,\n  CONCAT(first_name, ' ', last_name) AS full_name\nFROM employees;\n```\n\n**Result:**\n| first_name | last_name | full_name |\n|------------|-----------|-----------|\n| John       | Doe       | John Doe  |\n| Jane       | Smith     | Jane Smith|",
      author: "SQLExpert",
      timeAgo: "1 hour ago",
      isAccepted: true,
      votes: 8
    },
    {
      id: 2,
      content: "Another approach is to use the pipe operator (||) which works in some SQL dialects like PostgreSQL:\n\n```sql\nSELECT first_name || ' ' || last_name AS full_name\nFROM your_table;\n```\n\n**Note:** The pipe operator is not supported in all SQL databases, so CONCAT is more portable across different systems.",
      author: "DatabaseGuru",
      timeAgo: "30 minutes ago",
      isAccepted: false,
      votes: 3
    }
  ];

  const handleVote = (type: 'question' | 'answer', direction: 'up' | 'down', answerId?: number) => {
    if (type === 'question') {
      setQuestionVote(prev => direction === 'up' ? prev + 1 : prev - 1);
    } else if (answerId) {
      setAnswerVotes(prev => ({
        ...prev,
        [answerId]: (prev[answerId] || 0) + (direction === 'up' ? 1 : -1)
      }));
    }
  };

  const handleSubmitAnswer = () => {
    console.log("Submitting answer:", answer);
    setAnswer("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="glass-dark border-b border-white/10 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-300 group">
              <ArrowLeft className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Back to Questions</span>
            </Link>
            <Link to="/" className="text-3xl font-bold gradient-text hover:scale-105 transition-transform duration-300">
              StackIt
            </Link>
          </div>
          
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-glow group-hover:shadow-glow-purple transition-all duration-300 group-hover:scale-110">
              <span className="text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {/* Enhanced Breadcrumb */}
        <div className="text-sm text-gray-400 mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-gradient-primary transition-colors duration-300">Questions</Link>
          <span className="text-gray-600">→</span>
          <span className="text-gray-300 truncate">How to combine two columns in SQL...</span>
        </div>

        {/* Question */}
        <Card className="glass-dark border-white/10 card-hover fade-in mb-8">
          <CardContent className="p-8">
            <div className="flex gap-8">
              {/* Enhanced Voting Panel */}
              <div className="flex flex-col items-center gap-3 min-w-[80px]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote('question', 'up')}
                  className="p-2 hover:bg-green-500/10 hover:text-green-400 transition-all duration-300 group"
                >
                  <ChevronUp className="h-7 w-7 group-hover:scale-110 transition-transform" />
                </Button>
                <span className="text-2xl font-bold text-gradient-primary">{mockQuestion.votes + questionVote}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote('question', 'down')}
                  className="p-2 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
                >
                  <ChevronDown className="h-7 w-7 group-hover:scale-110 transition-transform" />
                </Button>
              </div>

              {/* Question Content */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-6 leading-tight">
                  {mockQuestion.title}
                </h1>
                
                <div className="prose prose-invert max-w-none mb-6">
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {mockQuestion.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
                  <div className="flex flex-wrap gap-3">
                    {mockQuestion.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40 cursor-pointer transform hover:scale-105"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">{mockQuestion.views} views</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white transition-all duration-300 group">
                      <Share className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white transition-all duration-300 group">
                      <Flag className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                      Flag
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-gray-400 flex items-center gap-2">
                  <span>asked by</span>
                  <span className="text-gradient-primary font-medium">{mockQuestion.author}</span>
                  <span>{mockQuestion.timeAgo}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-blue-400" />
            {mockAnswers.length} Answers
          </h2>
          
          <div className="space-y-8">
            {mockAnswers.map((answer, index) => (
              <Card 
                key={answer.id} 
                className={`glass-dark border-white/10 card-hover fade-in ${
                  answer.isAccepted ? 'border-green-500/50 bg-green-900/10 shadow-glow' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex gap-8">
                    {/* Enhanced Voting Panel */}
                    <div className="flex flex-col items-center gap-3 min-w-[80px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote('answer', 'up', answer.id)}
                        className="p-2 hover:bg-green-500/10 hover:text-green-400 transition-all duration-300 group"
                      >
                        <ChevronUp className="h-7 w-7 group-hover:scale-110 transition-transform" />
                      </Button>
                      <span className="text-2xl font-bold text-gradient-primary">{answerVotes[answer.id] || answer.votes}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote('answer', 'down', answer.id)}
                        className="p-2 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
                      >
                        <ChevronDown className="h-7 w-7 group-hover:scale-110 transition-transform" />
                      </Button>
                      {answer.isAccepted && (
                        <div className="mt-3 p-2 bg-green-500/20 rounded-full">
                          <Check className="h-6 w-6 text-green-400" />
                        </div>
                      )}
                    </div>

                    {/* Answer Content */}
                    <div className="flex-1">
                      <div className="prose prose-invert max-w-none mb-6">
                        <MDEditor.Markdown
                          source={answer.content}
                          className="text-gray-300 prose prose-invert max-w-none"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white transition-all duration-300 group">
                            <Share className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                            Share
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white transition-all duration-300 group">
                            <Flag className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                            Flag
                          </Button>
                        </div>
                        
                        <div className="text-sm text-gray-400 flex items-center gap-2">
                          <span>answered by</span>
                          <span className="text-gradient-primary font-medium">{answer.author}</span>
                          <span>{answer.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Submit Answer */}
        <Card className="glass-dark border-white/10 card-hover fade-in">
          <CardContent className="p-8">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-glow">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              Submit Your Answer
            </h3>
            
            <div className="space-y-4">
              <div data-color-mode="dark" className="bg-slate-800/50 rounded-xl border border-slate-600/50 overflow-hidden">
                <MDEditor
                  value={answer}
                  onChange={setAnswer}
                  height={300}
                  preview="edit"
                  className="border-0"
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSubmitAnswer}
                  className="gradient-primary hover:shadow-glow transform hover:scale-105 transition-all duration-300 font-medium px-8 py-3 text-lg"
                  disabled={!answer.trim()}
                >
                  Submit Answer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionDetail;
