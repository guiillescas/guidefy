'use client';

import { useState } from 'react';
import { useSongStore } from '@/store/songStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from 'react-hook-form';

interface AddSongModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormInputs {
  title: string;
  key?: string;
}

export function AddSongModal({ isOpen, onClose }: AddSongModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInputs>();
  const { addSong } = useSongStore();

  const onSubmit = (data: FormInputs) => {
    addSong(data.title, data.key || '');
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-950 border-gray-800">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold text-white">Add New Song</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-300">
                Title
              </Label>
              <Input
                id="title"
                {...register("title", { required: "Title is required" })}
                className="w-full bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
                placeholder="Enter song title"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="key" className="text-sm font-medium text-gray-300">
                Key
              </Label>
              <Input
                id="key"
                {...register("key")}
                className="w-full bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
                placeholder="Enter song key (optional)"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-900 text-white hover:bg-blue-800"
            >
              Add Song
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
