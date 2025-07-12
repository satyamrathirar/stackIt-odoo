import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parse markdown text and convert it to HTML with proper styling
 * @param text - The markdown text to parse
 * @returns HTML string with markdown formatting applied
 */
export function parseMarkdown(text: string): string {
  return text
    // Bold text: **text** -> <strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
    // Italic text: *text* -> <em>
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Strikethrough text: ~~text~~ -> <del>
    .replace(/~~(.*?)~~/g, '<del class="line-through">$1</del>')
    // Links: [text](url) -> <a>
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">$1</a>')
    // Images: ![alt](url) -> <img>
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
    // Bullet lists: • item -> <li>
    .replace(/\n• (.*?)(?=\n|$)/g, '<li>$1</li>')
    // Numbered lists: 1. item -> <li>
    .replace(/\n\d+\. (.*?)(?=\n|$)/g, '<li>$1</li>')
    // Wrap lists in <ul>
    .replace(/(<li>.*?<\/li>)/s, '<ul class="list-disc list-inside space-y-1 my-4">$1</ul>')
    // Line breaks
    .replace(/\n/g, '<br />')
}
