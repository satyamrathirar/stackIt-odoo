import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ChevronUp, ChevronDown, Check, MessageSquare, Share, Flag, Bold, Italic, List, Link as LinkIcon, Image, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
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
  title: "Introduce yourself",
  description: "Please give a brief introduction about yourself including your background, interests, and experience.",
  tags: ["Introduction", "General"],
  votes: 5,
  views: 342,
  author: "User Name",
  timeAgo: "2 hours ago"
};

  const mockAnswers = [
    {
      id: 1,
      content: "You can use the CONCAT function in SQL to combine two columns:\n\n```sql\nSELECT CONCAT(first_name, ' ', last_name) AS full_name\nFROM your_table;\n```\n\nThis will create a new column called 'full_name' that combines the first_name and last_name columns with a space in between.",
      author: "SQLExpert",
      timeAgo: "1 hour ago",
      isAccepted: true,
      votes: 5
    },
    {
      id: 2,
      content: "Another approach is to use the pipe operator (||) which works in some SQL dialects:\n\n```sql\nSELECT first_name || ' ' || last_name AS full_name\nFROM your_table;\n```",
      author: "DatabaseGuru",
      timeAgo: "30 minutes ago",
      isAccepted: false,
      votes: -2
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
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors">
              StackIt
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-4">
          <Link to="/" className="hover:text-blue-400">Questions</Link>
          <span className="mx-2">→</span>
          <span>How to join 2 columns...</span>
        </div>

        {/* Question */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardContent className="p-6">
            <div className="flex gap-6">
              {/* Voting Panel */}
              <div className="flex flex-col items-center gap-2 min-w-[60px]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote('question', 'up')}
                  className="p-1 hover:bg-slate-700"
                >
                  <ChevronUp className="h-6 w-6 text-gray-400 hover:text-green-400" />
                </Button>
                <span className="text-xl font-bold">{mockQuestion.votes + questionVote}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote('question', 'down')}
                  className="p-1 hover:bg-slate-700"
                >
                  <ChevronDown className="h-6 w-6 text-gray-400 hover:text-red-400" />
                </Button>
              </div>

              {/* Question Content */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-4">
                  {mockQuestion.title}
                </h1>
                
                <div className="prose prose-invert max-w-none mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    {mockQuestion.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex flex-wrap gap-2">
                    {mockQuestion.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        className="bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Flag className="h-4 w-4 mr-2" />
                      Flag
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-gray-400">
                  asked by <span className="text-blue-400">{mockQuestion.author}</span> {mockQuestion.timeAgo}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{mockAnswers.length} Answers</h2>
          
          <div className="space-y-6">
            {mockAnswers.map((answer) => (
              <Card key={answer.id} className={`bg-slate-800 border-slate-700 ${answer.isAccepted ? 'border-green-500 bg-green-900/10' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Voting Panel */}
                    <div className="flex flex-col items-center gap-2 min-w-[60px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote('answer', 'up', answer.id)}
                        className="p-1 hover:bg-slate-700"
                      >
                        <ChevronUp className="h-6 w-6 text-gray-400 hover:text-green-400" />
                      </Button>
                      <span className="text-xl font-bold">{answerVotes[answer.id] || answer.votes}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote('answer', 'down', answer.id)}
                        className="p-1 hover:bg-slate-700"
                      >
                        <ChevronDown className="h-6 w-6 text-gray-400 hover:text-red-400" />
                      </Button>
                      {answer.isAccepted && (
                        <div className="mt-2">
                          <Check className="h-6 w-6 text-green-400" />
                        </div>
                      )}
                    </div>

                    {/* Answer Content */}
                    <div className="flex-1">
                      <div className="prose prose-invert max-w-none mb-4">
                        <MDEditor.Markdown
                            source={answer.content}
                            className="text-gray-300 prose prose-invert max-w-none"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Share className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Flag className="h-4 w-4 mr-2" />
                            Flag
                          </Button>
                        </div>
                        
                        <div className="text-sm text-gray-400">
                          answered by <span className="text-blue-400">{answer.author}</span> {answer.timeAgo}
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
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Submit Your Answer</h3>
            


        <div data-color-mode="dark" className="bg-slate-700 rounded-md p-2">
  <MDEditor
    value={answer}
    onChange={setAnswer}
    height={200}
    preview="edit"
  />
</div>

            
            <div className="flex justify-end mt-4">
              <Button 
                onClick={handleSubmitAnswer}
                className="bg-blue-600 hover:bg-blue-700 px-8"
                disabled={!answer.trim()}
              >
                Submit Answer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuestionDetail;
