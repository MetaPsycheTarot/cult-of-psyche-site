import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  Users,
  TrendingUp,
  MailOpen,
  MousePointerClick,
  Award,
  Filter,
  Download,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UserEngagementReport() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"clicks" | "opens" | "emails">("clicks");

  const { data: topUsers, isLoading: topLoading } = trpc.userEngagement.getTopEngaged.useQuery({
    limit: 20,
  });
  const { data: selectedUserStats } = trpc.userEngagement.getUserStats.useQuery(
    { userId: selectedUser || undefined },
    { enabled: !!selectedUser }
  );
  const { data: selectedUserHistory } = trpc.userEngagement.getUserHistory.useQuery(
    { userId: selectedUser || undefined, limit: 20 },
    { enabled: !!selectedUser }
  );
  const { data: selectedUserByType } = trpc.userEngagement.getUserEngagementByType.useQuery(
    { userId: selectedUser || undefined },
    { enabled: !!selectedUser }
  );
  const { data: selectedUserTrends } = trpc.userEngagement.getUserTrends.useQuery(
    { userId: selectedUser || undefined, days: 30 },
    { enabled: !!selectedUser }
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              User engagement reports are only available to administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const COLORS = ["#FF1493", "#00D9FF", "#FFD700", "#FF69B4", "#00FF00"];

  // Sort users based on selected metric
  const sortedUsers = topUsers
    ? [...topUsers].sort((a, b) => {
        if (sortBy === "clicks") return (b.totalClicks || 0) - (a.totalClicks || 0);
        if (sortBy === "opens") return (b.totalOpens || 0) - (a.totalOpens || 0);
        return (b.totalEmails || 0) - (a.totalEmails || 0);
      })
    : [];

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8" style={{ color: "var(--color-hot-pink)" }} />
          <h1 className="text-4xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
            User Engagement Report
          </h1>
        </div>
        <p className="text-muted-foreground">
          Detailed analysis of user email engagement and interaction patterns
        </p>
      </div>

      {/* Top Users Rankings */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" style={{ color: "var(--color-cyan)" }} />
                <CardTitle>Top Engaged Users</CardTitle>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy("clicks")}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    sortBy === "clicks"
                      ? "bg-hot-pink text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  Clicks
                </button>
                <button
                  onClick={() => setSortBy("opens")}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    sortBy === "opens"
                      ? "bg-hot-pink text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  Opens
                </button>
                <button
                  onClick={() => setSortBy("emails")}
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    sortBy === "emails"
                      ? "bg-hot-pink text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  Emails
                </button>
              </div>
            </div>
            <CardDescription>Ranked by engagement score (opens + clicks × 2)</CardDescription>
          </CardHeader>
          <CardContent>
            {!topLoading && sortedUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Rank</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="text-right">Emails</TableHead>
                      <TableHead className="text-right">Opens</TableHead>
                      <TableHead className="text-right">Clicks</TableHead>
                      <TableHead className="text-right">Open Rate</TableHead>
                      <TableHead className="text-right">Click Rate</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedUsers.slice(0, 15).map((user, index) => (
                      <TableRow key={user.userId} className="hover:bg-muted/50">
                        <TableCell className="font-bold" style={{ color: "var(--color-hot-pink)" }}>
                          #{index + 1}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-semibold">{user.userName}</div>
                            <div className="text-sm text-muted-foreground">{user.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{user.totalEmails}</TableCell>
                        <TableCell className="text-right">
                          <span style={{ color: "var(--color-cyan)" }}>{user.totalOpens}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span style={{ color: "var(--color-hot-pink)" }}>{user.totalClicks}</span>
                        </TableCell>
                        <TableCell className="text-right">{user.openRate}%</TableCell>
                        <TableCell className="text-right">{user.clickRate}%</TableCell>
                        <TableCell className="text-right font-bold">
                          {user.engagementScore}
                        </TableCell>
                        <TableCell className="text-center">
                          <button
                            onClick={() => setSelectedUser(user.userId)}
                            className="px-3 py-1 rounded text-sm transition-all"
                            style={{
                              background: "rgba(0, 217, 255, 0.1)",
                              color: "var(--color-cyan)",
                            }}
                          >
                            View
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-muted-foreground">
                No user engagement data available yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Detail View */}
      {selectedUser && selectedUserStats && (
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Details</CardTitle>
                  <CardDescription>
                    Detailed engagement analytics for selected user
                  </CardDescription>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-3 py-1 rounded text-sm bg-muted text-muted-foreground hover:bg-muted/80"
                >
                  Close
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="byType">By Type</TabsTrigger>
                  <TabsTrigger value="trends">Trends</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Total Emails
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedUserStats.totalEmails}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <MailOpen className="w-4 h-4" style={{ color: "var(--color-cyan)" }} />
                          Opens
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold" style={{ color: "var(--color-cyan)" }}>
                          {selectedUserStats.totalOpens}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <MousePointerClick
                            className="w-4 h-4"
                            style={{ color: "var(--color-hot-pink)" }}
                          />
                          Clicks
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
                          {selectedUserStats.totalClicks}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Open Rate
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedUserStats.openRate}%</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Click Rate
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedUserStats.clickRate}%</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Last Engagement
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm">
                          {selectedUserStats.lastEngagementAt
                            ? new Date(selectedUserStats.lastEngagementAt).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* By Type Tab */}
                <TabsContent value="byType" className="mt-6">
                  {selectedUserByType && selectedUserByType.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-4">Email Type Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={selectedUserByType}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ emailType, totalEmails }) => `${emailType}: ${totalEmails}`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="totalEmails"
                            >
                              {selectedUserByType.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-4">Metrics by Type</h3>
                        <div className="space-y-3">
                          {selectedUserByType.map((type) => (
                            <div
                              key={type.emailType}
                              className="p-3 rounded border"
                              style={{ borderColor: "rgba(0, 217, 255, 0.3)" }}
                            >
                              <div className="font-semibold capitalize mb-2">{type.emailType}</div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>Emails: {type.totalEmails}</div>
                                <div>Opens: {type.totalOpens}</div>
                                <div>Clicks: {type.totalClicks}</div>
                                <div>Open Rate: {type.openRate}%</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center text-muted-foreground">
                      No email type data available
                    </div>
                  )}
                </TabsContent>

                {/* Trends Tab */}
                <TabsContent value="trends" className="mt-6">
                  {selectedUserTrends && selectedUserTrends.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={selectedUserTrends}>
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
                          dataKey="emailCount"
                          stroke="var(--color-cyan)"
                          strokeWidth={2}
                          name="Emails Sent"
                        />
                        <Line
                          type="monotone"
                          dataKey="openCount"
                          stroke="var(--color-hot-pink)"
                          strokeWidth={2}
                          name="Opens"
                        />
                        <Line
                          type="monotone"
                          dataKey="clickCount"
                          stroke="var(--color-lime)"
                          strokeWidth={2}
                          name="Clicks"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-40 flex items-center justify-center text-muted-foreground">
                      No trend data available
                    </div>
                  )}
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="mt-6">
                  {selectedUserHistory && selectedUserHistory.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {selectedUserHistory.map((email) => (
                        <div
                          key={email.id}
                          className="p-4 rounded border"
                          style={{ borderColor: "rgba(0, 217, 255, 0.3)" }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-semibold capitalize">{email.emailType}</div>
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
                              <MousePointerClick
                                className="w-4 h-4"
                                style={{ color: "var(--color-hot-pink)" }}
                              />
                              <span>{email.clickCount} clicks</span>
                            </div>
                            {email.bounced && (
                              <div className="text-red-500 text-xs">Bounced</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center text-muted-foreground">
                      No email history available
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
