import { Link } from "wouter";
import { MessageSquare, Heart, Share2, Flame, Target, Users as UsersIcon, Camera, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "sonner";
import type { CommunityPost, User } from "@shared/schema";

export default function Community() {
  const queryClient = useQueryClient();
  const { data: posts = [] } = useQuery<CommunityPost[]>({
    queryKey: ["/api/community-posts"],
  });

  const { data: allUsers = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const likeMutation = useMutation({
    mutationFn: async (postId: number) => {
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      const res = await apiRequest("PATCH", `/api/community-posts/${postId}`, { likes: post.likes + 1 });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts"] });
    },
  });

  const getUserById = (userId: number) => allUsers.find(u => u.id === userId);

  const formatTimeAgo = (date: string | Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    const diff = Date.now() - d.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(diff / 86400000);
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-20">
      <header className="py-2 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-semibold text-primary" data-testid="text-community-title">Community Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">Connect, share, and grow together</p>
        </div>
      </header>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
        {[
          { href: "/challenges", icon: Flame, label: "Weekly\nChallenges" },
          { href: "/bootcamps", icon: Target, label: "Seasonal\nBootcamps" },
          { href: "/friends", icon: UsersIcon, label: "Connect\nFriends" },
          { href: "/messages", icon: MessageSquare, label: "Group\nChat" },
        ].map(item => (
          <Link key={item.href} href={item.href}>
            <Card className="min-w-[120px] bg-gradient-to-br from-card to-secondary/50 border-border shadow-sm cursor-pointer hover:border-primary/50 transition-colors">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2 h-full">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-xs text-foreground whitespace-pre-line">{item.label}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-12 bg-card border-border shadow-sm text-foreground flex items-center gap-2 justify-start px-4" onClick={() => toast.info("Share Photo", { description: "Opening camera roll..." })} data-testid="button-share-photo">
          <Camera className="w-4 h-4 text-primary" />
          <span className="font-medium text-xs">Share Photo</span>
        </Button>
        <Button variant="outline" className="h-12 bg-card border-border shadow-sm text-foreground flex items-center gap-2 justify-start px-4" onClick={() => toast.info("Share Recipe", { description: "Opening recipe builder..." })} data-testid="button-share-recipe">
          <ChefHat className="w-4 h-4 text-primary" />
          <span className="font-medium text-xs">Share Recipe</span>
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Community Feed</h2>

        {posts.map(post => {
          const user = getUserById(post.userId);
          const isCoach = user?.role === "coach";
          return (
            <Card key={post.id} className="border-border shadow-sm" data-testid={`card-post-${post.id}`}>
              <CardHeader className="p-4 pb-2 flex flex-row items-center gap-3">
                <Avatar>
                  {!isCoach && <AvatarImage src={`https://i.pravatar.cc/150?u=${post.userId}`} />}
                  <AvatarFallback className={isCoach ? "bg-primary/20 text-primary" : ""}>{user?.avatarInitials || "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm">{user?.displayName || "Unknown"}</h4>
                    {isCoach && <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded font-medium">Admin</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{formatTimeAgo(post.createdAt)} &bull; {post.postType === "pr" ? "Personal Record" : post.postType === "announcement" ? "Announcement" : "Update"}</p>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm leading-relaxed">{post.content}</p>
                {post.postType === "pr" && (
                  <div className="bg-secondary/50 rounded-lg p-3 border border-border mt-3">
                    <div className="text-xs text-muted-foreground">Personal Record</div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-3 border-t border-border flex gap-4">
                <Button variant="ghost" size="sm" className="text-muted-foreground h-8 px-2" onClick={() => likeMutation.mutate(post.id)} data-testid={`button-like-${post.id}`}>
                  <Heart className={`w-4 h-4 mr-1.5 ${post.likes > 0 ? "fill-current text-primary" : ""}`} /> {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground h-8 px-2" onClick={() => toast.info("Comments", { description: "Opening comments..." })}>
                  <MessageSquare className="w-4 h-4 mr-1.5" /> {post.comments}
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground h-8 px-2 ml-auto" onClick={() => toast.info("Share Options", { description: "Opening share menu..." })}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
