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

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { vendors: vendorsData } = await context.request.json();
    
    // Get existing vendors
    const existingData = await context.env.VENDORS_KV.get('vendors');
    const existingVendors: any[] = existingData ? JSON.parse(existingData) : [];
    
    // Process each vendor
    const importedVendors: any[] = [];
    for (const vendorData of vendorsData) {
      // Parse priceRange if it's a string
      let priceRange = vendorData.priceRange;
      if (typeof priceRange === 'string' && priceRange.startsWith('[') && priceRange.endsWith(']')) {
        try {
          priceRange = JSON.parse(priceRange);
        } catch (e) {
          // If parsing fails, keep as is
        }
      }
      
      // Convert isVerified to boolean if it's a string
      let isVerified = vendorData.isVerified;
      if (typeof isVerified === 'string') {
        isVerified = isVerified.toLowerCase() === 'true';
      }
      
      const processedVendor = {
        ...vendorData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        priceRange: Array.isArray(priceRange) ? priceRange : [0, 0],
        isVerified: Boolean(isVerified),
        createdAt: new Date().toISOString(),
      };
      
      importedVendors.push(processedVendor);
    }
    
    // Add to existing vendors
    const allVendors = [...existingVendors, ...importedVendors];
    
    // Save back to KV
    await context.env.VENDORS_KV.put('vendors', JSON.stringify(allVendors));
    
    return new Response(JSON.stringify({ 
      message: "Vendors imported successfully", 
      imported: importedVendors.length,
      vendors: importedVendors
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error importing vendors:', error);
    return new Response(JSON.stringify({ 
      message: "Failed to import vendors", 
      error: error.message 
    }), {
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
