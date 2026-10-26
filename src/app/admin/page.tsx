'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Image as ImageIcon,
  FileText,
  Briefcase,
  HelpCircle,
  Settings,
  LogOut,
  Upload,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Edit3,
  Search,
  Filter,
  Check,
  Star,
  RefreshCw,
  Server,
  BookOpen,
  Quote,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  Zap,
  Globe,
  ArrowRight,
  Eye,
  CheckCircle,
  Youtube,
  Calculator,
  DollarSign,
  Scale,
  Tag,
  X,
} from 'lucide-react';
import MediaSelectModal from '@/components/MediaSelectModal';
import DynamicBlockManager from '@/components/admin/DynamicBlockManager';
import PricingPackagesManager from '@/components/admin/PricingPackagesManager';
import CalculatorPricingManager from '@/components/admin/CalculatorPricingManager';
import LegalPagesManager from '@/components/admin/LegalPagesManager';
import LogoFaviconSettings from '@/components/admin/LogoFaviconSettings';
import BlogPostManager from '@/components/admin/BlogPostManager';
import ServiceManager from '@/components/admin/ServiceManager';
import HomepageSectionsManager from '@/components/admin/HomepageSectionsManager';
import ServicePagesCMS from '@/components/admin/ServicePagesCMS';
import AboutContactCMS from '@/components/admin/AboutContactCMS';

