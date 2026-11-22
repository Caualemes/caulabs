/**
 * ============================================================================
 * CAULABS | IMPRESSÃO 3D — LINKS & SIMULAÇÃO 3D WEBGL (THREE.JS)
 * ============================================================================
 * Coloque os seus links finais abaixo quando estiverem prontos:
 */

const CAULABS_LINKS = {
  shopee: "https://shopee.com.br/caulabs",
  whatsapp: "https://wa.me/5518991149093?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20CauLabs%20e%20gostaria%20de%20saber%20mais%20sobre%20as%20pe%C3%A7as%20e%20encomendas%20em%20impress%C3%A3o%203D.",
  instagram: "https://instagram.com/caulabs.3d"
};

// Aplica os links configurados
document.querySelectorAll(".link-card[data-channel]").forEach((card) => {
  const key = card.getAttribute("data-channel");
  const url = CAULABS_LINKS[key];
  if (url) {
    card.setAttribute("href", url);
    card.setAttribute("target", "_blank");
    card.setAttribute("rel", "noopener noreferrer");
  }
});

// Brilho suave Seda acompanhando o cursor nos botões de link
document.querySelectorAll("[data-glow-card]").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  });
});

/* ============================================================================
   SIMULAÇÃO 3D REALISTA EM WEBGL (THREE.JS):
   IMPRESSORA 3D COREXY IMPRIMINDO UM GATINHO TOY-ART EM FILAMENTO SEDA
   ============================================================================ */
