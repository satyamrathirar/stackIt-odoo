import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ChevronUp, ChevronDown, Check, MessageSquare, Share, Flag, Bold, Italic, List, Link as LinkIcon, Image, AlignLeft, AlignCenter, AlignRight, Eye, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MDEditor from "@uiw/react-md-editor";

// Mock questions database - this would normally come from an API
const mockQuestionsDatabase = [
  {
    id: 1,
    title: "Introduce yourself",
    description: "Please give a brief introduction about yourself including your background, interests, and experience.",
    tags: ["Introduction", "General"],
    votes: 5,
    views: 342,
    author: "User Name",
    timeAgo: "2 hours ago"
  },
  {
    id: 2,
    title: "React useState hook not updating state immediately",
    description: "I'm trying to update state in React but the component doesn't re-render with the new value. I've tried using useEffect but it's not working as expected. Can someone help me understand why the state isn't updating immediately?",
    tags: ["React", "Hooks"],
    votes: 12,
    views: 156,
    author: "Developer123",
    timeAgo: "4 hours ago"
  },
  {
    id: 3,
    title: "How to implement authentication in Next.js",
    description: "I need to add user authentication to my Next.js application. What's the best approach for implementing JWT tokens and session management?",
    tags: ["Next.js", "Authentication"],
    votes: 8,
    views: 89,
    author: "NextDev",
    timeAgo: "6 hours ago"
  },
  {
    id: 4,
    title: "TypeScript interface vs type",
    description: "What's the difference between interface and type in TypeScript? When should I use each? I'm confused about the performance implications and best practices.",
    tags: ["TypeScript"],
    votes: 15,
    views: 234,
    author: "TSUser",
    timeAgo: "1 day ago"
  },
  {
    id: 5,
    title: "CSS Grid layout tutorial",
    description: "Can someone explain CSS Grid layout with practical examples? I want to create a responsive layout but I'm struggling with the grid-template-areas property.",
    tags: ["CSS", "Grid"],
    votes: 3,
    views: 67,
    author: "CSSLearner",
    timeAgo: "2 days ago"
  },
  {
    id: 6,
    title: "Database optimization techniques",
    description: "What are the best practices for optimizing database queries and performance? I'm working with a large dataset and need to improve query execution time.",
    tags: ["Database", "Performance"],
    votes: 22,
    views: 445,
    author: "DBExpert",
    timeAgo: "3 days ago"
  },
  {
    id: 7,
    title: "Docker container management",
    description: "How do I manage multiple Docker containers efficiently? I need to set up a development environment with multiple services.",
    tags: ["Docker", "DevOps"],
    votes: 7,
    views: 123,
    author: "DevOpsUser",
    timeAgo: "4 days ago"
  },
  {
    id: 8,
    title: "API rate limiting implementation",
    description: "What's the best way to implement rate limiting in a REST API? I need to prevent abuse while maintaining good user experience.",
    tags: ["API", "Security"],
    votes: 18,
    views: 178,
    author: "APIDev",
    timeAgo: "5 days ago"
  },
  {
    id: 9,
    title: "Vue.js vs React comparison",
    description: "I'm choosing between Vue.js and React for a new project. What are the pros and cons of each framework? Which one is better for enterprise applications?",
    tags: ["Vue.js", "React", "Frontend"],
    votes: 25,
    views: 567,
    author: "FrameworkFan",
    timeAgo: "1 week ago"
  },
  {
    id: 10,
    title: "Microservices architecture patterns",
    description: "What are the common patterns and best practices for microservices architecture? I'm planning to migrate from a monolithic application.",
    tags: ["Microservices", "Architecture"],
    votes: 31,
    views: 789,
    author: "ArchitectUser",
    timeAgo: "1 week ago"
  },
  {
    id: 11,
    title: "Git workflow strategies",
    description: "What's the best Git workflow for a team of 10 developers? I need to implement branching strategies and code review processes.",
    tags: ["Git", "Workflow"],
    votes: 14,
    views: 234,
    author: "GitMaster",
    timeAgo: "1 week ago"
  },
  {
    id: 12,
    title: "Machine learning model deployment",
    description: "How do I deploy a machine learning model to production? I need to set up monitoring, versioning, and A/B testing for my ML models.",
    tags: ["Machine Learning", "Deployment"],
    votes: 28,
    views: 456,
    author: "MLDev",
    timeAgo: "2 weeks ago"
  },
  {
    id: 13,
    title: "Web accessibility guidelines",
    description: "What are the key accessibility guidelines for web development? I want to make my application accessible to users with disabilities.",
    tags: ["Accessibility", "Web Development"],
    votes: 9,
    views: 123,
    author: "A11yDev",
    timeAgo: "2 weeks ago"
  },
  {
    id: 14,
    title: "GraphQL vs REST API",
    description: "When should I choose GraphQL over REST API? I'm building a new API and need to understand the trade-offs between these approaches.",
    tags: ["GraphQL", "REST", "API"],
    votes: 19,
    views: 345,
    author: "APIArchitect",
    timeAgo: "2 weeks ago"
  },
  {
    id: 15,
    title: "Serverless function optimization",
    description: "How do I optimize serverless functions for better performance? I'm experiencing cold starts and need to reduce execution time.",
    tags: ["Serverless", "Performance"],
    votes: 11,
    views: 167,
    author: "ServerlessDev",
    timeAgo: "3 weeks ago"
  }
];

