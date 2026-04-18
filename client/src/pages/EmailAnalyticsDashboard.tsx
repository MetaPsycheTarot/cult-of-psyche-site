import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Mail, TrendingUp, MailOpen, MousePointerClick, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EmailAnalyticsDashboard() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const { data: summary, isLoading: summaryLoading } = trpc.emailAnalytics.getEngagementSummary.useQuery();
  const { data: recentMetrics, isLoading: recentLoading } = trpc.emailAnalytics.getRecentMetrics.useQuery(
    { days: 30 }
  );
  const { data: welcomeMetrics } = trpc.emailAnalytics.getMetricsByType.useQuery({
    emailType: "welcome",
  });
  const { data: paymentMetrics } = trpc.emailAnalytics.getMetricsByType.useQuery({
    emailType: "payment_confirmation",
  });
  const { data: referralMetrics } = trpc.emailAnalytics.getMetricsByType.useQuery({
    emailType: "referral_notification",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const COLORS = ["#FF1493", "#00D9FF", "#FFD700", "#FF69B4", "#00FF00"];

  // Prepare data for email type distribution
  const emailTypeData = [
    { name: "Welcome", value: welcomeMetrics?.length || 0 },
    { name: "Payment", value: paymentMetrics?.length || 0 },
    { name: "Referral", value: referralMetrics?.length || 0 },
  ].filter((item) => item.value > 0);

  // Prepare timeline data for recent emails
  const timelineData = (recentMetrics || [])
    .slice(0, 14)
    .reverse()
    .map((metric) => ({
      date: new Date(metric.sentAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      opens: metric.openCount || 0,
      clicks: metric.clickCount || 0,
    }));

  const isLoading = summaryLoading || recentLoading;

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Mail className="w-8 h-8" style={{ color: "var(--color-hot-pink)" }} />
          <h1 className="text-4xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
            Email Analytics
          </h1>
        </div>
        <p className="text-muted-foreground">Track email engagement, open rates, and click-through metrics</p>
      </div>

      {/* Key Metrics Cards */}
      {!isLoading && summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Emails</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summary.totalEmails}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MailOpen className="w-4 h-4" style={{ color: "var(--color-cyan)" }} />
                Open Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: "var(--color-cyan)" }}>
                {parseFloat(String(summary.openRate)).toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MousePointerClick className="w-4 h-4" style={{ color: "var(--color-magenta)" }} />
                Click Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: "var(--color-magenta)" }}>
                {parseFloat(String(summary.clickRate)).toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: "var(--color-lime)" }} />
                Delivery Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: "var(--color-lime)" }}>
                {parseFloat(String(summary.deliveryRate)).toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4" style={{ color: "var(--color-orange)" }} />
                Bounce Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: "var(--color-orange)" }}>
                {parseFloat(String(summary.bounceRate)).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline">Engagement Timeline</TabsTrigger>
          <TabsTrigger value="distribution">Email Type Distribution</TabsTrigger>
          <TabsTrigger value="recent">Recent Emails</TabsTrigger>
        </TabsList>

        {/* Engagement Timeline */}
        <TabsContent value="timeline" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" style={{ color: "var(--color-cyan)" }} />
                Engagement Over Time (Last 14 Days)
              </CardTitle>
              <CardDescription>Opens and clicks per day</CardDescription>
            </CardHeader>
            <CardContent>
              {timelineData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.2)" />
                    <XAxis dataKey="date" stroke="var(--color-text-secondary)" />
                    <YAxis stroke="var(--color-text-secondary)" />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-midnight)",
                        border: "1px solid var(--color-cyan)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="opens"
                      stroke="var(--color-cyan)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-cyan)", r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="clicks"
                      stroke="var(--color-hot-pink)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-hot-pink)", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No engagement data available yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Type Distribution */}
        <TabsContent value="distribution" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Email Type Distribution</CardTitle>
              <CardDescription>Breakdown of emails by type</CardDescription>
            </CardHeader>
            <CardContent>
              {emailTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={emailTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {emailTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No email data available yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Emails */}
        <TabsContent value="recent" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Email Activity</CardTitle>
              <CardDescription>Latest 5 emails sent</CardDescription>
            </CardHeader>
            <CardContent>
              {summary?.recentEmails && summary.recentEmails.length > 0 ? (
                <div className="space-y-4">
                  {summary.recentEmails.map((email, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border"
                      style={{ borderColor: "rgba(0, 217, 255, 0.3)", background: "rgba(0, 217, 255, 0.05)" }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold capitalize">{email.emailType.replace(/_/g, " ")}</div>
                          <div className="text-sm text-muted-foreground">{email.recipientEmail}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(email.sentAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MailOpen className="w-4 h-4" style={{ color: "var(--color-cyan)" }} />
                          <span>{email.openCount} opens</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MousePointerClick className="w-4 h-4" style={{ color: "var(--color-hot-pink)" }} />
                          <span>{email.clickCount} clicks</span>
                        </div>
                        {email.openedAt && (
                          <div className="text-xs text-muted-foreground">
                            Opened: {new Date(email.openedAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-muted-foreground">
                  No recent email activity
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
