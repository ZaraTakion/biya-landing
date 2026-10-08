import { useEffect, useState } from 'react';
import type { Language } from './data';

const contentByLanguage = {
  pt: {
    language: 'Português',
    title: 'Política das artes',
    lead: 'A Biya autorizou a exibição dos materiais visuais selecionados neste site. Essa autorização é para publicação no BIYA — Parallel Worlds e não transfere direitos autorais nem cria uma licença de reutilização para visitantes, empresas, plataformas ou sistemas de inteligência artificial.',
    rightsTitle: 'Direitos e autoria',
    rights: 'As ilustrações, personagens, designs, fotografias, miniaturas e demais materiais visuais permanecem protegidos pelos direitos dos respectivos artistas, criadores, clientes e demais titulares. A autorização da Biya para exibição neste site não substitui a autorização do titular aplicável quando ela for necessária.',
    forbiddenTitle: 'Sem autorização expressa, não é permitido',
    forbidden: [
      'repostar, redistribuir, re-hospedar ou apresentar o material como próprio;',
      'editar, recortar, recolorir, remover assinatura, marca d’água ou crédito, ou criar derivados;',
      'usar em publicidade, produtos, merchandising, NFTs, monetização ou outra finalidade comercial;',
      'coletar as imagens por scraping ou inseri-las em datasets;',
      'usar para treinamento, pré-treinamento, fine-tuning, LoRA, embeddings ou qualquer ajuste de modelos;',
      'usar como prompt visual, referência de estilo, image-to-image, ControlNet ou outra entrada para geração de imagens por IA;',
      'criar ou ajustar modelos com a finalidade de imitar deliberadamente a arte, o design ou a identidade visual exibida aqui.',
    ],
    allowedTitle: 'O que é permitido',
    allowed: 'Você pode visualizar o site, compartilhar o endereço desta página e usar recursos nativos de compartilhamento que preservem a origem. Para reutilizar uma obra ou material visual, obtenha antes a permissão do titular aplicável.',
    aiTitle: 'IA generativa',
    ai: 'Nenhum material visual deste site é disponibilizado como conteúdo autorizado para datasets, treinamento, ajuste de modelos ou geração de imagens por IA. A possibilidade técnica de acessar ou copiar um arquivo não constitui consentimento.',
    contactTitle: 'Contato',
    contact: 'Para dúvidas ou pedidos de uso relacionados à Biya, utilize os canais públicos abaixo.',
    back: '← BIYA — Parallel Worlds',
  },
  en: {
    language: 'English',
    title: 'Artwork policy',
    lead: 'Biya authorized the display of selected visual materials on this website. This authorization is for publication on BIYA — Parallel Worlds and does not transfer copyright or create a reuse license for visitors, companies, platforms or artificial-intelligence systems.',
    rightsTitle: 'Rights and authorship',
    rights: 'Illustrations, characters, designs, photographs, thumbnails and other visual materials remain protected by the rights of their respective artists, creators, clients and other rights holders. Biya’s authorization to display material on this website does not replace permission from the applicable rights holder where such permission is required.',
    forbiddenTitle: 'Without express permission, you may not',
    forbidden: [
      'repost, redistribute, re-host or present the material as your own;',
      'edit, crop, recolor, remove signatures, watermarks or credits, or create derivative versions;',
      'use it in advertising, products, merchandise, NFTs, monetized content or other commercial uses;',
      'scrape the images or add them to datasets;',
      'use them for training, pre-training, fine-tuning, LoRA, embeddings or any other model adjustment;',
      'use them as a visual prompt, style reference, image-to-image input, ControlNet input or any other input for generative-AI image creation;',
      'build or tune models intended to deliberately imitate the artwork, design or visual identity displayed here.',
    ],
    allowedTitle: 'What is allowed',
    allowed: 'You may view the website, share the URL of this page and use native sharing features that preserve the source. To reuse an artwork or visual asset, obtain permission from the applicable rights holder first.',
    aiTitle: 'Generative AI',
    ai: 'No visual material on this website is provided as authorized content for datasets, model training, fine-tuning or AI image generation. Technical access or the ability to copy a file does not constitute consent.',
    contactTitle: 'Contact',
    contact: 'For questions or permission requests related to Biya, use the public channels below.',
    back: '← BIYA — Parallel Worlds',
  },
} as const;

export default function PolicyApp() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return localStorage.getItem('biya-language') === 'en' ? 'en' : 'pt';
    } catch {
      return 'pt';
    }
  });
  const t = contentByLanguage[language];

  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
    try {
      localStorage.setItem('biya-language', language);
    } catch {
      // Browsers may disable storage; language switching still works.
    }
    document.title = language === 'pt'
      ? 'Política das artes — BIYA / Parallel Worlds'
      : 'Artwork policy — BIYA / Parallel Worlds';
  }, [language]);

  return (
    <main className="policy-shell">
      <a className="policy-back" href="/">{t.back}</a>
      <p className="policy-eyebrow">ARTWORK RIGHTS / BIYA / PARALLEL WORLDS</p>
      <h1>{t.title}</h1>
      <p className="policy-lead">{t.lead}</p>

      <div className="policy-language" role="group" aria-label="Language">
        {(['pt', 'en'] as const).map(value => (
          <button
            key={value}
            type="button"
            className={language === value ? 'is-active' : undefined}
            lang={value === 'pt' ? 'pt-BR' : 'en'}
            aria-pressed={language === value}
            onClick={() => setLanguage(value)}
          >
            {value.toUpperCase()}
          </button>
        ))}
      </div>

      <article className="policy-card">
        <span className="policy-lang-name">{t.language}</span>
        <h2>{t.rightsTitle}</h2>
        <p>{t.rights}</p>

        <h2>{t.forbiddenTitle}</h2>
        <ul>{t.forbidden.map(item => <li key={item}>{item}</li>)}</ul>

        <h2>{t.allowedTitle}</h2>
        <p>{t.allowed}</p>

        <aside className="policy-ai">
          <strong>{t.aiTitle}</strong>
          <p>{t.ai}</p>
        </aside>

        <h2>{t.contactTitle}</h2>
        <p>{t.contact}</p>
        <p className="policy-links">
          <a href="https://x.com/BiyA_YU" target="_blank" rel="noopener noreferrer">X / @BiyA_YU ↗</a>
          <a href="https://vgen.co/BiyA_YU" target="_blank" rel="noopener noreferrer">VGen ↗</a>
        </p>
      </article>

      <footer>© 2026 BIYA — Parallel Worlds · Artwork & visual-material usage policy</footer>
    </main>
  );
}
