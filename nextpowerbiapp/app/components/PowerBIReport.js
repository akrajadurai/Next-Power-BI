'use client'
import { useEffect, useRef } from 'react';
//import { models, Embed } from 'powerbi-client';
import * as powerbi from "powerbi-client";

const PowerBIReport = ({ embedUrl, accessToken, reportId }) => {
  const reportContainerRef = useRef(null);
 
  useEffect(() => {
   // if (reportContainerRef.current) {
      //const powerbi = new Embed.PowerBI();
      
      const embedConfig = {
        type: 'report', // Can be 'report', 'dashboard', or 'tile'
        id: reportId,
        embedUrl: embedUrl,
        accessToken: accessToken,
        //tokenType: models.TokenType.Aad, // or models.TokenType.Embed if using Embed token
        settings: {
          panes: {
            filters: {
              visible: false
            },
            pageNavigation: {
              visible: false
            }
          }
        }
      };
 
      // Embed the report and display it within the container
      //powerbi.embed(reportContainerRef.current, embedConfig);

      const powerbiService = new powerbi.service.Service(
        powerbi.factories.hpmFactory,
        powerbi.factories.wpmpFactory,
        powerbi.factories.routerFactory
      );
      const embedContainer = document.getElementById("embedContainer");
      const report = powerbiService.embed(embedContainer, embedConfig);

   // }
  }, [embedUrl, accessToken, reportId]);
 
  return <div id="embedContainer"  style={{ height: '100vh', width: '100%' }} />;
};
 
export default PowerBIReport;