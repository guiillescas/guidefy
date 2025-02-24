'use client';

import { useState } from 'react';

import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSongStore } from '@/store/songStore';
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
  const [isUpdating, setIsUpdating] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInputs>({
    defaultValues: {
      title: song.title,
      key: song.key || ''
    }
  });
  const { updateSong } = useSongStore();

  const onSubmit = async (data: FormInputs) => {
    setIsUpdating(true);
    try {
      await updateSong(song.id, data.title, data.key);
      onClose();
    } catch (error) {
      console.error('Error updating song:', error);
    } finally {
      setIsUpdating(false);
    }
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
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="key">Key (optional)</Label>
            <Input id="key" {...register('key')} className="bg-gray-800 border-gray-700" />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUpdating}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating} className="bg-blue-900 text-white hover:bg-blue-800">
              {isUpdating ?
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
