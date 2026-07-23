/* ============================================================================
 * SUPABASE-CONFIG.JS — Configuração Central do Projeto
 * ============================================================================
 * WHITE-LABEL: Este é o ÚNICO arquivo que muda entre clientes/instâncias.
 * Ao vender para um novo cliente, você cria um novo projeto no Supabase
 * e troca apenas as chaves abaixo. Nenhum outro arquivo é tocado.
 *
 * SEGURANÇA: A "anon key" é PÚBLICA por design (ela vai para o navegador).
 * A proteção real vem das políticas de RLS (Row Level Security) definidas
 * no arquivo setup/01_auth_setup.sql — sem RLS ativo, NÃO coloque em produção.
 * ========================================================================== */

window.SUPABASE_CONFIG = {
    // URL do projeto (Dashboard Supabase → Settings → API)
    url: 'https://bguslrxqkrlrueafetzh.supabase.co',

    // Chave pública (formato novo "publishable" — Dashboard → Settings → API Keys)
    anonKey: 'sb_publishable_ZpEyI4ldSV5-ZbXKZFuYyQ_YRPXB4mz',

    // Identidade do cliente desta instância (usado em payloads do n8n e no título do login)
    cliente: {
        id: 'gleyciane-araujo',            // slug único (multi-tenant futuro)
        nome: 'Gleyciane Araújo',
        marca: 'Advocacia',
    },

    // Webhooks do n8n (Fase 3 usa; centralizado aqui desde já)
    n8n: {
        webhookLeads: '',                  // ex: https://n8n.seudominio.com/webhook/leads
        webhookEventos: '',                // ex: cliques em botões críticos, intenções
    },

    // Rotas internas do template (permite renomear arquivos sem caçar strings)
    rotas: {
        login: 'login.html',
        admin: 'admin.html',
        site: 'index.html',
    },
};
