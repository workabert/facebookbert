'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface Post {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  imageUrl?: string;
}

export default function Home() {
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('wall-posts');
    setPosts(stored ? JSON.parse(stored) : []);
  }, []);

  const handleShare = async () => {
    if (!message.trim()) return;

    let imageUrl = '';

    if (imageFile) {
      try {
        setUploading(true);
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('wall-images')
          .upload(fileName, imageFile);

        if (error) throw error;

        const { data: publicData } = supabase.storage
          .from('wall-images')
          .getPublicUrl(fileName);

        imageUrl = publicData.publicUrl;
      } catch (err) {
        alert('Failed to upload photo. Please try again.');
        return;
      } finally {
        setUploading(false);
      }
    }

    const newPost: Post = {
      id: crypto.randomUUID(),
      name: 'Robert',
      message: message.trim(),
      timestamp: new Date().toLocaleString(),
      imageUrl,
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('wall-posts', JSON.stringify(updated));
    setMessage('');
    setImageFile(null);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f5f6f8] p-6">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-white rounded-2xl shadow-md p-4 flex flex-col items-center">
        <Image
          src="/robert.jpg"
          width={220}
          height={220}
          alt="Your photo"
          className="rounded-xl object-cover w-full h-auto"
        />
        <div className="text-center mt-4">
          <h2 className="text-xl font-semibold">Robert</h2>
          <p className="text-gray-500">wall</p>
        </div>
        <Button variant="outline" className="mt-4 w-full">Information</Button>
        <div className="mt-6 text-sm text-gray-400 w-full">
          <p><strong>Networks:</strong> Stanford Alum</p>
          <p><strong>Current City:</strong> Palo Alto, CA</p>
        </div>
      </aside>

      {/* Wall Feed */}
      <main className="flex-1 ml-0 md:ml-6 mt-6 md:mt-0 bg-white rounded-2xl shadow-md p-6">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's on your mind?"
          maxLength={280}
          className="mb-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="mb-2 block"
        />
        <Button onClick={handleShare} disabled={!message.trim() || uploading} className="mb-6">
          {uploading ? 'Uploading...' : 'Share'}
        </Button>

        <div className="space-y-4">
          {posts.map(post => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <p className="font-semibold">{post.name}</p>
                <p className="text-gray-800 mt-1">{post.message}</p>
                {post.imageUrl && (
                  <img src={post.imageUrl} alt="post" className="mt-3 rounded-lg w-full max-h-[400px] object-cover" />
                )}
                <span className="text-xs text-gray-400 block mt-2">{post.timestamp}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
