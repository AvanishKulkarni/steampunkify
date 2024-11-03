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

import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor, colorUtils } from "express-document-sdk";
const { runtime } = addOnSandboxSdk.instance;

let gearRef = null;

function start() {
  runtime.exposeApi({
    log: (...args) => {
      console.log(...args);
    },
    addGear({ teeth, innerRadius, outerRadius, angle, hole, color, holeColor }) {
      // console.log("addGear", teeth, innerRadius, outerRadius, angle);
      // generate a gear...
      const doc = editor.documentRoot;
      const page = doc.pages.first;
      const gearGroup = editor.createGroup();



      let pathData = "";
      let angleStep = (2 * Math.PI) / teeth;
      let toothDepth = outerRadius;
      let offset = Math.cos(angle * (Math.PI / 180)) / teeth * 0.01 * Math.PI * (innerRadius ** 2);
      for (let i = 0; i < teeth; i++) {
        let a = i * angleStep;
        let outerX = ((innerRadius + toothDepth) * Math.cos(a)) + (offset * Math.sin(a));
        let outerY = ((innerRadius + toothDepth) * Math.sin(a)) - (offset * Math.cos(a));
        let outerX2 = ((innerRadius + toothDepth) * Math.cos(a)) - (offset * Math.sin(a));
        let outerY2 = ((innerRadius + toothDepth) * Math.sin(a)) + (offset * Math.cos(a));
        pathData += (i === 0 ? `M ${outerX} ${outerY} ` : `L ${outerX} ${outerY} `);
        pathData += (i === 0 ? `M ${outerX2} ${outerY2} ` : `L ${outerX2} ${outerY2} `);

        a += angleStep / 2;
        let innerX = (innerRadius * Math.cos(a)) + (offset * Math.sin(a));
        let innerY = (innerRadius * Math.sin(a)) - (offset * Math.cos(a));
        let innerX2 = (innerRadius * Math.cos(a)) - (offset * Math.sin(a));
        let innerY2 = (innerRadius * Math.sin(a)) + (offset * Math.cos(a));
        pathData += `L ${innerX} ${innerY} `;
        pathData += `L ${innerX2} ${innerY2} `;
      }
      pathData += "Z"

      let gear = editor.createPath(pathData);
      gear.setPositionInParent({ x: 0, y: 0 }, { x: -innerRadius, y: -innerRadius });
      gear.fill = editor.makeColorFill(colorUtils.fromHex(color));

      let ratio = (hole / 100);
      let c = editor.createEllipse();
      c.rx = innerRadius * ratio;
      c.ry = innerRadius * ratio;
      c.setPositionInParent({ x: 0, y: 0 }, { x: -innerRadius * ratio, y: -innerRadius * ratio });
      c.fill = editor.makeColorFill(colorUtils.fromHex(holeColor));
      c.stroke = editor.makeStroke({ alpha: 1, red: 0, green: 0, blue: 0 });

      gearGroup.children.append(gear);
      gearGroup.children.append(c);

      gearRef = gearGroup;

      page.artboards.first.children.append(gearGroup);

    },
    delGear() {
      console.log("delGear");
      if (gearRef) {
        try {
          gearRef.removeFromParent();
        } catch (error) {
          console.error(error);
          return "Error: No tracked gear!";
        }
      }
    }
    // other properties will go here...
  });
}

start();
