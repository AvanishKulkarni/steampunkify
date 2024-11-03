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
import "@spectrum-web-components/field-label/sp-field-label.js";
import "@spectrum-web-components/number-field/sp-number-field.js";
import "@spectrum-web-components/slider/sp-slider.js";
import "@spectrum-web-components/swatch/sp-swatch.js";

import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import { fabric } from 'fabric';

addOnUISdk.ready.then(async () => {
    console.log("addOnUISdk is ready for use.");
    
    // Get the UI runtime.
    const { runtime } = addOnUISdk.instance;
    const sandboxProxy = await runtime.apiProxy("documentSandbox");
    sandboxProxy.log("Document sandbox up and running.");

    // Input Fields
    const teethInput = document.getElementById("teeth");
    const innerRadiusInput = document.getElementById("inner-radius");
    const outerRadiusInput = document.getElementById("outer-radius");
    const angleInput = document.getElementById("angle");
    const holeInput = document.getElementById("hole-size");

    teethInput.value = 16;
    innerRadiusInput.value = 32;
    outerRadiusInput.value = 8;
    angleInput.value = 16;
    holeInput.value = 16;

    const createGearButton = document.getElementById("createGear");
    const deleteGearButton = document.getElementById("deleteGear");

    const gearColorPicker = document.getElementById("colorPicker");
    const gearColorSwatch = document.getElementById("colorSwatch");
    const intColorPicker = document.getElementById("colorIntPicker");
    const intColorSwatch = document.getElementById("colorIntSwatch");

    gearColorPicker.value = "#a1a1a1";
    gearColorSwatch.color = "#a1a1a1";
    intColorPicker.value = "#ffffff";
    intColorSwatch.color = "#ffffff";

    gearColorSwatch.addEventListener("click", function () {
        gearColorPicker.click();
    })
    gearColorPicker.addEventListener("input", function (event) {
        const selectedColor = event.target.value;
        gearColorSwatch.setAttribute("color", selectedColor);
    })

    intColorSwatch.addEventListener("click", function () {
        intColorPicker.click();
    })
    intColorPicker.addEventListener("input", function (event) {
        const selectedColor = event.target.value;
        intColorSwatch.setAttribute("color", selectedColor);
    })

    createGearButton.onclick = async (event) => {
        await sandboxProxy.addGear({
            teeth: teethInput.value,
            innerRadius: innerRadiusInput.value,
            outerRadius: outerRadiusInput.value,
            angle: angleInput.value,
            hole: holeInput.value,
            color: gearColorPicker.value,
            holeColor: intColorPicker.value,
    });
    }
    deleteGearButton.onclick = async (event) => {
        await sandboxProxy.delGear();
    }
    createGearButton.disabled = false;
    deleteGearButton.disabled = false;
  
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
                    const scaleX = canvas.width / img.width;
                    const scaleY = canvas.height / img.height;
                    console.log("ImageObject updated", imageObject);
                    img.set({
                        left: 0,
                        top: 0,
                        scaleX: Math.min(scaleX,scaleY),
                        scaleY: Math.min(scaleX,scaleY),
                        crossOrigin: 'Anonymous'
                    },
                    {
                        crossOrigin: 'Anonymous'
                    });
                    resolve();
                } else {
                    reject(new Error("Image loading failed"));
                }
            });
        });
    }
    document.getElementById('uploadImage').addEventListener('change', (event) => {
        const reader = new FileReader();
        console.log("After Image inputted", event);
        reader.onload = (e) => {
            const dataURL = e.target.result;
            // console.log("File reader result: ", dataURL);
            
            fabric.Image.fromURL(dataURL, function(img) {
                imageObject = img;
                const scaleX = canvas.width / img.width;
                const scaleY = canvas.height / img.height;
                console.log("ImageObject updated");
                img.set({
                    left: 0,
                    top: 0,
                    scaleX: Math.min(scaleX,scaleY),
                    scaleY: Math.min(scaleX,scaleY),
                    crossOrigin: 'Anonymous'
                },
                {
                    crossOrigin: 'Anonymous'
                });
                canvas.clear();
            });
        };
        reader.onerror = (error) => {
            console.error("Error reading file:", error);
        };
        reader.readAsDataURL(event.target.files[0]);
    });

    document.getElementById('fileClear').addEventListener('click', () => {
        const fileInput = document.getElementById('uploadImage');
        fileInput.value = '';
        imageObject = null;
        canvas.clear();
    });

    document.getElementById('previewButton').addEventListener('click', async () => {
        
        console.log("Upload Button, image exists");
        if (!imageObject) {
            const response = await addOnUISdk.app.document.createRenditions({
                range: "currentPage",
                format: "image/jpeg",
            });
            const downloadUrl = URL.createObjectURL(response[0].blob);
            await loadImage(downloadUrl); // needs to be loaded before continuing on to avoid any errors
        }
        canvas.clear();
        canvas.add(imageObject);
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
        console.log(imageObject);
        imageObject.applyFilters();
        canvas.renderAll();
        const fileInput = document.getElementById("uploadImage");
        if (fileInput.files.length == 0) {
            imageObject = null;
        }
    });
      
    document.getElementById('applyButton').addEventListener('click', async (event) => {
        event.preventDefault();  // Prevent default behavior
        console.log("Download Button clicked");
        
        if (!imageObject) {
            console.error("No image object found for download.");
            return;  // Exit if there is no image to download
        }
        imageObject.applyFilters();
        canvas.renderAll();
        
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1
        });
        console.log("Data URL: ", dataURL);
        
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'filtered-image.png';
        document.body.appendChild(link);
        link.click();
        console.log("Download Link: ", link);
        document.body.removeChild(link);
        canvas.clear();
        
    });

});

