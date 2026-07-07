/* ============================================================================
 * THEME-ENGINE.JS — Motor de Temas Premium (White-Label)
 * ============================================================================
 * Compartilhado entre index.html (site) e admin.html (painel).
 * Estratégia: cada tema é um dicionário de CSS Variables. Aplicar um tema
 * é só reescrever as variáveis em :root — o navegador repinta na hora,
 * sem recarregar CSS, sem flash, sem peso extra.
 *
 * Variáveis controladas:
 *   --primary       cor institucional (fundos de header/footer, títulos)
 *   --accent        cor de destaque (botões, bordas, ícones)
 *   --bg            fundo geral da página
 *   --surface       fundo de cartões/seções alternadas
 *   --texto         cor do texto sobre --bg (troca em temas escuros!)
 *   --font-display  fonte de títulos
 *   --font-body     fonte de corpo
 *
 * Cada tema também aponta um `audio` (pacote sonoro do audio-engine.js)
 * e um `icone` FontAwesome usado na galeria de temas do Admin.
 * ========================================================================== */

window.ThemeEngine = (() => {
    'use strict';

    // ------------------------------------------------------------------ //
    // CATÁLOGO DE TEMAS (16 nativos, organizados por categoria)
    // ------------------------------------------------------------------ //
    const TEMAS = {
        /* ---------------- PROFISSÕES ---------------- */
        advogado: {
            nome: 'Advocacia', cat: 'Profissões', icone: 'fa-scale-balanced', audio: 'elegante',
            primary: '#001f3f', accent: '#e5c05b', bg: '#ffffff', surface: '#f4f4f4', texto: '#1c2733',
            fontDisplay: "'Playfair Display', serif", fontBody: "'Montserrat', sans-serif",
        },
        engenheiro: {
            nome: 'Engenharia', cat: 'Profissões', icone: 'fa-helmet-safety', audio: 'engrenagem',
            primary: '#1a1a1a', accent: '#f39c12', bg: '#fafafa', surface: '#efefef', texto: '#222222',
            fontDisplay: "'Oswald', sans-serif", fontBody: "'Roboto', sans-serif",
        },
        medico: {
            nome: 'Medicina', cat: 'Profissões', icone: 'fa-stethoscope', audio: 'clinico',
            primary: '#00796b', accent: '#4db6ac', bg: '#ffffff', surface: '#eef7f6', texto: '#223835',
            fontDisplay: "'Poppins', sans-serif", fontBody: "'Inter', sans-serif",
        },
        fisioterapia: {
            nome: 'Fisioterapia', cat: 'Profissões', icone: 'fa-person-walking', audio: 'clinico',
            primary: '#0e7490', accent: '#67e8f9', bg: '#ffffff', surface: '#ecf8fb', texto: '#164e5f',
            fontDisplay: "'Poppins', sans-serif", fontBody: "'Inter', sans-serif",
        },
        odontologia: {
            nome: 'Odontologia', cat: 'Profissões', icone: 'fa-tooth', audio: 'clinico',
            primary: '#0369a1', accent: '#7dd3fc', bg: '#ffffff', surface: '#f0f8ff', texto: '#1e3a4f',
            fontDisplay: "'Poppins', sans-serif", fontBody: "'Inter', sans-serif",
        },
        psicologo: {
            nome: 'Psicologia', cat: 'Profissões', icone: 'fa-brain', audio: 'elegante',
            primary: '#6d597a', accent: '#e5989b', bg: '#fdfbfc', surface: '#f5eef2', texto: '#41354a',
            fontDisplay: "'Playfair Display', serif", fontBody: "'Inter', sans-serif",
        },
        contador: {
            nome: 'Contabilidade', cat: 'Profissões', icone: 'fa-calculator', audio: 'elegante',
            primary: '#0d1b2a', accent: '#c9a227', bg: '#ffffff', surface: '#f2f4f7', texto: '#1b2733',
            fontDisplay: "'Oswald', sans-serif", fontBody: "'Inter', sans-serif",
        },
        nutricionista: {
            nome: 'Nutrição', cat: 'Profissões', icone: 'fa-seedling', audio: 'clinico',
            primary: '#2d6a4f', accent: '#95d5b2', bg: '#ffffff', surface: '#effaf3', texto: '#22402f',
            fontDisplay: "'Poppins', sans-serif", fontBody: "'Montserrat', sans-serif",
        },
        arquiteto: {
            nome: 'Arquitetura', cat: 'Profissões', icone: 'fa-compass-drafting', audio: 'elegante',
            primary: '#000000', accent: '#8e8e8e', bg: '#ffffff', surface: '#f6f6f6', texto: '#111111',
            fontDisplay: "'Oswald', sans-serif", fontBody: "'Inter', sans-serif",
        },

        /* ---------------- ESPORTES / ATLETAS ---------------- */
        natacao: {
            nome: 'Natação / Água', cat: 'Esportes', icone: 'fa-person-swimming', audio: 'agua',
            primary: '#023e8a', accent: '#48cae4', bg: '#f6fbfe', surface: '#e7f4fb', texto: '#0b3556',
            fontDisplay: "'Poppins', sans-serif", fontBody: "'Montserrat', sans-serif",
        },
        basquete: {
            nome: 'Basquete', cat: 'Esportes', icone: 'fa-basketball', audio: 'quadra',
            primary: '#1e1b18', accent: '#ff7f2a', bg: '#fdfaf7', surface: '#f4ece4', texto: '#2a241f',
            fontDisplay: "'Oswald', sans-serif", fontBody: "'Roboto', sans-serif",
        },
        lutador: {
            nome: 'Artes Marciais', cat: 'Esportes', icone: 'fa-hand-fist', audio: 'impacto',
            primary: '#111318', accent: '#c1121f', bg: '#f7f7f8', surface: '#ecedef', texto: '#17191d',
            fontDisplay: "'Oswald', sans-serif", fontBody: "'Roboto', sans-serif",
        },

        /* ---------------- ESPECIAIS ---------------- */
        cyberpunk: {
            nome: 'Cyberpunk / Neon', cat: 'Especiais', icone: 'fa-bolt', audio: 'digital',
            primary: '#03001c', accent: '#fee715', bg: '#050505', surface: '#101018', texto: '#e8e8f0',
            fontDisplay: "'Orbitron', sans-serif", fontBody: "'Inter', sans-serif",
            escuro: true,
        },
        gamer: {
            nome: 'Gamer', cat: 'Especiais', icone: 'fa-gamepad', audio: 'arcade',
            primary: '#0b0e11', accent: '#00ff41', bg: '#0e1114', surface: '#161b20', texto: '#d7e2dc',
            fontDisplay: "'Orbitron', sans-serif", fontBody: "'Roboto', sans-serif",
            escuro: true,
        },
        youtuber: {
            nome: 'Youtuber', cat: 'Especiais', icone: 'fa-play', audio: 'arcade',
            primary: '#0f0f0f', accent: '#ff0000', bg: '#ffffff', surface: '#f2f2f2', texto: '#181818',
            fontDisplay: "'Poppins', sans-serif", fontBody: "'Roboto', sans-serif",
        },
        minimalista: {
            nome: 'Minimalista Premium', cat: 'Especiais', icone: 'fa-circle-half-stroke', audio: 'elegante',
            primary: '#111827', accent: '#9ca3af', bg: '#fbfbfb', surface: '#f1f2f4', texto: '#1f2937',
            fontDisplay: "'Inter', sans-serif", fontBody: "'Inter', sans-serif",
        },
    };

    const TEMA_PADRAO = 'advogado';

    // ------------------------------------------------------------------ //
    // APLICAÇÃO — reescreve as CSS Variables em :root
    // ------------------------------------------------------------------ //
    // `aparencia` (vindo do site_config) tem o formato:
    //   { tema: 'advogado', custom: { primary: '#..', accent: '#..' } | null }
    // Se `custom` existir, as cores do usuário SOBRESCREVEM as do tema
    // (mantendo fontes/áudio do tema base) — é o modo Color Picker livre.
    function aplicar(aparencia) {
        const id = (aparencia && TEMAS[aparencia.tema]) ? aparencia.tema : TEMA_PADRAO;
        const tema = TEMAS[id];
        const custom = aparencia?.custom || {};

        const raiz = document.documentElement.style;
        raiz.setProperty('--primary', custom.primary || tema.primary);
        raiz.setProperty('--accent', custom.accent || tema.accent);
        raiz.setProperty('--bg', custom.bg || tema.bg);
        raiz.setProperty('--surface', tema.surface);
        raiz.setProperty('--texto', tema.texto);
        raiz.setProperty('--font-display', tema.fontDisplay);
        raiz.setProperty('--font-body', tema.fontBody);

        // Marcações no <body> para o CSS reagir (ex.: sombras em tema escuro)
        document.body.dataset.tema = id;
        document.body.classList.toggle('tema-escuro', !!tema.escuro);

        // Sincroniza o pacote sonoro com o tema (se o motor de áudio existir
        // na página e o Admin não tiver fixado um pacote manualmente)
        if (window.AudioEngine && !AudioEngine.pacoteManual()) {
            AudioEngine.setPacote(tema.audio, { manual: false });
        }
        return tema;
    }

    // Utilidades para o Admin montar a galeria
    const listar = () => Object.entries(TEMAS).map(([id, t]) => ({ id, ...t }));
    const categorias = () => [...new Set(Object.values(TEMAS).map(t => t.cat))];
    const get = (id) => TEMAS[id] || TEMAS[TEMA_PADRAO];

    return { aplicar, listar, categorias, get, TEMA_PADRAO };
})();
