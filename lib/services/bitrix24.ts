import { env } from '@/config/env';
import { Order, QuoteRequest } from '@/lib/types/order';
import { formatOrderDetails } from '@/lib/utils/formatters';

const BITRIX_SOURCE_WEB = 'WEB';

/** Normalize phone for Bitrix24 search (digits only, optional + prefix) */
function normalizePhone(phone: string): string {
  return (phone || '').replace(/\D/g, '').trim();
}

export interface Bitrix24Lead {
  TITLE: string;
  NAME: string;
  LAST_NAME?: string;
  COMPANY_TITLE?: string;
  EMAIL?: Array<{ VALUE: string; VALUE_TYPE: string }>;
  PHONE?: Array<{ VALUE: string; VALUE_TYPE: string }>;
  ADDRESS?: string;
  ADDRESS_CITY?: string;
  ADDRESS_POSTAL_CODE?: string;
  COMMENTS?: string;
  SOURCE_ID: string;
  SOURCE_DESCRIPTION?: string;
  ASSIGNED_BY_ID?: string;
  CONTACT_ID?: string;
  COMPANY_ID?: string;
  OPPORTUNITY?: number; // Сума замовлення (для поля "Сумма і валюта")
  CURRENCY_ID?: string; // Валюта (GBP, USD, EUR тощо)
  UF_CRM_PRODUCT_LIST?: string;
  UF_CRM_ORDER_WEIGHT?: string;
  UF_CRM_ORDER_TOTAL?: string;
}

export interface Bitrix24Response {
  result?: string | number;
  error?: string;
  error_description?: string;
}

/** Base URL for webhook (e.g. https://b24-xxx.bitrix24.ua/rest/5/xxxxx) — no trailing slash */
function getWebhookBase(): string {
  const url = (env.BITRIX24_WEBHOOK_URL || '').replace(/\/+$/, '');
  if (!url) return '';
  return url;
}

/**
 * Get currency list from Bitrix24 to find correct currency ID for GBP
 * Usage: const currencies = await getCurrencies(); console.log(currencies);
 */
export async function getCurrencies(): Promise<Bitrix24Response> {
  return requestToCRM('crm.currency.list', {});
}

/**
 * Call Bitrix24 REST method (as in your PHP script).
 * Example: requestToCRM('crm.lead.add', { fields: { TITLE: '...', NAME: '...' } })
 */
export async function requestToCRM(
  method: string,
  data: Record<string, unknown>
): Promise<Bitrix24Response> {
  const base = getWebhookBase();
  if (!base) {
    console.error('BITRIX24_WEBHOOK_URL is not configured');
    throw new Error('Bitrix24 webhook URL is not configured');
  }

  const url = `${base}/${method}.json`;
  const body = JSON.stringify(data);

  let response: Response;
  try {
    console.log(`[Bitrix24] Calling: ${method} at ${url.replace(/\/\d+\/[^/]+$/, '/***/***')}`); // Log without exposing webhook code
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const code = err instanceof Error ? (err as NodeJS.ErrnoException).code : undefined;
    
    let hint = '';
    if (code === 'ENOTFOUND' || msg.includes('ENOTFOUND')) {
      hint = ' Host not found (DNS) — перевір чи правильний домен у NEXT_PUBLIC_BITRIX24_WEBHOOK_URL. Спробуй відкрити портал у браузері з того ж комп\'ютера.';
    } else if (msg.includes('timeout') || code === 'ETIMEDOUT') {
      hint = ' Timeout — Bitrix24 не відповідає протягом 10 секунд. Перевір доступність порталу або мережу.';
    } else if (msg.includes('ECONNREFUSED') || code === 'ECONNREFUSED') {
      hint = ' Connection refused — портал недоступний або блокує запити. Перевір URL та налаштування вебхука.';
    } else if (msg.includes('fetch failed')) {
      hint = ' Fetch failed — можливі причини: неправильний URL, SSL помилка, мережа блокує, або портал недоступний. Перевір URL у .env та спробуй відкрити портал у браузері.';
    }
    
    console.error(`[Bitrix24] Request failed: ${msg}${hint ? `\n${hint}` : ''}`);
    throw new Error(`Bitrix24 unreachable: ${msg}${hint}`);
  }

  if (!response.ok) {
    let errorDetails = '';
    try {
      const errorBody = (await response.json()) as Bitrix24Response;
      errorDetails = errorBody.error_description || errorBody.error || '';
      console.error(`[Bitrix24] Error ${response.status}:`, errorDetails);
      console.error(`[Bitrix24] Request body (sanitized):`, JSON.stringify(data, null, 2).replace(/uj4mrsn8a8li5d4o/g, '***'));
    } catch {
      const text = await response.text();
      errorDetails = text || response.statusText;
      console.error(`[Bitrix24] Error ${response.status} response:`, text.substring(0, 500));
    }
    throw new Error(`Bitrix24 API error: ${response.status} ${response.statusText}${errorDetails ? ` - ${errorDetails}` : ''}`);
  }

  const result = (await response.json()) as Bitrix24Response;
  return result;
}

