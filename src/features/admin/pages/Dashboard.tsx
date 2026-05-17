import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useListBlogs,
  useListProjects,
  useListTechs
} from "@/features/portfolio/api/portfolio.api";
import {
  ArrowUpRight,
  Briefcase,
  FileText,
  Mail,
  Wrench
} from "lucide-react";
import { Link } from "wouter";
import { useGetEnquiries } from "../api/admin.api";

export default function Dashboard() {
  const { data: projects } = useListProjects();
  const { data: techs } = useListTechs();
  const { data: blogsResponse } = useListBlogs();
  const { data: enquiries = [] } = useGetEnquiries();

  const blogs =
    Array.isArray(blogsResponse)
      ? blogsResponse
      : (blogsResponse as any)?.data || [];

  const stats = [
    {
      label: "Projects",
      value: projects?.length || 0,
      icon: Briefcase,
      color: "text-blue-500",
      bg: "bg-blue-500",
      href: "/admin/projects",
    },
    {
      label: "Tech Stack",
      value: techs?.length || 0,
      icon: Wrench,
      color: "text-orange-500",
      bg: "bg-orange-500",
      href: "/admin/techs",
    },
    {
      label: "Blog Posts",
      value: blogs?.length || 0,
      icon: FileText,
      color: "text-green-500",
      bg: "bg-green-500",
      href: "/admin/blogs",
    },
    {
      label: "Enquiries",
      value: enquiries?.length || 0,
      icon: Mail,
      color: "text-purple-500",
      bg: "bg-purple-500",
      href: "/admin/enquiries",
    },
  ];

  const maxValue = Math.max(...stats.map((s) => s.value), 1);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h2>

        <p className="text-muted-foreground">
          Manage your portfolio content from here.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border-border/50 hover:shadow-lg transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>

              <div
                className={`rounded-xl p-2 bg-muted ${stat.color}`}
              >
                <stat.icon size={16} />
              </div>
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold">
                {stat.value}
              </div>

              <Link href={stat.href}>
                <div className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 cursor-pointer mt-2">
                  View all <ArrowUpRight size={10} />
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Beautiful Graph UI */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Analytics */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Portfolio Analytics</CardTitle>

                <p className="text-sm text-muted-foreground mt-1">
                  Overview of your portfolio content distribution
                </p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-bold">
                  {stats.reduce((a, b) => a + b.value, 0)}
                </div>

                <p className="text-xs text-muted-foreground">
                  Total Items
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-10">
            <div className="flex items-end justify-between gap-6 h-[320px]">
              {stats.map((item) => {
                const height =
                  (item.value / maxValue) * 100;

                return (
                  <div
                    key={item.label}
                    className="flex-1 flex flex-col items-center gap-4"
                  >
                    <div className="text-sm font-semibold">
                      {item.value}
                    </div>

                    <div className="relative w-full flex items-end justify-center h-full">
                      <div
                        className={`w-full max-w-[90px] rounded-t-3xl ${item.bg} shadow-2xl transition-all duration-700 hover:scale-105`}
                        style={{
                          height: `${Math.max(height, 12)}%`,
                        }}
                      >
                        <div className="h-full w-full bg-white/10 rounded-t-3xl" />
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`rounded-xl p-2 bg-muted ${item.color}`}
                      >
                        <item.icon size={18} />
                      </div>

                      <span className="text-sm font-medium text-center">
                        {item.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Activity Card */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Content Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {stats.map((item) => {
              const progress =
                (item.value / maxValue) * 100;

              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <item.icon
                        size={14}
                        className={item.color}
                      />

                      <span className="text-sm font-medium">
                        {item.label}
                      </span>
                    </div>

                    <span className="text-sm font-bold">
                      {item.value}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.bg} transition-all duration-700`}
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="pt-6 border-t">
              <div className="rounded-2xl bg-muted/50 p-5">
                <p className="text-sm text-muted-foreground">
                  Your portfolio currently contains
                </p>

                <div className="mt-2 text-2xl font-bold">
                  {stats.reduce((a, b) => a + b.value, 0)}{" "}
                  total entries
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  Across projects, technologies, blogs and
                  enquiries.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}