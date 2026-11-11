import { DEMO_MODE } from '../config/app.config.js';
import { el } from '../utils/dom.util.js';
import { session } from '../stores/session.store.js';

const DEMO_MESSAGE =
  'Projet de démonstration open source : les réservations ne déclenchent aucune intervention réelle';

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/#comment', label: 'Comment ça marche' },
  { href: '/#faq', label: 'À propos' },
  { href: '/contact.html', label: 'Contact' },
];

const ORDER_LINK = { href: '/services.html', label: 'Commander' };

const SOCIAL_LINKS = [
  { href: 'https://www.facebook.com', icon: 'bi-facebook', label: 'Facebook' },
  { href: 'https://www.instagram.com', icon: 'bi-instagram', label: 'Instagram' },
  { href: 'https://x.com', icon: 'bi-twitter-x', label: 'X' },
  { href: 'https://wa.me/212600000000', icon: 'bi-whatsapp', label: 'WhatsApp' },
];

const isCurrentPage = (href) => href === window.location.pathname;

function renderNavLink({ href, label }) {
  return el('a', {
    href,
    text: label,
    className: 'site-nav__link',
    'aria-current': isCurrentPage(href) ? 'page' : undefined,
  });
}

// One button in the navigation (the order page); account actions stay quiet text links.
function renderAccountActions() {
  const orderButton = el('a', {
    href: ORDER_LINK.href,
    className: 'btn btn-primary btn-sm',
    text: ORDER_LINK.label,
    'aria-current': isCurrentPage(ORDER_LINK.href) ? 'page' : undefined,
  });

  if (!session.isLoggedIn()) {
    return [renderNavLink({ href: '/auth.html', label: 'Connexion' }), orderButton];
  }
  return [
    renderNavLink({ href: '/account.html', label: session.user.name }),
    el('button', {
      type: 'button',
      className: 'site-nav__link btn btn-link p-0',
      text: 'Déconnexion',
      on: { click: () => session.clear() },
    }),
    orderButton,
  ];
}

function renderHeader() {
  const nav = el(
    'nav',
    { className: 'site-nav', id: 'site-nav', 'aria-label': 'Navigation principale' },
    [
      ...NAV_LINKS.map(renderNavLink),
      el('div', { className: 'site-nav__actions' }, renderAccountActions()),
    ],
  );

  const toggle = el(
    'button',
    {
      type: 'button',
      className: 'site-header__toggle',
      'aria-controls': 'site-nav',
      'aria-expanded': 'false',
      'aria-label': 'Ouvrir le menu',
      on: {
        click: (event) => {
          const isOpen = nav.classList.toggle('is-open');
          event.currentTarget.setAttribute('aria-expanded', String(isOpen));
        },
      },
    },
    [el('i', { className: 'bi bi-list', 'aria-hidden': 'true' })],
  );

  return el('div', { className: 'site-header__inner' }, [
    el('a', { href: '/', className: 'site-header__logo' }, [
      el('img', { src: '/img/logo.png', alt: 'M3alem.ma', width: '128', height: '56' }),
    ]),
    toggle,
    nav,
  ]);
}

function renderFooter() {
  return el('div', { className: 'site-footer__inner' }, [
    el(
      'div',
      { className: 'site-footer__socials' },
      SOCIAL_LINKS.map(({ href, icon, label }) =>
        el('a', { href, target: '_blank', rel: 'noopener noreferrer', 'aria-label': label }, [
          el('i', { className: `bi ${icon}`, 'aria-hidden': 'true' }),
        ]),
      ),
    ),
    el('p', {
      text: `© ${new Date().getFullYear()} M3alem.ma · B click, M3alem ijik · Projet open source sous licence MIT`,
    }),
  ]);
}

function mount() {
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');

  header?.classList.add('site-header');
  footer?.classList.add('site-footer');
  header?.replaceChildren(...(DEMO_MODE ? [renderDemoBanner()] : []), renderHeader());
  footer?.replaceChildren(renderFooter());
}

function renderDemoBanner() {
  return el('p', { className: 'demo-banner', role: 'note', text: DEMO_MESSAGE });
}

mount();
session.subscribe(mount);
