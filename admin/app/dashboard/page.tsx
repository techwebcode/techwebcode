"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Folder,
  Tags,
  ImageIcon,
  Mail,
  Plus,
  Upload,
  ExternalLink,
  Pencil,
  Eye,
  ArrowUpRight,
  Sparkles,
  Server,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useArticles } from "@/hooks/useArticles";
import { useCategoryOptions } from "@/hooks/useCategories";
import { useTagOptions } from "@/hooks/useTags";
import { useMediaList } from "@/hooks/useMedia";
import adminContactService, { ContactMessageItem } from "@/services/contact";
import { Article } from "@/types/article";
import ArticleModal from "@/components/article/ArticleModal";
import UploadModal from "@/components/media/UploadModal";
import { getMediaUrl, toDateTimeFormat } from "@/lib/utils";

export default function DashboardPage() {
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Queries
  const { data: articlesRes, isLoading: articlesLoading, refetch: refetchArticles } = useArticles(1, 5, "");
  const { data: categories } = useCategoryOptions();
  const { data: tags } = useTagOptions();
  const { data: mediaRes, refetch: refetchMedia } = useMediaList(1, 1, "");

  // Contact Messages State
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [messagesCount, setMessagesCount] = useState<number>(0);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [messagesLoading, setMessagesLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      try {
        setMessagesLoading(true);
        const res = await adminContactService.getContactMessages({ limit: 5 });
        if (res && res.data) {
          setMessages(res.data);
          const total = res.pagination?.total || res.meta?.total || res.data.length || 0;
          setMessagesCount(total);
          const newMsgCount = res.data.filter((m: ContactMessageItem) => m.status === "new").length;
          setUnreadCount(newMsgCount);
        }
      } catch (err) {
        // Handle error silently
      } finally {
        setMessagesLoading(false);
      }
    }

    fetchMessages();
  }, []);

  const articlesList: Article[] = Array.isArray(articlesRes) ? articlesRes : (articlesRes as any)?.data || [];
  const totalArticles = (articlesRes as any)?.meta?.total ?? articlesList.length;
  const publishedArticlesCount = articlesList.filter((a) => a.status === "published").length;
  const draftArticlesCount = articlesList.filter((a) => a.status === "draft").length;

  const totalCategories = categories?.length ?? 0;
  const totalTags = tags?.length ?? 0;
  const totalMedia = (mediaRes as any)?.total ?? (mediaRes as any)?.meta?.total ?? 0;

  const handleEditArticle = (article: Article) => {
    setSelectedArticle(article);
    setArticleModalOpen(true);
  };

  const handleCreateArticle = () => {
    setSelectedArticle(null);
    setArticleModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-300" />
            <h2 className="text-2xl font-bold tracking-tight">Admin Overview</h2>
          </div>
          <p className="text-xs text-blue-100 max-w-xl">
            Welcome to the TechWebCode Control Center. Manage publication articles, tools categories, media library, and user contact inquiries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            onClick={handleCreateArticle}
            className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-md h-9 text-xs"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Article
          </Button>

          <Button
            onClick={() => setUploadModalOpen(true)}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 font-semibold h-9 text-xs"
          >
            <Upload className="h-4 w-4 mr-1" />
            Upload Media
          </Button>

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-black/20 hover:bg-black/30 px-3 py-2 text-xs font-semibold text-white transition-colors"
          >
            <span>View Site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Metrics & Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Articles Card */}
        <Card className="hover:shadow-md transition-all border-l-4 border-l-blue-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Articles
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalArticles}</div>
            <p className="text-[11px] text-gray-500 mt-1">
              <span className="font-semibold text-emerald-600">{publishedArticlesCount} published</span> • {draftArticlesCount} draft
            </p>
            <Link href="/dashboard/articles" className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline mt-2">
              <span>Manage Articles</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        {/* Categories Card */}
        <Card className="hover:shadow-md transition-all border-l-4 border-l-emerald-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Categories
            </CardTitle>
            <Folder className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalCategories}</div>
            <p className="text-[11px] text-gray-500 mt-1">Active content taxonomy</p>
            <Link href="/dashboard/categories" className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline mt-2">
              <span>Manage Categories</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        {/* Tags Card */}
        <Card className="hover:shadow-md transition-all border-l-4 border-l-purple-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Tags
            </CardTitle>
            <Tags className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalTags}</div>
            <p className="text-[11px] text-gray-500 mt-1">Keywords &amp; topics</p>
            <Link href="/dashboard/tags" className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 hover:underline mt-2">
              <span>Manage Tags</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        {/* Media Uploads Card */}
        <Card className="hover:shadow-md transition-all border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Media Uploads
            </CardTitle>
            <ImageIcon className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalMedia}</div>
            <p className="text-[11px] text-gray-500 mt-1">Images &amp; assets in library</p>
            <Link href="/dashboard/media" className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:underline mt-2">
              <span>View Media Library</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        {/* Contact Messages Card */}
        <Card className="hover:shadow-md transition-all border-l-4 border-l-rose-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Messages
            </CardTitle>
            <Mail className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{messagesCount}</div>
            <p className="text-[11px] text-gray-500 mt-1">
              {unreadCount > 0 ? (
                <span className="font-bold text-rose-600">{unreadCount} new unread</span>
              ) : (
                "Contact inquiries"
              )}
            </p>
            <Link href="/dashboard/contact-messages" className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:underline mt-2">
              <span>View Messages</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Recent Articles (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Recent Articles</CardTitle>
                <p className="text-xs text-gray-500">Latest technical guides and tutorials</p>
              </div>

              <Link href="/dashboard/articles">
                <Button variant="outline" size="sm" className="text-xs font-bold">
                  View All
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-0">
              {articlesLoading ? (
                <div className="p-8 text-center text-sm text-gray-500">
                  Loading articles...
                </div>
              ) : articlesList.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500 space-y-2">
                  <p>No articles found.</p>
                  <Button size="sm" onClick={handleCreateArticle}>Create First Article</Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {articlesList.slice(0, 5).map((article) => {
                      const rawImg = article.featured_image || (article as any).featured_image_media?.url || (article as any).featuredImageMedia?.url;
                      const imageUrl = getMediaUrl(rawImg);

                      return (
                        <TableRow key={article.id}>
                          <TableCell>
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={article.title}
                                width={48}
                                height={48}
                                className="rounded-lg object-cover h-12 w-12"
                                unoptimized
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-[10px] text-gray-400 font-bold">
                                No Image
                              </div>
                            )}
                          </TableCell>

                          <TableCell>
                            <div className="font-semibold text-sm line-clamp-1">{article.title}</div>
                            <div className="text-xs text-gray-400 line-clamp-1 font-mono">{article.slug}</div>
                          </TableCell>

                          <TableCell className="text-xs font-medium text-gray-600">
                            {article.category?.name || "Uncategorized"}
                          </TableCell>

                          <TableCell>
                            {article.status === "published" ? (
                              <Badge className="bg-emerald-600 text-white uppercase text-[9px] font-bold">
                                Published
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 uppercase text-[9px] font-bold">
                                Draft
                              </Badge>
                            )}
                          </TableCell>

                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditArticle(article)}
                              title="Edit Article"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Recent Messages & Quick Health (1 Col) */}
        <div className="space-y-6">
          {/* Recent Contact Inquiries */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Recent Messages</CardTitle>
                <p className="text-xs text-gray-500">Contact form submissions</p>
              </div>

              <Link href="/dashboard/contact-messages">
                <Button variant="ghost" size="sm" className="text-xs font-bold text-blue-600">
                  View All
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="space-y-3">
              {messagesLoading ? (
                <div className="py-6 text-center text-xs text-gray-400">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400">No contact messages received.</div>
              ) : (
                messages.slice(0, 4).map((msg) => (
                  <div key={msg.id} className="p-3 rounded-xl border bg-gray-50/50 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-900 truncate">{msg.name}</span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-extrabold uppercase ${
                          msg.status === "new"
                            ? "bg-rose-50 text-rose-600 border-rose-200"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {msg.status}
                      </Badge>
                    </div>
                    <div className="text-xs font-semibold text-blue-600 line-clamp-1">{msg.subject || "No Subject"}</div>
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{msg.message}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick System Health Box */}
          <Card className="bg-slate-900 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span>System Status</span>
                <Server className="h-4 w-4 text-emerald-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Backend API</span>
                <Badge className="bg-emerald-600 text-white text-[9px] font-bold">ONLINE (8082)</Badge>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Database</span>
                <span className="text-emerald-400 font-bold">MySQL (Connected)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Environment</span>
                <span className="text-blue-400 font-bold uppercase">Production</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <ArticleModal
        open={articleModalOpen}
        article={selectedArticle}
        onClose={() => {
          setArticleModalOpen(false);
          setSelectedArticle(null);
          refetchArticles();
        }}
      />

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={() => {
          refetchMedia();
        }}
      />
    </div>
  );
}