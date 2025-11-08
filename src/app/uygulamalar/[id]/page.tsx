"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import UserMenu from "../../components/UserMenu";
import MobileMenu from "../../components/MobileMenu";
import LoginModal from "../../components/LoginModal";
import SignUpModal from "../../components/SignUpModal";
import { supabase } from "@/lib/supabase";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Application {
  id: string;
  title: string;
  description: string;
  version: string;
  download_url: string;
  file_size: number;
  image_url: string;
  features: string[];
  requirements: string;
  download_count: number;
  category_id: string;
  categories: Category;
  created_at: string;
}

interface Comment {
  id: string;
  content: string;
  rating: number;
  created_at: string;
  parent_id?: string | null;
  users: {
    id: string;
    email: string;
    user_metadata: {
      full_name?: string;
      user_name?: string;
      avatar_url?: string;
    };
  };
  replies?: Comment[];
}

// Comment Component
interface CommentItemProps {
  comment: Comment;
  depth: number;
  onReply: (commentId: string | null) => void;
  replyingTo: string | null;
  replyText: string;
  setReplyText: (text: string) => void;
  handleReplySubmit: (parentId: string) => void;
  isSubmitting: boolean;
  getUserDisplayName: (userData: any) => string;
  formatDate: (dateString: string) => string;
}

