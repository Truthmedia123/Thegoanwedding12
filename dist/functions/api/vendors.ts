interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  list(): Promise<{ keys: { name: string }[] }>;
}

interface Env {
  VENDORS_KV: KVNamespace;
}

interface PagesFunction<Env = any> {
  (context: {
    request: Request;
    env: Env;
    params: Record<string, string>;
    waitUntil: (promise: Promise<any>) => void;
    next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
    data: Record<string, any>;
  }): Response | Promise<Response>;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { searchParams } = new URL(context.request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const location = searchParams.get('location');

    // Get all vendors from KV storage
    const vendorsData = await context.env.VENDORS_KV.get('vendors');
    let vendors = vendorsData ? JSON.parse(vendorsData) : [];

    // Apply filters
    if (category && category !== 'all') {
      vendors = vendors.filter((v: any) => 
        v.category?.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      vendors = vendors.filter((v: any) => 
        v.name?.toLowerCase().includes(searchLower) ||
        v.category?.toLowerCase().includes(searchLower) ||
        v.location?.toLowerCase().includes(searchLower)
      );
    }
    
    if (location && location !== 'all') {
      vendors = vendors.filter((v: any) => 
        v.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    return new Response(JSON.stringify(vendors), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch vendors' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json();
    
    // Get existing vendors
    const vendorsData = await context.env.VENDORS_KV.get('vendors');
    const vendors = vendorsData ? JSON.parse(vendorsData) : [];
    
    // Add new vendor with ID
    const newVendor = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    vendors.push(newVendor);
    
    // Save back to KV
    await context.env.VENDORS_KV.put('vendors', JSON.stringify(vendors));
    
    return new Response(JSON.stringify(newVendor), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error creating vendor:', error);
    return new Response(JSON.stringify({ error: 'Failed to create vendor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};
