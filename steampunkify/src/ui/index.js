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
import "@spectrum-web-components/button-group/sp-button-group.js";
import "@spectrum-web-components/field-label/sp-field-label.js";
import "@spectrum-web-components/number-field/sp-number-field.js";
import "@spectrum-web-components/slider/sp-slider.js";
import "@spectrum-web-components/swatch/sp-swatch.js";


import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

addOnUISdk.ready.then(async () => {
  console.log("addOnUISdk is ready for use.");

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
  intColorSwatch.addEventListener("input", function (event) {
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

  // Get the UI runtime.
  const { runtime } = addOnUISdk.instance;
  const sandboxProxy = await runtime.apiProxy("documentSandbox");
  sandboxProxy.log("Document sandbox up and running.");

  // Enabling CTA elements only when the addOnUISdk is ready
  createGearButton.disabled = false;
  deleteGearButton.disabled = false;
});
