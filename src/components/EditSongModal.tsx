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
import type { Song } from '@/types';

interface EditSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song;
}

interface FormInputs {
  title: string;
  key: string;
}

export function EditSongModal({ isOpen, onClose, song }: EditSongModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({
    defaultValues: {
      title: song.title,
      key: song.key || ''
    }
  });
  const { updateSong } = useSongStore();

  const onSubmit = async (data: FormInputs) => {
    await updateSong(song.id, data.title, data.key);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle>Edit Song</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register('title', { required: 'Title is required' })}
              className="bg-gray-800 border-gray-700"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="key">Key (optional)</Label>
            <Input
              id="key"
              {...register('key')}
              className="bg-gray-800 border-gray-700"
            />
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
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
