import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Bold, Italic, List, Link as LinkIcon, Image, AlignLeft, AlignCenter, AlignRight, Code, Quote, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const AskQuestion = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const navigate = useNavigate();

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Submitting question:", { title, description, tags });
    navigate("/");
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
      <header className="glass-dark border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-300 group">
              <ArrowLeft className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Back to Home</span>
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

      <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        <Card className="glass-dark border-white/10 card-hover fade-in">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl text-white flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-glow">
                <Hash className="h-6 w-6 text-white" />
              </div>
              Ask a Question
            </CardTitle>
            <p className="text-gray-400 text-lg">Share your knowledge and help others learn</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Title */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-200">
                Question Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your question? Be specific..."
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm text-lg py-4"
              />
              <p className="text-sm text-gray-500">A clear title helps others understand your question quickly</p>
            </div>

            {/* Description with Rich Text Editor */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-200">
                Question Details
              </label>
              
              {/* Enhanced Rich Text Toolbar */}
              <div className="bg-slate-800/50 border border-slate-600/50 rounded-t-xl p-3 flex flex-wrap gap-2 backdrop-blur-sm">
                <Button size="sm" variant="ghost" className="h-10 w-10 p-0 hover:bg-slate-700/50 transition-all duration-300 group">
                  <Bold className="h-4 w-4 group-hover:scale-110" />
                </Button>
                <Button size="sm" variant="ghost" className="h-10 w-10 p-0 hover:bg-slate-700/50 transition-all duration-300 group">
                  <Italic className="h-4 w-4 group-hover:scale-110" />
                </Button>
                <Separator orientation="vertical" className="bg-slate-500/50 mx-1" />
                <Button size="sm" variant="ghost" className="h-10 w-10 p-0 hover:bg-slate-700/50 transition-all duration-300 group">
                  <List className="h-4 w-4 group-hover:scale-110" />
                </Button>
                <Button size="sm" variant="ghost" className="h-10 w-10 p-0 hover:bg-slate-700/50 transition-all duration-300 group">
                  <Code className="h-4 w-4 group-hover:scale-110" />
                </Button>
                <Button size="sm" variant="ghost" className="h-10 w-10 p-0 hover:bg-slate-700/50 transition-all duration-300 group">
                  <Quote className="h-4 w-4 group-hover:scale-110" />
                </Button>
                <Separator orientation="vertical" className="bg-slate-500/50 mx-1" />
                <Button size="sm" variant="ghost" className="h-10 w-10 p-0 hover:bg-slate-700/50 transition-all duration-300 group">
                  <LinkIcon className="h-4 w-4 group-hover:scale-110" />
                </Button>
                <Button size="sm" variant="ghost" className="h-10 w-10 p-0 hover:bg-slate-700/50 transition-all duration-300 group">
                  <Image className="h-4 w-4 group-hover:scale-110" />
                </Button>
                <Separator orientation="vertical" className="bg-slate-500/50 mx-1" />
                <Button size="sm" variant="ghost" className="h-10 w-10 p-0 hover:bg-slate-700/50 transition-all duration-300 group">
                  <AlignLeft className="h-4 w-4 group-hover:scale-110" />
                </Button>
                <Button size="sm" variant="ghost" className="h-10 w-10 p-0 hover:bg-slate-700/50 transition-all duration-300 group">
                  <AlignCenter className="h-4 w-4 group-hover:scale-110" />
                </Button>
                <Button size="sm" variant="ghost" className="h-10 w-10 p-0 hover:bg-slate-700/50 transition-all duration-300 group">
                  <AlignRight className="h-4 w-4 group-hover:scale-110" />
                </Button>
              </div>
              
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your question in detail. Include code examples, error messages, or any relevant context..."
                rows={12}
                className="bg-slate-800/50 border-slate-600/50 border-t-0 rounded-t-none rounded-b-xl text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all duration-300 backdrop-blur-sm text-base leading-relaxed"
              />
              <p className="text-sm text-gray-500">Provide enough context for others to understand and help you</p>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-200">
                Tags
              </label>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add relevant tags (press Enter to add each tag)..."
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm py-4"
              />
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 hover:from-red-600/20 hover:to-pink-600/20 hover:text-red-300 cursor-pointer transition-all duration-300 border border-blue-500/20 hover:border-red-500/40 transform hover:scale-105 group"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">×</span>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500">Tags help categorize your question and make it easier to find</p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-white/10">
              <Button 
                onClick={handleSubmit}
                className="gradient-primary hover:shadow-glow transform hover:scale-105 transition-all duration-300 font-medium px-8 py-3 text-lg"
                disabled={!title.trim() || !description.trim()}
              >
                Submit Question
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AskQuestion;