// Mock answers database
const mockAnswersDatabase = {
  1: [
    {
      id: 1,
      content: "Hello! I'm a software developer with 5 years of experience in web development. I specialize in React, Node.js, and Python. I love working on open-source projects and learning new technologies. In my free time, I enjoy hiking and reading tech blogs.",
      author: "DevUser123",
      timeAgo: "1 hour ago",
      isAccepted: true,
      votes: 8
    },
    {
      id: 2,
      content: "Hi there! I'm a junior developer just starting my journey in tech. I'm currently learning JavaScript and React. Looking forward to connecting with other developers and learning from the community!",
      author: "JuniorDev",
      timeAgo: "30 minutes ago",
      isAccepted: false,
      votes: 2
    }
  ],
  2: [
    {
      id: 1,
      content: "The issue you're experiencing is likely due to React's asynchronous state updates. When you call setState, React doesn't immediately update the state. Instead, it schedules an update for the next render cycle.\n\nHere's how to fix it:\n\n```javascript\nconst [count, setCount] = useState(0);\n\n// Wrong way - state won't update immediately\nconst handleClick = () => {\n  setCount(count + 1);\n  console.log(count); // This will show the old value\n};\n\n// Correct way - use functional update\nconst handleClick = () => {\n  setCount(prevCount => prevCount + 1);\n  console.log(count); // Still shows old value, but state will update correctly\n};\n\n// If you need the new value immediately, use useEffect\nuseEffect(() => {\n  console.log('Count updated:', count);\n}, [count]);\n```",
      author: "ReactExpert",
      timeAgo: "2 hours ago",
      isAccepted: true,
      votes: 8
    }
  ],
  3: [
    {
      id: 1,
      content: "For Next.js authentication, I recommend using NextAuth.js. It's the most popular and well-maintained solution:\n\n```javascript\n// Install NextAuth\nnpm install next-auth\n\n// Create pages/api/auth/[...nextauth].js\nimport NextAuth from 'next-auth';\nimport Providers from 'next-auth/providers';\n\nexport default NextAuth({\n  providers: [\n    Providers.GitHub({\n      clientId: process.env.GITHUB_ID,\n      clientSecret: process.env.GITHUB_SECRET,\n    }),\n  ],\n  callbacks: {\n    async jwt(token, user) {\n      return token;\n    },\n    async session(session, token) {\n      return session;\n    },\n  },\n});\n```\n\nThis provides JWT tokens, session management, and supports multiple providers out of the box.",
      author: "NextAuthDev",
      timeAgo: "3 hours ago",
      isAccepted: true,
      votes: 6
    }
  ],
  4: [
    {
      id: 1,
      content: "Here are the key differences between `interface` and `type` in TypeScript:\n\n**Interfaces:**\n- Can be extended and merged\n- Better for object shapes\n- More flexible for API contracts\n\n```typescript\ninterface User {\n  name: string;\n  age: number;\n}\n\ninterface AdminUser extends User {\n  role: 'admin';\n}\n```\n\n**Types:**\n- Can represent unions, primitives, and complex types\n- Better for utility types and complex transformations\n- Cannot be merged\n\n```typescript\ntype Status = 'loading' | 'success' | 'error';\ntype UserResponse = User | null;\n```\n\n**When to use each:**\n- Use `interface` for object shapes and API contracts\n- Use `type` for unions, primitives, and utility types",
      author: "TypeScriptGuru",
      timeAgo: "1 day ago",
      isAccepted: true,
      votes: 12
    }
  ],
  5: [
    {
      id: 1,
      content: "CSS Grid is powerful for creating complex layouts. Here's a practical example:\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  grid-template-areas:\n    'header header header'\n    'sidebar main aside'\n    'footer footer footer';\n  gap: 1rem;\n}\n\n.header { grid-area: header; }\n.sidebar { grid-area: sidebar; }\n.main { grid-area: main; }\n.aside { grid-area: aside; }\n.footer { grid-area: footer; }\n```\n\nThis creates a responsive layout that adapts to different screen sizes.",
      author: "CSSMaster",
      timeAgo: "1 day ago",
      isAccepted: true,
      votes: 4
    }
  ]
};

const QuestionDetail = () => {
  const { id } = useParams();
  const [answer, setAnswer] = useState("");
  const [questionVote, setQuestionVote] = useState(0);
  const [answerVotes, setAnswerVotes] = useState<{[key: number]: number}>({});
  // To prevent multiple votes by same user/session
  const [hasVotedQuestion, setHasVotedQuestion] = useState(false);
  const [hasVotedAnswers, setHasVotedAnswers] = useState<{ [key: number]: boolean }>({});
  

  // Find the question based on the ID from URL
  const questionId = parseInt(id || "1");
  const mockQuestion = mockQuestionsDatabase.find(q => q.id === questionId) || mockQuestionsDatabase[0];
  const mockAnswers = mockAnswersDatabase[questionId] || [];

  const handleVote = (
  type: 'question' | 'answer',
  direction: 'up' | 'down',
  answerId?: number
    ) => {
    if (type === 'question') {
        if (hasVotedQuestion) {
         alert("You've already voted on this question.");
        return;
     }
    setQuestionVote(prev => direction === 'up' ? prev + 1 : prev - 1);
    setHasVotedQuestion(true);
  } else if (answerId) {
    if (hasVotedAnswers[answerId]) {
      alert("You've already voted on this answer.");
      return;
    }
    setAnswerVotes(prev => ({
      ...prev,
      [answerId]: (prev[answerId] || 0) + (direction === 'up' ? 1 : -1),
    }));
    setHasVotedAnswers(prev => ({
      ...prev,
      [answerId]: true,
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
          <span className="text-gray-300 truncate">{mockQuestion.title}</span>
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
