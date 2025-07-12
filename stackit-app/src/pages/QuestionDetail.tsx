import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ChevronUp, ChevronDown, Check, MessageSquare, Share, Flag, Bold, Italic, List, Link as LinkIcon, Image, AlignLeft, AlignCenter, AlignRight, Eye, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { api } from '@/services/api';
import { Question, Answer } from '@/types/database';
import RichTextEditor from '@/components/RichTextEditor';
import { parseMarkdown } from '@/lib/utils';

const QuestionDetail = () => {
  const { id } = useParams();
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [questionVote, setQuestionVote] = useState(0);
  const [answerVotes, setAnswerVotes] = useState<{[key: number]: number}>({});
  const [hasVotedQuestion, setHasVotedQuestion] = useState(false);
  const [hasVotedAnswers, setHasVotedAnswers] = useState<{ [key: number]: boolean }>({});

  // Load question and answers data
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const questionId = parseInt(id);
        
        // Load question
        const { data: questionData, error: questionError } = await api.getQuestion(questionId);
        if (questionError) {
          throw new Error(`Failed to load question: ${questionError.message}`);
        }
        setQuestion(questionData);
        
        // Load answers
        const { data: answersData, error: answersError } = await api.getAnswers(questionId);
        if (answersError) {
          throw new Error(`Failed to load answers: ${answersError.message}`);
        }
        setAnswers(answersData || []);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleVote = async (
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

  const handleSubmitAnswer = async () => {
    if (!question || !answer.trim()) return;
    
    setSubmitting(true);
    
    try {
      const newAnswer = {
        question_id: question.id,
        content: answer,
        author: "Current User", // This should come from auth context
        votes: 0,
        is_accepted: false
      };
      
      const { data, error } = await api.createAnswer(newAnswer);
      
      if (error) {
        throw new Error(`Failed to submit answer: ${error.message}`);
      }
      
      // Add the new answer to the list
      if (data) {
        setAnswers(prev => [data, ...prev]);
        setAnswer("");
        alert("Answer submitted successfully!");
      }
      
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Questions
          </Link>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300 mb-4">Question not found</p>
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Questions
          </Link>
        </div>
      </div>
    );
  }

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
              <ArrowLeft className="h-5 w-5 transition-colors" />
              <span className="font-medium">Back to Questions</span>
            </Link>
            <Link to="/" className="text-3xl font-bold gradient-text transition-colors duration-300">
              StackIt
            </Link>
          </div>
          
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-glow group-hover:shadow-glow-purple transition-all duration-300">
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
          <span className="text-gray-300 truncate">{question.title}</span>
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
                  <ChevronUp className="h-7 w-7 transition-colors" />
                </Button>
                <span className="text-2xl font-bold text-gradient-primary">{question.votes + questionVote}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote('question', 'down')}
                  className="p-2 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
                >
                  <ChevronDown className="h-7 w-7 transition-colors" />
                </Button>
              </div>

              {/* Question Content */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-6 leading-tight">
                  {question.title}
                </h1>
                
                <div className="prose prose-invert max-w-none mb-6">
                  <div 
                    className="text-gray-300 prose prose-invert max-w-none leading-relaxed text-lg"
                    dangerouslySetInnerHTML={{
                      __html: parseMarkdown(question.description)
                    }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
                  <div className="flex flex-wrap gap-3">
                    {question.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40 cursor-pointer"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">{question.views} views</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white transition-all duration-300 group">
                      <Share className="h-4 w-4 mr-2 transition-colors" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white transition-all duration-300 group">
                      <Flag className="h-4 w-4 mr-2 transition-colors" />
                      Flag
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-gray-400 flex items-center gap-2">
                  <span>asked by</span>
                  <span className="text-gradient-primary font-medium">{question.author}</span>
                  <span>{new Date(question.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-blue-400" />
            {answers.length} Answers
          </h2>
          
          <div className="space-y-8">
            {answers.map((answer, index) => (
              <Card 
                key={answer.id} 
                className={`glass-dark border-white/10 card-hover fade-in ${
                  answer.is_accepted ? 'border-green-500/50 bg-green-900/10 shadow-glow' : ''
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
                        <ChevronUp className="h-7 w-7 transition-colors" />
                      </Button>
                      <span className="text-2xl font-bold text-gradient-primary">{answerVotes[answer.id] || answer.votes}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote('answer', 'down', answer.id)}
                        className="p-2 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
                      >
                        <ChevronDown className="h-7 w-7 transition-colors" />
                      </Button>
                      {answer.is_accepted && (
                        <div className="mt-3 p-2 bg-green-500/20 rounded-full">
                          <Check className="h-6 w-6 text-green-400" />
                        </div>
                      )}
                    </div>

                    {/* Answer Content */}
                    <div className="flex-1">
                      <div className="prose prose-invert max-w-none mb-6">
                        <div 
                          className="text-gray-300 prose prose-invert max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: answer.content
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
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white transition-all duration-300 group">
                            <Share className="h-4 w-4 mr-2 transition-colors" />
                            Share
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white transition-all duration-300 group">
                            <Flag className="h-4 w-4 mr-2 transition-colors" />
                            Flag
                          </Button>
                        </div>
                        
                        <div className="text-sm text-gray-400 flex items-center gap-2">
                          <span>answered by</span>
                          <span className="text-gradient-primary font-medium">{answer.author}</span>
                          <span>{new Date(answer.created_at).toLocaleDateString()}</span>
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
              <RichTextEditor
                value={answer}
                onChange={setAnswer}
                placeholder="Write your answer here..."
              />
              
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSubmitAnswer}
                  className="gradient-primary hover:shadow-glow transition-all duration-300 font-medium px-8 py-3 text-lg"
                  disabled={!answer.trim() || submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Answer'}
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
