"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, Check, CheckCheck, Briefcase, UserCheck } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function NotificationBell() {
  const notifications = useQuery(api.notifications.getMyNotifications);
  const unreadCount = useQuery(api.notifications.getUnreadCount);
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);
  const updateStatus = useMutation(api.applications.updateStatus);
  const router = useRouter();
  
  const [open, setOpen] = useState(false);

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await markAsRead({
        notificationId: id as Id<"notifications">,
      });
    } catch {
      // ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
    } catch {
      // ignore
    }
  };

  const handleUpdateStatus = async (
    e: React.MouseEvent,
    notificationId: string,
    applicationId: string,
    status: "shortlisted" | "rejected"
  ) => {
    e.stopPropagation();
    try {
      await updateStatus({
        applicationId: applicationId as Id<"applications">,
        status,
      });
      // Also mark the notification as read
      await markAsRead({
        notificationId: notificationId as Id<"notifications">,
      });
      toast.success(`Application ${status}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update application");
    }
  };

  const iconMap: Record<string, any> = {
    new_application: Briefcase,
    status_change: UserCheck,
    job_expired: Bell,
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {(unreadCount ?? 0) > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">
              {unreadCount! > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[380px] p-0">
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
          <h4 className="text-sm font-semibold">Notifications</h4>
          {(unreadCount ?? 0) > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={handleMarkAllRead}
            >
              <CheckCheck className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {!notifications || notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No notifications yet
              </p>
            </div>
          ) : (
            notifications.map((n) => {
              const Icon = iconMap[n.type] ?? Bell;
              
              // Define special actions for new applications
              const isApplication = n.type === "new_application" && n.applicationId;

              return (
                <div
                  key={n._id}
                  className={`flex items-start gap-3 border-b border-border/30 px-4 py-3 transition-colors ${
                    !n.isRead
                      ? "bg-muted/50"
                      : "opacity-70"
                  } ${isApplication || n.jobId ? "cursor-pointer hover:bg-muted" : ""}`}
                  onClick={() => {
                     // Default click action: take user to relevant page
                     if (isApplication) {
                       router.push(`/dashboard/applicants`);
                       setOpen(false);
                       handleMarkAsRead(n._id);
                     } else if (n.jobId) {
                       router.push(`/dashboard/jobs`);
                       setOpen(false);
                       handleMarkAsRead(n._id);
                     }
                  }}
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      !n.isRead
                        ? "bg-muted text-foreground"
                        : "bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60">
                      {new Date(n.createdAt).toLocaleDateString()} •{" "}
                      {new Date(n.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    
                    {/* Inline Quick Actions for Applications */}
                    {isApplication && !n.isRead && (
                      <div className="flex items-center gap-2 pt-1">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          className="h-7 text-xs"
                          onClick={(e) => handleUpdateStatus(e, n._id, n.applicationId!, "shortlisted")}
                        >
                          Shortlist
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-7 text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/50"
                          onClick={(e) => handleUpdateStatus(e, n._id, n.applicationId!, "rejected")}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {!n.isRead && !isApplication && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={(e) => handleMarkAsRead(n._id, e)}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
