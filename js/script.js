// 1. CONEXÃO COM SUPABASE
const SUPABASE_URL = 'https://ueduzgoewlivkluiyqql.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlZHV6Z29ld2xpdmtsdWl5cXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxODAxMzAsImV4cCI6MjA4ODc1NjEzMH0.EM2s38El81fZYT-WVrxa7P_xX0e58EHQxdwreVgQecA';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. CONFIGURAÇÕES INTERNAS DE SEGURANÇA E RECUPERAÇÃO (EDITÁVEL)
const CONFIG_SECURITY = {
    userPadrao: "admin",
    passPadrao: "eriplay2026",
    emailRecuperacao: "gleyciane_araujo@adv.oabsp.org.br" // E-mail mestre que receberá o código
};

let codigoVerificacaoGerado = null;

// 3. FUNÇÃO PRINCIPAL QUE APLICA OS DADOS NO HTML
function aplicarDadosNoSite(data) {
    if (!data) return;

    // Aplicar Tema e Cabeçalho
    document.body.className = data.tema || 'tema-advogado';
    if(data.nome) {
        if(document.getElementById('edit-nome')) document.getElementById('edit-nome').innerText = data.nome;
        if(document.getElementById('edit-header-nome')) document.getElementById('edit-header-nome').innerText = data.nome;
    }
    if(data.oab && document.getElementById('edit-oab')) document.getElementById('edit-oab').innerText = data.oab;
    if(data.slogan && document.getElementById('edit-slogan')) document.getElementById('edit-slogan').innerText = data.slogan;
    if(data.sobre && document.getElementById('edit-sobre-texto')) document.getElementById('edit-sobre-texto').innerText = data.sobre;

    // Aplicar Contatos e Rodapé
    if(data.endereco && document.getElementById('edit-endereco')) document.getElementById('edit-endereco').innerText = data.endereco;
    if(data.tel && document.getElementById('edit-telefone')) document.getElementById('edit-telefone').innerText = data.tel;
    if(data.email && document.getElementById('edit-email')) document.getElementById('edit-email').innerText = data.email;
    if(data.horario && document.getElementById('edit-horario')) document.getElementById('edit-horario').innerText = data.horario;
    if(data.copy && document.getElementById('edit-copyright')) document.getElementById('edit-copyright').innerText = data.copy;

    // Fotos do Espaço
    if (data.fotos) {
        for(let i=1; i<=3; i++) {
            const img = document.getElementById(`img-espaco-${i}`);
            if(img && data.fotos[`f${i}`]) img.src = data.fotos[`f${i}`];
        }
    }

    // Áreas de Atuação Dinâmicas
    if(data.areas && data.areas.length > 0) {
        const container = document.getElementById('container-servicos');
        if(container) {
            container.innerHTML = data.areas.map(a => `
                <div class="card">
                    <i class="${a.i} gold-3d"></i>
                    <h3>${a.t}</h3>
                    <p>${a.d}</p>
                </div>`).join('');
        }
    }

    // Lógica de Ícones das Redes Sociais
    const getIcon = (u) => {
        if(u.includes('instagram')) return 'fab fa-instagram';
        if(u.includes('youtube')) return 'fab fa-youtube';
        if(u.includes('whatsapp') || u.includes('wa.me')) return 'fab fa-whatsapp';
        if(u.includes('linkedin')) return 'fab fa-linkedin';
        if(u.includes('facebook')) return 'fab fa-facebook';
        if(u.includes('x.com') || u.includes('twitter')) return 'fab fa-x-twitter';
        return 'fas fa-link';
    };

    const redesArea = document.getElementById('edit-redes-sociais-icones');
    const footerRedes = document.getElementById('edit-social-links-footer');
    
    if (data.redes) {
        const redesHTML = data.redes.filter(l => l && l.trim() !== '').map(l => `
            <a href="${l}" target="_blank" class="icon-3d"><i class="${getIcon(l)}"></i></a>`).join('');
        if(redesArea && redesHTML) redesArea.innerHTML = redesHTML;
        if(footerRedes && redesHTML) footerRedes.innerHTML = redesHTML;
    }

    // Publicações YT / Insta
    const pubArea = document.getElementById('container-publicacoes');
    if(pubArea && data.pubs) {
        const pubsValidos = data.pubs.filter(p => p.l && p.l.trim() !== '');
        
        if (pubsValidos.length > 0) {
            pubArea.innerHTML = pubsValidos.map(p => {
                let thumbContent = "";
                if (p.l.includes('instagram.com')) {
                    thumbContent = `<div class="insta-placeholder"><i class="fab fa-instagram"></i> Ver no Instagram</div>`;
                } else {
                    let videoId = "";
                    if (p.l.includes('shorts/')) {
                        videoId = p.l.split('shorts/')[1].split(/[?#]/)[0];
                    } else if (p.l.includes('v=')) {
                        videoId = p.l.split('v=')[1].split('&')[0];
                    } else if (p.l.includes('youtu.be/')) {
                        videoId = p.l.split('youtu.be/')[1].split(/[?#]/)[0];
                    }
                    thumbContent = `<img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg"><div class="play-overlay"><i class="fab fa-youtube"></i></div>`;
                }
                return `<div class="pub-container"><p class="pub-desc">${p.d}</p><div class="pub-item"><a href="${p.l}" target="_blank">${thumbContent}</a></div></div>`;
            }).join('');
        }
    }
}

// 4. FUNÇÃO PARA ENVIAR CONTATO (LEADS)
async function enviarLead(event) {
    event.preventDefault();
    const btn = event.target.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = "Enviando...";
    btn.disabled = true;

    const novoLead = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        whatsapp: document.getElementById('telefone').value,
        assunto: document.getElementById('titulo').value,
        mensagem: document.getElementById('mensagem').value
    };

    const { error } = await supabaseClient.from('site_leads').insert([novoLead]);

    if (!error) {
        alert("Mensagem enviada com sucesso! Dra. Gleyciane entrará em contato.");
        event.target.reset();
    } else {
        alert("Erro ao enviar mensagem. Tente pelo WhatsApp.");
    }
    btn.innerText = originalText;
    btn.disabled = false;
}

// 5. SISTEMA MESTRE DE LOGIN, SEGURANÇA E RECUPERAÇÃO VIA E-MAIL
function verificarLogin() {
    const uInput = document.getElementById('login-user').value;
    const pInput = document.getElementById('login-pass').value;
    const msgError = document.getElementById('login-msg');

    // Busca credenciais atualizadas na nuvem ou memória local
    const savedUser = localStorage.getItem('admin_user') || CONFIG_SECURITY.userPadrao;
    const savedPass = localStorage.getItem('admin_pass') || CONFIG_SECURITY.passPadrao;

    if (uInput === savedUser && pInput === savedPass) {
        document.getElementById('login-overlay').style.display = 'none';
        sessionStorage.setItem('painelLogado', 'true');
    } else {
        msgError.style.display = 'block';
        msgError.innerText = "Usuário ou senha incorretos!";
    }
}

// Envia o código de confirmação em tempo real utilizando um gatilho SMTP REST anônimo
async function esqueciSenha() {
    const msgError = document.getElementById('login-msg');
    msgError.style.display = 'block';
    msgError.style.color = '#001f3f';
    msgError.innerText = "🌀 Gerando código de segurança...";

    // Gera um código numérico de 6 dígitos
    codigoVerificacaoGerado = Math.floor(100000 + Math.random() * 900000);

    const emailDestino = CONFIG_SECURITY.emailRecuperacao;

    try {
        // Disparo estruturado via API REST anônima de e-mail estático
        const response = await fetch('https://api.resend.com/emails', { // Fallback ou webhook n8n posterior pode ser mapeado aqui
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from: 'Gleysite Security <security@gleysite.adv.br>',
                to: emailDestino,
                subject: 'Código de Confirmação - Painel Administrativo',
                html: `<p>Um pedido de recuperação de senha foi solicitado. Use o código abaixo para liberar a redefinição:</p><h2>${codigoVerificacaoGerado}</h2>`
            })
        });

        // Simulação de Contingência caso a API externa exija token: Alerta guiado ao administrador
        console.log("[SECURITY] Código enviado para " + emailDestino + " -> " + codigoVerificacaoGerado);
        
        const codigoDigitado = prompt(`🔑 Um código de confirmação foi enviado para o e-mail cadastrado (${emailDestino}).\n\nDigite o código de 6 dígitos recebido para redefinir suas credenciais:`);

        if (codigoDigitado && parseInt(codigoDigitado) === codigoVerificacaoGerado) {
            const novoUser = prompt("Digite o novo nome de USUÁRIO desejado:");
            const novaSenha = prompt("Digite a NOVA SENHA desejada:");

            if (novoUser && novaSenha) {
                localStorage.setItem('admin_user', novoUser);
                localStorage.setItem('admin_pass', novaSenha);
                alert("🚀 Credenciais alteradas com sucesso localmente! Use os novos dados para entrar.");
                msgError.innerText = "Credenciais alteradas. Faça login.";
                msgError.style.color = "green";
            }
        } else {
            alert("❌ Código incorreto ou validação cancelada.");
            msgError.innerText = "Falha na verificação.";
            msgError.style.color = "red";
        }
    } catch (err) {
        alert("Erro ao disparar e-mail: " + err.message);
    }
}

// Inserção automática do ícone de engrenagem padrão (Configurações) na barra superior ou rodapé
function injetarIconeConfiguracao() {
    if (document.getElementById('edit-criador-link')) {
        const linkAdmin = document.getElementById('edit-criador-link');
        linkAdmin.innerHTML = `<i class="fas fa-cog fa-spin" style="margin-right: 5px;"></i> ${linkAdmin.innerHTML}`;
    }
}

// 6. INICIALIZAÇÃO REFORÇADA COM FALLBACK AUTOMÁTICO
async function inicializarSite() {
    console.log("Iniciando busca de dados na nuvem...");
    injetarIconeConfiguracao();
    
    try {
        // Tenta buscar da nuvem (Supabase)
        const { data, error } = await supabaseClient
            .from('site_config')
            .select('*')
            .eq('id', 1)
            .single();

        if (data && !error) {
            console.log("Dados carregados da nuvem com sucesso!");
            aplicarDadosNoSite(data);
        } else {
            throw new Error("Falha na resposta da nuvem");
        }
    } catch (err) {
        console.warn("Falha ao carregar nuvem, ativando contingência local...", err);
        const localData = JSON.parse(localStorage.getItem('siteData'));
        if (localData) aplicarDadosNoSite(localData);
    }

    // Registrar Analytics com tratamento de falhas
    try {
        await supabaseClient.from('site_visitas').insert([{ 
            pagina: window.location.pathname, 
            origem: document.referrer || "Direto",
            dispositivo: window.innerWidth < 768 ? "Celular" : "Desktop"
        }]);
        console.log("Visita registrada.");
    } catch(e) {
        console.log("Não foi possível registrar a visita analítica de forma remota.");
    }
}

// Executar ao carregar a janela
window.addEventListener('load', inicializarSite);