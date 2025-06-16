
import AppLayout from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, UserSquare, PenSquare, MessageSquarePlus, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const features = [
  {
    title: 'AI プロフィール作成',
    description: 'AIが日本語と英語で魅力的なLinkedInプロフィールを作成します。',
    icon: UserSquare,
    href: '/profile',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=faces&auto=format&q=80',
    aiHint: 'professional profile writing',
    buttonText: 'プロフィール作成へ',
  },
  {
    title: 'AI 投稿作成アシスト',
    description: '日本語と英語でエンゲージメントの高いLinkedIn投稿を生成します。',
    icon: PenSquare,
    href: '/posts',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop&crop=faces&auto=format&q=80',
    aiHint: 'ai content generation',
    buttonText: '投稿作成アシストへ',
  },
  {
    title: 'AI コメントアシスト',
    description: 'LinkedIn投稿への日本語と英語のコメント案をAIが提案します。',
    icon: MessageSquarePlus,
    href: '/comments',
    image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&h=400&fit=crop&crop=faces&auto=format&q=80',
    aiHint: 'social media engagement ai',
    buttonText: 'コメントアシストへ',
  },
  {
    title: 'AI トレンドアナリスト',
    description: '日本人CEO向けの最新の関連トレンドや考察をAIが分析・提供します。',
    icon: TrendingUp,
    href: '/trends',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=faces&auto=format&q=80',
    aiHint: 'business trend analysis',
    buttonText: 'トレンドアナリストへ',
  },
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Globalink CEO へようこそ</h1>
          <p className="text-muted-foreground">
            AIを活用してLinkedInでの影響力を高め、グローバルなビジネスチャンスを掴むためのアシスタントツールです。
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2"> {/* Adjusted grid for 4 items */}
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover"
                  data-ai-hint={feature.aiHint}
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <feature.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
              <div className="p-6 pt-0">
                <Button asChild variant="default" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href={feature.href}>
                    {feature.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
