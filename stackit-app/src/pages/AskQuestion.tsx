import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Bold, Italic, List, Link as LinkIcon, Image, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
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
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Ask a Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your question title..."
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-blue-500"
              />
            </div>

            {/* Description with Rich Text Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              
              {/* Rich Text Toolbar */}
              <div className="bg-slate-700 border border-slate-600 rounded-t-md p-2 flex flex-wrap gap-1">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-600">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-600">
                  <Italic className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="bg-slate-500 mx-1" />
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-600">
                  <List className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-600">
                  <LinkIcon className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-600">
                  <Image className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="bg-slate-500 mx-1" />
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-600">
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-600">
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-600">
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
              
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your question in detail..."
                rows={8}
                className="bg-slate-700 border-slate-600 border-t-0 rounded-t-none text-white placeholder:text-gray-400 focus:border-blue-500 resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tags (press Enter to add)..."
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-blue-500"
              />
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 px-8"
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
