
"use client";

import AppLayout from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, Briefcase, MapPin, Link as LinkIcon, Building } from 'lucide-react';
import Image from 'next/image';
import { useState, type FormEvent } from 'react';

interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  industry: string;
  avatarUrl: string;
  linkedinUrl: string;
}

const dummyLeads: Lead[] = [
  { id: '1', name: '田中 祐希', title: 'マーケティングディレクター', company: 'さくらテック', location: '東京、日本', industry: 'テクノロジー', avatarUrl: 'https://placehold.co/100x100.png', linkedinUrl: '#' },
  { id: '2', name: '佐藤 浩', title: '営業マネージャー', company: '富士モーターズ', location: '大阪、日本', industry: '自動車', avatarUrl: 'https://placehold.co/100x100.png', linkedinUrl: '#' },
  { id: '3', name: '高橋 愛', title: 'プロダクトリード', company: '京都イノベーションズ', location: '京都、日本', industry: 'ソフトウェア', avatarUrl: 'https://placehold.co/100x100.png', linkedinUrl: '#' },
];

const industryOptions = [
  { value: "food_beverage", label: "飲食業" },
  { value: "retail_wholesale_distribution", label: "小売・卸売・流通" },
  { value: "it_web_development", label: "IT・Web開発" },
  { value: "manufacturing", label: "製造業" },
  { value: "cleaning_services", label: "清掃業" },
  { value: "consulting", label: "コンサルタント" },
  { value: "fortune_telling_healing", label: "手相・数秘・ヒーリング" },
  { value: "finance_insurance", label: "金融・保険" },
  { value: "photography", label: "写真家" },
  { value: "handicrafts_crafts", label: "手芸・クラフト" },
  { value: "art_design", label: "美術・デザイン" },
];

export default function LeadFinderPage() {
  const [searchResults, setSearchResults] = useState<Lead[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setSearchResults(dummyLeads);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8">
        <Card className="shadow-xl">
          <CardHeader className="bg-muted/30 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl font-headline">リードファインダー</CardTitle>
            </div>
            <CardDescription className="text-md">
              基準に基づいて関連性の高いリードを検索し、ネットワークを拡大しましょう。
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-6 border rounded-lg shadow-sm bg-card">
              <div>
                <Label htmlFor="industry" className="font-semibold">業界</Label>
                <Select>
                  <SelectTrigger id="industry" className="mt-1">
                    <SelectValue placeholder="業界を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="jobTitle" className="font-semibold">役職</Label>
                <Input id="jobTitle" placeholder="例：CEO, ディレクター" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="location" className="font-semibold">地域</Label>
                <Input id="location" placeholder="例：東京、日本" className="mt-1" />
              </div>
              <div className="lg:col-span-1 flex items-end">
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSearching}>
                  <Search className="mr-2 h-4 w-4" />
                  {isSearching ? '検索中...' : 'リードを検索'}
                </Button>
              </div>
            </form>

            {isSearching && <div className="text-center py-8">リードを検索中... <Briefcase className="inline-block animate-spin h-5 w-5 ml-2" /></div>}

            {!isSearching && searchResults.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl">まだリードが見つかりません。</p>
                <p>検索条件を調整するか、新しい検索を開始してください。</p>
              </div>
            )}
            
            {!isSearching && searchResults.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-6 font-headline">検索結果 ({searchResults.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((lead) => (
                    <Card key={lead.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardHeader className="flex flex-row items-center space-x-4 p-4 bg-muted/20">
                        <Image src={lead.avatarUrl} alt={lead.name} width={64} height={64} className="rounded-full" data-ai-hint="professional headshot" />
                        <div>
                          <CardTitle className="text-lg font-headline">{lead.name}</CardTitle>
                          <CardDescription className="text-sm">{lead.title}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Building className="h-4 w-4 mr-2" /> {lead.company}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Briefcase className="h-4 w-4 mr-2" /> {lead.industry}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" /> {lead.location}
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 border-t">
                        <Button variant="outline" className="w-full" onClick={() => window.open(lead.linkedinUrl, '_blank')}>
                          <LinkIcon className="mr-2 h-4 w-4" /> プロフィール閲覧とつながる申請
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
