"use client"

import { useState, useEffect } from "react"
import { 
  Bar, 
  BarChart, 
  CartesianGrid,
  Line, 
  LineChart, 
  PieChart, 
  Pie, 
  ResponsiveContainer, 
  Tooltip,
  XAxis, 
  YAxis,
  Cell,
  Legend,
  RadialBar,
  RadialBarChart,
  AreaChart,
  Area
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronUp, TrendingUp, TrendingDown, Activity, Users, Eye, BarChart3, Calendar, Loader2, Shield, Video } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import Web3Verification from "@/components/web3/web3-verification"

// Mock data for charts
const portfolioViews = [
  { name: "Jan", views: 150 },
  { name: "Feb", views: 220 },
  { name: "Mar", views: 200 },
  { name: "Apr", views: 310 },
  { name: "May", views: 290 },
  { name: "Jun", views: 380 },
  { name: "Jul", views: 400 },
  { name: "Aug", views: 380 },
  { name: "Sep", views: 450 },
  { name: "Oct", views: 520 },
  { name: "Nov", views: 580 },
  { name: "Dec", views: 650 },
]

const skillsData = [
  { name: "React", value: 85 },
  { name: "Node.js", value: 70 },
  { name: "TypeScript", value: 65 },
  { name: "Blockchain", value: 55 },
  { name: "UI/UX", value: 75 },
]

const applicationStatus = [
  { name: "Applied", value: 32 },
  { name: "Interviewed", value: 18 },
  { name: "Offers", value: 5 },
  { name: "Rejected", value: 9 },
]

const weeklyActivity = [
  { name: "Mon", activity: 12 },
  { name: "Tue", activity: 18 },
  { name: "Wed", activity: 15 },
  { name: "Thu", activity: 22 },
  { name: "Fri", activity: 28 },
  { name: "Sat", activity: 10 },
  { name: "Sun", activity: 8 },
]

const projectCompletionData = [
  { name: "Portfolio", fill: "#8884d8", value: 100 },
  { name: "Resume", fill: "#83a6ed", value: 85 },
  { name: "Cover Letter", fill: "#8dd1e1", value: 100 },
  { name: "Web3 Verification", fill: "#82ca9d", value: 100 },
  { name: "Video Generation", fill: "#ff7c78", value: 85 },
]

// Mock IPFS Hash for the portfolio
const PORTFOLIO_IPFS_HASH = "bafybeidqvihld4k77iqe2qiiu5ajlktcxvswbj7eivplh3tm2tedrlzeym"

// Color constants
const COLORS = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#ff7c78"]
const GRADIENT_COLORS = ["#6366f1", "#8b5cf6", "#d946ef"]
const AREA_GRADIENT_START = "#4f46e5"
const AREA_GRADIENT_STOP = "#4f46e510"

