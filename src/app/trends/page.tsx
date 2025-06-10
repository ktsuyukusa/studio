
"use client";

import AppLayout from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, Search, MessageCircle, Heart, Repeat, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { generateTrendingTopics, type TrendWatcherInput, type TrendWatcherOutput } from '@/ai/flows/trend-watcher-flow';
import { useToast } from "@/hooks/use-toast";

interface TrendPost {
  id: string;
  author: string;
  authorAvatar: string;
  authorAvatarHint?: string;
  contentSnippet: string;
  likes: number;
  comments: number;
  reposts: number;
  postUrl: string;
  imageUrl?: string;
  imageHint?: string;
}

export default function TrendWatcherPage() {
  const [keywords, setKeywords] = useState('');
  const [searchResults, setSearchResults] = useState<TrendPost[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!keywords.trim()) {
      toast({
        title: "キーワードを入力してください",
        description: "トレンドを検索するためのキーワードが必要です。",
        variant: "destructive",
      });
      return;
    }
    setIsSearching(true);
    setSearchResults([]);
    try {
      const result = await generateTrendingTopics({ keywords } as TrendWatcherInput);
      if (result && result.trends) {
        setSearchResults(result.trends);
        if (result.trends.length === 0) {
          toast({
            title: "検索結果なし",
            description: "指定されたキーワードに一致するトレンドは見つかりませんでした。",
          });
        } else {
          toast({
            title: "トレンド情報取得完了",
            description: "AIが関連するトレンド情報を生成しました。",
          });
        }
      } else {
        throw new Error("AIからの応答が正しくありません。");
      }
    } catch (error) {
      console.error("Error fetching trends:", error);
      toast({
        title: "エラー",
        description: "トレンド情報の取得に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    }
    setIsSearching(false);
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
              AIがキーワードに基づいて、日本のCEOに関連する可能性のあるLinkedIn上のディスカッショントピックやトレンドの例を生成します。
              これは実際の投稿をリアルタイムで収集するものではなく、現状の話題性を踏まえたAIによる情報提供です。エンゲージメント戦略の参考にしてください。
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex items-end gap-4 mb-8 p-6 border rounded-lg shadow-sm bg-card">
              <div className="flex-grow">
                <Label htmlFor="keywords" className="font-semibold">キーワード / トピック</Label>
                <Input 
                  id="keywords" 
                  placeholder="例：日本市場参入, ビジネスにおけるAI, サステナビリティ" 
                  className="mt-1" 
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSearching}>
                <Search className="mr-2 h-4 w-4" />
                {isSearching ? '検索中...' : 'トレンドを検索'}
              </Button>
            </form>

            {isSearching && (
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
                <p className="text-lg">AIがトレンド情報を分析・生成中です...</p>
              </div>
            )}

            {!isSearching && searchResults.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl">まだトレンド情報がありません。</p>
                <p>キーワードを入力して検索を開始してください。</p>
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-6 font-headline">AIによるトレンド分析結果 ({searchResults.length}件)</h3>
                <div className="space-y-6">
                  {searchResults.map((post) => (
                    <Card key={post.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardHeader className="flex items-start space-x-4 p-4 bg-muted/10">
                        <Image 
                          src={post.authorAvatar} 
                          alt={post.author} 
                          width={48} 
                          height={48} 
                          className="rounded-full" 
                          data-ai-hint={post.authorAvatarHint || "profile picture"}
                        />
                        <div>
                          <CardTitle className="text-md font-semibold font-headline">{post.author}</CardTitle>
                          <CardDescription className="text-xs text-muted-foreground">LinkedIn上の注目トピック（AI生成例）</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="mb-3 text-sm" lang="ja">{post.contentSnippet}</p>
                        {post.imageUrl && (
                          <div className="my-3 rounded-lg overflow-hidden border aspect-video relative">
                            <Image 
                              src={post.imageUrl} 
                              alt="投稿関連画像 (AI生成例)" 
                              fill 
                              className="object-cover" 
                              data-ai-hint={post.imageHint || "business concept"}
                            />
                          </div>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                          <span className="flex items-center"><Heart className="h-3.5 w-3.5 mr-1 text-red-500" /> {post.likes}</span>
                          <span className="flex items-center"><MessageCircle className="h-3.5 w-3.5 mr-1 text-blue-500" /> {post.comments}</span>
                          <span className="flex items-center"><Repeat className="h-3.5 w-3.5 mr-1 text-green-500" /> {post.reposts}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 border-t bg-muted/10 flex justify-between">
                        <Button variant="outline" size="sm" onClick={() => window.open(post.postUrl, '_blank', 'noopener,noreferrer')}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          関連情報を確認
                        </Button>
                        <Button variant="default" size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                           <Link href={`/comments?postContent=${encodeURIComponent(post.contentSnippet)}&ceoProfile=日本のCEOとして、このトピックについてコメントします。`}>コメントを提案する</Link>
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
