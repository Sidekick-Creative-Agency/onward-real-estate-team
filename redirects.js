const redirects = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header',
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }
  const emailSignaturesRedirect = {
    destination: '/email-signatures.html',
    source: '/email-signatures',
    permanent: true,
  }
  const iabsRedirects = [
    {
      source: '/api/attachments/file/onward-IABS-2026-ujviUU1HEd.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-wErVTkQbUA.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-KyleCox-UUY7u4puyj.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-KyleCox-AO2QoF7ku6.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-MasonFrucci-nYx13F3ZGG.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-MasonFrucci-cg2ZaKOswo.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-DavidHaragan-iEkzK70BYt.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-DavidHaragan-ZpPCYT9qPf.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-MelissaHarrell-8wDtdnsfWp.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-MelissaHarrell-4zpNPVoxB4.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-BradHarrell-W6jlKe3QGL.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-BradHarrell-7R1kYvkG1v.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-LinaPerez-23ql6TS0iW.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-LinaLopez-0GEpjbXWff.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-XavierRosas-IuwA6n3PVo.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-XavierRosas-vqOgYIPcDw.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-AdamVoight-7oZMUN49Om.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-AdamVoight-Ahfxz21cxj.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-MichaelWarren-KPOR7rOeI7.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-MichaelWarren-x0jRJ7owDI.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-TaylorWilson-z99JTgCsD3.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-TaylorWilson-EZgXnOu5vA.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-JeffYoung-k3lWRY2UHx.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-JeffYoung-noePgyGCWr.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-TrishaYoung-8JABhgQMGW.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-TrishaYoung-QqmfERv2gA.pdf',
      permanent: true,
    },
    // ******************************************
    {
      source: '/api/attachments/file/onward-IABS-2026-prk6Sh3wCl.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-wErVTkQbUA.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-KyleCox-C9Kl1yK1rs.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-KyleCox-AO2QoF7ku6.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-MasonFrucci-xHvPuOU1tl.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-MasonFrucci-cg2ZaKOswo.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-DavidHaragan-a43dJSpXRW.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-DavidHaragan-ZpPCYT9qPf.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-MelissaHarrell-Df6OrTrpyp.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-MelissaHarrell-4zpNPVoxB4.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-BradHarrell-ybnuPPyHQ2.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-BradHarrell-7R1kYvkG1v.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-LinaLopez-U7Mo6AAG89.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-LinaLopez-0GEpjbXWff.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-XavierRosas-NLt0SnLDv5.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-XavierRosas-vqOgYIPcDw.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-AdamVoight-hd4o6yLV89.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-AdamVoight-Ahfxz21cxj.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-MichaelWarren-vQwpEwh720.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-MichaelWarren-x0jRJ7owDI.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-TaylorWilson-IQsXaNaYSq.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-TaylorWilson-EZgXnOu5vA.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-JeffYoung-uxFEq6rfp4.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-JeffYoung-noePgyGCWr.pdf',
      permanent: true,
    },
    {
      source: '/api/attachments/file/onward-IABS-2026-TrishaYoung-d8WMQbHOsh.pdf',
      destination: '/api/attachments/file/onward-IABS-2026-TrishaYoung-QqmfERv2gA.pdf',
      permanent: true,
    },
  ]

  const redirects = [internetExplorerRedirect, emailSignaturesRedirect, ...iabsRedirects]

  return redirects
}

export default redirects
