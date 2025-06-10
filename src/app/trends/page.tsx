
"use client";

import AppLayout from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, Search, ExternalLink, Lightbulb, ListChecks } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { generateTrendingTopics, type TrendWatcherInput, type TrendWatcherOutput, type TrendAnalysis } from '@/ai/flows/trend-watcher-flow';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

export default function TrendWatcherPage() {
  const [keywords, setKeywords] = useState('');
  const [searchResults, setSearchResults] = useState<TrendAnalysis[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!keywords.trim()) {
      toast({
        title: "キーワードを入力してください",
        description: "トレンドを分析するためのキーワードが必要です。",
        variant: "destructive",
      });
      return;
    }
    setIsSearching(true);
    setSearchResults([]);
    try {
      const result: TrendWatcherOutput = await generateTrendingTopics({ keywords } as TrendWatcherInput);
      if (result && result.analyzedTrends) {
        setSearchResults(result.analyzedTrends);
        if (result.analyzedTrends.length === 0) {
          toast({
            title: "分析結果なし",
            description: "指定されたキーワードに一致するトレンド分析結果は見つかりませんでした。",
          });
        } else {
          toast({
            title: "トレンド分析完了",
            description: "AIが関連するビジネストレンド情報を生成しました。",
          });
        }
      } else {
        throw new Error("AIからの応答が正しくありません。");
      }
    } catch (error) {
      console.error("Error fetching trend analysis:", error);
      toast({
        title: "エラー",
        description: "トレンド分析情報の取得に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    }
    setIsSearching(false);
  };

  const createGoogleSearchUrl = (query: string) => {
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <Card className="shadow-xl">
          <CardHeader className="bg-muted/30 p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl font-headline">AI トレンドアナリスト</CardTitle>
            </div>
            <CardDescription className="text-md">
              キーワードに基づいて、AIが日本のCEOに関連する可能性のあるビジネストレンドを分析し、要点・考察・次のステップの提案を生成します。
              これはリアルタイムの市場データを収集するものではなく、AIによる情報分析と洞察提供です。戦略策定の参考にしてください。
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex items-end gap-4 mb-8 p-6 border rounded-lg shadow-sm bg-card">
              <div className="flex-grow">
                <Label htmlFor="keywords" className="font-semibold">分析したいキーワード / トピック</Label>
                <Input 
                  id="keywords" 
                  placeholder="例：日本酒 欧州市場, GX戦略 日本企業, 中小企業 DX推進" 
                  className="mt-1" 
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSearching}>
                <Search className="mr-2 h-4 w-4" />
                {isSearching ? '分析中...' : 'トレンドを分析'}
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
                <p className="text-xl">まだトレンド分析情報がありません。</p>
                <p>キーワードを入力して分析を開始してください。</p>
              </div>
            )}

            {!isSearching && searchResults.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-6 font-headline">AIによるトレンド分析結果 ({searchResults.length}件)</h3>
                <div className="space-y-6">
                  {searchResults.map((trend) => (
                    <Card key={trend.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardHeader className="pb-3 pt-4 px-4 md:px-6 bg-muted/10">
                        <CardTitle className="text-lg md:text-xl font-headline text-primary">{trend.trendTitle}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 md:p-6 space-y-4">
                        {trend.imageUrl && (
                          <div className="my-3 rounded-lg overflow-hidden border aspect-video relative">
                            <Image 
                              src={trend.imageUrl} 
                              alt={trend.trendTitle || "トレンド関連画像"}
                              fill 
                              className="object-cover" 
                              data-ai-hint={trend.imageHint || "business analysis"}
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-md mb-2 flex items-center"><ListChecks className="h-5 w-5 mr-2 text-primary/80" /> 主要トレンドポイント</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm ml-2" lang="ja">
                            {trend.keyTrendPoints.map((point, index) => (
                              <li key={index}>{point}</li>
                            ))}
                          </ul>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="font-semibold text-md mb-2 flex items-center"><Lightbulb className="h-5 w-5 mr-2 text-primary/80" /> CEOへのインサイト・考察</h4>
                          <p className="text-sm text-muted-foreground" lang="ja">{trend.trendAnalysis}</p>
                        </div>
                        
                        {trend.potentialNextSteps && trend.potentialNextSteps.length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="font-semibold text-md mb-2 flex items-center">検討すべき次のステップ</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm ml-2" lang="ja">
                                {trend.potentialNextSteps.map((step, index) => (
                                  <li key={index}>{step}</li>
                                ))}
                              </ul>
                            </div>
                          </>
                        )}
                      </CardContent>
                      <CardFooter className="p-4 md:p-6 border-t bg-muted/10 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full sm:w-auto"
                            onClick={() => window.open(createGoogleSearchUrl(trend.sampleSearchQuery), '_blank', 'noopener,noreferrer')}
                        >
                          <Search className="mr-2 h-4 w-4" />
                          関連情報を検索 (Google)
                        </Button>
                        <Button 
                            variant="default" 
                            size="sm" 
                            className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" 
                            asChild
                        >
                           <Link href={`/comments?postContent=${encodeURIComponent(trend.trendTitle + "\n\n" + trend.keyTrendPoints.join("\n") + "\n\n考察: " + trend.trendAnalysis)}&ceoProfile=日本のCEOとして、このトレンドについてコメントします。`}>
                             <MessageSquarePlus className="mr-2 h-4 w-4" />
                             このトレンドについてコメントを生成
                           </Link>
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