(function initWebGLPrinter() {
  const mount = document.getElementById("printerWebglMount");
  if (!mount || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();

  const width = mount.clientWidth || 500;
  const height = mount.clientHeight || 490;

  const camera = new THREE.PerspectiveCamera(33, width / height, 0.1, 100);
  camera.position.set(4.7, 2.9, 6.1);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.localClippingEnabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  mount.appendChild(renderer.domElement);

  const printerRoot = new THREE.Group();
  printerRoot.position.y = -0.15;
  scene.add(printerRoot);

  // --------------------------------------------------------------------------
  // 1. ILUMINAÇÃO DE ESTÚDIO (GRAFITE + LILÁS SEDA + LUZ QUENTE DO BICO)
  // --------------------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0x2c2048, 1.45);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xf6f2ff, 1.65);
  keyLight.position.set(5, 8, 6);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x5b43db, 2.1);
  rimLight.position.set(-6, 4, -5);
  scene.add(rimLight);

  const fillLight = new THREE.DirectionalLight(0xa796ff, 0.95);
  fillLight.position.set(-4, 2, 5);
  scene.add(fillLight);

  const nozzleLight = new THREE.PointLight(0xffb478, 2.5, 3.0, 2);
  printerRoot.add(nozzleLight);

  const laserGlowLight = new THREE.PointLight(0xa796ff, 1.4, 2.8, 2);
  printerRoot.add(laserGlowLight);

  // --------------------------------------------------------------------------
  // 2. ESTRUTURA DA IMPRESSORA 3D COREXY (CHASSI, GUIAS LINEARES & MESA PEI)
  // --------------------------------------------------------------------------
  const darkFrameMat = new THREE.MeshStandardMaterial({
    color: 0x15111e,
    metalness: 0.78,
    roughness: 0.28
  });

  const chromeRodMat = new THREE.MeshStandardMaterial({
    color: 0xd8d6e2,
    metalness: 0.92,
    roughness: 0.14
  });

  const accentSedaMat = new THREE.MeshStandardMaterial({
    color: 0xa796ff,
    emissive: 0x5b43db,
    emissiveIntensity: 0.55,
    metalness: 0.4,
    roughness: 0.3
  });

  const bedY = -1.25;
  const topY = 1.62;
  const frameHalf = 1.38;

  // Base inferior e Mesa Aquecida PEI
  const basePlate = new THREE.Mesh(new THREE.BoxGeometry(2.86, 0.14, 2.86), darkFrameMat);
  basePlate.position.y = bedY - 0.11;
  printerRoot.add(basePlate);

  const peiMat = new THREE.MeshStandardMaterial({
    color: 0x0d0a12,
    metalness: 0.55,
    roughness: 0.22
  });
  const peiBed = new THREE.Mesh(new THREE.BoxGeometry(2.44, 0.04, 2.44), peiMat);
  peiBed.position.y = bedY - 0.02;
  printerRoot.add(peiBed);

  const gridHelper = new THREE.GridHelper(2.36, 12, 0xa796ff, 0x2d2444);
  gridHelper.position.y = bedY + 0.003;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.55;
  printerRoot.add(gridHelper);

  const bedBorderGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.46, 0.042, 2.46));
  const bedBorderMat = new THREE.LineBasicMaterial({
    color: 0xa796ff,
    transparent: true,
    opacity: 0.45
  });
  const bedBorder = new THREE.LineSegments(bedBorderGeo, bedBorderMat);
  bedBorder.position.y = bedY - 0.02;
  printerRoot.add(bedBorder);

  // Colunas e barras superiores do chassi CoreXY
  const pillarGeo = new THREE.BoxGeometry(0.11, topY - bedY + 0.2, 0.11);
  [
    [-frameHalf, -frameHalf],
    [frameHalf, -frameHalf],
    [frameHalf, frameHalf],
    [-frameHalf, frameHalf]
  ].forEach(([cx, cz]) => {
    const pillar = new THREE.Mesh(pillarGeo, darkFrameMat);
    pillar.position.set(cx, (topY + bedY) * 0.5 - 0.02, cz);
    printerRoot.add(pillar);
  });

  const topBarGeoX = new THREE.BoxGeometry(frameHalf * 2 + 0.11, 0.1, 0.11);
  const topBarGeoZ = new THREE.BoxGeometry(0.11, 0.1, frameHalf * 2 + 0.11);
  [-frameHalf, frameHalf].forEach((pos) => {
    const bx = new THREE.Mesh(topBarGeoX, darkFrameMat);
    bx.position.set(0, topY, pos);
    printerRoot.add(bx);

    const bz = new THREE.Mesh(topBarGeoZ, darkFrameMat);
    bz.position.set(pos, topY, 0);
    printerRoot.add(bz);
  });

  const zRodGeo = new THREE.CylinderGeometry(0.024, 0.024, topY - bedY, 16);
  [-frameHalf + 0.14, frameHalf - 0.14].forEach((rx) => {
    const rod = new THREE.Mesh(zRodGeo, chromeRodMat);
    rod.position.set(rx, (topY + bedY) * 0.5, 0);
    printerRoot.add(rod);
  });

  // --------------------------------------------------------------------------
  // 3. MODELAGEM 3D DO BICHINHO: GATINHO TOY-ART ("CHIBI CAT") EM FILAMENTO SEDA
  // --------------------------------------------------------------------------
  const printMinY = bedY;
  const printMaxHeight = 2.02;
  let printProgress = 0.22;

  const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), printMinY + 0.2);

  // Textura sutil de camadas horizontais 0.12mm
  function createLayerBumpTexture() {
    const c = document.createElement("canvas");
    c.width = 16;
    c.height = 512;
    const g = c.getContext("2d");
    for (let y = 0; y < c.height; y++) {
      const wave = Math.floor(128 + Math.sin((y / c.height) * Math.PI * 190) * 95);
      g.fillStyle = `rgb(${wave},${wave},${wave})`;
      g.fillRect(0, y, c.width, 1);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 3);
    return tex;
  }

  // Mescla geometrias mantendo buffer indexado compacto (< 20.000 vértices)
  function appendIndexedGeometry(targetPos, targetNorm, targetIdx, geo, matrix) {
    const cloned = geo.clone();
    cloned.applyMatrix4(matrix);
    cloned.computeVertexNormals();

    const pos = cloned.attributes.position.array;
    const norm = cloned.attributes.normal.array;
    const baseVertexOffset = targetPos.length / 3;

    for (let i = 0; i < pos.length; i++) {
      targetPos.push(pos[i]);
      targetNorm.push(norm[i]);
    }

    if (cloned.index) {
      const idxArr = cloned.index.array;
      for (let i = 0; i < idxArr.length; i++) {
        targetIdx.push(baseVertexOffset + idxArr[i]);
      }
    } else {
      const vertCount = pos.length / 3;
      for (let i = 0; i < vertCount; i++) {
        targetIdx.push(baseVertexOffset + i);
      }
    }
  }

  // Constrói a geometria 3D completa do Gatinho Toy-Art sentado na mesa
  function buildCuteKittenGeometry() {
    const allPos = [];
    const allNorm = [];
    const allIdx = [];
    const m = new THREE.Matrix4();
    const s = new THREE.Matrix4();
    const r = new THREE.Matrix4();

    function addPart(geo, tx, ty, tz, sx = 1, sy = 1, sz = 1, rx = 0, ry = 0, rz = 0) {
      m.identity();
      m.makeTranslation(tx, bedY + ty, tz);
      if (rx || ry || rz) {
        r.makeRotationFromEuler(new THREE.Euler(rx, ry, rz));
        m.multiply(r);
      }
      if (sx !== 1 || sy !== 1 || sz !== 1) {
        s.makeScale(sx, sy, sz);
        m.multiply(s);
      }
      appendIndexedGeometry(allPos, allNorm, allIdx, geo, m);
    }

    const sphereHi = new THREE.SphereGeometry(1, 32, 24);
    const sphereMed = new THREE.SphereGeometry(1, 18, 14);

    // 1. Corpinho gordinho sentado (formato pêra fofinho)
    const bodyPoints = [];
    const bodySteps = 24;
    for (let i = 0; i <= bodySteps; i++) {
      const t = i / bodySteps;
      const y = t * 0.94;
      const rad =
        t < 0.08
          ? 0.34 + (t / 0.08) * 0.15
          : 0.49 * Math.sin(t * Math.PI * 0.72 + 0.35) * (1 - t * 0.25) + 0.14;
      bodyPoints.push(new THREE.Vector2(Math.max(0.01, rad), y));
    }
    const bodyLathe = new THREE.LatheGeometry(bodyPoints, 36);
    addPart(bodyLathe, 0, 0, 0.02, 1.04, 1.0, 0.96);

    // Barriguinha saliente na frente
    addPart(sphereHi, 0, 0.42, 0.11, 0.39, 0.36, 0.36);

    // 2. Coxinhas e Patinhas Traseiras sentadas nas laterais
    [-1, 1].forEach((side) => {
      addPart(sphereMed, side * 0.37, 0.24, -0.02, 0.23, 0.23, 0.27, 0, side * 0.2, 0);
      addPart(sphereMed, side * 0.41, 0.095, 0.25, 0.16, 0.1, 0.22, 0, side * 0.25, 0);
      for (let d = -1; d <= 1; d++) {
        addPart(
          sphereMed,
          side * 0.41 + d * 0.045 + side * 0.02,
          0.075,
          0.42 - Math.abs(d) * 0.02,
          0.048,
          0.055,
          0.06
        );
      }
    });

    // 3. Bracinhos e Patinhas Dianteiras juntas na frente do peito
    const legCyl = new THREE.CylinderGeometry(0.115, 0.125, 0.62, 18, 6);
    [-1, 1].forEach((side) => {
      addPart(legCyl, side * 0.19, 0.36, 0.26, 1, 1, 0.95, 0.16, 0, -side * 0.08);
      addPart(sphereMed, side * 0.21, 0.66, 0.21, 0.13, 0.14, 0.13);
      addPart(sphereMed, side * 0.2, 0.085, 0.36, 0.14, 0.095, 0.17);
      for (let d = -1; d <= 1; d++) {
        addPart(
          sphereMed,
          side * 0.2 + d * 0.042,
          0.068,
          0.49 - Math.abs(d) * 0.015,
          0.042,
          0.05,
          0.055
        );
      }
    });

    // 4. Coleira e Guizo (Sininho) no pescoço
    const collarGeo = new THREE.TorusGeometry(0.31, 0.045, 14, 32);
    addPart(collarGeo, 0, 0.89, 0.05, 1.04, 0.98, 1.0, Math.PI * 0.5 + 0.12, 0, 0);
    addPart(sphereMed, 0, 0.82, 0.39, 0.085, 0.085, 0.085);

    // 5. Cabeça Grande e Fofinha (Proporção Toy-Art / Chibi)
    addPart(sphereHi, 0, 1.32, 0.07, 0.57, 0.47, 0.49);
    [-1, 1].forEach((side) => {
      addPart(sphereMed, side * 0.31, 1.21, 0.18, 0.27, 0.21, 0.24);
    });

    // 6. Focinho + Narizinho de botão
    [-1, 1].forEach((side) => {
      addPart(sphereMed, side * 0.085, 1.2, 0.51, 0.105, 0.085, 0.09);
    });
    addPart(sphereMed, 0, 1.255, 0.575, 0.058, 0.042, 0.045);

    // 7. Olhinhos grandes expressivos em relevo
    [-1, 1].forEach((side) => {
      addPart(sphereMed, side * 0.23, 1.35, 0.47, 0.115, 0.125, 0.08, 0, side * 0.22, 0);
      addPart(sphereMed, side * 0.24, 1.36, 0.53, 0.055, 0.06, 0.04);
    });

    // 8. Bigodinhos em relevo nas bochechas
    const whiskerGeo = new THREE.CylinderGeometry(0.018, 0.014, 0.18, 8);
    whiskerGeo.rotateZ(Math.PI * 0.5);
    [-1, 1].forEach((side) => {
      addPart(whiskerGeo, side * 0.47, 1.23, 0.34, 1, 1, 1, 0, -side * 0.45, side * 0.12);
      addPart(whiskerGeo, side * 0.46, 1.17, 0.33, 1, 1, 1, 0, -side * 0.45, -side * 0.08);
    });

    // 9. Orelhinhas de Gato Pontudas e Arredondadas no Topo
    const earCone = new THREE.ConeGeometry(0.24, 0.48, 24, 8);
    const earPos = earCone.attributes.position;
    for (let i = 0; i < earPos.count; i++) {
      let ex = earPos.getX(i);
      let ey = earPos.getY(i);
      let ez = earPos.getZ(i) * 0.68;
      if (ey > 0.15) {
        ey -= ((ey - 0.15) / 0.09) * 0.025;
      }
      earPos.setXYZ(i, ex, ey, ez);
    }
    earCone.computeVertexNormals();

    [-1, 1].forEach((side) => {
      addPart(earCone, side * 0.36, 1.78, 0.05, 1, 1, 1, 0.08, -side * 0.15, -side * 0.28);
      addPart(sphereMed, side * 0.425, 1.97, 0.068, 0.045, 0.045, 0.035);
    });

    // 10. Rabinho Curvado Enrolando ao Redor do Corpo
    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, 0.16, -0.42),
      new THREE.Vector3(0.32, 0.14, -0.44),
      new THREE.Vector3(0.56, 0.18, -0.22),
      new THREE.Vector3(0.62, 0.34, 0.08),
      new THREE.Vector3(0.54, 0.56, 0.28),
      new THREE.Vector3(0.45, 0.68, 0.32)
    ]);
    const tailGeo = new THREE.TubeGeometry(tailCurve, 36, 0.088, 14, false);
    addPart(tailGeo, 0, 0, 0);
    addPart(sphereMed, 0.45, 0.68, 0.32, 0.092, 0.092, 0.092);

    // Monta o BufferGeometry indexado final com Gradiente Oficial SEDA (#5B43DB -> #A796FF -> #F6F2FF)
    const finalGeo = new THREE.BufferGeometry();
    const posFloat = new Float32Array(allPos);
    const normFloat = new Float32Array(allNorm);
    const colFloat = new Float32Array(allPos.length);
    const uvFloat = new Float32Array((allPos.length / 3) * 2);

    const cDeep = new THREE.Color(0x5b43db);
    const cMid = new THREE.Color(0xa796ff);
    const cPearl = new THREE.Color(0xf6f2ff);
    const tmp = new THREE.Color();

    for (let i = 0; i < posFloat.length; i += 3) {
      const vx = posFloat[i];
      const vy = posFloat[i + 1];
      const vz = posFloat[i + 2];
      const t = Math.max(0, Math.min(1, (vy - printMinY) / printMaxHeight));

      if (t < 0.52) {
        tmp.lerpColors(cDeep, cMid, t / 0.52);
      } else {
        tmp.lerpColors(cMid, cPearl, (t - 0.52) / 0.48);
      }

      const radial = Math.sqrt(vx * vx + vz * vz);
      const boost = Math.max(0, (radial - 0.35) * 0.25);
      colFloat[i] = Math.min(1, tmp.r + boost);
      colFloat[i + 1] = Math.min(1, tmp.g + boost);
      colFloat[i + 2] = Math.min(1, tmp.b + boost);

      const vi = (i / 3) * 2;
      uvFloat[vi] = Math.atan2(vz, vx) / (Math.PI * 2) + 0.5;
      uvFloat[vi + 1] = t;
    }

    finalGeo.setIndex(allIdx);
    finalGeo.setAttribute("position", new THREE.BufferAttribute(posFloat, 3));
    finalGeo.setAttribute("normal", new THREE.BufferAttribute(normFloat, 3));
    finalGeo.setAttribute("color", new THREE.BufferAttribute(colFloat, 3));
    finalGeo.setAttribute("uv", new THREE.BufferAttribute(uvFloat, 2));
    return finalGeo;
  }

  const layerBumpTex = createLayerBumpTexture();
  const kittenGeo = buildCuteKittenGeometry();

  // Face Externa do Gatinho em Filamento Seda Acetinado
  const silkFrontMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    metalness: 0.36,
    roughness: 0.23,
    bumpMap: layerBumpTex,
    bumpScale: 0.009,
    side: THREE.FrontSide,
    clippingPlanes: [clipPlane],
    clipShadows: true
  });

  // Face Interna Escura (evita aspecto oco listrado dentro do corte)
  const innerFillMat = new THREE.MeshBasicMaterial({
    color: 0x261b42,
    side: THREE.BackSide,
    clippingPlanes: [clipPlane]
  });

  const printedFrontMesh = new THREE.Mesh(kittenGeo, silkFrontMat);
  const printedBackMesh = new THREE.Mesh(kittenGeo, innerFillMat);
  printerRoot.add(printedFrontMesh);
  printerRoot.add(printedBackMesh);

  // Preview Holográfico (G-code Slicer Ghost) da parte superior ainda não impressa (clone isolado para wireframe)
  const ghostPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -(printMinY + 0.2));
  const ghostMat = new THREE.MeshBasicMaterial({
    color: 0xa796ff,
    wireframe: true,
    transparent: true,
    opacity: 0.045,
    clippingPlanes: [ghostPlane]
  });
  const ghostMesh = new THREE.Mesh(kittenGeo.clone(), ghostMat);
  printerRoot.add(ghostMesh);

  // --------------------------------------------------------------------------
  // 4. FATIADOR 3D EM TEMPO REAL (SLICER): CONTORNO EXATO DE CADA CAMADA Z
  // --------------------------------------------------------------------------
  const totalSlices = 120;
  const sliceContours = Array.from({ length: totalSlices }, () => []);
  const sliceNozzleLoops = Array.from({ length: totalSlices }, () => []);
  let maxContourFloats = 600;

  (function precomputeSlices() {
    const pos = kittenGeo.attributes.position.array;
    const idx = kittenGeo.index.array;
    const triCount = idx.length / 3;

    for (let t = 0; t < triCount; t++) {
      const i0 = idx[t * 3] * 3;
      const i1 = idx[t * 3 + 1] * 3;
      const i2 = idx[t * 3 + 2] * 3;

      const x0 = pos[i0], y0 = pos[i0 + 1], z0 = pos[i0 + 2];
      const x1 = pos[i1], y1 = pos[i1 + 1], z1 = pos[i1 + 2];
      const x2 = pos[i2], y2 = pos[i2 + 1], z2 = pos[i2 + 2];

      const minY = Math.min(y0, y1, y2);
      const maxY = Math.max(y0, y1, y2);

      const iMin = Math.max(0, Math.ceil(((minY - printMinY) / printMaxHeight) * (totalSlices - 1)));
      const iMax = Math.min(
        totalSlices - 1,
        Math.floor(((maxY - printMinY) / printMaxHeight) * (totalSlices - 1))
      );

      for (let li = iMin; li <= iMax; li++) {
        const ys = printMinY + (li / (totalSlices - 1)) * printMaxHeight;
        const pts = [];

        function checkEdge(ax, ay, az, bx, by, bz) {
          if ((ay <= ys && by > ys) || (by <= ys && ay > ys)) {
            const f = (ys - ay) / (by - ay);
            pts.push(ax + f * (bx - ax), az + f * (bz - az));
          }
        }

        checkEdge(x0, y0, z0, x1, y1, z1);
        checkEdge(x1, y1, z1, x2, y2, z2);
        checkEdge(x2, y2, z2, x0, y0, z0);

        if (pts.length === 4) {
          sliceContours[li].push(pts[0], ys, pts[1], pts[2], ys, pts[3]);
          sliceNozzleLoops[li].push({
            x: (pts[0] + pts[2]) * 0.5,
            z: (pts[1] + pts[3]) * 0.5,
            angle: Math.atan2((pts[1] + pts[3]) * 0.5, (pts[0] + pts[2]) * 0.5)
          });
        }
      }
    }

    for (let li = 0; li < totalSlices; li++) {
      if (sliceContours[li].length > maxContourFloats) {
        maxContourFloats = sliceContours[li].length;
      }
      sliceNozzleLoops[li].sort((a, b) => a.angle - b.angle);
      if (sliceNozzleLoops[li].length === 0) {
        sliceNozzleLoops[li].push({ x: 0, z: 0, angle: 0 });
      }
    }
  })();

  // Buffer de tamanho fixo para a linha incandescente da camada ativa (evita realocação de VBO no WebGL)
  const activeLayerBuffer = new Float32Array(maxContourFloats);
  const activeLayerGeo = new THREE.BufferGeometry();
  activeLayerGeo.setAttribute("position", new THREE.BufferAttribute(activeLayerBuffer, 3));
  activeLayerGeo.setDrawRange(0, 0);

  const activeLayerMat = new THREE.LineBasicMaterial({
    color: 0xf6f2ff,
    transparent: true,
    opacity: 0.92
  });
  const activeLayerSegments = new THREE.LineSegments(activeLayerGeo, activeLayerMat);
  printerRoot.add(activeLayerSegments);

  let lastUpdatedSliceIdx = -1;

  // --------------------------------------------------------------------------
  // 5. PÓRTICO MÓVEL (GANTRY X/Z) + CABEÇOTE EXTRUSOR CAULABS + VENTOINHA
  // --------------------------------------------------------------------------
  const gantryGroup = new THREE.Group();
  printerRoot.add(gantryGroup);

  const xRodGeo = new THREE.CylinderGeometry(0.018, 0.018, frameHalf * 2 - 0.16, 12);
  xRodGeo.rotateZ(Math.PI / 2);

  const xRodTop = new THREE.Mesh(xRodGeo, chromeRodMat);
  xRodTop.position.set(0, 0.28, 0.06);
  gantryGroup.add(xRodTop);

  const xRodBot = new THREE.Mesh(xRodGeo, chromeRodMat);
  xRodBot.position.set(0, 0.18, 0.06);
  gantryGroup.add(xRodBot);

  const zBlockGeo = new THREE.BoxGeometry(0.16, 0.22, 0.24);
  [-frameHalf + 0.14, frameHalf - 0.14].forEach((bx) => {
    const zb = new THREE.Mesh(zBlockGeo, darkFrameMat);
    zb.position.set(bx, 0.23, 0);
    gantryGroup.add(zb);
  });

  const toolheadGroup = new THREE.Group();
  gantryGroup.add(toolheadGroup);

  const shroudMesh = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.36, 0.28), darkFrameMat);
  shroudMesh.position.y = 0.26;
  toolheadGroup.add(shroudMesh);

  const accentStrip = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.028, 0.29), accentSedaMat);
  accentStrip.position.y = 0.38;
  toolheadGroup.add(accentStrip);

  const fanGroup = new THREE.Group();
  fanGroup.position.set(0, 0.24, 0.145);
  toolheadGroup.add(fanGroup);

  const fanRingGeo = new THREE.RingGeometry(0.075, 0.095, 24);
  const fanRingMat = new THREE.MeshBasicMaterial({ color: 0xa796ff, side: THREE.DoubleSide });
  fanGroup.add(new THREE.Mesh(fanRingGeo, fanRingMat));

  const bladeGeo = new THREE.BoxGeometry(0.13, 0.022, 0.008);
  for (let i = 0; i < 3; i++) {
    const blade = new THREE.Mesh(bladeGeo, accentSedaMat);
    blade.rotation.z = (i * Math.PI) / 3;
    fanGroup.add(blade);
  }

  const heaterMesh = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.07, 0.11), chromeRodMat);
  heaterMesh.position.y = 0.065;
  toolheadGroup.add(heaterMesh);

  const nozzleConeGeo = new THREE.ConeGeometry(0.038, 0.065, 16);
  nozzleConeGeo.rotateX(Math.PI);
  const nozzleMat = new THREE.MeshStandardMaterial({
    color: 0xffb870,
    emissive: 0xff7b29,
    emissiveIntensity: 1.4,
    metalness: 0.7,
    roughness: 0.2
  });
  const nozzleMesh = new THREE.Mesh(nozzleConeGeo, nozzleMat);
  nozzleMesh.position.y = 0.032;
  toolheadGroup.add(nozzleMesh);

  const meltDot = new THREE.Mesh(
    new THREE.SphereGeometry(0.022, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xf6f2ff })
  );
  meltDot.position.y = 0;
  toolheadGroup.add(meltDot);

  const bowdenCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, topY, -0.4),
    new THREE.Vector3(0, topY - 0.25, -0.15),
    new THREE.Vector3(0, 0.6, 0),
    new THREE.Vector3(0, 0.44, 0)
  ]);
  const bowdenMat = new THREE.MeshStandardMaterial({
    color: 0xa796ff,
    emissive: 0x5b43db,
    emissiveIntensity: 0.45,
    roughness: 0.2
  });
  const bowdenTube = new THREE.Mesh(
    new THREE.TubeGeometry(bowdenCurve, 24, 0.015, 8, false),
    bowdenMat
  );
  printerRoot.add(bowdenTube);

  // --------------------------------------------------------------------------
  // 6. PARTÍCULAS DE CALOR DO BICO EXTRUSOR
  // --------------------------------------------------------------------------
  const sparkCount = 24;
  const sparkPositions = new Float32Array(sparkCount * 3);
  const sparkData = [];
  for (let i = 0; i < sparkCount; i++) {
    sparkData.push({
      vx: (Math.random() - 0.5) * 0.38,
      vy: 0.18 + Math.random() * 0.45,
      vz: (Math.random() - 0.5) * 0.38,
      age: Math.random()
    });
  }
  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
  const sparkMat = new THREE.PointsMaterial({
    color: 0xf6f2ff,
    size: 0.036,
    transparent: true,
    opacity: 0.85
  });
  printerRoot.add(new THREE.Points(sparkGeo, sparkMat));

  // --------------------------------------------------------------------------
  // 7. INTERAÇÃO DE ROTAÇÃO 360° & LOOP DE ANIMAÇÃO
  // --------------------------------------------------------------------------
  let isDragging = false;
  let prevX = 0;
  let prevY = 0;
  let targetRotY = -0.32;
  let targetCamY = 2.9;

  mount.addEventListener("pointerdown", (e) => {
    isDragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
    mount.setPointerCapture?.(e.pointerId);
  });

  window.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - prevX;
    const dy = e.clientY - prevY;
    prevX = e.clientX;
    prevY = e.clientY;
    targetRotY += dx * 0.01;
    targetCamY = Math.max(0.8, Math.min(5.2, targetCamY + dy * 0.015));
  });

  const stopDrag = () => {
    isDragging = false;
  };
  window.addEventListener("pointerup", stopDrag);
  window.addEventListener("pointercancel", stopDrag);

  window.addEventListener("resize", () => {
    if (!mount.clientWidth || !mount.clientHeight) return;
    camera.aspect = mount.clientWidth / mount.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(mount.clientWidth, mount.clientHeight);
  });

  let lastTime = null;
  let nozzleCursor = 0;

  function animate(now) {
    if (lastTime === null) lastTime = now;
    const dt = Math.max(0.001, Math.min(0.05, (now - lastTime) / 1000));
    lastTime = now;

    if (!isDragging) {
      targetRotY += dt * 0.22;
    }
    printerRoot.rotation.y += (targetRotY - printerRoot.rotation.y) * 0.1;
    camera.position.y += (targetCamY - camera.position.y) * 0.1;

    // Progresso da impressão do gatinho
    printProgress += dt * 0.036;
    if (printProgress > 1.06) {
      printProgress = 0.05;
    }
    const clampedProgress = Math.max(0, Math.min(1.0, printProgress));
    const currentY = printMinY + clampedProgress * printMaxHeight;

    // Atualiza plano de corte (Clipping Plane)
    const worldClipY = currentY + printerRoot.position.y;
    clipPlane.constant = worldClipY;
    ghostPlane.constant = -worldClipY;

    // Atualiza o contorno luminoso da fatia atual sem realocar buffer
    const sliceIdx = Math.min(
      totalSlices - 1,
      Math.max(0, Math.floor(clampedProgress * (totalSlices - 1)))
    );

    if (sliceIdx !== lastUpdatedSliceIdx) {
      lastUpdatedSliceIdx = sliceIdx;
      const segs = sliceContours[sliceIdx];
      const len = Math.min(segs.length, activeLayerBuffer.length);
      for (let i = 0; i < len; i++) {
        activeLayerBuffer[i] = segs[i];
      }
      activeLayerGeo.setDrawRange(0, Math.floor(len / 3));
      activeLayerGeo.attributes.position.needsUpdate = true;
    }

    // Move o bico extrusor ao longo dos pontos reais do contorno da fatia atual do gatinho
    const loop = sliceNozzleLoops[sliceIdx];
    nozzleCursor = (((nozzleCursor + dt * 1.4) % 1.0) + 1.0) % 1.0;
    const ptIdx = Math.max(0, Math.min(loop.length - 1, Math.floor(nozzleCursor * loop.length)));
    const activePt = loop[ptIdx] || { x: 0, z: 0 };

    gantryGroup.position.y = currentY;
    toolheadGroup.position.x += (activePt.x - toolheadGroup.position.x) * 0.35;
    toolheadGroup.position.z += (activePt.z - toolheadGroup.position.z) * 0.35;
    xRodTop.position.z = toolheadGroup.position.z;
    xRodBot.position.z = toolheadGroup.position.z;

    fanGroup.rotation.z -= dt * 18;

    nozzleLight.position.set(toolheadGroup.position.x, currentY + 0.05, toolheadGroup.position.z);
    laserGlowLight.position.set(-toolheadGroup.position.x, currentY + 0.1, -toolheadGroup.position.z);

    bowdenCurve.points[2].set(
      toolheadGroup.position.x * 0.5,
      Math.min(topY - 0.1, currentY + 0.85),
      toolheadGroup.position.z * 0.5
    );
    bowdenCurve.points[3].set(toolheadGroup.position.x, currentY + 0.44, toolheadGroup.position.z);
    bowdenTube.geometry.dispose();
    bowdenTube.geometry = new THREE.TubeGeometry(bowdenCurve, 20, 0.014, 8, false);

    // Partículas saindo do ponto de fusão
    const spArr = sparkGeo.attributes.position.array;
    for (let i = 0; i < sparkCount; i++) {
      const sd = sparkData[i];
      sd.age += dt * 1.8;
      if (sd.age >= 1) {
        sd.age = 0;
        spArr[i * 3] = toolheadGroup.position.x;
        spArr[i * 3 + 1] = currentY + 0.01;
        spArr[i * 3 + 2] = toolheadGroup.position.z;
      } else {
        spArr[i * 3] += sd.vx * dt;
        spArr[i * 3 + 1] += sd.vy * dt;
        spArr[i * 3 + 2] += sd.vz * dt;
      }
    }
    sparkGeo.attributes.position.needsUpdate = true;

    camera.lookAt(0, -0.15, 0);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();