/**
 * Search CRM for contact by phone. Returns first match or null.
 */
export async function findContactByPhone(phone: string): Promise<{ ID: string; ASSIGNED_BY_ID: string } | null> {
  const normalized = normalizePhone(phone);
  if (!normalized) return null;
  try {
    const res = await requestToCRM('crm.contact.list', {
      filter: { PHONE: normalized },
    });
    const list = (res as { result?: Array<{ ID: string; ASSIGNED_BY_ID: string }> }).result;
    if (Array.isArray(list) && list.length > 0) {
      return { ID: list[0].ID, ASSIGNED_BY_ID: list[0].ASSIGNED_BY_ID };
    }
  } catch {
    // requestToCRM already logged or will be logged by createLead
    return null;
  }
  return null;
}

/**
 * Search CRM for contact by email. Returns first match or null.
 */
export async function findContactByEmail(email: string): Promise<{ ID: string; ASSIGNED_BY_ID: string } | null> {
  if (!email || !email.includes('@')) return null;
  try {
    const res = await requestToCRM('crm.contact.list', {
      filter: { EMAIL: email },
    });
    const list = (res as { result?: Array<{ ID: string; ASSIGNED_BY_ID: string }> }).result;
    if (Array.isArray(list) && list.length > 0) {
      return { ID: list[0].ID, ASSIGNED_BY_ID: list[0].ASSIGNED_BY_ID };
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Search CRM for company by phone. Returns first match or null.
 */
export async function findCompanyByPhone(phone: string): Promise<{ ID: string; ASSIGNED_BY_ID: string } | null> {
  const normalized = normalizePhone(phone);
  if (!normalized) return null;
  try {
    const res = await requestToCRM('crm.company.list', {
      filter: { PHONE: normalized },
    });
    const list = (res as { result?: Array<{ ID: string; ASSIGNED_BY_ID: string }> }).result;
    if (Array.isArray(list) && list.length > 0) {
      return { ID: list[0].ID, ASSIGNED_BY_ID: list[0].ASSIGNED_BY_ID };
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Search CRM for company by email. Returns first match or null.
 */
export async function findCompanyByEmail(email: string): Promise<{ ID: string; ASSIGNED_BY_ID: string } | null> {
  if (!email || !email.includes('@')) return null;
  try {
    const res = await requestToCRM('crm.company.list', {
      filter: { EMAIL: email },
    });
    const list = (res as { result?: Array<{ ID: string; ASSIGNED_BY_ID: string }> }).result;
    if (Array.isArray(list) && list.length > 0) {
      return { ID: list[0].ID, ASSIGNED_BY_ID: list[0].ASSIGNED_BY_ID };
    }
  } catch {
    return null;
  }
  return null;
}

const defaultAssignedById = (): string | undefined => {
  const id = env.BITRIX24_USER_ID || '';
  return id ? String(id) : undefined;
};

/**
 * Create a lead in Bitrix24. Optionally links to existing contact/company by phone or email.
 * Logic aligned with your PHP script: contact by phone → CONTACT_ID; company by phone → COMPANY_ID; else new lead.
 */
export async function createLead(data: Bitrix24Lead): Promise<Bitrix24Response> {
  const base = getWebhookBase();
  if (!base) {
    console.error('BITRIX24_WEBHOOK_URL is not configured');
    throw new Error('Bitrix24 webhook URL is not configured');
  }

  const phone = data.PHONE?.[0]?.VALUE;
  const email = data.EMAIL?.[0]?.VALUE;

  let contactId: string | undefined;
  let companyId: string | undefined;
  let assignedById: string | undefined = data.ASSIGNED_BY_ID || defaultAssignedById();

  if (phone) {
    const contact = await findContactByPhone(phone);
    if (contact) {
      contactId = contact.ID;
      assignedById = contact.ASSIGNED_BY_ID || assignedById;
    }
    if (!contactId) {
      const company = await findCompanyByPhone(phone);
      if (company) {
        companyId = company.ID;
        assignedById = company.ASSIGNED_BY_ID || assignedById;
      }
    }
  }
  if (!contactId && !companyId && email) {
    const contact = await findContactByEmail(email);
    if (contact) {
      contactId = contact.ID;
      assignedById = contact.ASSIGNED_BY_ID || assignedById;
    }
    if (!contactId) {
      const company = await findCompanyByEmail(email);
      if (company) {
        companyId = company.ID;
        assignedById = company.ASSIGNED_BY_ID || assignedById;
      }
    }
  }

  const fields: Record<string, unknown> = {
    TITLE: data.TITLE,
    NAME: data.NAME,
    LAST_NAME: data.LAST_NAME,
    COMPANY_TITLE: data.COMPANY_TITLE,
    COMMENTS: data.COMMENTS,
    SOURCE_ID: data.SOURCE_ID,
    SOURCE_DESCRIPTION: data.SOURCE_DESCRIPTION,
    ASSIGNED_BY_ID: assignedById,
  };

  if (data.PHONE?.length) fields.PHONE = data.PHONE;
  if (data.EMAIL?.length) fields.EMAIL = data.EMAIL;
  if (data.ADDRESS) fields.ADDRESS = data.ADDRESS;
  if (data.ADDRESS_CITY) fields.ADDRESS_CITY = data.ADDRESS_CITY;
  if (data.ADDRESS_POSTAL_CODE) fields.ADDRESS_POSTAL_CODE = data.ADDRESS_POSTAL_CODE;
  if (contactId) fields.CONTACT_ID = contactId;
  if (companyId) fields.COMPANY_ID = companyId;
  if (data.OPPORTUNITY !== undefined && data.OPPORTUNITY !== null) {
    fields.OPPORTUNITY = typeof data.OPPORTUNITY === 'number' ? data.OPPORTUNITY : Number(data.OPPORTUNITY);
  }
  // CURRENCY_ID: Bitrix24 може вимагати ID валюти (число) або код у спеціальному форматі
  // Якщо передано CURRENCY_ID, спробуємо використати його, інакше Bitrix24 використає валюту за замовчуванням
  // Примітка: Якщо все ще помилка "Currency is incorrect", спробуй отримати список валют через:
  // const currencies = await requestToCRM('crm.currency.list', {});
  // і знайди правильний ID для GBP
  if (data.CURRENCY_ID) {
    // Спробуємо як рядок (код валюти) - якщо не працює, потрібно буде отримати ID через crm.currency.list
    fields.CURRENCY_ID = data.CURRENCY_ID;
  }
  if (data.UF_CRM_PRODUCT_LIST) fields.UF_CRM_PRODUCT_LIST = data.UF_CRM_PRODUCT_LIST;
  if (data.UF_CRM_ORDER_WEIGHT) fields.UF_CRM_ORDER_WEIGHT = data.UF_CRM_ORDER_WEIGHT;
  if (data.UF_CRM_ORDER_TOTAL) fields.UF_CRM_ORDER_TOTAL = data.UF_CRM_ORDER_TOTAL;

  return requestToCRM('crm.lead.add', { fields });
}

export async function createOrderLead(order: Order): Promise<Bitrix24Response> {
  const orderDetails = formatOrderDetails({
    cart: order.cart,
    customer: order.customer,
    total: order.total,
    totalWeight: order.totalWeight,
    notes: order.notes,
  });
  const leadData: Bitrix24Lead = {
    TITLE: `Lead Verandas & Caponies — ${order.customer.phone}`,
    NAME: order.customer.name,
    COMPANY_TITLE: order.customer.company,
    EMAIL: [{ VALUE: order.customer.email, VALUE_TYPE: 'WORK' }],
    PHONE: [{ VALUE: order.customer.phone, VALUE_TYPE: 'WORK' }],
    ADDRESS: order.customer.address?.street,
    ADDRESS_CITY: order.customer.address?.city,
    ADDRESS_POSTAL_CODE: order.customer.address?.postcode,
    COMMENTS: `Form type: Website Order\n\n${orderDetails}`,
    SOURCE_ID: BITRIX_SOURCE_WEB,
    SOURCE_DESCRIPTION: 'Lead Verandas & Caponies verandas.alteg.co.uk',
    ASSIGNED_BY_ID: defaultAssignedById(),
    OPPORTUNITY: Number(order.total.toFixed(2)), // Сума замовлення для поля "Сумма і валюта" (число)
    // CURRENCY_ID тимчасово прибрано через помилку "Currency is incorrect"
    // Bitrix24 використає валюту за замовчуванням або потрібно отримати правильний ID через crm.currency.list
    // CURRENCY_ID: 'GBP', // Валюта: фунти стерлінгів (UK)
    UF_CRM_ORDER_WEIGHT: order.totalWeight.toFixed(2),
    UF_CRM_ORDER_TOTAL: order.total.toFixed(2),
    UF_CRM_PRODUCT_LIST: order.cart
      .map((item) => `${item.product.name} (${item.product.dimensions}) - ${item.length}m x ${item.quantity}`)
      .join('; '),
  };

  return createLead(leadData);
}

export async function createQuoteLead(quote: QuoteRequest): Promise<Bitrix24Response> {
  const quoteBody = `Wholesale: ${quote.isWholesale ? 'Yes' : 'No'}\nTotal Weight: ${quote.totalWeight.toFixed(2)}kg\n\nProducts:\n${quote.products.map((item) => `${item.product.name} (${item.product.dimensions}) - ${item.length}m x ${item.quantity}`).join('\n')}\n\n${quote.notes || ''}`;
  const leadData: Bitrix24Lead = {
    TITLE: `Lead web B2B — ${quote.customer.name} — ${quote.customer.phone}`,
    NAME: quote.customer.name,
    COMPANY_TITLE: quote.customer.company,
    EMAIL: [{ VALUE: quote.customer.email, VALUE_TYPE: 'WORK' }],
    PHONE: [{ VALUE: quote.customer.phone, VALUE_TYPE: 'WORK' }],
    COMMENTS: `Form type: Request a quote\n\n${quoteBody}`,
    SOURCE_ID: BITRIX_SOURCE_WEB,
    SOURCE_DESCRIPTION: 'Lead web B2B',
    ASSIGNED_BY_ID: defaultAssignedById(),
    UF_CRM_ORDER_WEIGHT: quote.totalWeight.toFixed(2),
  };

  if (quote.estimatedTotal) {
    leadData.OPPORTUNITY = quote.estimatedTotal; // Сума для поля "Сумма і валюта"
    // CURRENCY_ID тимчасово прибрано через помилку "Currency is incorrect"
    // Bitrix24 використає валюту за замовчуванням або потрібно отримати правильний ID через crm.currency.list
    // leadData.CURRENCY_ID = 'GBP'; // Валюта: фунти стерлінгів (UK)
    leadData.UF_CRM_ORDER_TOTAL = quote.estimatedTotal.toFixed(2);
  }

  return createLead(leadData);
}
