import type { NextApiRequest, NextApiResponse } from "next";
export default function handler(_req:NextApiRequest,res:NextApiResponse){
  const base="https://cabanagrp.com";
  const urls=["","features","pricing","contact"]
    .map(p=>`<url><loc>${base}/${p}</loc></url>`).join("");
  res.setHeader("Content-Type","application/xml");
  res.status(200).send(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
  );
}
