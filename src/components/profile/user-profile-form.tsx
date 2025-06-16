'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser } from '@/lib/contexts/user-context';
import { useStorage } from '@/lib/firebase/storage-context';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/lib/models/user-profile';

const profileFormSchema = z.object({
  displayName: z.string().min(2, {
    message: '名前は2文字以上で入力してください。',
  }),
  email: z.string().email({
    message: '有効なメールアドレスを入力してください。',
  }),
  bio: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url({ message: '有効なURLを入力してください。' }).optional().or(z.literal('')),
  linkedin: z.string().url({ message: '有効なURLを入力してください。' }).optional().or(z.literal('')),
  twitter: z.string().url({ message: '有効なURLを入力してください。' }).optional().or(z.literal('')),
  facebook: z.string().url({ message: '有効なURLを入力してください。' }).optional().or(z.literal('')),
  youtube: z.string().url({ message: '有効なURLを入力してください。' }).optional().or(z.literal('')),
  instagram: z.string().url({ message: '有効なURLを入力してください。' }).optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function UserProfileForm() {
  const { profile, updateProfile } = useUser();
  const { uploadFile } = useStorage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: profile?.displayName || '',
      email: profile?.email || '',
      bio: profile?.bio || '',
      company: profile?.company || '',
      position: profile?.position || '',
      location: profile?.location || '',
      website: profile?.website || '',
      linkedin: profile?.linkedin || '',
      twitter: profile?.twitter || '',
      facebook: profile?.facebook || '',
      youtube: profile?.youtube || '',
      instagram: profile?.instagram || '',
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);

    try {
      await updateProfile(data as Partial<UserProfile>);
      toast({
        title: 'プロフィールを更新しました',
        description: 'プロフィール情報が正常に更新されました。',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'エラーが発生しました',
        description: 'プロフィールの更新中にエラーが発生しました。',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    console.log('Selected file:', file.name, file.type, file.size);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: '画像ファイルを選択してください',
        description: 'アップロードできるのは画像ファイルのみです。',
        variant: 'destructive',
      });
      return;
    }
    
    // Validate file size (max 1MB for base64 encoding)
    if (file.size > 1 * 1024 * 1024) {
      toast({
        title: 'ファイルサイズが大きすぎます',
        description: 'アップロードできるファイルサイズは最大1MBです。',
        variant: 'destructive',
      });
      return;
    }
    
    setUploadingPhoto(true);
    
    try {
      // Read the file as a data URL (base64)
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        if (!e.target || typeof e.target.result !== 'string') {
          throw new Error('Failed to read file');
        }
        
        const dataUrl = e.target.result;
        console.log('File converted to data URL');
        
        // Update profile with the data URL
        await updateProfile({ photoURL: dataUrl });
        console.log('Profile updated with data URL');
        
        toast({
          title: 'プロフィール写真を更新しました',
          description: 'プロフィール写真が正常に更新されました。',
        });
        
        setUploadingPhoto(false);
      };
      
      reader.onerror = () => {
        throw new Error('Failed to read file');
      };
      
      // Start reading the file
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      let errorMessage = 'プロフィール写真のアップロード中にエラーが発生しました。';
      
      if (error instanceof Error) {
        errorMessage += ` エラー: ${error.message}`;
        console.error('Error details:', error.stack);
      }
      
      toast({
        title: 'エラーが発生しました',
        description: errorMessage,
        variant: 'destructive',
      });
      
      setUploadingPhoto(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>プロフィール</CardTitle>
          <CardDescription>プロフィール情報を読み込み中...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>プロフィール設定</CardTitle>
        <CardDescription>
          あなたのプロフィール情報を更新します。これらの情報はLinkedInプロフィール生成に使用されます。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-muted bg-muted">
            {profile?.photoURL ? (
              <Image 
                src={profile.photoURL} 
                alt={profile.displayName} 
                fill 
                className="object-cover profile-photo-preview"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            )}
            {uploadingPhoto && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={triggerFileInput}
              disabled={uploadingPhoto}
            >
              {uploadingPhoto ? 'アップロード中...' : 'プロフィール写真を変更'}
            </Button>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="image/*"
              onChange={handlePhotoUpload}
            />
            <p className="text-xs text-muted-foreground">
              JPG, PNG, GIF形式の画像をアップロードできます（最大1MB）
            </p>
          </div>
        </div>
      </CardContent>
      <CardContent className="pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>名前</FormLabel>
                    <FormControl>
                      <Input placeholder="山田 太郎" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>会社名</FormLabel>
                    <FormControl>
                      <Input placeholder="株式会社サンプル" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>役職</FormLabel>
                    <FormControl>
                      <Input placeholder="CEO / 代表取締役" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>所在地</FormLabel>
                  <FormControl>
                    <Input placeholder="東京都渋谷区" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>自己紹介</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="あなたの経歴や専門分野について簡単に説明してください。"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    LinkedInプロフィールの概要セクションに使用されます。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ウェブサイト</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">ソーシャルメディア</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/in/username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter</FormLabel>
                      <FormControl>
                        <Input placeholder="https://twitter.com/username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <FormControl>
                        <Input placeholder="https://facebook.com/username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input placeholder="https://instagram.com/username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="youtube"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube</FormLabel>
                      <FormControl>
                        <Input placeholder="https://youtube.com/c/channelname" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <CardFooter className="px-0 pt-6">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '更新中...' : 'プロフィールを更新'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
