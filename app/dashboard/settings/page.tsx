"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Bell, 
  Shield, 
  User, 
  Palette, 
  Globe, 
  Key, 
  Save, 
  Loader2, 
  Moon, 
  Sun,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { getUserProfile, updateUserSettings } from "@/lib/supabase";

const settingsFormSchema = z.object({
  email_notifications: z.boolean().default(true),
  marketing_emails: z.boolean().default(false),
  account_alerts: z.boolean().default(true),
  language: z.string().default("en"),
  timezone: z.string().default("UTC"),
  two_factor_auth: z.boolean().default(false),
  privacy_profile: z.string().default("public"),
  session_timeout: z.string().default("30"),
  api_key_enabled: z.boolean().default(false),
  auto_dark_mode: z.boolean().default(true),
  animation_reduced: z.boolean().default(false),
  high_contrast: z.boolean().default(false),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      email_notifications: true,
      marketing_emails: false,
      account_alerts: true,
      language: "en",
      timezone: "UTC",
      two_factor_auth: false,
      privacy_profile: "public",
      session_timeout: "30",
      api_key_enabled: false,
      auto_dark_mode: true,
      animation_reduced: false,
      high_contrast: false,
    },
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (isLoaded && user) {
        try {
          const userProfile = await getUserProfile(user.id);
          
          if (userProfile && userProfile.settings) {
            // If settings exist in the user profile, use them
            form.reset({
              email_notifications: userProfile.settings.email_notifications ?? true,
              marketing_emails: userProfile.settings.marketing_emails ?? false,
              account_alerts: userProfile.settings.account_alerts ?? true,
              language: userProfile.settings.language ?? "en",
              timezone: userProfile.settings.timezone ?? "UTC",
              two_factor_auth: userProfile.settings.two_factor_auth ?? false,
              privacy_profile: userProfile.settings.privacy_profile ?? "public",
              session_timeout: userProfile.settings.session_timeout ?? "30",
              api_key_enabled: userProfile.settings.api_key_enabled ?? false,
              auto_dark_mode: userProfile.settings.auto_dark_mode ?? true,
              animation_reduced: userProfile.settings.animation_reduced ?? false,
              high_contrast: userProfile.settings.high_contrast ?? false,
            });
          }
        } catch (error) {
          console.error("Error loading settings:", error);
          toast({
            title: "Error",
            description: "Failed to load settings data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadSettings();
  }, [isLoaded, user, form, toast]);

  const onSubmit = async (data: SettingsFormValues) => {
    if (!user) return;
    
    setSaving(true);
    
    try {
      // Update settings in the database
      await updateUserSettings(user.id, data);
      
      // Apply theme settings
      if (data.auto_dark_mode) {
        setTheme("system");
      } else {
        setTheme(theme === "dark" ? "dark" : "light");
      }
      
      toast({
        title: "Settings Updated",
        description: "Your settings have been successfully saved.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        <Card className="md:row-span-2 h-fit">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Manage your preferences</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="flex flex-col space-y-1 text-sm">
              <button
                onClick={() => setActiveTab("account")}
                className={`flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent transition-colors ${activeTab === "account" ? "bg-accent" : ""}`}
              >
                <User className="h-4 w-4" />
                <span>Account</span>
                <ChevronRight className="ml-auto h-4 w-4" />
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent transition-colors ${activeTab === "notifications" ? "bg-accent" : ""}`}
              >
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
                <ChevronRight className="ml-auto h-4 w-4" />
              </button>
              <button
                onClick={() => setActiveTab("privacy")}
                className={`flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent transition-colors ${activeTab === "privacy" ? "bg-accent" : ""}`}
              >
                <Shield className="h-4 w-4" />
                <span>Privacy & Security</span>
                <ChevronRight className="ml-auto h-4 w-4" />
              </button>
              <button
                onClick={() => setActiveTab("apikeys")}
                className={`flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent transition-colors ${activeTab === "apikeys" ? "bg-accent" : ""}`}
              >
                <Key className="h-4 w-4" />
                <span>API Keys</span>
                <ChevronRight className="ml-auto h-4 w-4" />
              </button>
              <button
                onClick={() => setActiveTab("appearance")}
                className={`flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent transition-colors ${activeTab === "appearance" ? "bg-accent" : ""}`}
              >
                <Palette className="h-4 w-4" />
                <span>Appearance</span>
                <ChevronRight className="ml-auto h-4 w-4" />
              </button>
            </nav>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {activeTab === "account" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      <CardTitle>Account Settings</CardTitle>
                    </div>
                    <CardDescription>
                      Manage your account preferences and regional settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">User Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Full Name</Label>
                          <Input 
                            value={user?.fullName || ""} 
                            disabled 
                            className="bg-muted"
                          />
                          <p className="text-xs text-muted-foreground">
                            To change your name, update your profile
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input 
                            value={user?.primaryEmailAddress?.emailAddress || ""} 
                            disabled 
                            className="bg-muted"
                          />
                          <p className="text-xs text-muted-foreground">
                            Managed through your authentication provider
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Regional Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="language"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Language</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="en">English</SelectItem>
                                  <SelectItem value="es">Spanish</SelectItem>
                                  <SelectItem value="fr">French</SelectItem>
                                  <SelectItem value="de">German</SelectItem>
                                  <SelectItem value="zh">Chinese</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Your preferred language for the application
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="timezone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Timezone</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select timezone" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="UTC">UTC</SelectItem>
                                  <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                                  <SelectItem value="CST">Central Time (CST)</SelectItem>
                                  <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                                  <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                                  <SelectItem value="GMT">Greenwich Mean Time (GMT)</SelectItem>
                                  <SelectItem value="CET">Central European Time (CET)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Your preferred timezone for dates and times
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      <CardTitle>Notification Settings</CardTitle>
                    </div>
                    <CardDescription>
                      Manage how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Email Notifications</h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="email_notifications"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Email Notifications
                                </FormLabel>
                                <FormDescription>
                                  Receive email notifications for important updates
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="marketing_emails"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Marketing Emails
                                </FormLabel>
                                <FormDescription>
                                  Receive emails about new features and offers
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="account_alerts"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Account Alerts
                                </FormLabel>
                                <FormDescription>
                                  Receive alerts about your account security and activity
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "privacy" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <CardTitle>Privacy & Security</CardTitle>
                    </div>
                    <CardDescription>
                      Manage your privacy and security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Security Settings</h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="two_factor_auth"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Two-Factor Authentication
                                </FormLabel>
                                <FormDescription>
                                  Add an extra layer of security to your account
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="session_timeout"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Session Timeout (minutes)</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select timeout" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="15">15 minutes</SelectItem>
                                  <SelectItem value="30">30 minutes</SelectItem>
                                  <SelectItem value="60">1 hour</SelectItem>
                                  <SelectItem value="120">2 hours</SelectItem>
                                  <SelectItem value="240">4 hours</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Automatically log out after inactivity
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Privacy Settings</h3>
                      <FormField
                        control={form.control}
                        name="privacy_profile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Profile Visibility</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select visibility" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="public">Public (Everyone can see)</SelectItem>
                                <SelectItem value="contacts">Contacts Only</SelectItem>
                                <SelectItem value="private">Private (Only you)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Control who can view your profile information
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "apikeys" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Key className="h-5 w-5 text-primary" />
                      <CardTitle>API Keys</CardTitle>
                    </div>
                    <CardDescription>
                      Manage API access for integrations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="api_key_enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Enable API Access
                            </FormLabel>
                            <FormDescription>
                              Allow applications to access your data via API
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch("api_key_enabled") && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Your API Key</Label>
                          <div className="flex gap-2">
                            <Input 
                              value="••••••••••••••••••••••••••••••••" 
                              disabled 
                              className="bg-muted font-mono"
                            />
                            <Button type="button" variant="outline" size="sm">
                              Reveal
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Keep this key secret. Do not share it in client-side code.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" size="sm">
                            Regenerate Key
                          </Button>
                          <Button type="button" variant="destructive" size="sm">
                            Revoke Access
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === "appearance" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-primary" />
                      <CardTitle>Appearance</CardTitle>
                    </div>
                    <CardDescription>
                      Customize how the application looks and behaves
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Theme</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div 
                          className={`border p-4 rounded-lg cursor-pointer transition-all hover:border-primary ${theme === "light" && !form.watch("auto_dark_mode") ? "border-primary bg-primary/5" : ""}`}
                          onClick={() => {
                            form.setValue("auto_dark_mode", false);
                            setTheme("light");
                          }}
                        >
                          <div className="flex justify-center mb-3">
                            <Sun className="h-8 w-8 text-orange-400" />
                          </div>
                          <p className="text-center font-medium">Light</p>
                        </div>
                        <div 
                          className={`border p-4 rounded-lg cursor-pointer transition-all hover:border-primary ${theme === "dark" && !form.watch("auto_dark_mode") ? "border-primary bg-primary/5" : ""}`}
                          onClick={() => {
                            form.setValue("auto_dark_mode", false);
                            setTheme("dark");
                          }}
                        >
                          <div className="flex justify-center mb-3">
                            <Moon className="h-8 w-8 text-blue-400" />
                          </div>
                          <p className="text-center font-medium">Dark</p>
                        </div>
                        <div 
                          className={`border p-4 rounded-lg cursor-pointer transition-all hover:border-primary ${form.watch("auto_dark_mode") ? "border-primary bg-primary/5" : ""}`}
                          onClick={() => {
                            form.setValue("auto_dark_mode", true);
                            setTheme("system");
                          }}
                        >
                          <div className="flex justify-center mb-3">
                            <div className="relative">
                              <Sun className="h-8 w-8 text-orange-400 absolute opacity-50 left-1" />
                              <Moon className="h-8 w-8 text-blue-400 absolute -right-1" />
                            </div>
                          </div>
                          <p className="text-center font-medium mt-2">System</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Accessibility</h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="animation_reduced"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Reduce Animations
                                </FormLabel>
                                <FormDescription>
                                  Minimize motion for a more stable experience
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="high_contrast"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  High Contrast Mode
                                </FormLabel>
                                <FormDescription>
                                  Increase contrast for better visibility
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
} 