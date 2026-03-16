declare global {
  interface KVNamespace {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
    list(): Promise<{ keys: { name: string }[] }>;
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
}

export {};
