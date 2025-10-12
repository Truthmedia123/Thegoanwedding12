import { 
  vendors, 
  reviews, 
  categories, 
  blogPosts, 
  businessSubmissions, 
  contacts,
  weddings,
  type Vendor, 
  type InsertVendor,
  type Review,
  type InsertReview,
  type Category,
  type InsertCategory,
  type BlogPost,
  type InsertBlogPost,
  type BusinessSubmission,
  type InsertBusinessSubmission,
  type Contact,
  type InsertContact,
  type Wedding,
  type InsertWedding,
} from "@shared/schema";
import { db } from "./db";
import { eq, like, and, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Vendors
  getVendors(filters: { category?: string; location?: string; search?: string }): Promise<Vendor[]>;
  getVendor(id: number): Promise<Vendor | undefined>;
  getFeaturedVendors(): Promise<Vendor[]>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;

  // Reviews
  getVendorReviews(vendorId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Blog Posts
  getBlogPosts(published?: boolean): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;

  // Business Submissions
  createBusinessSubmission(submission: InsertBusinessSubmission): Promise<BusinessSubmission>;

  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;

  // Weddings
  getWeddings(): Promise<Wedding[]>;
  getWedding(slug: string): Promise<Wedding | undefined>;
  createWedding(wedding: InsertWedding): Promise<Wedding>;

}

export class DatabaseStorage implements IStorage {
  async getVendors(filters: { category?: string; location?: string; search?: string }): Promise<Vendor[]> {
    let query = db.select().from(vendors);
    
    const conditions: any[] = [];
    
    if (filters.category && filters.category !== 'all') {
      conditions.push(eq(vendors.category, filters.category));
    }
    
    if (filters.location) {
      conditions.push(like(vendors.location, `%${filters.location}%`));
    }
    
    if (filters.search) {
      conditions.push(
        sql`(${vendors.name} ILIKE ${`%${filters.search}%`} OR ${vendors.description} ILIKE ${`%${filters.search}%`})`
      );
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return query.orderBy(desc(vendors.featured), desc(vendors.rating));
  }

  async getVendor(id: number): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
    return vendor || undefined;
  }

  async getFeaturedVendors(): Promise<Vendor[]> {
    return db.select().from(vendors)
      .where(eq(vendors.featured, true))
      .orderBy(desc(vendors.rating))
      .limit(6);
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const [newVendor] = await db
      .insert(vendors)
      .values(vendor)
      .returning();
    return newVendor;
  }

  async getVendorReviews(vendorId: number): Promise<Review[]> {
    return db.select().from(reviews)
      .where(eq(reviews.vendorId, vendorId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values(review)
      .returning();
    
    // Update vendor rating and review count
    const vendorReviews = await this.getVendorReviews(review.vendorId);
    const avgRating = vendorReviews.reduce((sum, r) => sum + r.rating, 0) / vendorReviews.length;
    
    await db.update(vendors)
      .set({ 
        rating: avgRating.toFixed(2),
        reviewCount: vendorReviews.length 
      })
      .where(eq(vendors.id, review.vendorId));
    
    return newReview;
  }

  async getCategories(): Promise<Category[]> {
    return db.select().from(categories).orderBy(categories.name);
  }

  async getCategory(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async getBlogPosts(published?: boolean): Promise<BlogPost[]> {
    let query = db.select().from(blogPosts);
    
    if (published !== undefined) {
      query = query.where(eq(blogPosts.published, published));
    }
    
    return query.orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db
      .insert(blogPosts)
      .values(post)
      .returning();
    return newPost;
  }

  async createBusinessSubmission(submission: InsertBusinessSubmission): Promise<BusinessSubmission> {
    const [newSubmission] = await db
      .insert(businessSubmissions)
      .values(submission)
      .returning();
    return newSubmission;
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db
      .insert(contacts)
      .values(contact)
      .returning();
    return newContact;
  }

  async getWeddings(): Promise<Wedding[]> {
    return await db.select().from(weddings).where(eq(weddings.isPublic, true)).orderBy(desc(weddings.weddingDate));
  }

  async getWedding(slug: string): Promise<Wedding | undefined> {
    const [wedding] = await db.select().from(weddings).where(eq(weddings.slug, slug));
    return wedding || undefined;
  }

  async createWedding(wedding: InsertWedding): Promise<Wedding> {
    const [newWedding] = await db
      .insert(weddings)
      .values(wedding)
      .returning();
    return newWedding;
  }

}

class InMemoryStorage implements IStorage {
  private _vendors: Vendor[] = [];
  private _reviews: Review[] = [];
  private _categories: Category[] = [];
  private _blogPosts: BlogPost[] = [];
  private _businessSubmissions: BusinessSubmission[] = [];
  private _contacts: Contact[] = [];
  private _weddings: Wedding[] = [];
  private _ids = { vendor: 1, review: 1, category: 1, post: 1, submission: 1, contact: 1, wedding: 1 };

  constructor() {
    // Seed minimal demo data
    this._categories = [
      { id: this._ids.category++, name: "Photography", slug: "photography", description: "", icon: "camera", color: "#f59e0b", vendorCount: 1 },
      { id: this._ids.category++, name: "Catering", slug: "catering", description: "", icon: "utensils", color: "#10b981", vendorCount: 1 },
    ];

    this._vendors = [
      { id: this._ids.vendor++, name: "Golden Lens Studio", category: "photography", description: "Wedding photography and videography.", phone: "000-000-0000", email: "golden@example.com", whatsapp: "", location: "City", address: "", website: "", instagram: "", youtube: "", facebook: "", profileImage: "", coverImage: "", gallery: [], services: ["Photography", "Videography"], priceRange: "$$$", featured: true, verified: true, rating: "4.80" as any, reviewCount: 1, createdAt: new Date() as any },
      { id: this._ids.vendor++, name: "Tasty Bites Catering", category: "catering", description: "Delicious menus for your big day.", phone: "000-000-0001", email: "tasty@example.com", whatsapp: "", location: "City", address: "", website: "", instagram: "", youtube: "", facebook: "", profileImage: "", coverImage: "", gallery: [], services: ["Buffet", "Plated"], priceRange: "$$", featured: false, verified: false, rating: "4.50" as any, reviewCount: 0, createdAt: new Date() as any },
    ];

    this._reviews = [
      { id: this._ids.review++, vendorId: 1, customerName: "Alice", customerEmail: "alice@example.com", rating: 5, comment: "Amazing!", images: [], createdAt: new Date() as any },
    ];

    this._blogPosts = [
      { id: this._ids.post++, title: "Welcome to the Wedding Blog", slug: "welcome", excerpt: "First post", content: "Hello world", featuredImage: "", category: "tips", tags: ["intro"], published: true, createdAt: new Date() as any },
    ];

    this._weddings = [
      { id: this._ids.wedding++, brideName: "Jane", groomName: "John", weddingDate: new Date() as any, venue: "City Hall", venueAddress: "123 Main St", ceremonyTime: "2:00 PM", receptionTime: "6:00 PM", coverImage: "", galleryImages: [], story: "Our story", slug: "jane-john", maxGuests: 100, isPublic: true, contactEmail: "contact@example.com", contactPhone: "", createdAt: new Date() as any },
    ];
  }

  async getVendors(filters: { category?: string; location?: string; search?: string }): Promise<Vendor[]> {
    let list = [...this._vendors];
    if (filters.category && filters.category !== "all") {
      list = list.filter(v => v.category.toLowerCase() === filters.category!.toLowerCase());
    }
    if (filters.location) {
      list = list.filter(v => v.location.toLowerCase().includes(filters.location!.toLowerCase()));
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(v => v.name.toLowerCase().includes(s) || v.description.toLowerCase().includes(s));
    }
    return list.sort((a, b) => (b.featured === a.featured ? parseFloat(String(b.rating)) - parseFloat(String(a.rating)) : (b.featured?1:0) - (a.featured?1:0)));
  }

  async getVendor(id: number): Promise<Vendor | undefined> { return this._vendors.find(v => v.id === id); }
  async getFeaturedVendors(): Promise<Vendor[]> { return this._vendors.filter(v => v.featured).sort((a,b)=>parseFloat(String(b.rating))-parseFloat(String(a.rating))).slice(0,6); }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const v: Vendor = { id: this._ids.vendor++, reviewCount: 0, rating: "0" as any, createdAt: new Date() as any, ...vendor } as any;
    this._vendors.push(v);
    return v;
  }

  async getVendorReviews(vendorId: number): Promise<Review[]> { return this._reviews.filter(r => r.vendorId === vendorId).sort((a,b)=>new Date(b.createdAt as any).getTime()-new Date(a.createdAt as any).getTime()); }

  async createReview(review: InsertReview): Promise<Review> {
    const r: Review = { id: this._ids.review++, createdAt: new Date() as any, ...review } as any;
    this._reviews.push(r);
    const vendorReviews = this._reviews.filter(x => x.vendorId === review.vendorId);
    const avg = vendorReviews.reduce((s, x) => s + x.rating, 0) / vendorReviews.length;
    const vendor = this._vendors.find(v => v.id === review.vendorId);
    if (vendor) { vendor.rating = avg.toFixed(2) as any; vendor.reviewCount = vendorReviews.length; }
    return r;
  }

  async getCategories(): Promise<Category[]> { return [...this._categories].sort((a,b)=>a.name.localeCompare(b.name)); }
  async getCategory(slug: string): Promise<Category | undefined> { return this._categories.find(c => c.slug === slug); }
  async createCategory(category: InsertCategory): Promise<Category> { const c: Category = { id: this._ids.category++, vendorCount: 0, ...category } as any; this._categories.push(c); return c; }

  async getBlogPosts(published?: boolean): Promise<BlogPost[]> { let list = [...this._blogPosts]; if (published !== undefined) list = list.filter(p => p.published === published); return list.sort((a,b)=>new Date(b.createdAt as any).getTime()-new Date(a.createdAt as any).getTime()); }
  async getBlogPost(slug: string): Promise<BlogPost | undefined> { return this._blogPosts.find(p => p.slug === slug); }
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> { const p: BlogPost = { id: this._ids.post++, createdAt: new Date() as any, ...post } as any; this._blogPosts.push(p); return p; }

  async createBusinessSubmission(submission: InsertBusinessSubmission): Promise<BusinessSubmission> { const s: BusinessSubmission = { id: this._ids.submission++, status: "pending", createdAt: new Date() as any, ...submission } as any; this._businessSubmissions.push(s); return s; }
  async createContact(contact: InsertContact): Promise<Contact> { const c: Contact = { id: this._ids.contact++, createdAt: new Date() as any, ...contact } as any; this._contacts.push(c); return c; }

  async getWeddings(): Promise<Wedding[]> { return this._weddings.filter(w=>w.isPublic).sort((a,b)=>new Date(b.weddingDate as any).getTime()-new Date(a.weddingDate as any).getTime()); }
  async getWedding(slug: string): Promise<Wedding | undefined> { return this._weddings.find(w => w.slug === slug); }
  async createWedding(wedding: InsertWedding): Promise<Wedding> { const w: Wedding = { id: this._ids.wedding++, createdAt: new Date() as any, ...wedding } as any; this._weddings.push(w); return w; }

}

export const storage: IStorage = process.env.DATABASE_URL ? new DatabaseStorage() : new InMemoryStorage();
