/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import "@spectrum-web-components/styles/typography.css";

import "@spectrum-web-components/theme/src/themes.js";
import "@spectrum-web-components/theme/theme-light.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/sp-theme.js";

import "@spectrum-web-components/button/sp-button.js";
import '@spectrum-web-components/button-group/sp-button-group.js';

import '@spectrum-web-components/radio/sp-radio.js';
import '@spectrum-web-components/radio/sp-radio-group.js';

import '@spectrum-web-components/link/sp-link.js';

import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import { fabric } from 'fabric';

addOnUISdk.ready.then(async () => {
    console.log("addOnUISdk is ready for use.");
    
    const createShapeButton = document.getElementById("createShape");

    // Get the UI runtime.
    const { runtime } = addOnUISdk.instance;
    const sandboxProxy = await runtime.apiProxy("documentSandbox");
    sandboxProxy.log("Document sandbox up and running.");

    const documentHeight = document.documentElement.scrollHeight;
    const documentWidth = document.documentElement.scrollWidth;
    const iframeWidth = window.innerWidth;
    const canvas = new fabric.Canvas('canvas', {
        width: iframeWidth,
        height: iframeWidth * (documentHeight / documentWidth)
    });
    
    let imageObject;
    
    async function loadImage(downloadUrl) {
        return new Promise((resolve, reject) => {
            fabric.Image.fromURL(downloadUrl, function(img) {
                if (img) {
                    imageObject = img;
                    console.log("ImageObject updated", imageObject);
                    img.set({
                        left: 0,
                        top: 0,
                        scaleX: canvas.width / img.width,
                        scaleY: canvas.height / img.height,
                        crossOrigin: 'Anonymous'
                    },
                    {
                        crossOrigin: 'Anonymous'
                    });
                    canvas.clear();
                    canvas.add(img);
                    resolve();
                } else {
                    reject(new Error("Image loading failed"));
                }
            });
        });
    }
    document.getElementById('applyButton').addEventListener('click', async () => {
        
        console.log("Upload Button, image exists");
        const response = await addOnUISdk.app.document.createRenditions({
            range: "currentPage",
            format: "image/jpeg",
        });
        const downloadUrl = URL.createObjectURL(response[0].blob);
        await loadImage(downloadUrl);
        const filterType = document.getElementById('filter-drop').__selected;
        imageObject.filters = [];
        console.log("FilterTypes: ", filterType);
        switch (filterType) {
            case 'Sepia':
                imageObject.filters.push(new fabric.Image.filters.Sepia());
                break;
            case 'Grayscale':
                imageObject.filters.push(new fabric.Image.filters.Grayscale());
                break;
        }
        console.log("Image Filters: ", imageObject.filters);
        imageObject.applyFilters();
        canvas.renderAll();
    });
    

    async function addImageFromURL(url) {
        try {
          const blob = await fetch(url).then((response) => response.blob());
          await document.addImage(blob);
        } catch (error) {
          console.log("Failed to add the image to the page.");
        }
    }

    document.getElementById('downloadButton').addEventListener('click', async (event) => {
        event.preventDefault();  // Prevent default behavior
        console.log("Download Button clicked");

        if (!imageObject) {
            console.error("No image object found for download.");
            return;  // Exit if there is no image to download
        }
        
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1
        });
        console.log("Data URL: ", dataURL);
        
        await addImageFromURL(dataURL);
    });
});
