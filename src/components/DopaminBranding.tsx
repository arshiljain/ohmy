"use client";

import { useEffect } from "react";

const textReplacements: Array<[string, string]> = [
  ["Shopify Editions", "DOPAMIN"],
  ["Shopify.com", "DOPAMIN"],
  ["Shopify Inc", "DOPAMIN Studio"],
  ["Shopify", "DOPAMIN"],
  ["Winter '26", "WEBSITES · APPS · MARKETING"],
  ["Winter ’26", "WEBSITES · APPS · MARKETING"],
  ["Spring ’26", "WEBSITES"],
  ["Spring '26", "WEBSITES"],
  ["Summer ’25", "MARKETING"],
  ["Summer '25", "MARKETING"],
  ["Winter '25", "APPS"],
  ["Winter ’25", "APPS"],
  ["Editions", "Capabilities"],
  ["View all Editions", "View all services"],
  ["Everywhere", "Creative development"],
  ["Renaissance", "Product & engineering"],
  ["Horizons", "Growth campaigns"],
  ["Boring", "Digital commerce"],
  ["Sidekick", "Websites"],
  ["Agentic", "Apps"],
  ["Online", "E-commerce"],
  ["Retail", "Brand systems"],
  ["Checkout", "Conversion"],
  ["Operations", "Automation"],
  ["Shop app", "Mobile"],
  ["B2B", "Business systems"],
  ["Finance", "Analytics"],
  ["Shipping", "Launch & growth"],
  ["Developer", "Engineering"],
  ["Start for free", "Start a project"],
  ["Search", "Explore"],
  ["Terms of Service", "Terms"],
  ["Privacy Policy", "Privacy"],
  ["commerce renaissance", "digital growth era"],
  ["product updates", "digital experiences"],
  ["merchants", "clients"],
  ["merchant", "client"],
];

function replaceText(value: string) {
  return textReplacements.reduce(
    (result, [from, to]) => result.split(from).join(to),
    value
  );
}

function brandTextNode(node: Text) {
  if (!node.nodeValue || node.parentElement?.closest("script,style,noscript")) {
    return;
  }
  const next = replaceText(node.nodeValue);
  if (next !== node.nodeValue) {
    node.nodeValue = next;
  }
}

function brandAttributes(element: Element) {
  for (const attribute of ["aria-label", "alt", "title"]) {
    const value = element.getAttribute(attribute);
    if (!value) continue;
    const next = replaceText(value);
    if (next !== value) element.setAttribute(attribute, next);
  }

  if (element instanceof HTMLAnchorElement) {
    const href = element.getAttribute("href") ?? "";
    if (/https?:\/\/(?:www\.|admin\.)?shopify\.com/i.test(href)) {
      element.setAttribute("href", "#main-content");
      element.removeAttribute("target");
    }
  }

  if (element instanceof HTMLFormElement && /winter2026\.html/i.test(element.action)) {
    element.setAttribute("action", "#main-content");
  }
}

function installLogo() {
  const logoLink = document.querySelector<HTMLAnchorElement>(
    'header h1 a.back-to-top, header h1 a[href="/"]'
  );
  if (!logoLink || logoLink.dataset.dopaminLogo === "true") return;

  logoLink.dataset.dopaminLogo = "true";
  logoLink.innerHTML = "";
  const image = document.createElement("img");
  image.src = "/dopamin-logo.png";
  image.alt = "DOPAMIN";
  image.decoding = "async";
  image.style.width = "138px";
  image.style.height = "62px";
  image.style.maxWidth = "38vw";
  image.style.objectFit = "contain";
  image.style.display = "block";
  image.style.filter = "drop-shadow(0 0 14px rgba(255,255,255,.12))";
  logoLink.appendChild(image);
}

function applyBranding(root: ParentNode = document) {
  for (const node of root.querySelectorAll("*") as NodeListOf<Element>) {
    brandAttributes(node);
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) brandTextNode(child as Text);
    }
  }
  for (const node of Array.from(root.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) brandTextNode(node as Text);
  }
  installLogo();
}

export function DopaminBranding() {
  useEffect(() => {
    document.title = "DOPAMIN — Websites · Apps · Marketing";
    document.documentElement.dataset.brand = "dopamin";

    applyBranding();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node.nodeType === Node.TEXT_NODE) {
            brandTextNode(node as Text);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            applyBranding(node as Element);
          }
        }
      }
      installLogo();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
