/* ============================================================================
 * SUPABASE-CONFIG.JS — Configuração Central (Multi-Tenant)
 * ============================================================================
 * WHITE-LABEL: Este é o ÚNICO arquivo que muda entre clientes/instâncias.
 * 
 * Para Gleyciane: schema 'gleyciane'
 * Para Erivaldo:  schema 'erivaldo'
 * Para Cliente X: schema 'cliente_x'
 *
 * SEGURANÇA: A "anon key" é PÚBLICA (RLS + schema isolado protegem).
 * ========================================================================== */

window.SUPABASE_CONFIG = {
    // URL do projeto (MESMO para todos os clientes)
    url: 'https://bguslrxqkrlrueafetzh.supabase.co',

    // Chave pública (MESMA para todos — segura via RLS + schema)
    anonKey: 'sb_publishable_ZpEyI4ldSV5-ZbXKZFuYyQ_YRPXB4mz',

    // ← NOVO: Identidade do cliente E seu schema isolado
    cliente: {
        id: 'gleyciane',                  // slug
        nome: 'Gleyciane Araújo',
        marca: 'Advocacia',
        schema: 'gleyciane',              // ← A CHAVE: schema isolado
    },

    // Webhooks do n8n (preenchidos depois)
    n8n: {
        webhookLeads: '',
        webhookEventos: '',
    },

    // Rotas internas
    rotas: {
        login: 'login.html',
        admin: 'admin.html',
        site: 'index.html',
    },
};

/* ============================================================================
 * INICIALIZAÇÃO: Cria cliente Supabase com schema forçado
 * ============================================================================
 * Quando o SDK Supabase carrega, ele cria uma conexão que "sabe" qual schema
 * usar. Com isto, TODAS as queries vão para "gleyciane" automaticamente.
 * ========================================================================== */

if (typeof supabase !== 'undefined') {
    const cfg = window.SUPABASE_CONFIG;
    const schemaCliente = cfg.cliente.schema || 'public';
    
    // Cria o cliente com o schema forçado
    window.supabaseClient = supabase.createClient(
        cfg.url,
        cfg.anonKey,
        {
            db: { schema: schemaCliente },  // ← Força o schema "gleyciane"
        }
    );
    
    console.log(`[Supabase] Cliente conectado ao schema: ${schemaCliente}`);
}