type TabKey =
  | 'overview'
  | 'blocks'
  | 'packages'
  | 'calculator'
  | 'leads'
  | 'bookings'
  | 'portfolio'
  | 'services'
  | 'homepage'
  | 'service_cms'
  | 'about_contact_cms'
  | 'media'
  | 'legal'
  | 'testimonials'
  | 'clients'
  | 'faqs'
  | 'blogs'
  | 'settings'
  | 'deployment';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);

  // Data states
  const [leads, setLeads] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [mediaAssets, setMediaAssets] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [portfolioProjects, setPortfolioProjects] = useState<any[]>([]);
  const [portfolioCategories, setPortfolioCategories] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [blogs, setBlogs] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  // Filter & sub-tab states
  const [activePortfolioCategory, setActivePortfolioCategory] = useState<string>('all');
  const [activeBookingStatus, setActiveBookingStatus] = useState<string>('ALL');
  const [activeLeadStatus, setActiveLeadStatus] = useState<string>('ALL');
  const [activeSectionPage, setActiveSectionPage] = useState<'home' | 'about' | 'contact'>('home');

  // Modals for CRUD operations
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [selectedCoverAsset, setSelectedCoverAsset] = useState<any>(null);

  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [testimonialPhotoAsset, setTestimonialPhotoAsset] = useState<any>(null);
  const [clientLogoAsset, setClientLogoAsset] = useState<any>(null);
  const [testimonialMediaOpen, setTestimonialMediaOpen] = useState(false);
  const [clientLogoMediaOpen, setClientLogoMediaOpen] = useState(false);
  const [isSavingTestimonial, setIsSavingTestimonial] = useState(false);

  // UI status alerts & loading indicators
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isScanningMedia, setIsScanningMedia] = useState(false);
  const [compressingMediaId, setCompressingMediaId] = useState<string | null>(null);

  // Media picker modal state for CMS entity fields
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaTargetCallback, setMediaTargetCallback] = useState<((asset: any) => void) | null>(null);

  // Helper notification toaster
  const showNotification = (msg: string, isErr = false) => {
    if (isErr) {
      setSaveError(msg);
      setTimeout(() => setSaveError(''), 4500);
    } else {
      setSaveSuccess(msg);
      setTimeout(() => setSaveSuccess(''), 4500);
    }
  };

  // Helper to open media picker modal for any field
  const openMediaPicker = (callback: (asset: any) => void) => {
    setMediaTargetCallback(() => callback);
    setMediaModalOpen(true);
  };

  // Check auth session & load all backend data concurrently
  const checkAuthAndLoad = async () => {
    try {
      const authRes = await fetch('/api/admin/auth/me');
      const authData = await authRes.json();
      if (!authRes.ok || !authData.success) {
        setAdminUser(null);
        router.replace('/admin/login');
        return;
      }
      setAdminUser(authData.admin);

      // Concurrent fetch for all dynamic CMS entities
      const [
        leadsRes,
        bookingsRes,
        mediaRes,
        sectionsRes,
        servicesRes,
        portfolioRes,
        faqsRes,
        settingsRes,
        blogsRes,
        testRes,
        clientsRes,
      ] = await Promise.all([
        fetch('/api/admin/leads'),
        fetch('/api/admin/bookings'),
        fetch('/api/admin/media'),
        fetch('/api/admin/sections'),
        fetch('/api/admin/services'),
        fetch('/api/admin/portfolio'),
        fetch('/api/admin/faqs'),
        fetch('/api/admin/settings'),
        fetch('/api/admin/blogs'),
        fetch('/api/admin/testimonials'),
        fetch('/api/admin/clients'),
      ]);

      const [
        leadsD,
        bookingsD,
        mediaD,
        sectionsD,
        servicesD,
        portfolioD,
        faqsD,
        settingsD,
        blogsD,
        testD,
        clientsD,
      ] = await Promise.all([
        leadsRes.json().catch(() => ({ success: false })),
        bookingsRes.json().catch(() => ({ success: false })),
        mediaRes.json().catch(() => ({ success: false })),
        sectionsRes.json().catch(() => ({ success: false })),
        servicesRes.json().catch(() => ({ success: false })),
        portfolioRes.json().catch(() => ({ success: false })),
        faqsRes.json().catch(() => ({ success: false })),
        settingsRes.json().catch(() => ({ success: false })),
        blogsRes.json().catch(() => ({ success: false })),
        testRes.json().catch(() => ({ success: false })),
        clientsRes.json().catch(() => ({ success: false })),
      ]);

      if (leadsD.success) setLeads(leadsD.data || []);
      if (bookingsD.success) setBookings(bookingsD.data || []);
      if (mediaD.success) setMediaAssets(mediaD.data || []);
      if (sectionsD.success) setSections(sectionsD.data || []);
      if (servicesD.success) setServices(servicesD.data || []);
      if (portfolioD.success) {
        setPortfolioProjects(portfolioD.projects || []);
        setPortfolioCategories(portfolioD.categories || []);
      }
      if (faqsD.success) setFaqs(faqsD.data || []);
      if (settingsD.success) setSettings(settingsD.data || {});
      if (blogsD.success) setBlogs(blogsD.data || []);
      if (testD.success) setTestimonials(testD.data || []);
      if (clientsD.success) setClients(clientsD.data || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setAdminUser(null);
      router.replace('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch {}
    setAdminUser(null);
    router.replace('/admin/login');
  };

  // 1. Lead Status & Notes handler
  const handleUpdateLead = async (leadId: string, status: string, note?: string) => {
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status, note }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads(leads.map((l) => (l.id === leadId ? data.data : l)));
        showNotification('Lead status updated successfully');
      }
    } catch (err) {
      showNotification('Failed to update lead', true);
    }
  };

  // 2. Booking Status handler
  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings(bookings.map((b) => (b.id === bookingId ? data.data : b)));
        showNotification(`Booking status updated to ${status}`);
      }
    } catch (err) {
      showNotification('Failed to update booking status', true);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking request?')) return;
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBookings(bookings.filter((b) => b.id !== bookingId));
        showNotification('Booking deleted successfully');
      }
    } catch (err) {
      showNotification('Failed to delete booking', true);
    }
  };

  // 3. Media Safe Delete with global unlinking
  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm('Are you sure you want to delete this media asset? All CMS references will be cleanly unlinked without errors.')) return;
    try {
      const res = await fetch(`/api/admin/media/${mediaId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMediaAssets(mediaAssets.filter((m) => m.id !== mediaId));
        showNotification('Media asset and all references safely removed');
      }
    } catch (err) {
      showNotification('Failed to delete media asset', true);
    }
  };

  // 4. Media On-Demand Compression
  const handleCompressMedia = async (mediaId: string) => {
    setCompressingMediaId(mediaId);
    try {
      const res = await fetch(`/api/admin/media/${mediaId}/compress`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setMediaAssets(mediaAssets.map((m) => (m.id === mediaId ? data.data : m)));
        showNotification(data.message || 'Image optimized successfully!');
      } else {
        showNotification(data.error || 'Compression failed', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'Error compressing asset', true);
    } finally {
      setCompressingMediaId(null);
    }
  };

  // 5. Scan & Register Existing Images
  const handleScanExistingMedia = async () => {
    setIsScanningMedia(true);
    try {
      const res = await fetch('/api/admin/media/scan', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showNotification(data.message);
        await checkAuthAndLoad();
      } else {
        showNotification(data.error || 'Media scan failed', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'Error scanning media', true);
    } finally {
      setIsScanningMedia(false);
    }
  };

  // 6. Section-Level Isolated Save (Rule #4 & Rule #14: Updating one section never touches another)
  const handleSaveSection = async (page: string, sectionKey: string, sectionData: any) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page,
          sectionKey,
          ...sectionData,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Section "${sectionKey}" saved persistently to database!`);
        checkAuthAndLoad();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      showNotification(err.message || 'Failed to save section', true);
    } finally {
      setIsSaving(false);
    }
  };

  // 7. Save Global Settings
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Global settings updated and persisted!');
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      showNotification(err.message || 'Failed to save settings', true);
    } finally {
      setIsSaving(false);
    }
  };

  // 8. Portfolio CRUD Handlers
  const handleSavePortfolioProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const fd = new FormData(e.currentTarget);

    const payload = {
      title: fd.get('title') as string,
      slug: (fd.get('slug') as string) || (fd.get('title') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      clientName: fd.get('clientName') as string,
      categoryId: fd.get('categoryId') as string,
      coverMediaId: selectedCoverAsset?.id || editingProject?.coverMediaId || null,
      shortDesc: fd.get('shortDesc') as string,
      fullDesc: fd.get('fullDesc') as string,
      projectUrl: fd.get('projectUrl') as string,
      youtubeUrl: (fd.get('youtubeUrl') as string) || null,
      displayOrder: parseInt(fd.get('displayOrder') as string) || 0,
      status: fd.get('status') as string,
    };

    try {
      let res;
      if (editingProject) {
        res = await fetch(`/api/admin/portfolio/${editingProject.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        showNotification(editingProject ? 'Project updated successfully!' : 'New project added!');
        setPortfolioModalOpen(false);
        setEditingProject(null);
        setSelectedCoverAsset(null);
        checkAuthAndLoad();
      } else {
        throw new Error(data.error || 'Failed to save project');
      }
    } catch (err: any) {
      showNotification(err.message, true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePortfolioProject = async (projectId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/portfolio/${projectId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPortfolioProjects(portfolioProjects.filter((p) => p.id !== projectId));
        showNotification('Project deleted successfully');
      }
    } catch (err: any) {
      showNotification('Failed to delete project', true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-agency-dark flex items-center justify-center text-white gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
        <span className="font-heading">Loading Scalemint Admin Engine...</span>
      </div>
    );
  }

  // Filtered lists
  const filteredProjects = portfolioProjects.filter((p) => {
    if (activePortfolioCategory === 'all') return true;
    return p.category?.slug === activePortfolioCategory;
  });

  const filteredBookings = bookings.filter((b) => {
    if (activeBookingStatus === 'ALL') return true;
    return b.status === activeBookingStatus;
  });

  const filteredLeads = leads.filter((l) => {
    if (activeLeadStatus === 'ALL') return true;
    return l.status === activeLeadStatus;
  });

  // Section finders
  const heroSection = sections.find((s) => s.page === 'home' && s.sectionKey === 'hero') || {};
  const whySection = sections.find((s) => s.page === 'home' && s.sectionKey === 'why_choose_us') || {};
  const processSection = sections.find((s) => s.page === 'home' && s.sectionKey === 'process') || {};
  const finalCtaSection = sections.find((s) => s.page === 'home' && s.sectionKey === 'final_cta') || {};
  const aboutMissionSection = sections.find((s) => s.page === 'about' && s.sectionKey === 'mission') || {};

  if (loading) {
    return (
      <div className="min-h-screen bg-agency-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center p-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shadow-glow-purple">
            <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Verifying Admin Session</h3>
            <p className="text-xs text-gray-400 mt-1">Please wait while we verify your credentials...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-agency-dark flex flex-col md:flex-row text-gray-200">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-agency-surface border-r border-agency-border flex flex-col justify-between p-4 shrink-0">
        <div className="space-y-6">
          {/* Brand header */}
          <div className="flex items-center justify-between px-2 pt-2">
            <Link href="/" target="_blank" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow">
                <span className="font-heading font-black text-white text-xs">SM</span>
              </div>
              <div>
                <h2 className="font-heading font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                  Scalemint Admin
                </h2>
                <span className="text-[10px] text-gray-500 block">360° Studio CMS</span>
              </div>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-agency-card transition-colors"
              title="View Public Website"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'blocks', label: 'Dynamic Blocks', icon: Layers },
              { id: 'packages', label: 'Pricing Packages', icon: DollarSign },
              { id: 'calculator', label: 'Calculator Pricing', icon: Calculator },
              { id: 'leads', label: 'Leads & Inquiries', icon: Users, badge: leads.filter((l) => l.status === 'NEW').length },
              { id: 'bookings', label: 'Strategy Bookings', icon: Calendar, badge: bookings.filter((b) => b.status === 'PENDING').length },
              { id: 'services', label: 'Services & Growth Suite', icon: Briefcase, badge: services.length },
              { id: 'portfolio', label: 'Portfolio (Archived)', icon: Sparkles, badge: portfolioProjects.length },
              { id: 'homepage', label: 'Homepage Sections', icon: FileText },
              { id: 'service_cms', label: 'Service Pages CMS', icon: Scale },
              { id: 'about_contact_cms', label: 'About & Contact CMS', icon: Layers },
              { id: 'media', label: 'Central Media Library', icon: ImageIcon, badge: mediaAssets.length },
              { id: 'legal', label: 'Terms & Privacy Policies', icon: Scale },
              { id: 'testimonials', label: 'Testimonials', icon: Star, badge: testimonials.length },
              { id: 'clients', label: 'Client Brand Marquee', icon: ShieldCheck, badge: clients.length },
              { id: 'faqs', label: 'FAQs Manager', icon: HelpCircle, badge: faqs.length },
              { id: 'blogs', label: 'Blog Posts', icon: BookOpen, badge: blogs.length },
              { id: 'settings', label: 'Logo & Settings', icon: Settings },
              { id: 'deployment', label: 'Hostinger & Backup', icon: Server },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabKey)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/20 text-white border border-purple-500/50 shadow-glow-purple/20'
                      : 'text-gray-400 hover:text-white hover:bg-agency-card'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-gray-500'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="pt-4 border-t border-agency-border/60 flex items-center justify-between px-2">
          <div className="truncate">
            <span className="text-xs font-semibold text-white block truncate">
              {adminUser?.name || 'Administrator'}
            </span>
            <span className="text-[10px] text-gray-500 block truncate">
              {adminUser?.email}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-agency-card transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-10 relative">
        {/* Floating Notification Alerts */}
        {saveSuccess && (
          <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-2 shadow-xl animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveSuccess}</span>
          </div>
        )}
        {saveError && (
          <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-medium flex items-center gap-2 shadow-xl animate-fadeIn">
            <AlertCircle className="w-4 h-4" />
            <span>{saveError}</span>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 max-w-6xl">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Welcome back, {adminUser?.name || 'Admin'}
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Real-time synchronized control center for Scalemint 360° Studio content, leads, and media assets.
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="glass-card rounded-2xl p-5 border border-agency-border space-y-1">
                <span className="text-xs text-gray-400 font-medium">New Inquiries</span>
                <p className="font-heading text-3xl font-black text-purple-400">
                  {leads.filter((l) => l.status === 'NEW').length}
                </p>
                <span className="text-[10px] text-gray-500">Requires follow-up</span>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-agency-border space-y-1">
                <span className="text-xs text-gray-400 font-medium">Pending Bookings</span>
                <p className="font-heading text-3xl font-black text-emerald-400">
                  {bookings.filter((b) => b.status === 'PENDING').length}
                </p>
                <span className="text-[10px] text-gray-500">Strategy call requests</span>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-agency-border space-y-1">
                <span className="text-xs text-gray-400 font-medium">Portfolio Projects</span>
                <p className="font-heading text-3xl font-black text-blue-400">
                  {portfolioProjects.length}
                </p>
                <span className="text-[10px] text-gray-500">Across 6 disciplines</span>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-agency-border space-y-1">
                <span className="text-xs text-gray-400 font-medium">Core Services</span>
                <p className="font-heading text-3xl font-black text-indigo-400">
                  {services.length}
                </p>
                <span className="text-[10px] text-gray-500">Active & Published</span>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-agency-border space-y-1">
                <span className="text-xs text-gray-400 font-medium">Media Library</span>
                <p className="font-heading text-3xl font-black text-amber-400">
                  {mediaAssets.length}
                </p>
                <span className="text-[10px] text-gray-500">Optimized WebP assets</span>
              </div>
            </div>

            {/* Inquiries & Bookings Quick Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Inquiries */}
              <div className="glass-card rounded-2xl border border-agency-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>Recent Client Inquiries</span>
                  </h3>
                  <button onClick={() => setActiveTab('leads')} className="text-xs text-purple-400 hover:underline">
                    View All ({leads.length}) →
                  </button>
                </div>

                {leads.length === 0 ? (
                  <div className="text-center py-8 text-xs text-gray-500">No leads captured yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-agency-border text-gray-400">
                          <th className="pb-2 font-semibold">Client</th>
                          <th className="pb-2 font-semibold">Interest</th>
                          <th className="pb-2 font-semibold">Budget</th>
                          <th className="pb-2 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-agency-border/60">
                        {leads.slice(0, 4).map((lead) => (
                          <tr key={lead.id} className="hover:bg-agency-card/50">
                            <td className="py-2.5 font-medium text-white">
                              <div>{lead.name}</div>
                              <div className="text-[10px] text-gray-500">{lead.email}</div>
                            </td>
                            <td className="py-2.5 text-gray-300">{lead.serviceInterest || 'General'}</td>
                            <td className="py-2.5 text-amber-400 font-medium">{lead.budget || '—'}</td>
                            <td className="py-2.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                {lead.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Recent Strategy Bookings */}
              <div className="glass-card rounded-2xl border border-agency-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-sm font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>Strategy Call Bookings</span>
                  </h3>
                  <button onClick={() => setActiveTab('bookings')} className="text-xs text-emerald-400 hover:underline">
                    View All ({bookings.length}) →
                  </button>
                </div>

                {bookings.length === 0 ? (
                  <div className="text-center py-8 text-xs text-gray-500">No meeting bookings scheduled yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-agency-border text-gray-400">
                          <th className="pb-2 font-semibold">Lead</th>
                          <th className="pb-2 font-semibold">Preferred Date</th>
                          <th className="pb-2 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-agency-border/60">
                        {bookings.slice(0, 4).map((b) => (
                          <tr key={b.id} className="hover:bg-agency-card/50">
                            <td className="py-2.5 font-medium text-white">
                              <div>{b.name}</div>
                              <div className="text-[10px] text-gray-500">{b.company || b.email}</div>
                            </td>
                            <td className="py-2.5 text-gray-300">
                              {new Date(b.requestedDate).toLocaleDateString()} ({b.durationMinutes}m)
                            </td>
                            <td className="py-2.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                b.status === 'CONFIRMED'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              }`}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: DYNAMIC BLOCKS */}
        {activeTab === 'blocks' && (
          <DynamicBlockManager showNotification={showNotification} />
        )}

        {/* TAB: PRICING PACKAGES */}
        {activeTab === 'packages' && (
          <PricingPackagesManager services={services} showNotification={showNotification} />
        )}

        {/* TAB: CALCULATOR PRICING */}
        {activeTab === 'calculator' && (
          <CalculatorPricingManager showNotification={showNotification} />
        )}

        {/* TAB: LEGAL & POLICIES */}
        {activeTab === 'legal' && (
          <LegalPagesManager showNotification={showNotification} />
        )}

        {/* TAB 2: LEADS & INQUIRIES */}
        {activeTab === 'leads' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl font-bold text-white">
                  Client Inquiries & CRM
                </h1>
                <p className="text-xs text-gray-400">
                  Full lead attribution including UTM campaign source, budget, and internal follow-up notes.
                </p>
              </div>
              <button
                onClick={checkAuthAndLoad}
                className="px-3.5 py-1.5 rounded-lg bg-agency-card border border-agency-border text-xs text-gray-300 hover:text-white flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Leads</span>
              </button>
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'WON', 'LOST'].map((st) => (
                <button
                  key={st}
                  onClick={() => setActiveLeadStatus(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    activeLeadStatus === st
                      ? 'bg-purple-600 text-white shadow'
                      : 'bg-agency-card border border-agency-border text-gray-400 hover:text-white'
                  }`}
                >
                  {st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            {filteredLeads.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center text-gray-400 space-y-2">
                <Users className="w-8 h-8 text-gray-600 mx-auto" />
                <p className="text-sm font-semibold text-white">No Inquiries In This Category</p>
                <p className="text-xs text-gray-500">Contact submissions from the website will automatically appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLeads.map((lead) => (
                  <div key={lead.id} className="glass-card rounded-2xl p-6 border border-agency-border space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-agency-border/60 pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-heading text-base font-bold text-white">{lead.name}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {lead.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                          <span>{lead.email}</span>
                          {lead.phone && <span>• {lead.phone}</span>}
                          {lead.company && <span>• {lead.company}</span>}
                        </div>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Stage:</span>
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateLead(lead.id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl bg-agency-dark border border-agency-border text-xs text-white"
                        >
                          <option value="NEW">New</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="QUALIFIED">Qualified</option>
                          <option value="PROPOSAL_SENT">Proposal Sent</option>
                          <option value="WON">Won (Client)</option>
                          <option value="LOST">Lost</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-gray-500 font-semibold block">Service Interest</span>
                        <span className="text-gray-300 font-medium">{lead.serviceInterest || 'General Discovery'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-semibold block">Selected Package</span>
                        {lead.packageName ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold text-[11px]">
                            {lead.packageName} ({lead.packagePrice || 'Configured'})
                          </span>
                        ) : (
                          <span className="text-gray-400">Direct Brief</span>
                        )}
                      </div>
                      <div>
                        <span className="text-gray-500 font-semibold block">Target Budget</span>
                        <span className="text-amber-400 font-bold">{lead.budget || 'Custom Scope'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-semibold block">Submission Timestamp</span>
                        <span className="text-gray-400">{new Date(lead.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-agency-dark/80 border border-agency-border/60 text-xs text-gray-300 leading-relaxed">
                      {lead.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: STRATEGY BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl font-bold text-white">
                  Strategy Call Appointments
                </h1>
                <p className="text-xs text-gray-400">
                  Manage discovery consultations, schedule dates, and appointment statuses.
                </p>
              </div>
              <button
                onClick={checkAuthAndLoad}
                className="px-3.5 py-1.5 rounded-lg bg-agency-card border border-agency-border text-xs text-gray-300 hover:text-white flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Bookings</span>
              </button>
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setActiveBookingStatus(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    activeBookingStatus === st
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-agency-card border border-agency-border text-gray-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {filteredBookings.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center text-gray-400 space-y-2">
                <Calendar className="w-8 h-8 text-gray-600 mx-auto" />
                <p className="text-sm font-semibold text-white">No Bookings In This Category</p>
                <p className="text-xs text-gray-500">Meetings booked via the header 'Book a Call' modal will be listed here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((b) => (
                  <div key={b.id} className="glass-card rounded-2xl p-6 border border-agency-border space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-agency-border/60 pb-3">
                      <div>
                        <h3 className="font-heading text-base font-bold text-white">{b.name}</h3>
                        <p className="text-xs text-gray-400">{b.email} • {b.phone || 'No phone'} • {b.company || 'Direct Founder'}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <select
                          value={b.status}
                          onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl bg-agency-dark border border-agency-border text-xs text-white"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDeleteBooking(b.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-agency-card"
                          title="Delete booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-gray-500 font-semibold block">Requested Time</span>
                        <span className="text-purple-300 font-bold">{new Date(b.requestedDate).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-semibold block">Discipline Scope</span>
                        <span className="text-gray-300 font-medium">{b.serviceInterest || '360° Studio Growth'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-semibold block">Duration</span>
                        <span className="text-emerald-400 font-bold">{b.durationMinutes || 30} Minutes</span>
                      </div>
                    </div>

                    {b.notes && (
                      <div className="p-3 rounded-xl bg-agency-dark/70 border border-agency-border/50 text-xs text-gray-300">
                        <span className="text-gray-500 font-bold block mb-1">Client Notes:</span>
                        {b.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PORTFOLIO CMS */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl font-bold text-white">
                  Portfolio & Verified Case Studies CMS
                </h1>
                <p className="text-xs text-gray-400">
                  Manage the 36 projects across Branding (1:1 Logos), Web Design, Cinema (16:9), AI UGC (9:16), Meta Ads, and Google Ads PPC.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  setSelectedCoverAsset(null);
                  setPortfolioModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 transition-all self-start sm:self-auto shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Portfolio Project</span>
              </button>
            </div>

            {/* Discipline Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: 'all', label: 'All Disciplines' },
                { id: 'branding', label: 'Branding Design (1:1 Logos)' },
                { id: 'websites', label: 'Website Engineering' },
                { id: 'video-editing', label: 'Cinematic Video (16:9)' },
                { id: 'ai-ugc', label: 'AI UGC Reels (9:16)' },
                { id: 'digital-marketing', label: 'Meta Ads & Paid Social' },
                { id: 'google-ads', label: 'Google Ads PPC' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActivePortfolioCategory(c.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activePortfolioCategory === c.id
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                      : 'bg-agency-card border border-agency-border text-gray-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const coverUrl = project.coverMedia?.publicUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600';
                return (
                  <div
                    key={project.id}
                    className="glass-card rounded-2xl border border-agency-border overflow-hidden flex flex-col justify-between group hover:border-purple-500/40 transition-all"
                  >
                    <div>
                      {/* Project Image Preview */}
                      <div className="aspect-video w-full bg-agency-dark overflow-hidden relative border-b border-agency-border/60">
                        <img
                          src={coverUrl}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/75 backdrop-blur-md text-purple-300 border border-purple-500/30">
                            {project.category?.name || 'General'}
                          </span>
                        </div>
                        <div className="absolute top-2.5 right-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/75 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                            {project.status}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2">
                        <h3 className="font-heading font-bold text-sm text-white line-clamp-1">
                          {project.title}
                        </h3>
                        {project.clientName && (
                          <p className="text-[11px] font-semibold text-purple-400">
                            Client: {project.clientName}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                          {project.shortDesc || 'Comprehensive studio deliverables engineered for conversion.'}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 bg-agency-dark/70 border-t border-agency-border/60 flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 font-mono">Order: #{project.displayOrder}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject(project);
                            setSelectedCoverAsset(project.coverMedia || null);
                            setPortfolioModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-agency-card hover:bg-purple-600/30 text-purple-300 border border-agency-border text-xs flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePortfolioProject(project.id, project.title)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-agency-card"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add / Edit Project Modal */}
            {portfolioModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-[#0D0D18] border border-agency-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-agency-border pb-3">
                    <h3 className="font-heading font-bold text-base text-white">
                      {editingProject ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setPortfolioModalOpen(false);
                        setEditingProject(null);
                        setSelectedCoverAsset(null);
                      }}
                      className="text-gray-400 hover:text-white text-xs font-semibold"
                    >
                      ✕ Close
                    </button>
                  </div>

                  <form onSubmit={handleSavePortfolioProject} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 font-semibold mb-1">Project Title *</label>
                        <input
                          name="title"
                          required
                          defaultValue={editingProject?.title || ''}
                          placeholder="e.g. ZenFlow Systems Architecture"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-semibold mb-1">Client Name</label>
                        <input
                          name="clientName"
                          defaultValue={editingProject?.clientName || ''}
                          placeholder="e.g. ZenFlow AI Inc."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 font-semibold mb-1">Category / Discipline *</label>
                        <select
                          name="categoryId"
                          defaultValue={editingProject?.categoryId || (portfolioCategories[0]?.id || '')}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                        >
                          {portfolioCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name} ({cat.slug})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-300 font-semibold mb-1">Status</label>
                        <select
                          name="status"
                          defaultValue={editingProject?.status || 'PUBLISHED'}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                        >
                          <option value="PUBLISHED">Published (Visible on Website)</option>
                          <option value="DRAFT">Draft (Hidden)</option>
                        </select>
                      </div>
                    </div>

                    {/* Rule #5 Compliant Image Selector (Select from Media Library ONLY) */}
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">
                        Cover Image (Strictly Select from Central Media Library) *
                      </label>
                      <div className="flex items-center gap-4 p-3 rounded-xl bg-agency-dark border border-agency-border">
                        <div className="w-16 h-16 rounded-lg bg-agency-card overflow-hidden flex items-center justify-center border border-agency-border shrink-0">
                          {selectedCoverAsset?.publicUrl || editingProject?.coverMedia?.publicUrl ? (
                            <img
                              src={selectedCoverAsset?.publicUrl || editingProject?.coverMedia?.publicUrl}
                              alt="Cover"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-white font-medium truncate">
                            {selectedCoverAsset?.originalFilename || editingProject?.coverMedia?.originalFilename || 'No image selected'}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            Select an optimized WebP image from your media library.
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => openMediaPicker((asset) => setSelectedCoverAsset(asset))}
                            className="px-3 py-2 rounded-xl bg-agency-card hover:bg-agency-cardHover text-purple-300 border border-agency-border text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Library</span>
                          </button>
                          <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Direct Upload</span>
                            <input
                              type="file"
                              accept="image/*,.svg,.webp,.png,.jpg,.jpeg,.avif"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const fd = new FormData();
                                fd.append('file', file);
                                fd.append('category', 'portfolio');
                                try {
                                  const res = await fetch('/api/admin/media', { method: 'POST', body: fd });
                                  const data = await res.json();
                                  if (data.success) {
                                    setSelectedCoverAsset(data.data);
                                    showNotification('Image uploaded and selected as cover!');
                                  } else {
                                    showNotification(data.error || 'Upload failed', true);
                                  }
                                } catch (err: any) {
                                  showNotification(err.message || 'Upload error', true);
                                }
                                e.target.value = '';
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* YouTube Video Link Streamer */}
                    <div className="p-3.5 rounded-xl bg-[#0F0B18] border border-purple-500/30 space-y-1.5">
                      <label className="block text-white font-semibold flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-purple-300">
                          <Youtube className="w-3.5 h-3.5 text-red-500" />
                          <span>YouTube Video Link (Direct Stream — No Video File Uploads)</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">Zero Server Storage</span>
                      </label>
                      <input
                        name="youtubeUrl"
                        defaultValue={editingProject?.youtubeUrl || ''}
                        placeholder="Paste YouTube Video or Shorts URL, e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
                        className="w-full px-3.5 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      />
                      <p className="text-[10px] text-gray-400">
                        Pastes directly from YouTube. This video will stream in full HD 4K on the website Cinema Player (16:9) and UGC Reels (9:16) with zero video files stored on your server.
                      </p>
                    </div>

                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Short Description</label>
                      <textarea
                        name="shortDesc"
                        rows={2}
                        defaultValue={editingProject?.shortDesc || ''}
                        placeholder="Brief summary displayed on portfolio grid"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 font-semibold mb-1">Project / Live Link (Optional)</label>
                        <input
                          name="projectUrl"
                          defaultValue={editingProject?.projectUrl || ''}
                          placeholder="https://..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-semibold mb-1">Display Order</label>
                        <input
                          name="displayOrder"
                          type="number"
                          defaultValue={editingProject?.displayOrder ?? 0}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="pt-3 flex justify-end gap-3 border-t border-agency-border">
                      <button
                        type="button"
                        onClick={() => {
                          setPortfolioModalOpen(false);
                          setEditingProject(null);
                          setSelectedCoverAsset(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-white/[0.05] text-gray-300 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 disabled:opacity-50"
                      >
                        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        <span>{editingProject ? 'Save Changes' : 'Create Project'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: CENTRAL MEDIA LIBRARY */}
        {activeTab === 'media' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl font-bold text-white">
                  Central Media System & Asset Engine
                </h1>
                <p className="text-xs text-gray-400">
                  Single source of truth for all website imagery. Safe deletions cleanly unlink across all pages.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* 1-Click Scan Existing Media Assets */}
                <button
                  type="button"
                  disabled={isScanningMedia}
                  onClick={handleScanExistingMedia}
                  className="px-3.5 py-2 rounded-xl bg-agency-card hover:bg-agency-border border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanningMedia ? 'animate-spin' : ''}`} />
                  <span>{isScanningMedia ? 'Scanning...' : 'Scan Existing Project Assets'}</span>
                </button>

                {/* Upload to Library */}
                <label className="cursor-pointer px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload to Library</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml,image/avif"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append('file', file);
                      const res = await fetch('/api/admin/media', {
                        method: 'POST',
                        body: formData,
                      });
                      const data = await res.json();
                      if (data.success) {
                        setMediaAssets([data.data, ...mediaAssets]);
                        showNotification('Image uploaded and WebP-optimized successfully!');
                      } else {
                        showNotification(data.error || 'Upload failed', true);
                      }
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>
            </div>

            {mediaAssets.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center text-gray-400 space-y-4">
                <ImageIcon className="w-8 h-8 text-gray-600 mx-auto" />
                <p className="text-sm font-semibold text-white">Media Library is Currently Empty</p>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Click 'Scan Existing Project Assets' above to automatically register all existing images into the database, or upload your own.
                </p>
                <button
                  onClick={handleScanExistingMedia}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
                >
                  Run One-Click Scan
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {mediaAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="glass-card rounded-2xl border border-agency-border overflow-hidden flex flex-col justify-between group"
                  >
                    <div className="aspect-video w-full bg-agency-dark flex items-center justify-center overflow-hidden relative">
                      <img
                        src={asset.publicUrl}
                        alt={asset.altText || asset.originalFilename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold bg-black/75 text-purple-300 uppercase">
                        {asset.category || 'general'}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <p className="text-xs font-semibold text-white truncate" title={asset.originalFilename}>
                        {asset.originalFilename}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span>
                          {asset.width && asset.height ? `${asset.width}x${asset.height} • ` : ''}
                          {(asset.fileSize / 1024).toFixed(0)} KB
                        </span>
                        <span className="uppercase text-purple-400 font-semibold">{asset.mimeType?.split('/')[1] || 'webp'}</span>
                      </div>

                      {/* Alt text editor */}
                      <input
                        type="text"
                        placeholder="Alt text for SEO..."
                        defaultValue={asset.altText || ''}
                        onBlur={async (e) => {
                          await fetch(`/api/admin/media/${asset.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ altText: e.target.value }),
                          });
                          showNotification('Alt text updated');
                        }}
                        className="w-full px-2.5 py-1 rounded bg-agency-dark border border-agency-border text-[11px] text-gray-300 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="px-4 py-2.5 bg-agency-dark/70 border-t border-agency-border/60 flex items-center justify-between">
                      {/* Compress Button */}
                      <button
                        type="button"
                        disabled={compressingMediaId === asset.id}
                        onClick={() => handleCompressMedia(asset.id)}
                        className="text-[11px] text-indigo-300 hover:text-indigo-200 flex items-center gap-1 font-medium"
                      >
                        <Zap className="w-3 h-3 text-indigo-400" />
                        <span>{compressingMediaId === asset.id ? 'Optimizing...' : 'Compress'}</span>
                      </button>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(asset.publicUrl);
                            showNotification('Public URL copied to clipboard');
                          }}
                          className="text-[11px] text-purple-400 hover:underline"
                        >
                          Copy
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMedia(asset.id)}
                          className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SERVICES & PACKAGES */}
        {activeTab === 'services' && (
          <ServiceManager showNotification={showNotification} />
        )}

        {/* TAB 7: PAGE SECTIONS CMS (Isolated Atomic Updates) */}
        {activeTab === 'homepage' && (
          <HomepageSectionsManager showNotification={showNotification} />
        )}

        {/* TAB 7B: SERVICE DETAIL PAGES CMS (Comparison Matrix, Roadmap, Hero) */}
        {activeTab === 'service_cms' && (
          <ServicePagesCMS showNotification={showNotification} />
        )}

        {/* TAB 7C: ABOUT & CONTACT CMS */}
        {activeTab === 'about_contact_cms' && (
          <AboutContactCMS showNotification={showNotification} />
        )}

        {/* TAB 8: TESTIMONIALS CMS */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6 max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl font-bold text-white">Client Testimonials Management</h1>
                <p className="text-xs text-gray-400">Control the endorsements featured across homepage and service pages. Add photos for maximum credibility.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingTestimonial(null);
                  setTestimonialPhotoAsset(null);
                  setTestimonialModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Testimonial</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="glass-card rounded-2xl p-6 border border-agency-border flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTestimonial(t);
                            setTestimonialPhotoAsset(t.photoMedia || null);
                            setTestimonialModalOpen(true);
                          }}
                          className="text-purple-400 hover:text-purple-300 p-1"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!confirm(`Delete testimonial from ${t.clientName}?`)) return;
                            await fetch(`/api/admin/testimonials?id=${t.id}`, { method: 'DELETE' });
                            setTestimonials(testimonials.filter((item) => item.id !== t.id));
                            showNotification('Testimonial deleted');
                          }}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 italic leading-relaxed line-clamp-3">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-agency-border/60 flex items-center gap-3">
                    {/* Photo avatar */}
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-agency-dark border border-agency-border shrink-0">
                      {t.photoMedia?.publicUrl ? (
                        <img src={t.photoMedia.publicUrl} alt={t.clientName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-purple-600/20 text-purple-300 font-bold text-sm">
                          {t.clientName?.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-xs text-white">{t.clientName}</h4>
                      <p className="text-[11px] text-purple-300 font-medium">{t.clientRole} · {t.companyName}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial Add/Edit Modal */}
            {testimonialModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-[#0D0D18] border border-agency-border rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto">
                  <div className="sticky top-0 bg-[#0D0D18] border-b border-agency-border px-6 py-4 flex items-center justify-between">
                    <h3 className="font-heading font-bold text-base text-white">
                      {editingTestimonial ? 'Edit Testimonial' : 'Add Client Testimonial'}
                    </h3>
                    <button type="button" onClick={() => { setTestimonialModalOpen(false); setEditingTestimonial(null); setTestimonialPhotoAsset(null); }} className="text-gray-400 hover:text-white p-1.5 rounded-lg"><X className="w-4 h-4" /></button>
                  </div>

                  <form
                    onSubmit={async (e: any) => {
                      e.preventDefault();
                      setIsSavingTestimonial(true);
                      const fd = new FormData(e.target);
                      const payload = {
                        clientName: fd.get('clientName'),
                        clientRole: fd.get('clientRole'),
                        companyName: fd.get('companyName'),
                        rating: parseInt(fd.get('rating') as string) || 5,
                        quote: fd.get('quote'),
                        photoMediaId: testimonialPhotoAsset?.id || null,
                        status: 'PUBLISHED',
                      };
                      try {
                        let res;
                        if (editingTestimonial) {
                          res = await fetch('/api/admin/testimonials', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: editingTestimonial.id, ...payload }),
                          });
                        } else {
                          res = await fetch('/api/admin/testimonials', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload),
                          });
                        }
                        const d = await res.json();
                        if (d.success) {
                          setTestimonialModalOpen(false);
                          setEditingTestimonial(null);
                          setTestimonialPhotoAsset(null);
                          checkAuthAndLoad();
                          showNotification(editingTestimonial ? 'Testimonial updated!' : 'Testimonial added!');
                        } else throw new Error(d.error);
                      } catch (err: any) {
                        showNotification(err.message, true);
                      } finally { setIsSavingTestimonial(false); }
                    }}
                    className="p-6 space-y-4 text-xs"
                  >
                    {/* Photo Picker */}
                    <div>
                      <label className="block text-gray-300 font-semibold mb-2">Client Photo</label>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-agency-dark border border-agency-border">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-agency-card border border-agency-border shrink-0 flex items-center justify-center">
                          {testimonialPhotoAsset?.publicUrl
                            ? <img src={testimonialPhotoAsset.publicUrl} alt="Photo" className="w-full h-full object-cover" />
                            : <span className="text-gray-500 text-[10px]">No photo</span>}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium truncate">{testimonialPhotoAsset?.originalFilename || 'No photo selected'}</p>
                          <p className="text-[10px] text-gray-500">Optional — adds credibility to the review card</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button type="button" onClick={() => setTestimonialMediaOpen(true)} className="px-3 py-2 rounded-xl bg-agency-card text-purple-300 border border-agency-border text-xs font-semibold flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5" /><span>Library</span>
                          </button>
                          <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5">
                            <Upload className="w-3.5 h-3.5" /><span>Upload</span>
                            <input type="file" accept="image/*" className="hidden" onChange={async (evt) => {
                              const file = evt.target.files?.[0]; if (!file) return;
                              const fd2 = new FormData(); fd2.append('file', file); fd2.append('category', 'testimonial');
                              const r = await fetch('/api/admin/media', { method: 'POST', body: fd2 });
                              const d2 = await r.json();
                              if (d2.success) { setTestimonialPhotoAsset(d2.data); showNotification('Photo uploaded!'); }
                              else showNotification(d2.error || 'Upload failed', true);
                              evt.target.value = '';
                            }} />
                          </label>
                          {testimonialPhotoAsset && <button type="button" onClick={() => setTestimonialPhotoAsset(null)} className="p-2 rounded-xl text-red-400 border border-agency-border hover:bg-agency-card"><Trash2 className="w-3.5 h-3.5" /></button>}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Client Name *</label>
                      <input name="clientName" required defaultValue={editingTestimonial?.clientName || ''} placeholder="e.g. Marcus Vance" className="w-full px-3.5 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs focus:outline-none focus:border-purple-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-300 font-semibold mb-1">Role</label>
                        <input name="clientRole" defaultValue={editingTestimonial?.clientRole || ''} placeholder="e.g. Managing Partner" className="w-full px-3.5 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs focus:outline-none focus:border-purple-500" />
                      </div>
                      <div>
                        <label className="block text-gray-300 font-semibold mb-1">Company</label>
                        <input name="companyName" defaultValue={editingTestimonial?.companyName || ''} placeholder="e.g. Apex Ventures" className="w-full px-3.5 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs focus:outline-none focus:border-purple-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Quote *</label>
                      <textarea name="quote" rows={3} required defaultValue={editingTestimonial?.quote || ''} className="w-full px-3.5 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs leading-relaxed focus:outline-none focus:border-purple-500" />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Star Rating</label>
                      <select name="rating" defaultValue={editingTestimonial?.rating || 5} className="w-full px-3.5 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs focus:outline-none focus:border-purple-500">
                        <option value={5}>5 Stars ★★★★★</option>
                        <option value={4}>4 Stars ★★★★</option>
                        <option value={3}>3 Stars ★★★</option>
                      </select>
                    </div>
                    <div className="pt-2 flex justify-end gap-2 border-t border-agency-border">
                      <button type="button" onClick={() => { setTestimonialModalOpen(false); setEditingTestimonial(null); setTestimonialPhotoAsset(null); }} className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] text-gray-300 text-xs">Cancel</button>
                      <button type="submit" disabled={isSavingTestimonial} className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50">
                        {isSavingTestimonial ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        <span>{editingTestimonial ? 'Save Changes' : 'Publish Testimonial'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Testimonial Photo Media Modal */}
            <MediaSelectModal
              isOpen={testimonialMediaOpen}
              onClose={() => setTestimonialMediaOpen(false)}
              onSelect={asset => { setTestimonialPhotoAsset(asset); setTestimonialMediaOpen(false); }}
            />
          </div>
        )}

        {/* TAB 9: CLIENT BRANDS */}
        {activeTab === 'clients' && (
          <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading text-2xl font-bold text-white">Client Brands Marquee</h1>
                <p className="text-xs text-gray-400">Manage logos in the infinite scrolling partner marquee. Upload SVG or PNG for best results.</p>
              </div>
              <button
                onClick={() => { setClientLogoAsset(null); setClientModalOpen(true); }}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Partner Brand</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {clients.map((c) => (
                <div key={c.id} className="glass-card rounded-2xl p-4 border border-agency-border flex flex-col gap-3">
                  {/* Logo preview */}
                  <div className="w-full h-16 rounded-xl bg-agency-dark border border-agency-border overflow-hidden flex items-center justify-center">
                    {c.logoMedia?.publicUrl ? (
                      <img src={c.logoMedia.publicUrl} alt={c.name} className="max-h-12 max-w-full object-contain" />
                    ) : (
                      <span className="text-xs font-bold text-gray-500">{c.name}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-white truncate">{c.name}</span>
                    <button
                      onClick={async () => {
                        if (!confirm(`Remove ${c.name}?`)) return;
                        await fetch(`/api/admin/clients?id=${c.id}`, { method: 'DELETE' });
                        setClients(clients.filter((item) => item.id !== c.id));
                        showNotification('Client brand removed');
                      }}
                      className="text-red-400 hover:text-red-300 p-1 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {clientModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-[#0D0D18] border border-agency-border rounded-2xl max-w-md w-full">
                  <div className="border-b border-agency-border px-6 py-4 flex items-center justify-between">
                    <h3 className="font-heading font-bold text-base text-white">Add Partner Brand</h3>
                    <button onClick={() => { setClientModalOpen(false); setClientLogoAsset(null); }} className="text-gray-400 hover:text-white p-1.5 rounded-lg"><X className="w-4 h-4" /></button>
                  </div>
                  <form
                    onSubmit={async (e: any) => {
                      e.preventDefault();
                      const fd = new FormData(e.target);
                      const res = await fetch('/api/admin/clients', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: fd.get('name'), websiteUrl: fd.get('websiteUrl'), logoMediaId: clientLogoAsset?.id || null }),
                      });
                      const d = await res.json();
                      if (d.success) { setClientModalOpen(false); setClientLogoAsset(null); checkAuthAndLoad(); showNotification('Client added'); }
                      else showNotification(d.error || 'Failed to add', true);
                    }}
                    className="p-6 space-y-4 text-xs"
                  >
                    {/* Logo Picker */}
                    <div>
                      <label className="block text-gray-300 font-semibold mb-2">Brand Logo</label>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-agency-dark border border-agency-border">
                        <div className="w-20 h-14 rounded-lg bg-agency-card border border-agency-border overflow-hidden flex items-center justify-center shrink-0">
                          {clientLogoAsset?.publicUrl
                            ? <img src={clientLogoAsset.publicUrl} alt="Logo" className="max-h-12 max-w-full object-contain" />
                            : <ImageIcon className="w-6 h-6 text-gray-600" />}
                        </div>
                        <div className="flex-1"><p className="text-white font-medium truncate">{clientLogoAsset?.originalFilename || 'No logo selected'}</p></div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button type="button" onClick={() => setClientLogoMediaOpen(true)} className="px-3 py-2 rounded-xl bg-agency-card text-purple-300 border border-agency-border text-xs font-semibold flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5" /><span>Library</span>
                          </button>
                          <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5">
                            <Upload className="w-3.5 h-3.5" /><span>Upload</span>
                            <input type="file" accept="image/*,.svg" className="hidden" onChange={async (evt) => {
                              const file = evt.target.files?.[0]; if (!file) return;
                              const fd2 = new FormData(); fd2.append('file', file); fd2.append('category', 'client-logo');
                              const r = await fetch('/api/admin/media', { method: 'POST', body: fd2 });
                              const d2 = await r.json();
                              if (d2.success) { setClientLogoAsset(d2.data); showNotification('Logo uploaded!'); }
                              else showNotification(d2.error || 'Upload failed', true);
                              evt.target.value = '';
                            }} />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Brand Name *</label>
                      <input name="name" required placeholder="e.g. Apex Ventures" className="w-full px-3.5 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs focus:outline-none focus:border-purple-500" />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-1">Website URL</label>
                      <input name="websiteUrl" placeholder="https://..." className="w-full px-3.5 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs focus:outline-none focus:border-purple-500" />
                    </div>
                    <div className="pt-2 flex justify-end gap-2 border-t border-agency-border">
                      <button type="button" onClick={() => { setClientModalOpen(false); setClientLogoAsset(null); }} className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] text-gray-300">Cancel</button>
                      <button type="submit" className="px-4 py-1.5 rounded-xl bg-purple-600 text-white font-semibold text-xs">Add Brand</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Logo Media Modal */}
            <MediaSelectModal
              isOpen={clientLogoMediaOpen}
              onClose={() => setClientLogoMediaOpen(false)}
              onSelect={asset => { setClientLogoAsset(asset); setClientLogoMediaOpen(false); }}
            />
          </div>
        )}

        {/* TAB 10: FAQS MANAGER */}
        {activeTab === 'faqs' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading text-2xl font-bold text-white">Frequently Asked Questions (19 Items)</h1>
                <p className="text-xs text-gray-400">Address turnaround, pricing, revisions, and ownership.</p>
              </div>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="glass-card rounded-2xl p-5 border border-agency-border space-y-3">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      defaultValue={faq.question}
                      onBlur={async (e) => {
                        await fetch('/api/admin/faqs', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id: faq.id, question: e.target.value }),
                        });
                        showNotification('FAQ Question updated');
                      }}
                      className="w-full font-heading font-bold text-sm text-white bg-transparent border-b border-transparent hover:border-agency-border focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      onClick={async () => {
                        if (!confirm('Delete this FAQ?')) return;
                        await fetch(`/api/admin/faqs?id=${faq.id}`, { method: 'DELETE' });
                        setFaqs(faqs.filter((f) => f.id !== faq.id));
                        showNotification('FAQ deleted');
                      }}
                      className="text-red-400 hover:text-red-300 p-1 ml-3"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    defaultValue={faq.answer}
                    onBlur={async (e) => {
                      await fetch('/api/admin/faqs', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: faq.id, answer: e.target.value }),
                      });
                      showNotification('FAQ Answer updated');
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-gray-300 focus:outline-none focus:border-purple-500 leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 11: BLOG POSTS (Fully Customizable Multi-Block Editor) */}
        {activeTab === 'blogs' && (
          <BlogPostManager showNotification={showNotification} />
        )}

        {/* TAB 12: SETTINGS & BRAND IDENTITY */}
        {activeTab === 'settings' && (
          <LogoFaviconSettings
            settings={settings}
            setSettings={setSettings}
            showNotification={showNotification}
          />
        )}

        {/* TAB 13: HOSTINGER DEPLOYMENT & PERSISTENCE */}
        {activeTab === 'deployment' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h1 className="font-heading text-2xl font-bold text-white">
                Hostinger Deployment & Data Persistence Architecture
              </h1>
              <p className="text-xs text-gray-400">
                Non-Negotiable Architecture Guarantee: Code updates, rebuilds, and deployments will NEVER wipe out your saved CMS content or uploaded media.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-agency-border space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Data Persistence Guaranteed</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  All image uploads write to persistent storage in <code className="text-purple-300">public/uploads/</code>, and all CMS records reside in the SQLite database (<code className="text-purple-300">prisma/dev.db</code>).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-agency-dark/90 border border-agency-border space-y-3">
                <span className="text-xs font-bold text-white block">Hostinger VPS / Cloud Setup Guide:</span>
                <ol className="list-decimal list-inside space-y-2 text-xs text-gray-300 leading-relaxed">
                  <li>
                    <strong>Node.js Runtime:</strong> Ensure Node.js 18.x, 20.x, or 22.x is active on your Hostinger panel.
                  </li>
                  <li>
                    <strong>Build Command:</strong> Run <code className="text-purple-300">npm run build</code> (executes <code className="text-purple-300">prisma generate && next build</code>).
                  </li>
                  <li>
                    <strong>Process Manager:</strong> Launch via PM2 using <code className="text-purple-300">pm2 start ecosystem.config.js</code> for 24/7 uptime with zero downtime restarts.
                  </li>
                  <li>
                    <strong>Backup Script:</strong> Run <code className="text-purple-300">node scripts/backup-db.js</code> before any major system update.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Media Selection Modal (Rule #5: All image fields select from Media Library) */}
      <MediaSelectModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelect={(asset) => {
          if (mediaTargetCallback) {
            mediaTargetCallback(asset);
          }
        }}
      />
    </div>
  );
}
