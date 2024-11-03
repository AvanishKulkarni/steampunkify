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
import { editor } from "express-document-sdk";
const { runtime } = addOnSandboxSdk.instance;

function start() {
  runtime.exposeApi({
    log: (...args) => {
      console.log(...args);
    },
    addGear({ teeth, innerRadius, outerRadius, angle }) {
      console.log("addGear", teeth, innerRadius, outerRadius, angle);
      // generate a gear...
      const doc = editor.documentRoot;
      const page = doc.pages.first;

      let pathData = "";
      let angleStep = (2 * Math.PI) / teeth;
      let toothDepth = outerRadius;
      let offset = Math.tan(angle * (Math.PI / 180)) * (toothDepth) / 2;
      for (let i = 0; i < teeth; i++) {
        let a = i * angleStep;
        let outerX = ((innerRadius + toothDepth) * Math.cos(a)) + (0.5 * offset * Math.sin(a));
        let outerY = ((innerRadius + toothDepth) * Math.sin(a)) - (0.5 * offset * Math.cos(a));
        let outerX2 = ((innerRadius + toothDepth) * Math.cos(a)) - (0.5 * offset * Math.sin(a));
        let outerY2 = ((innerRadius + toothDepth) * Math.sin(a)) + (0.5 * offset * Math.cos(a));
        pathData += (i === 0 ? `M ${outerX} ${outerY} ` : `L ${outerX} ${outerY} `);
        pathData += (i === 0 ? `M ${outerX2} ${outerY2} ` : `L ${outerX2} ${outerY2} `);

        a += angleStep / 2;
        let innerX = (innerRadius * Math.cos(a)) + (0.25 * offset * Math.sin(a));
        let innerY = (innerRadius * Math.sin(a)) - (0.25 * offset * Math.cos(a));
        let innerX2 = (innerRadius * Math.cos(a)) - (0.25 * offset * Math.sin(a));
        let innerY2 = (innerRadius * Math.sin(a)) + (0.25 * offset * Math.cos(a));
        pathData += `L ${innerX} ${innerY} `;
        pathData += `L ${innerX2} ${innerY2} `;
      }
      pathData += "Z"

      let gear = editor.createPath(pathData);
      gear.setPositionInParent({ x: 0, y: 0 }, { x: -innerRadius, y: -innerRadius });

      let c = editor.createEllipse()
      c.rx = innerRadius / 2;
      c.ry = innerRadius / 2;
      c.setPositionInParent({ x: 0, y: 0 }, { x: -innerRadius / 2, y: -innerRadius / 2 });

      // var teethArr = [];

      // for (let i = 0; i < teeth; i++) {
      //   let r = editor.createRectangle();
      //   r.width = outerRadius;
      //   r.height = 10;
      //   r.setPositionInParent(
      //     { x: page.width / 2 + innerRadius, y: page.height / 2 },
      //     { x: 0, y: r.height / 2 }
      //   )
      //   r.setRotationInParent(i * (360 / teeth), { x: r.width / 2 - innerRadius, y: r.height / 2 });
      //   teethArr.push(r);
      // }

      // page.artboards.first.children.append(c);
      // teethArr.forEach((r) => page.artboards.first.children.append(r));
      page.artboards.first.children.append(gear);
      page.artboards.first.children.append(c);
    },
    delGear() {
      console.log("delGear");
    }
    // other properties will go here...
  });
}

start();
