// 1. CONEXÃO COM SUPABASE
const SUPABASE_URL = 'https://ueduzgoewlivkluiyqql.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlZHV6Z29ld2xpdmtsdWl5cXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxODAxMzAsImV4cCI6MjA4ODc1NjEzMH0.EM2s38El81fZYT-WVrxa7P_xX0e58EHQxdwreVgQecA';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const CONFIG_SECURITY = {
    userPadrao: "admin",
    passPadrao: "eriplay2026",
    emailRecuperacao: "gleyciane_araujo@adv.oabsp.org.br"
};

let codigoVerificacaoGerado = null;

// 2. FUNÇÃO QUE INJETA AS INFORMAÇÕES NO HTML
function aplicarDadosNoSite(data) {
    if (!data) return;

    // Sincronizar Tema com a classe do body do seu CSS
    document.body.className = data.tema || 'tema-advogado';
    
    if(data.nome) {
        if(document.getElementById('edit-nome')) document.getElementById('edit-nome').innerText = data.nome;
        if(document.getElementById('edit-header-nome')) document.getElementById('edit-header-nome').innerText = data.nome;
    }
    if(data.oab && document.getElementById('edit-oab')) document.getElementById('edit-oab').innerText = data.oab;
    if(data.slogan && document.getElementById('edit-slogan')) document.getElementById('edit-slogan').innerText = data.slogan;
    if(data.sobre && document.getElementById('edit-sobre-texto')) document.getElementById('edit-sobre-texto').innerText = data.sobre;

    if(data.endereco && document.getElementById('edit-endereco')) document.getElementById('edit-endereco').innerText = data.endereco;
    if(data.tel && document.getElementById('edit-telefone')) document.getElementById('edit-telefone').innerText = data.tel;
    if(data.email && document.getElementById('edit-email')) document.getElementById('edit-email').innerText = data.email;
    if(data.horario && document.getElementById('edit-horario')) document.getElementById('edit-horario').innerText = data.horario;
    if(data.copy && document.getElementById('edit-copyright')) document.getElementById('edit-copyright').innerText = data.copy;

    // --- PROCESSAMENTO DAS FOTOS DE IDENTIDADE VISUAL (NOVO) ---
    if (data.identidade) {
        if (data.identidade.perfil && document.getElementById('edit-perfil-foto')) {
            document.getElementById('edit-perfil-foto').src = data.identidade.perfil;
        }
        if (data.identidade.favicon && document.getElementById('edit-logo')) {
            document.getElementById('edit-logo').src = data.identidade.favicon;
        }
        if (data.identidade.fundo && document.getElementById('hero')) {
            document.getElementById('hero').style.background = `url('${data.identidade.fundo}') no-repeat center center/cover`;
        }
    }

    // Fotos do Espaço
    if (data.fotos) {
        for(let i=1; i<=3; i++) {
            const img = document.getElementById(`img-espaco-${i}`);
            if(img && data.fotos[`f${i}`]) img.src = data.fotos[`f${i}`];
        }
    }

    // Áreas de Atuação
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

    // Redes Sociais
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

    // Publicações
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

// 3. ENVIO DE FORMULÁRIO DE CONTATO
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
        alert("Mensagem enviada com sucesso!");
        event.target.reset();
    } else {
        alert("Erro ao enviar. Entre em contato via WhatsApp.");
    }
    btn.innerText = originalText;
    btn.disabled = false;
}

function verificarLogin() {
    const uInput = document.getElementById('login-user').value;
    const pInput = document.getElementById('login-pass').value;
    const msgError = document.getElementById('login-msg');

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

async function esqueciSenha() {
    const msgError = document.getElementById('login-msg');
    msgError.style.display = 'block';
    msgError.innerText = "🌀 Gerando código...";

    codigoVerificacaoGerado = Math.floor(100000 + Math.random() * 900000);
    console.log("[SECURITY] Código gerado: " + codigoVerificacaoGerado);
    
    const codigoDigitado = prompt(`🔑 Validação de Segurança\n\nDigite o código de 6 dígitos enviado para liberar o acesso:`);

    if (codigoDigitado && parseInt(codigoDigitado) === codigoVerificacaoGerado) {
        const novoUser = prompt("Novo usuário:");
        const novaSenha = prompt("Nova senha:");
        if (novoUser && novaSenha) {
            localStorage.setItem('admin_user', novoUser);
            localStorage.setItem('admin_pass', novaSenha);
            alert("Credenciais alteradas com sucesso!");
        }
    } else {
        alert("Código inválido.");
    }
}

function injetarIconeConfiguracao() {
    if (document.getElementById('edit-criador-link')) {
        const linkAdmin = document.getElementById('edit-criador-link');
        linkAdmin.innerHTML = `<i class="fas fa-cog fa-spin" style="margin-right: 5px;"></i> ${linkAdmin.innerHTML}`;
    }
}

// 4. MOTOR DE INICIALIZAÇÃO HÍBRIDO
async function inicializarSite() {
    injetarIconeConfiguracao();
    try {
        const { data, error } = await supabaseClient.from('site_config').select('*').eq('id', 1).single();
        if (data && !error) {
            aplicarDadosNoSite(data);
        } else {
            throw new Error("Nuvem offline");
        }
    } catch (err) {
        const localData = JSON.parse(localStorage.getItem('siteData'));
        if (localData) aplicarDadosNoSite(localData);
    }
}

window.addEventListener('load', inicializarSite);