function CommentItem({
  comment,
  depth,
  onReply,
  replyingTo,
  replyText,
  setReplyText,
  handleReplySubmit,
  isSubmitting,
  getUserDisplayName,
  formatDate
}: CommentItemProps) {
  const maxDepth = 5; // Maksimum iç içe yorum seviyesi
  
  return (
    <div className={`${depth > 0 ? 'ml-12 mt-3' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
          {comment.users.user_metadata.avatar_url ? (
            <Image
              src={comment.users.user_metadata.avatar_url}
              alt={getUserDisplayName(comment.users)}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <span className="text-white text-xs font-bold">
              {getUserDisplayName(comment.users).charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">
                {getUserDisplayName(comment.users)}
              </span>
              <span className="text-xs text-zinc-500">
                {formatDate(comment.created_at)}
              </span>
            </div>
            {comment.rating > 0 && (
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div
                    key={value}
                    className={`w-3 h-0.5 ${
                      value <= comment.rating ? 'bg-white' : 'bg-zinc-700'
                    }`}
                  />
                ))}
                <span className="text-xs text-zinc-400 ml-1">
                  {comment.rating}/5
                </span>
              </div>
            )}
          </div>
          <p className="text-zinc-300 text-sm mb-2">{comment.content}</p>
          
          {depth < maxDepth && (
            <button
              onClick={() => onReply(comment.id)}
              className="text-xs text-zinc-400 hover:text-white transition-colors font-semibold uppercase tracking-wider"
            >
              ↳ Cevapla
            </button>
          )}

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="mt-3 mb-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Cevabınızı yazın..."
                rows={2}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:border-zinc-500 focus:outline-none mb-2"
              />
              <div className="flex gap-3">
                <div className="button-borders">
                  <button
                    onClick={() => handleReplySubmit(comment.id)}
                    disabled={isSubmitting || !replyText.trim()}
                    className="primary-button text-xs! py-2! px-4! disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'GÖNDERİLİYOR...' : 'GÖNDER'}
                  </button>
                </div>
                <div className="button-borders">
                  <button
                    onClick={() => onReply(null)}
                    className="secondary-button text-xs! py-2! px-4!"
                  >
                    İPTAL
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Recursive Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                  onReply={onReply}
                  replyingTo={replyingTo}
                  replyText={replyText}
                  setReplyText={setReplyText}
                  handleReplySubmit={handleReplySubmit}
                  isSubmitting={isSubmitting}
                  getUserDisplayName={getUserDisplayName}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchApplication();
      fetchComments();
      checkDownloadStatus();
    }
  }, [params.id, user]);

  const fetchApplication = async () => {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('id', params.id)
      .eq('is_active', true)
      .single();

    if (!error && data) {
      setApplication(data);
    } else {
      router.push('/uygulamalar');
    }
    setLoading(false);
  };

  const fetchComments = async () => {
    try {
      // Yorumları kullanıcı bilgileriyle birlikte çek
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('application_id', params.id)
        .order('created_at', { ascending: true }); // Eskiden yeniye sıralı

      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
        return;
      }

      if (!commentsData || commentsData.length === 0) {
        console.log('No comments found');
        setComments([]);
        return;
      }

      console.log('Raw comments data:', commentsData);

      // Kullanıcı bilgileri artık comments tablosunda
      const allComments = commentsData.map((comment: any) => {
        return {
          ...comment,
          users: {
            id: comment.user_id,
            email: comment.user_email || comment.user_name || 'Kullanıcı',
            user_metadata: {
              full_name: comment.user_name,
              user_name: comment.user_name,
              avatar_url: comment.user_avatar
            }
          },
          replies: []
        };
      });

      // Parent-child ilişkisini kur
      const commentsMap = new Map<string, Comment>();
      const rootComments: Comment[] = [];

      // Önce tüm yorumları map'e ekle
      allComments.forEach((comment: Comment) => {
        commentsMap.set(comment.id, comment);
      });

      // Sonra parent-child ilişkisini kur
      allComments.forEach((comment: Comment) => {
        if (comment.parent_id) {
          const parent = commentsMap.get(comment.parent_id);
          if (parent) {
            if (!parent.replies) parent.replies = [];
            parent.replies.push(comment);
          }
        } else {
          rootComments.push(comment);
        }
      });

      console.log('Organized comments:', rootComments);
      setComments(rootComments);
    } catch (error) {
      console.error('Exception fetching comments:', error);
    }
  };

  const checkDownloadStatus = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('downloads')
      .select('id')
      .eq('application_id', params.id)
      .eq('user_id', user.id)
      .single();

    setHasDownloaded(!!data);
  };

  const handleDownload = async () => {
    if (!user || !application) return;

    // İndirme kaydı oluştur
    const { error } = await supabase
      .from('downloads')
      .insert({
        application_id: application.id,
        user_id: user.id
      });

    if (!error) {
      // İndirme sayısını artır
      await supabase.rpc('increment_download_count', { app_id: application.id });
      
      // Dosyayı indir
      window.open(application.download_url, '_blank');
      setHasDownloaded(true);
      
      // Uygulama bilgilerini yenile
      fetchApplication();
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    setIsSubmitting(true);

    const { error } = await supabase
      .from('comments')
      .insert({
        application_id: params.id,
        user_id: user.id,
        content: commentText.trim(),
        rating: rating,
        parent_id: null, // Ana yorum
        user_name: user.user_metadata?.full_name || user.user_metadata?.user_name || user.email?.split('@')[0] || 'Kullanıcı',
        user_email: user.email,
        user_avatar: user.user_metadata?.avatar_url
      });

    if (!error) {
      setCommentText("");
      setRating(5);
      fetchComments();
    } else {
      console.error('Error submitting comment:', error);
      alert('Yorum gönderilemedi: ' + (error.message || JSON.stringify(error)));
    }

    setIsSubmitting(false);
  };

  const handleReplySubmit = async (parentId: string) => {
    if (!user || !replyText.trim()) return;

    setIsSubmitting(true);

    const { error } = await supabase
      .from('comments')
      .insert({
        application_id: params.id,
        user_id: user.id,
        content: replyText.trim(),
        rating: null, // Cevaplarda rating yok (NULL)
        parent_id: parentId, // Parent yorum ID'si
        user_name: user.user_metadata?.full_name || user.user_metadata?.user_name || user.email?.split('@')[0] || 'Kullanıcı',
        user_email: user.email,
        user_avatar: user.user_metadata?.avatar_url
      });

    if (!error) {
      setReplyText("");
      setReplyingTo(null);
      fetchComments();
    } else {
      console.error('Error submitting reply:', error);
      alert('Cevap gönderilemedi: ' + (error.message || JSON.stringify(error)));
    }

    setIsSubmitting(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getUserDisplayName = (userData: any) => {
    return userData.user_metadata?.full_name ||
           userData.user_metadata?.user_name ||
           userData.email?.split('@')[0] ||
           'Kullanıcı';
  };

  const getTotalCommentsCount = (comments: Comment[]): number => {
    let count = comments.length;
    comments.forEach(comment => {
      if (comment.replies && comment.replies.length > 0) {
        count += getTotalCommentsCount(comment.replies);
      }
    });
    return count;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  // Sadece ana yorumların (rating'i olan) ortalamasını hesapla
  const commentsWithRating = comments.filter(c => c.rating > 0);
  const averageRating = commentsWithRating.length > 0
    ? commentsWithRating.reduce((acc, comment) => acc + comment.rating, 0) / commentsWithRating.length
    : 0;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 sticky top-0 bg-black z-50 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-4">
              <Image
                src="/logo2.png"
                alt="Vulpax Digital"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-xl font-bold text-white logo-font">
                  VULPA<span className="text-red-500">X</span>
                </h1>
                <p className="text-xs text-zinc-400">DIGITAL</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/#products" className="text-zinc-300 hover:text-white transition-colors">Ürünler</a>
              <a href="/#services" className="text-zinc-300 hover:text-white transition-colors">Hizmetler</a>
              <a href="/references" className="text-zinc-300 hover:text-white transition-colors">Referanslar</a>
              <a href="/#contact" className="text-zinc-300 hover:text-white transition-colors">İletişim</a>
              <a href="/uygulamalar" className="text-zinc-300 hover:text-white transition-colors">Ücretsiz Uygulamalar</a>
              {user && user.id === 'd628cec7-7ebe-4dd7-9d0a-0a76fb091911' && (
                <a href="/admin" className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Editör
                </a>
              )}
              {!authLoading && (
                user ? (
                  <UserMenu user={user} onSignOut={signOut} />
                ) : (
                  <div className="button-borders">
                    <button 
                      onClick={() => setIsLoginModalOpen(true)}
                      className="primary-button"
                    >
                      GİRİŞ YAP
                    </button>
                  </div>
                )
              )}
            </nav>
            <MobileMenu onLoginClick={() => setIsLoginModalOpen(true)} user={user} onSignOut={signOut} />
            <MobileMenu onLoginClick={() => setIsLoginModalOpen(true)} user={user} onSignOut={signOut} />
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignUp={() => {
          setIsLoginModalOpen(false);
          setIsSignUpModalOpen(true);
        }}
        onSwitchToForgotPassword={() => {
          setIsLoginModalOpen(false);
          setIsForgotPasswordModalOpen(true);
        }}
      />
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSwitchToLogin={() => {
          setIsSignUpModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      {/* Application Detail */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* App Header */}
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <Link
                  href="/uygulamalar"
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  ← Geri
                </Link>
                <span className="text-zinc-600">/</span>
                <span className="bg-zinc-800 text-zinc-300 text-sm px-3 py-1">
                  {application.categories.name}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{application.title}</h1>
              <p className="text-zinc-400 text-lg">{application.description}</p>
            </div>

            {/* App Image */}
            {application.image_url && (
              <div className="aspect-video bg-zinc-900 border border-zinc-800 relative overflow-hidden animate-fade-in-up delay-100">
                <Image
                  src={application.image_url}
                  alt={application.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Features */}
            {application.features && application.features.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 p-6 animate-fade-in-up delay-200">
                <h2 className="text-2xl font-bold mb-4">Özellikler</h2>
                <ul className="space-y-2">
                  {application.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-zinc-300">
                      <svg
                        className="w-5 h-5 text-green-500 mt-0.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {application.requirements && (
              <div className="bg-zinc-900 border border-zinc-800 p-6 animate-fade-in-up delay-300">
                <h2 className="text-2xl font-bold mb-4">Sistem Gereksinimleri</h2>
                <p className="text-zinc-300 whitespace-pre-line">{application.requirements}</p>
              </div>
            )}

            {/* Comments Section */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 animate-fade-in-up delay-400">
              <h2 className="text-2xl font-bold mb-6">
                Yorumlar ({getTotalCommentsCount(comments)})
              </h2>

              {/* Comment Form */}
              {user ? (
                <form onSubmit={handleCommentSubmit} className="mb-8">
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-zinc-400 mb-2">
                      Değerlendirme: <span className="text-white">{rating}/5</span>
                    </label>
                    <div className="flex gap-0.5 max-w-xs">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRating(value)}
                          className={`h-2 flex-1 transition-all ${
                            value <= rating
                              ? 'bg-white'
                              : 'bg-zinc-800 hover:bg-zinc-700'
                          }`}
                          title={`${value}/5`}
                        />
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Yorumunuzu yazın..."
                    rows={4}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none mb-4"
                  />

                  <div className="button-borders">
                    <button
                      type="submit"
                      disabled={isSubmitting || !commentText.trim()}
                      className="primary-button disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'GÖNDERİLİYOR...' : 'YORUM YAP'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mb-8 bg-zinc-800 border border-zinc-700 p-6 text-center">
                  <p className="text-zinc-400 mb-4">Yorum yapmak için giriş yapmanız gerekiyor</p>
                  <Link href="/" className="inline-block bg-white text-black px-6 py-3 font-semibold hover:bg-zinc-200 transition-colors">
                    Giriş Yap
                  </Link>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <div className="border-t border-zinc-800 pt-8 text-center text-zinc-500">
                    Henüz yorum yapılmamış. İlk yorum yapan siz olun!
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="border-t border-zinc-800 pt-4">
                      <CommentItem
                        comment={comment}
                        depth={0}
                        onReply={setReplyingTo}
                        replyingTo={replyingTo}
                        replyText={replyText}
                        setReplyText={setReplyText}
                        handleReplySubmit={handleReplySubmit}
                        isSubmitting={isSubmitting}
                        getUserDisplayName={getUserDisplayName}
                        formatDate={formatDate}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Download Card */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 sticky top-24 animate-fade-in-left">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-zinc-400 mb-1">Versiyon</div>
                  <div className="text-xl font-bold">{application.version}</div>
                </div>

                <div>
                  <div className="text-sm text-zinc-400 mb-1">Dosya Boyutu</div>
                  <div className="text-xl font-bold">{formatFileSize(application.file_size)}</div>
                </div>

                <div>
                  <div className="text-sm text-zinc-400 mb-1">İndirme</div>
                  <div className="text-xl font-bold">{application.download_count}</div>
                </div>

                {averageRating > 0 && (
                  <div>
                    <div className="text-sm text-zinc-400 mb-1">Ortalama Puan</div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-xl font-bold">{averageRating.toFixed(1)}</div>
                      <div className="flex gap-0.5 flex-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <div
                            key={value}
                            className={`h-1 flex-1 ${
                              value <= Math.round(averageRating) ? 'bg-white' : 'bg-zinc-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-zinc-500">
                      {comments.length} değerlendirme
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-zinc-800">
                  {user ? (
                    <div className="button-borders w-full">
                      <button
                        onClick={handleDownload}
                        className="primary-button w-full flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        {hasDownloaded ? 'TEKRAR İNDİR' : 'İNDİR'}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="bg-zinc-800 border border-zinc-700 p-4 text-center mb-3">
                        <p className="text-zinc-400 text-sm mb-3">İndirmek için giriş yapmanız gerekiyor</p>
                        <Link href="/" className="inline-block bg-white text-black px-6 py-3 font-semibold hover:bg-zinc-200 transition-colors text-sm">
                          Giriş Yap
                        </Link>
                      </div>
                    </div>
                  )}
                  {user && hasDownloaded && (
                    <p className="text-xs text-zinc-500 text-center mt-2">
                      Bu uygulamayı daha önce indirdiniz
                    </p>
                  )}
                </div>

                <div className="text-xs text-zinc-500 pt-4 border-t border-zinc-800">
                  <div>Yayınlanma: {formatDate(application.created_at)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-zinc-500 text-sm">
          <p>&copy; 2025 Vulpax Software. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
