'use client'

import Image from "next/image";
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client'
import React, { lazy, Suspense, useEffect, useState } from "react";

export default function Home() {
  const [token, setToken] = React.useState();;
  const [embedUrl, setEmbedUrl] = React.useState();;

  const getToken = async () => {
    const headers = { 'Content-Type': 'application/json' };
    const response = await fetch('https://popshopshopifyapi.azurewebsites.net/api/Report/GetPBIAccessToken', { method: 'GET', headers });
    if (!response.ok) { throw new Error('Failed to fetch product data'); }
    const tokenResult = await response.text();
    console.log(tokenResult)
    setToken(tokenResult);
    //await getEmbeddedUrl(tokenResult);
  };
  const getEmbeddedUrl = async (ak) => {
    if(!embedUrl){
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ak}` };
    const response = await fetch('https://api.powerbi.com/v1.0/myorg/reports/a36dbcd4-3a35-4185-804d-40b868f5f376', { method: 'GET', headers });
    if (!response.ok) { throw new Error('Failed to fetch product data'); }
    const responseData = await response.json();
    console.log(responseData.embedUrl)
    setEmbedUrl(responseData.embedUrl);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      await getToken();
    };

    fetchToken();

    const interval = setInterval(() => {
      fetchToken();
    }, 50 * 60 * 1000); // 50 minutes

    return () => {
      clearInterval(interval);
    };
  }, []);

  // useEffect(() => {
  //   if (token != "")
  //     getEmbeddedUrl();
  // }, [token]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 bg-gray-100 dark:bg-gray-900">

      <div className="w-full flex flex-col items-center">
        <PowerBIEmbed
          embedConfig={{
            type: 'report',   // Supported types: report, dashboard, tile, visual, qna, paginated report and create
            id: "a36dbcd4-3a35-4185-804d-40b868f5f376",
            embedUrl: "https://app.powerbi.com/reportEmbed?reportId=a36dbcd4-3a35-4185-804d-40b868f5f376&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVTLUVBU1QyLUQtUFJJTUFSWS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsidXNhZ2VNZXRyaWNzVk5leHQiOnRydWV9fQ%3d%3d",
            accessToken: token,
           // tokenType: models.TokenType.Embed, // Use models.TokenType.Aad for SaaS embed
            settings: {
              panes: {
                filters: {
                  expanded: false,
                  visible: false
                }
              },
            }
          }}

          eventHandlers={
            new Map([
              ['loaded', function () { console.log('Report loaded'); }],
              ['rendered', function () { console.log('Report rendered'); }],
              ['error', function (event) { console.log(event.detail); }],
              ['visualClicked', () => console.log('visual clicked')],
              ['pageChanged', (event) => console.log(event)],
            ])
          }

          cssClassName={"w-full h-96 md:w-3/4 lg:w-1/2 rounded-lg shadow-lg bg-white dark:bg-gray-800 p-4"}

          getEmbeddedComponent={(embeddedReport) => {
            window.report = embeddedReport;
          }}
        />
      </div>

    </main>
  );
}
        