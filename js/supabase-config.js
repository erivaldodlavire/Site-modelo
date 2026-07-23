/* ============================================================================
 * SUPABASE-CONFIG.JS — Configuração Central (Multi-Tenant) — TEMPLATE PADRÃO
 * ============================================================================ */

window.SUPABASE_CONFIG = {
    url: 'https://bguslrxqkrlrueafetzh.supabase.co',
    anonKey: 'sb_publishable_ZpEyI4ldSV5-ZbXKZFuYyQ_YRPXB4mz',

    cliente: {
        id: 'TEMPLATE_ID',                // ex: "gleyciane", "erivaldo"
        nome: 'TEMPLATE_NOME',            // ex: "Gleyciane Araújo"
        marca: 'TEMPLATE_MARCA',          // ex: "Advocacia"
        schema: 'TEMPLATE_SCHEMA',        // ex: "gleyciane"
    },

    n8n: {
        webhookLeads: '',
        webhookEventos: '',
    },

    rotas: {
        login: 'login.html',
        admin: 'admin.html',
        site: 'index.html',
    },
};

if (typeof supabase !== 'undefined') {
    const cfg = window.SUPABASE_CONFIG;
    
    if (cfg.cliente.schema === 'TEMPLATE_SCHEMA' || cfg.cliente.schema === '') {
        console.error('❌ ERRO: supabase-config.js ainda tem TEMPLATE_SCHEMA não preenchido!');
        throw new Error('Configuração do Supabase incompleta. Veja console para detalhes.');
    }
    
    const schemaCliente = cfg.cliente.schema;
    window.supabaseClient = supabase.createClient(
        cfg.url,
        cfg.anonKey,
        { db: { schema: schemaCliente } }
    );
    
    console.log(`✅ [Supabase] Conectado para cliente: ${cfg.cliente.nome}`);
    console.log(`   Schema: ${schemaCliente}`);
}