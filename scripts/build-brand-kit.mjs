/** Rebuild the website's one authoritative identity kit from shared tokens. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import * as fontkit from 'fontkit';
import PDFDocument from 'pdfkit';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'public/brand');
const brand = JSON.parse(fs.readFileSync(path.join(dir, 'tokens.json'), 'utf8'));
const c = brand.colour;
const fontFile = path.join(root, 'public/fonts/FamiljenGrotesk-Variable.ttf');
const font = fontkit.openSync(fontFile);
const semibold = font.getVariation({ wght: 600 });
const exports = [];
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const svg = (w, h, body, title = 'Databrew') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img"><title>${escape(title)}</title>${body}</svg>`;
const mark = (x, y, size, colour) => `<path d="${brand.mark.path}" fill="${colour}" transform="translate(${x} ${y}) scale(${size / 64})"/>`;

function lettering(value, size, x, y, colour, weight = 600, tracking = -.035) {
    const face = weight === 600 ? semibold : font;
    const run = face.layout(value);
    const scale = size / face.unitsPerEm;
    let cursor = 0;
    const body = run.glyphs.map((glyph, i) => {
        const position = run.positions[i];
        const element = `<path d="${glyph.path.toSVG()}" transform="translate(${x + cursor + position.xOffset * scale} ${y - position.yOffset * scale}) scale(${scale} ${-scale})"/>`;
        cursor += position.xAdvance * scale + size * tracking;
        return element;
    }).join('');
    return { body: `<g fill="${colour}">${body}</g>`, width: cursor - size * tracking };
}
function logo(colour, endorsed = false) {
    const type = lettering('databrew', 80, 128, 92, colour);
    return svg(Math.ceil(152 + type.width), endorsed ? 174 : 130,
        mark(24, 24, 88, colour) + type.body + (endorsed ? lettering('A Brewling company', 22, 128, 142, colour, 400, 0).body : ''),
        endorsed ? 'Databrew — A Brewling company' : 'Databrew primary signature');
}
async function save(name, value, pngWidth) {
    const target = path.join(dir, name);
    fs.writeFileSync(target, value);
    exports.push(target);
    if (pngWidth) {
        const png = target.replace(/\.svg$/, '.png');
        await sharp(Buffer.from(value)).resize({ width: pngWidth }).png().toFile(png);
        exports.push(png);
    }
}

await save('logo.svg', logo(c.ink), 2400);
await save('logo-light.svg', logo(c.white), 2400);
await save('logo-black.svg', logo('#000000'), 2400);
await save('logo-white.svg', logo('#FFFFFF'), 2400);
await save('logo-endorsed.svg', logo(c.ink, true), 2400);
await save('logo-endorsed-light.svg', logo(c.white, true), 2400);
const word = lettering('databrew', 80, 24, 90, c.ink);
await save('wordmark.svg', svg(Math.ceil(word.width + 48), 120, word.body), 2000);
const stacked = lettering('databrew', 64, 0, 0, c.ink);
await save('logo-stacked.svg', svg(360, 270, mark(132, 24, 96, c.ink) + lettering('databrew', 64, (360 - stacked.width) / 2, 198, c.ink).body + lettering('A Brewling company', 18, 102, 238, c.ink, 400, 0).body), 1600);
await save('mark-transparent.svg', svg(88, 88, mark(12, 12, 64, c.ink)), 1024);
await save('mark-light.svg', svg(88, 88, mark(12, 12, 64, c.white)), 1024);
const appIcon = svg(128, 128, `<rect width="128" height="128" rx="28" fill="${c.silver}"/>` + mark(24, 24, 80, c.ink), 'Databrew app icon');
await save('mark.svg', appIcon, 512);
for (const size of [192, 512]) {
    const target = path.join(dir, `app-icon-${size}.png`);
    await sharp(Buffer.from(appIcon)).resize(size).png().toFile(target);
    exports.push(target);
}
const favicon = await sharp(Buffer.from(appIcon)).resize(32).png().toBuffer();
// ICO container with a PNG image; replaces the framework's default favicon.
const ico = Buffer.alloc(22);
ico.writeUInt16LE(1, 2); ico.writeUInt16LE(1, 4);
ico[6] = 32; ico[7] = 32;
ico.writeUInt16LE(1, 10); ico.writeUInt16LE(32, 12);
ico.writeUInt32LE(favicon.length, 14); ico.writeUInt32LE(22, 18);
fs.writeFileSync(path.join(root, 'app/favicon.ico'), Buffer.concat([ico, favicon]));

const patternPaths = Array.from({ length: 6 }, (_, i) => `M-60 ${35 + i * 55}H${300 - i * 18}Q${515 - i * 18} ${35 + i * 55} ${515 - i * 18} ${250 + i * 55}V650`);
await save('signal-pattern.svg', svg(640, 400, `<rect width="640" height="400" fill="${c.ink}"/>` + patternPaths.map(d => `<path d="${d}" fill="none" stroke="${c.silver}" stroke-width="20"/>`).join(''), 'Databrew Confluence pattern'), 1920);
const board = `<rect width="1440" height="900" fill="${c.white}"/>
    <rect x="40" y="40" width="1360" height="430" rx="24" fill="${c.ink}"/>
    ${mark(80, 85, 70, c.silver)}${lettering('databrew', 58, 174, 140, c.white).body}
    ${lettering('Human ambition.', 86, 78, 282, c.white).body}${lettering('Amplified.', 86, 78, 374, c.silver).body}
    ${mark(1040, 120, 245, c.silver)}${lettering('A Brewling company', 20, 82, 433, c.white, 400, 0).body}
    <rect x="40" y="494" width="420" height="366" rx="20" fill="${c.silver}"/>${mark(138, 540, 224, c.ink)}
    ${lettering('CONFLUENCE / THE MARK', 17, 78, 818, c.ink, 400, .035).body}
    ${lettering('Familjen Grotesk', 45, 500, 555, c.ink).body}${lettering('Aa Bb Cc 0123', 70, 500, 655, c.ink).body}
    ${lettering('Ideas into possibilities.', 28, 500, 713, c.graphite, 400, 0).body}
    ${Object.values(c).map((value, i) => `<rect x="${500 + i * 178}" y="761" width="160" height="60" rx="8" fill="${value}" stroke="${c.graphite}" stroke-width=".3"/>${lettering(value, 15, 502 + i * 178, 851, c.ink, 400, 0).body}`).join('')}`;
await save('brand-board.svg', svg(1440, 900, board, 'Databrew identity overview'), 2160);

const pdfPath = path.join(dir, 'databrew-brand-guidelines.pdf');
const doc = new PDFDocument({ size: [960, 640], margin: 0, autoFirstPage: false, info: { Title: 'Databrew / Brand guidelines', Author: 'Databrew — A Brewling company', Subject: 'Confluence identity, version 3.0' } });
const stream = fs.createWriteStream(pdfPath);
doc.pipe(stream);
doc.registerFont('Brand', fontFile);
let page = 0;
function text(value, x, y, size = 14, colour = c.ink, width = 380, options = {}) {
    doc.font('Brand').fontSize(size).fillColor(colour).text(value, x, y, { width, lineGap: 5, ...options });
}
function display(value, x, baseline, size = 44, colour = c.ink) {
    const run = semibold.layout(value);
    const scale = size / semibold.unitsPerEm;
    let cursor = 0;
    run.glyphs.forEach((glyph, i) => {
        const p = run.positions[i];
        doc.save().translate(x + cursor + p.xOffset * scale, baseline - p.yOffset * scale).scale(scale, -scale).path(glyph.path.toSVG()).fill(colour).restore();
        cursor += p.xAdvance * scale - .035 * size;
    });
}
function pdfMark(x, y, size, colour = c.ink) {
    doc.save().translate(x, y).scale(size / 64).path(brand.mark.path).fill(colour).restore();
}
function box(x, y, w, h, colour, radius = 12) { doc.roundedRect(x, y, w, h, radius).fill(colour); }
function start(title, dark = false) {
    doc.addPage(); page++;
    doc.rect(0, 0, 960, 640).fill(dark ? c.ink : c.white);
    text('DATABREW / BRAND GUIDELINES', 48, 30, 10, dark ? c.silver : c.graphite, 500, { characterSpacing: 1 });
    text(title, 610, 30, 10, dark ? c.white : c.graphite, 302, { align: 'right' });
    doc.moveTo(48, 594).lineTo(912, 594).strokeColor(dark ? '#484848' : '#D0D0D0').lineWidth(.5).stroke();
    text('A Brewling company', 48, 606, 10, dark ? c.white : c.graphite, 400);
    text(`IDENTITY 03 / ${String(page).padStart(2, '0')}`, 730, 606, 10, dark ? c.white : c.graphite, 182, { align: 'right' });
}

start('THE IDEA', true);
pdfMark(48, 82, 56, c.silver); display('databrew', 122, 129, 48, c.white);
display('Many inputs.', 48, 272, 74, c.white);
display('One way forward.', 48, 350, 74, c.silver);
text('An identity for bringing people, knowledge and AI together.\nClear in its structure. Optimistic in its outlook.\nDistinctive in the details.', 52, 401, 17, c.white, 590);
pdfMark(723, 403, 142, c.silver);
text('Databrew is the company. AIOS is the product.\nBrewling is the parent-company endorsement.', 52, 515, 12, '#C0C0C0', 590);

start('01 / SIGNATURE & SPACING');
display('Meet Confluence.', 48, 110);
text('Three incoming streams form an open D: separate inputs, one shared direction.', 48, 130, 15, c.graphite, 815);
box(48, 189, 548, 187, c.ink); pdfMark(80, 220, 88, c.white); display('databrew', 190, 290, 72, c.white);
text('A Brewling company', 192, 326, 14, c.white, 350);
box(616, 189, 296, 187, c.silver); pdfMark(732, 227, 64);
doc.rect(720, 215, 88, 88).dash(3, { space: 3 }).strokeColor(c.graphite).lineWidth(.7).stroke().undash();
text('12 units of clear space / 64-unit mark', 630, 334, 11, c.ink, 268, { align: 'center' });
display('Give it room.', 48, 426, 24); text('Keep the 12-unit spacing around the mark and full signature. The supplied logo exports use outlined lettering and do not need an installed font.', 48, 444, 13, c.graphite, 255);
display('Keep it legible.', 348, 426, 24); text('Minimum mark: 24px digital / 8mm print.\nMinimum full logo: 140px / 40mm.\nBelow that, use the mark alone.\nAlways preserve its proportions.', 348, 444, 13, c.graphite, 250);
display('Keep it consistent.', 656, 426, 24); text('Do not stretch, rotate, outline or add shadows. Use supplied monochrome assets for one-colour output. Write Databrew in prose; databrew in the wordmark.', 656, 444, 13, c.graphite, 252);

start('02 / COLOUR');
display('Clarity through contrast.', 48, 110, 42);
text('Black and white. Precise greys. Typography and space do the expressive work.', 48, 135, 15, c.graphite, 810);
const colours = Object.entries(c);
colours.forEach(([name, hex], i) => {
    const x = 48 + i * 176;
    const foreground = ['ink', 'graphite'].includes(name) ? c.white : c.ink;
    box(x, 193, 160, 215, hex);
    display(name[0].toUpperCase() + name.slice(1), x + 16, 232, 22, foreground);
    text(hex, x + 16, 253, 13, foreground, 130);
    text(['Primary text\nDark surfaces', 'Layers\nQuiet emphasis', 'Main canvas\nBreathing room', 'Quiet panels\nProduct context', 'Secondary text\nSupporting detail'][i], x + 16, 340, 11, foreground, 130);
});
display('Contrast is part of the identity.', 48, 463, 26);
text('Use Ink text on Silver, White or Fog. Use White text on Ink. Graphite is for secondary copy on light surfaces. Never use Silver text on White or rely on colour alone to communicate a state.', 48, 485, 14, c.graphite, 520);
text('Digital values: sRGB / HEX.\nFor professional printing, proof colours with the printer and the chosen paper stock; do not treat automatic CMYK conversion as a colour standard.', 636, 473, 12, c.graphite, 274);

start('03 / TYPOGRAPHY');
display('Familjen Grotesk.', 48, 110, 48);
text('One family. Expressive headlines. Comfortable reading. Distinctive details.', 48, 135, 15, c.graphite, 820);
display('Aa', 48, 304, 142);
display('Ideas into', 48, 378, 46); display('possibilities.', 48, 426, 46);
text('ABCDEFGHIJKLMNOPQRSTUVWXYZ\nabcdefghijklmnopqrstuvwxyz\n0123456789  ₦  /  &  @', 52, 471, 17, c.graphite, 415);
box(514, 188, 398, 362, c.fog);
display('A clear hierarchy.', 540, 231, 27);
text('Display   48–96px / 600\nHeading   28–54px / 600\nBody   14–18px / 400\nControls   12–14px / 600', 540, 257, 16, c.ink, 340, { lineGap: 10 });
text('Use generous line height for paragraphs. Keep body letter spacing neutral. Use −0.04em for large display and −0.035em in the wordmark. Tabular numerals align data.', 540, 425, 13, c.graphite, 338);
text('Self-hosted variable font / SIL Open Font License 1.1\nFont and full licence included in the kit.', 540, 511, 10, c.graphite, 338);

start('04 / VISUAL & VERBAL LANGUAGE', true);
display('Human ambition.', 48, 117, 52, c.white); display('Amplified.', 48, 172, 52, c.silver);
doc.save().rect(510, 77, 402, 262).clip().translate(510, 77).scale(.66);
patternPaths.forEach(d => doc.path(d).lineWidth(20).strokeColor(c.silver).stroke()); doc.restore();
text('Parallel paths and generous curves extend the mark. Use the pattern on covers and brand moments, away from body text and product controls. One expressive gesture per composition.', 52, 218, 14, c.white, 365);
const principles = [
    ['Human, not hyped.', 'Say “Find the policy you need.” Explain the task, the source and who stays in control. Avoid sweeping claims about autonomous intelligence.'],
    ['Local, not narrow.', 'Respect Nigerian and African business realities: diverse teams, connectivity, deployment constraints and public-sector responsibilities.'],
    ['Evidence, not theatre.', 'Show real screens and label illustrative data. No invented customer logos, certifications or results. Motion should explain; respect reduced motion.'],
];
principles.forEach(([heading, body], i) => { const x = 48 + i * 298; display(heading, x, 402, 24, c.silver); text(body, x, 430, 14, c.white, 255); });

start('05 / HANDOFF & SOURCES');
display('Ready to work with.', 48, 110, 44);
text('A practical kit for the website, documents, presentations and product touchpoints.', 48, 135, 15, c.graphite, 820);
const manifest = [
    ['SIGNATURES', 'Primary, reversed, black, white, endorsed, stacked and wordmark-only. SVG paths + transparent PNGs.'],
    ['MARK & APPLICATIONS', 'Standalone marks, app icons at 192px and 512px, the Confluence pattern and an identity overview board.'],
    ['SYSTEM', 'Colour and typography tokens, usage notes, this guide, Familjen Grotesk variable font and its full OFL licence.'],
];
manifest.forEach(([heading, body], i) => { const y = 203 + i * 102; text(heading, 48, y, 10, c.graphite, 400, { characterSpacing: 1 }); text(body, 48, y + 22, 15, c.ink, 430); });
box(535, 190, 377, 356, c.fog);
display('Chosen with intention.', 558, 232, 27);
text('Craftwork’s wizard guided the resource review. Familjen Grotesk was selected from its catalogue; the licensed font files came from Google Fonts. No paid marketplace assets were used.', 558, 255, 13, c.graphite, 325);
text('Craftwork font listing', 558, 360, 13, c.ink, 325, { link: brand.typography.source, underline: true });
text('Google Fonts source and licence', 558, 390, 13, c.ink, 325, { link: brand.typography.fontSource, underline: true });
text('Craftwork Grotesk and Unbounded were considered but not used. The Confluence mark and pattern are new artwork for Databrew. Trademark clearance remains a separate pre-launch step.', 558, 438, 12, c.graphite, 325);
text('Brand naming: Databrew / A Brewling company.\nProduct naming: AIOS. Keep this hierarchy consistent.', 48, 539, 11, c.graphite, 450);
doc.end();
await new Promise((resolve, reject) => { stream.on('finish', resolve); stream.on('error', reject); doc.on('error', reject); });
exports.push(pdfPath, path.join(dir, 'tokens.json'), path.join(dir, 'README.txt'), fontFile, path.join(root, 'public/fonts/OFL-FamiljenGrotesk.txt'));

// Fresh archive, never an in-place zip update that could preserve obsolete files.
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'databrew-brand-kit-'));
const archive = path.join(temporary, 'databrew-brand-kit.zip');
execFileSync('zip', ['-j', '-q', archive, ...exports]);
fs.renameSync(archive, path.join(dir, 'databrew-brand-kit.zip'));
fs.rmdirSync(temporary);
console.log(`Built ${exports.length} assets and a ${page}-page guide. Archive: public/brand/databrew-brand-kit.zip`);
