<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, follow" />
        <title>Bhaagyavedh — Sitemap</title>
        <style>
          :root {
            --bg: #faf7f2;
            --card: #ffffff;
            --ink: #2a1f14;
            --muted: #7a6b57;
            --accent: #b8541a;
            --accent-soft: #fde8d3;
            --border: #e8dfd1;
            --row: #fff9f0;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
            background: var(--bg);
            color: var(--ink);
            line-height: 1.5;
          }
          .wrap { max-width: 1100px; margin: 0 auto; padding: 32px 20px; }
          header {
            display: flex;
            align-items: center;
            gap: 14px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--border);
            margin-bottom: 24px;
          }
          .logo {
            width: 44px; height: 44px;
            background: var(--accent);
            color: #fff;
            border-radius: 10px;
            display: grid; place-items: center;
            font-weight: 700;
            font-size: 20px;
          }
          h1 { font-size: 22px; margin: 0; font-weight: 700; }
          .sub { color: var(--muted); font-size: 13px; margin-top: 2px; }
          .meta {
            display: flex; flex-wrap: wrap; gap: 10px;
            margin-bottom: 20px;
          }
          .pill {
            background: var(--accent-soft);
            color: var(--accent);
            padding: 6px 12px;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 600;
          }
          .card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 12px;
            overflow: hidden;
          }
          table { width: 100%; border-collapse: collapse; font-size: 14px; }
          th {
            text-align: left;
            padding: 12px 16px;
            background: var(--row);
            font-weight: 600;
            color: var(--muted);
            border-bottom: 1px solid var(--border);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }
          td {
            padding: 12px 16px;
            border-bottom: 1px solid var(--border);
            vertical-align: top;
          }
          tr:last-child td { border-bottom: none; }
          tr:hover td { background: var(--row); }
          a { color: var(--accent); text-decoration: none; word-break: break-all; }
          a:hover { text-decoration: underline; }
          .num { color: var(--muted); font-variant-numeric: tabular-nums; width: 48px; }
          .tag {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 6px;
            background: var(--accent-soft);
            color: var(--accent);
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.03em;
          }
          .date, .freq, .prio {
            color: var(--muted);
            font-size: 12px;
            font-variant-numeric: tabular-nums;
            white-space: nowrap;
          }
          footer {
            margin-top: 24px;
            text-align: center;
            color: var(--muted);
            font-size: 12px;
          }
          @media (max-width: 640px) {
            .hide-m { display: none; }
            td, th { padding: 10px 12px; }
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <header>
            <div class="logo">B</div>
            <div>
              <h1>Bhaagyavedh Sitemap</h1>
              <div class="sub">XML sitemap rendered with stylesheet for readability. Crawlers receive raw XML.</div>
            </div>
          </header>

          <xsl:choose>
            <xsl:when test="s:sitemapindex">
              <div class="meta">
                <span class="pill">Sitemap Index</span>
                <span class="pill"><xsl:value-of select="count(s:sitemapindex/s:sitemap)" /> sub-sitemaps</span>
              </div>
              <div class="card">
                <table>
                  <thead>
                    <tr>
                      <th class="num">#</th>
                      <th>Sitemap URL</th>
                      <th class="hide-m">Last Modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="s:sitemapindex/s:sitemap">
                      <tr>
                        <td class="num"><xsl:value-of select="position()" /></td>
                        <td>
                          <a href="{s:loc}"><xsl:value-of select="s:loc" /></a>
                        </td>
                        <td class="hide-m date"><xsl:value-of select="substring(s:lastmod, 1, 10)" /></td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </div>
            </xsl:when>

            <xsl:otherwise>
              <div class="meta">
                <span class="pill">URL Set</span>
                <span class="pill"><xsl:value-of select="count(s:urlset/s:url)" /> URLs</span>
              </div>
              <div class="card">
                <table>
                  <thead>
                    <tr>
                      <th class="num">#</th>
                      <th>URL</th>
                      <th class="hide-m">Lang</th>
                      <th class="hide-m">Last Mod</th>
                      <th class="hide-m">Freq</th>
                      <th class="hide-m">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="s:urlset/s:url">
                      <tr>
                        <td class="num"><xsl:value-of select="position()" /></td>
                        <td>
                          <a href="{s:loc}"><xsl:value-of select="s:loc" /></a>
                        </td>
                        <td class="hide-m">
                          <xsl:choose>
                            <xsl:when test="contains(s:loc, '/mr/') or substring(s:loc, string-length(s:loc) - 2) = '/mr'">
                              <span class="tag">mr</span>
                            </xsl:when>
                            <xsl:when test="contains(s:loc, '/en/') or substring(s:loc, string-length(s:loc) - 2) = '/en'">
                              <span class="tag">en</span>
                            </xsl:when>
                          </xsl:choose>
                        </td>
                        <td class="hide-m date"><xsl:value-of select="substring(s:lastmod, 1, 10)" /></td>
                        <td class="hide-m freq"><xsl:value-of select="s:changefreq" /></td>
                        <td class="hide-m prio"><xsl:value-of select="s:priority" /></td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </div>
            </xsl:otherwise>
          </xsl:choose>

          <footer>
            <a href="https://bhaagyavedh.com">bhaagyavedh.com</a> — Hindu astrology, kundli, panchang, rashifal
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