//document.addEventListener("DOMContentLoaded", () => {
addOnUISdk.ready.then(async () => {
    const soundLibraryPanel = document.getElementById("sound-list");
  
    // Array of sound effects
    const soundEffects = [
      { name: "Steam Train Horn", file: "sounds/steam-train-horn.mp3" },
      { name: "Steam Hiss", file: "sounds/steam-hiss.mp3" },
      { name: "Gear Clank", file: "sounds/gear-clank.mp3" },
      { name: "Clock Tick", file: "sounds/clock-tick.mp3" },
      { name: "Engine Hum", file: "sounds/engine-hum.mp3" }
    ];
  
    // Function to create each sound item in the list
    soundEffects.forEach((sound) => {
      const soundItem = document.createElement("div");
      soundItem.classList.add("sound-item");
      soundItem.addEventListener("click", () => playSound(sound.file)); //playSound

      addOnUISdk.app.enableDragToDocument(soundItem, {
        previewCallback: sound => {
            return new URL("about:blank");
        },
        completionCallback: async (sound) => {
            return [{ blob: await getBlob(sound.file) }];
        }
    });

        
      const soundName = document.createElement("span");
      soundName.textContent = sound.name;
  
      soundItem.appendChild(soundName);
      soundLibraryPanel.appendChild(soundItem);
    });
  
    // Play sound function
    function playSound(file) {
      const audio = new Audio(file);
      audio.play();
    }


    // Register event handler for "dragstart" event
    addOnUISdk.app.on("dragstart", startDrag);
     // Register event handler for 'dragend' event
    addOnUISdk.app.on("dragend", endDrag);

});

/**
 * Add sound to the document. ???
 */
async function addToDocument(event) {
    const url = event.currentTarget.src;
    const blob = await getBlob(url);
    addOnUISdk.app.document.addImage(blob);
}

/**
 * Handle "dragstart" event
 */
function startDrag(eventData) {
    console.log("The drag event has started for", eventData.element.id);
}

/**
 * Handle "dragend" event
 */
function endDrag(eventData) {
    if (!eventData.dropCancelled) {
        console.log("The drag event has ended for", eventData.element.id);
    } else {
        console.log("The drag event was cancelled for", eventData.element.id);
    }
}



/**
 * Get the binary object for the image.
 */
async function getBlob(url) {
    return await fetch(url).then(response => response.blob());
}
