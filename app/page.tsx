'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

interface Post {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

export default function Home() {
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('wall-posts');
        const saved = stored ? JSON.parse(stored) : [];
        setPosts(saved);
      } catch (error) {
        console.error('Failed to parse wall-posts:', error);
        setPosts([]);
      }
    }
  }, []);

  const handleShare = () => {
    if (!message.trim()) return;

    const newPost: Post = {
      id: crypto.randomUUID(),
      name: 'Robert',
      message: message.trim(),
      timestamp: new Date().toLocaleString(),
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('wall-posts', JSON.stringify(updated));
    setMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f5f6f8] p-6">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-white rounded-2xl shadow-md p-4 flex flex-col items-center">
        <Image
          src="/placeholder.jpg"
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

      {/* Main Wall Feed */}
      <main className="flex-1 ml-0 md:ml-6 mt-6 md:mt-0 bg-white rounded-2xl shadow-md p-6">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's on your mind?"
          maxLength={280}
          className="mb-2"
        />
        <Button onClick={handleShare} disabled={!message.trim()} className="mb-6">
          Share
        </Button>

        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <p className="font-semibold">{post.name}</p>
                <p className="text-gray-800 mt-1">{post.message}</p>
                <span className="text-xs text-gray-400 block mt-2">{post.timestamp}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
