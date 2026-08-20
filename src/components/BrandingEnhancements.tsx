"use client";

import { useEffect } from "react";

const exactReplacements: Record<string, string> = {
  "Shopify Editions": "Dune Rise",
  "Winter '26": "Studio / 2026",
  "Winter ’26": "Studio / 2026",
  "Spring ’26": "Brand Systems",
  "Summer ’25": "Digital Products",
  "Winter '25": "Web Experiences",
  "Renaissance": "Built for what’s next",
  "Everywhere": "Across every touchpoint",
  "Horizons": "Beyond the screen",
  "Boring": "Never ordinary",
  "View all Editions": "View all work",
  "Start for free": "Start a project",
  "Shopify.com": "Dune Rise Studio",
  "Search": "Explore",
};

const phraseReplacements: Array<[RegExp, string]> = [
  [/the commerce renaissance is here/gi, "We build brands, products, and digital experiences for what’s next"],
  [/explore 150\+ product updates across ai, retail, and more/gi, "Explore a studio built around identity, digital products, web, and creative technology"],
  [/commerce renaissance/gi, "digital transformation"],
  [/commerce/gi, "digital"],
  [/Shopify/gi, "Dune Rise"],
  [/merchants/gi, "founders"],
  [/merchant/gi, "founder"],
  [/storefronts/gi, "digital experiences"],
  [/storefront/gi, "digital experience"],
  [/retail/gi, "brand"],
];

function replaceCopy(value: string) {
  let next = value.trim();
  if (!next) return value;

  if (exactReplacements[next]) return value.replace(next, exactReplacements[next]);

  for (const [pattern, replacement] of phraseReplacements) {
    next = next.replace(pattern, replacement);
  }

  return value.replace(value.trim(), next);
}

function walkText(root: Element) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    nodes.push(node as Text);
  }

  for (const textNode of nodes) {
    const parent = textNode.parentElement;
    if (!parent) continue;
    if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) continue;
    const current = textNode.nodeValue ?? "";
    const next = replaceCopy(current);
    if (next !== current) textNode.nodeValue = next;
  }
}

function updateAttributes(root: Element) {
  root.querySelectorAll<HTMLElement>("[aria-label], [title], img[alt]").forEach((element) => {
    for (const attribute of ["aria-label", "title", "alt"]) {
      const value = element.getAttribute(attribute);
      if (!value) continue;
      const next = replaceCopy(value);
      if (next !== value) element.setAttribute(attribute, next);
    }
  });
}

function retargetPrimaryLinks(root: Element) {
  root.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
    const href = link.getAttribute("href") ?? "";
    const label = (link.textContent ?? "").trim().toLowerCase();

    if (href.includes("shopify.com") || href.includes("admin.shopify.com")) {
      if (label.includes("start a project")) link.href = "#contact";
      else if (label.includes("dune rise studio")) link.href = "#top";
      else link.href = "#work";
    }
  });
}

function ensureContactAnchor(root: Element) {
  const existing = root.querySelector("#contact");
  if (existing) return;

  const candidate = Array.from(root.querySelectorAll<HTMLElement>("a, button"))
    .find((element) => /talk|contact|get started|start a project|let's work/i.test(element.textContent ?? ""));

  if (candidate) candidate.setAttribute("id", "contact");
}

export function BrandingEnhancements() {
  useEffect(() => {
    const root = document.getElementById("captured-page");
    if (!root) return;

    const applyBranding = () => {
      walkText(root);
      updateAttributes(root);
      retargetPrimaryLinks(root);
      ensureContactAnchor(root);

      const logo = root.querySelector<HTMLElement>('a.back-to-top');
      const logoText = logo?.querySelector<HTMLElement>("span.flex.flex-col");
      if (logoText && logoText.dataset.duneBranded !== "true") {
        logoText.innerHTML = "<span>DUNE RISE</span>";
        logoText.dataset.duneBranded = "true";
      }
    };

    applyBranding();
    const observer = new MutationObserver(() => applyBranding());
    observer.observe(root, { subtree: true, childList: true, characterData: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
