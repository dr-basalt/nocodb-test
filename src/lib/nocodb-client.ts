import { NoCodeDBProject, NoCodeDBTable, NoCodeDBResponse, Feature, Receipt } from '@/types/nocodb';

const NOCODB_BASE_URL = 'https://nocodb-iwgg808ggoko0g8co8scscs4.dr.hosting.infra.ori3com.cloud';
const NOCODB_TOKEN = 'bV8ZHVaG-JuN91bDU5PQ4b_YFu3e0urpkDlfw583';
const PROJECT_ID = 'p0g0j5lfmkh77tl';

// Table IDs discovered from API
const FEATURES_TABLE_ID = 'me16bd61t1g5zyf';
const RECEIPT_LOG_TABLE_ID = 'mx5c3fn75siin1b';

class NoCodeDBClient {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string = NOCODB_BASE_URL, token: string = NOCODB_TOKEN) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'xc-token': this.token,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`NoCodeDB API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Project operations
  async getProjects(): Promise<{ list: NoCodeDBProject[] }> {
    return this.request('/api/v1/db/meta/projects');
  }

  async getTables(projectId: string = PROJECT_ID): Promise<{ list: NoCodeDBTable[] }> {
    return this.request(`/api/v1/db/meta/projects/${projectId}/tables`);
  }

  // Features Collection (rebranded)
  async getFeatures(params?: { limit?: number; offset?: number }): Promise<NoCodeDBResponse<Feature>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request(`/api/v2/tables/${FEATURES_TABLE_ID}/records${query}`);
  }

  async createFeature(data: Partial<Feature>): Promise<Feature> {
    return this.request(`/api/v2/tables/${FEATURES_TABLE_ID}/records`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFeature(id: number, data: Partial<Feature>): Promise<Feature> {
    return this.request(`/api/v2/tables/${FEATURES_TABLE_ID}/records/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteFeature(id: number): Promise<void> {
    return this.request(`/api/v2/tables/${FEATURES_TABLE_ID}/records/${id}`, {
      method: 'DELETE',
    });
  }

  // Receipt Collection (rebranded)
  async getReceipts(params?: { limit?: number; offset?: number }): Promise<NoCodeDBResponse<Receipt>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request(`/api/v2/tables/${RECEIPT_LOG_TABLE_ID}/records${query}`);
  }

  async createReceipt(data: Partial<Receipt>): Promise<Receipt> {
    return this.request(`/api/v2/tables/${RECEIPT_LOG_TABLE_ID}/records`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReceipt(id: number, data: Partial<Receipt>): Promise<Receipt> {
    return this.request(`/api/v2/tables/${RECEIPT_LOG_TABLE_ID}/records/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteReceipt(id: number): Promise<void> {
    return this.request(`/api/v2/tables/${RECEIPT_LOG_TABLE_ID}/records/${id}`, {
      method: 'DELETE',
    });
  }

  // Generic table operations
  async getTableRecords<T>(tableId: string, params?: { limit?: number; offset?: number }): Promise<NoCodeDBResponse<T>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request(`/api/v2/tables/${tableId}/records${query}`);
  }
}

export const nocodbClient = new NoCodeDBClient();
export default NoCodeDBClient;