export function DashboardAnalytics() {
  const [timeFrame, setTimeFrame] = useState("weekly")
  const [loading, setLoading] = useState(false)
  const [web3DialogOpen, setWeb3DialogOpen] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  
  const handleTimeFrameChange = (frame: string) => {
    setLoading(true)
    // Simulate loading - resolves immediately to avoid actual waiting
    setTimeout(() => {
      setTimeFrame(frame)
      setLoading(false)
    }, 500)
  }
  
  const handleCardClick = () => {
    setLoading(true)
    // Simulate data loading
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }
  
  // Handle wallet connection status change
  const handleWalletChange = (address: string | null) => {
    setWalletConnected(!!address)
  }
  
  return (
    <div className="space-y-6 relative">
      {loading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your portfolio performance and activity</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={timeFrame === "weekly" ? "default" : "outline"}
            size="sm" 
            onClick={() => handleTimeFrameChange("weekly")}
            disabled={loading}
          >
            Weekly
          </Button>
          <Button 
            variant={timeFrame === "monthly" ? "default" : "outline"}
            size="sm" 
            onClick={() => handleTimeFrameChange("monthly")}
            disabled={loading}
          >
            Monthly
          </Button>
          <Button 
            variant={timeFrame === "yearly" ? "default" : "outline"}
            size="sm" 
            onClick={() => handleTimeFrameChange("yearly")}
            disabled={loading}
          >
            Yearly
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border-l-4 border-l-blue-500 hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
          <CardHeader className="pb-2">
            <CardDescription>Portfolio Views</CardDescription>
            <div className="flex items-baseline justify-between">
              <CardTitle className="text-2xl">1,247</CardTitle>
              <Badge variant="default" className="bg-blue-500">
                <ChevronUp className="mr-1 h-3 w-3" />
                12%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart data={portfolioViews.slice(-7)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={AREA_GRADIENT_START} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={AREA_GRADIENT_STOP} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="views" stroke="#4f46e5" fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-purple-500 hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
          <CardHeader className="pb-2">
            <CardDescription>Application Rate</CardDescription>
            <div className="flex items-baseline justify-between">
              <CardTitle className="text-2xl">64</CardTitle>
              <Badge variant="default" className="bg-purple-500">
                <TrendingUp className="mr-1 h-3 w-3" />
                8%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart data={weeklyActivity} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf610" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="activity" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorActivity)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-pink-500 hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
          <CardHeader className="pb-2">
            <CardDescription>Response Rate</CardDescription>
            <div className="flex items-baseline justify-between">
              <CardTitle className="text-2xl">28%</CardTitle>
              <Badge variant="default" className="bg-pink-500">
                <TrendingDown className="mr-1 h-3 w-3" />
                2%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={portfolioViews.slice(-7)} margin={{ top: 15, right: 5, left: 5, bottom: 0 }}>
                <Line type="monotone" dataKey="views" stroke="#ec4899" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
          <CardHeader className="pb-2">
            <CardDescription>Profile Completion</CardDescription>
            <div className="flex items-baseline justify-between">
              <CardTitle className="text-2xl">84%</CardTitle>
              <Badge variant="default" className="bg-emerald-500">
                <ChevronUp className="mr-1 h-3 w-3" />
                4%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveContainer width="100%" height={80}>
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="50%" 
                outerRadius="90%" 
                barSize={10} 
                data={[{ name: "Progress", value: 84, fill: "#10b981" }]}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2 hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
          <CardHeader>
            <CardTitle>Portfolio Engagement</CardTitle>
            <CardDescription>Monthly views of your portfolio and associated content</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={portfolioViews} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="views" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
          <CardHeader>
            <CardTitle>Skill Breakdown</CardTitle>
            <CardDescription>Your strongest areas based on your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillsData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(value) => [`${value}%`, 'Proficiency']} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {skillsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>Job application outcomes and distribution</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={applicationStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {applicationStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Your portfolio and application activity by day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyActivity} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="activity" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Dialog open={web3DialogOpen} onOpenChange={setWeb3DialogOpen}>
          <DialogTrigger asChild>
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setWeb3DialogOpen(true)}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-500" />
                    Web3 Verification
                  </CardTitle>
                  {walletConnected && <Badge className="bg-green-500">Active</Badge>}
                </div>
                <CardDescription>Blockchain verification for your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="20%" 
                    outerRadius="90%" 
                    barSize={20} 
                    data={projectCompletionData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      label={{ position: 'insideStart', fill: '#fff' }}
                      background
                      dataKey="value"
                    />
                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="text-center mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setWeb3DialogOpen(true);
                    }}
                  >
                    <Shield className="h-4 w-4" />
                    Verify Portfolio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <Web3Verification 
              ipfsHash={PORTFOLIO_IPFS_HASH}
              contractAddress="0x1234567890123456789012345678901234567890"
              tokenId="1"
              entityType="portfolio"
              entityId="portfolio-123"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Video Generation Card */}
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-red-500" />
              Video Generator
            </CardTitle>
            <Badge className="bg-blue-500">New</Badge>
          </div>
          <CardDescription>Create professional videos for your portfolio and resume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2 border rounded-lg p-4">
              <h3 className="font-medium">Portfolio Videos</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Generated</span>
                <span className="font-medium">2</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "40%" }}></div>
              </div>
            </div>
            <div className="space-y-2 border rounded-lg p-4">
              <h3 className="font-medium">Resume Videos</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Generated</span>
                <span className="font-medium">1</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: "20%" }}></div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link href="/dashboard/video-generation">
              <Button className="gap-2">
                <Video className="h-4 w-4" />
                Create New Video
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 