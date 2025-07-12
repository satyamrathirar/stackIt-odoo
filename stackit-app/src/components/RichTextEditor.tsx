import React, { useState, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Link, 
  Image as ImageIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Smile,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Write your answer here...",
  className = ""
}) => {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '💩', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];

  const getSelectedText = () => {
    const textarea = textareaRef.current;
    if (!textarea) return '';
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    return value.substring(start, end);
  };

  const replaceSelectedText = (replacement: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 0);
  };

  const formatText = (format: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    const selected = getSelectedText();
    if (!selected) return;

    let replacement = '';
    switch (format) {
      case 'bold':
        replacement = `**${selected}**`;
        break;
      case 'italic':
        replacement = `*${selected}*`;
        break;
      case 'strikethrough':
        replacement = `~~${selected}~~`;
        break;
      case 'bullet':
        replacement = `\n• ${selected}`;
        break;
      case 'numbered':
        replacement = `\n1. ${selected}`;
        break;
    }
    
    replaceSelectedText(replacement);
  };

  const insertEmoji = (emoji: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const cursorPos = textarea.selectionStart;
    const newValue = value.substring(0, cursorPos) + emoji + value.substring(cursorPos);
    onChange(newValue);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorPos + emoji.length, cursorPos + emoji.length);
    }, 0);
    
    setShowEmojiPicker(false);
  };

  const insertLink = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    const selected = getSelectedText();
    if (!selected || !linkUrl.trim()) return;
    
    const replacement = `[${selected}](${linkUrl})`;
    replaceSelectedText(replacement);
    setLinkUrl('');
    setShowLinkDialog(false);
  };

  const insertImage = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (!imageUrl.trim()) return;
    
    const replacement = `![Image](${imageUrl})`;
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const newValue = value.substring(0, cursorPos) + replacement + value.substring(cursorPos);
    onChange(newValue);
    
    setImageUrl('');
    setShowImageDialog(false);
  };

  const alignText = (alignment: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const cursorPos = textarea.selectionStart;
    let replacement = '';
    
    switch (alignment) {
      case 'left':
        replacement = '\n<div style="text-align: left;">\n\n</div>\n';
        break;
      case 'center':
        replacement = '\n<div style="text-align: center;">\n\n</div>\n';
        break;
      case 'right':
        replacement = '\n<div style="text-align: right;">\n\n</div>\n';
        break;
    }
    
    const newValue = value.substring(0, cursorPos) + replacement + value.substring(cursorPos);
    onChange(newValue);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorPos + replacement.length - 7, cursorPos + replacement.length - 7);
    }, 0);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg backdrop-blur-sm">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => formatText('bold', e)}
            className="p-2 hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-200"
            title="Bold"
            type="button"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => formatText('italic', e)}
            className="p-2 hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-200"
            title="Italic"
            type="button"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => formatText('strikethrough', e)}
            className="p-2 hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-200"
            title="Strikethrough"
            type="button"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => formatText('bullet', e)}
            className="p-2 hover:bg-green-500/20 hover:text-green-400 transition-all duration-200"
            title="Bullet List"
            type="button"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => formatText('numbered', e)}
            className="p-2 hover:bg-green-500/20 hover:text-green-400 transition-all duration-200"
            title="Numbered List"
            type="button"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        {/* Links and Images */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowLinkDialog(true);
            }}
            className="p-2 hover:bg-purple-500/20 hover:text-purple-400 transition-all duration-200"
            title="Insert Link"
            type="button"
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowImageDialog(true);
            }}
            className="p-2 hover:bg-purple-500/20 hover:text-purple-400 transition-all duration-200"
            title="Insert Image"
            type="button"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Emoji */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowEmojiPicker(!showEmojiPicker);
            }}
            className="p-2 hover:bg-yellow-500/20 hover:text-yellow-400 transition-all duration-200"
            title="Insert Emoji"
            type="button"
          >
            <Smile className="h-4 w-4" />
          </Button>
          
          {showEmojiPicker && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowEmojiPicker(false)}>
              <div 
                className="bg-slate-800 border border-slate-600 rounded-lg shadow-lg p-4 min-w-[400px] max-w-[500px] max-h-[400px]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-white">Select Emoji</h3>
                  <button
                    onClick={() => setShowEmojiPicker(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                    type="button"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid grid-cols-12 gap-1 max-h-80 overflow-y-auto">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={(e) => insertEmoji(emoji, e)}
                      className="p-2 hover:bg-slate-700 rounded text-lg transition-colors"
                      type="button"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => alignText('left', e)}
            className="p-2 hover:bg-orange-500/20 hover:text-orange-400 transition-all duration-200"
            title="Align Left"
            type="button"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => alignText('center', e)}
            className="p-2 hover:bg-orange-500/20 hover:text-orange-400 transition-all duration-200"
            title="Align Center"
            type="button"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => alignText('right', e)}
            className="p-2 hover:bg-orange-500/20 hover:text-orange-400 transition-all duration-200"
            title="Align Right"
            type="button"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Textarea */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[200px] bg-slate-800/50 border-slate-600/50 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 rounded-xl backdrop-blur-sm"
      />

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-600 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">URL</label>
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={(e) => insertLink(e)} className="flex-1" type="button">
                  Insert Link
                </Button>
                <Button 
                  variant="outline" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowLinkDialog(false);
                  }}
                  className="flex-1"
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-600 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Insert Image</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={(e) => insertImage(e)} className="flex-1" type="button">
                  Insert Image
                </Button>
                <Button 
                  variant="outline" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowImageDialog(false);
                  }}
                  className="flex-1"
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor; 