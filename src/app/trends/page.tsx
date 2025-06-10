
"use client";

import AppLayout from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, Search, MessageCircle, Heart, Repeat } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';

interface TrendPost {
  id: string;
  author: string;
  authorAvatar: string;
  contentSnippet: string;
  likes: number;
  comments: number;
  reposts: number;
  postUrl: string;
  imageUrl?: string;
}

const dummyTrends: TrendPost[] = [
  { id: '1', author: 'Global Innovator', authorAvatar: 'https://placehold.co/80x80.png', contentSnippet: 'アジアにおける持続可能エネルギーのエキサイティングな発展！最新レポートでは、拡大を目指すCEOにとっての主要な市場機会と課題を強調しています...', imageUrl: 'https://placehold.co/600x300.png', likes: 125, comments: 15, reposts: 30, postUrl: '#' },
  { id: '2', author: 'Tech Visionary CEO', authorAvatar: 'https://placehold.co/80x80.png', contentSnippet: '日本における伝統産業へのAIの影響は否定できません。競争力を維持するためには、適応し革新する必要があります。あなたの考えは？', likes: 230, comments: 45, reposts: 60, postUrl: '#' },
  { id: '3', author: 'Economic Analyst JP', authorAvatar: 'https://placehold.co/80x80.png', contentSnippet: '日本企業の第3四半期経済見通しを深掘り。注目すべき主要セクターには、先端製造業やグリーンテクノロジーが含まれます。', imageUrl: 'https://placehold.co/600x300.png', likes: 88, comments: 12, reposts: 20, postUrl: '#' },
];

export default function TrendWatcherPage() {
  const [searchResults, setSearchResults] = useState<TrendPost[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setSearchResults(dummyTrends);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <Card className="shadow-xl">
          <CardHeader className="bg-muted/30 p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl font-headline">トレンドウォッチャー</CardTitle>
            </div>
            <CardDescription className="text-md">
              日本人CEO向けの最新の関連投稿やコメントを把握し、時流を捉えます。
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex items-end gap-4 mb-8 p-6 border rounded-lg shadow-sm bg-card">
              <div className="flex-grow">
                <Label htmlFor="keywords" className="font-semibold">キーワード / トピック</Label>
                <Input id="keywords" placeholder="例：日本市場参入, ビジネスにおけるAI, サステナビリティ" className="mt-1" />
              </div>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSearching}>
                <Search className="mr-2 h-4 w-4" />
                {isSearching ? '検索中...' : 'トレンドを検索'}
              </Button>
            </form>

            {isSearching && <div className="text-center py-8">トレンドを検索中... <TrendingUp className="inline-block animate-pulse h-5 w-5 ml-2" /></div>}

            {!isSearching && searchResults.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl">トレンド投稿は見つかりませんでした。</p>
                <p>異なるキーワードを試すか、後でもう一度ご確認ください。</p>
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-6 font-headline">トレンド投稿 ({searchResults.length})</h3>
                <div className="space-y-6">
                  {searchResults.map((post) => (
                    <Card key={post.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardHeader className="flex items-start space-x-4 p-4">
                        <Image src={post.authorAvatar} alt={post.author} width={48} height={48} className="rounded-full" data-ai-hint="profile picture" />
                        <div>
                          <CardTitle className="text-md font-semibold font-headline">{post.author}</CardTitle>
                          <CardDescription className="text-xs text-muted-foreground">LinkedIn 投稿</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="mb-3 text-sm">{post.contentSnippet}</p>
                        {post.imageUrl && (
                          <div className="my-3 rounded-lg overflow-hidden border">
                            <Image src={post.imageUrl} alt="投稿画像" width={600} height={300} className="w-full h-auto object-cover" data-ai-hint="social media post" />
                          </div>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center"><Heart className="h-3.5 w-3.5 mr-1" /> {post.likes}</span>
                          <span className="flex items-center"><MessageCircle className="h-3.5 w-3.5 mr-1" /> {post.comments}</span>
                          <span className="flex items-center"><Repeat className="h-3.5 w-3.5 mr-1" /> {post.reposts}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 border-t">
                        <Button variant="outline" size="sm" onClick={() => window.open(post.postUrl, '_blank')}>
                          投稿を見る
                        </Button>
                        <Button variant="default" size="sm" className="ml-auto bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                           <Link href={`/comments?postContent=${encodeURIComponent(post.contentSnippet)}`}>コメントを提案する</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

    