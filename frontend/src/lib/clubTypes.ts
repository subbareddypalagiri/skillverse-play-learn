import {
  Palette, Music, Dumbbell, Code, Camera, BookOpen, Gamepad2, Coffee
} from "lucide-react";

export const clubTypes = [
  { type: 'art', icon: Palette, label: 'Art & Design', gradient: 'from-purple-500 to-pink-500' },
  { type: 'music', icon: Music, label: 'Music', gradient: 'from-pink-500 to-rose-500' },
  { type: 'sports', icon: Dumbbell, label: 'Sports & Fitness', gradient: 'from-green-500 to-emerald-500' },
  { type: 'tech', icon: Code, label: 'Technology', gradient: 'from-blue-500 to-cyan-500' },
  { type: 'photography', icon: Camera, label: 'Photography', gradient: 'from-orange-500 to-amber-500' },
  { type: 'reading', icon: BookOpen, label: 'Reading & Books', gradient: 'from-indigo-500 to-violet-500' },
  { type: 'gaming', icon: Gamepad2, label: 'Gaming', gradient: 'from-red-500 to-orange-500' },
  { type: 'other', icon: Coffee, label: 'Other', gradient: 'from-gray-500 to-slate-500' },
];

export const getClubTypeConfig = (type: string) =>
  clubTypes.find(t => t.type === type) || clubTypes[clubTypes.length - 1];
