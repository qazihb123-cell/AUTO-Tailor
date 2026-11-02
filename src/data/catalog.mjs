export const sources = {
  ppf: 'AUTO Tailor 隐形车衣.中文版.pdf',
  color: 'AT TPU宣传册.中文版.pdf',
  window: 'AT窗膜画册中文版.pdf',
};

export const categories = [
  { id: 'paint-protection-film', name: 'Paint Protection Film', short: 'PPF', eyebrow: '01 / PAINT PROTECTION', image: '/images/ppf-t75.webp', description: 'Clear, matte and black finishes. A dedicated layer between your paint and the everyday.', count: 8 },
  { id: 'color-ppf', name: 'Color TPU PPF', short: 'Color TPU', eyebrow: '02 / COLOR EXPRESSION', image: '/images/color-material.webp', description: 'Color expression meets TPU protection. Explore standard, special-effect and carbon-fiber collections.', count: 11 },
  { id: 'window-film', name: 'Window Film', short: 'Window Film', eyebrow: '03 / DRIVING COMFORT', image: '/images/window-road.webp', description: 'Find your balance of light, solar control and visibility across four window film series.', count: 21 },
];

export const performanceFilters = [
  { id: 'thicker-film', label: 'Film thickness 8.5 mil+' },
  { id: 'hydrophobic-surface', label: 'Hydrophobic A Series' },
  { id: 'carbon-fiber-effect', label: 'Carbon-fiber finish' },
  { id: 'high-vlt', label: 'VLT 50% or more' },
  { id: 'high-tser', label: 'TSER 60% or more' },
];

const ppfRows = [
  ['t75', 'T75', 'T', 'Clear gloss', '7.5', 5, 16, '99'],
  ['t85', 'T85', 'T', 'Clear gloss', '8.5', 5, 17, '100.1'],
  ['t75m', 'T75M', 'T', 'Clear matte', '7.5', 5, 18, '18.8 / 19.5'],
  ['a75', 'A75', 'A', 'Clear gloss', '7.5', 5, 21, '103.5 / 102.8'],
  ['a85', 'A85', 'A', 'Clear gloss', '8.5', 8, 22, '103.5 / 102.8'],
  ['a75m', 'A75M', 'A', 'Clear matte', '7.5', 5, 23, '103.5 / 102.8'],
  ['super-black', 'AT Super Black', 'AT', 'Gloss black', '7.5', 5, 26, '106.5'],
  ['super-matte-black', 'AT Super Matte Black', 'AT', 'Matte black', '7.5', 5, 27, '18.7 / 17.8'],
];
const ppfChinese = ['T75','T85','T75M','A75','A85','A75M','AT超级黑','AT超亚黑'];
export const ppfProducts = ppfRows.map(([slug,name,series,finish,thickness,warranty,page,gloss],i) => ({
  slug, name, chineseName: ppfChinese[i], category:'paint-protection-film', series: `${series} Series`, finish,
  image:`/images/ppf-${slug}.webp`, imageNote:'Vehicle illustration from the original product page; not a fitment or endorsement claim.',
  description:`${name} is an automotive paint protection film in the ${series} Series, with a ${finish.toLowerCase()} finish and a brochure-listed thickness of ${thickness} mil.`,
  features:['TPU film construction','Heat-assisted scratch recovery described in the brochure','Impact and abrasion resistance described in the brochure', ...(series==='A'?['Hydrophobic surface described in the A Series brochure']:[])],
  specs:[['Finish',finish],['Film thickness',`${thickness} mil`],['Brochure warranty period',`${warranty} years`]],
  highlights:[`${thickness} mil`,finish], warrantyYears:warranty, thickness:Number(thickness),
  performance:['body-panel-protection', ...(Number(thickness)>=8.5?['thicker-film']:[]), ...(series==='A'?['hydrophobic-surface']:[])].join(' '),
  care:['Avoid touching the film, especially its edges, for the first 3 days after installation.','The brochure recommends washing approximately one week after installation, once the film has fully dried.','Avoid brushes, abrasive compounds, abrasive sponges and adhesive items on the surface.','Have removal performed by a professional installer.'],
  storage:'Store flat in the original packaging, away from direct sunlight and extreme temperatures. The brochure recommends 20 ± 2 °C and 40–60% relative humidity.',
  warrantyNote:'This is the period printed in the supplied brochure, not confirmation of regional coverage. Confirm the applicable terms and installation requirements before purchase.',
  source:{file:sources.ppf,page,additionalPages:[38,39]}, evidence:`/evidence/ppf-${page}.webp`,
  reviewNotes: slug==='a75m' ? ['The A75M page repeats the high gloss figures from A75 despite the matte model name. Gloss figures are withheld pending confirmation.'] : [],
}));

const colorRows = [
 ['tpu-aster-black','TPU Aster Black','TPU阿斯特黑','Standard Collection','Black'],
 ['tpu-standard','TPU Standard Collection','TPU常规系列','Standard Collection','Collection'],
 ['tpu-starry-pink','TPU Zhongjin Starry Pink','TPU中金星空粉','Special Effects','Pink'],
 ['tpu-3d-gray','TPU 3D Iridescent Gray','TPU3D炫彩灰','Special Effects','Gray'],
 ['tpu-matte-3d-gray','TPU Matte 3D Iridescent Gray','TPU哑面3D炫彩灰','Special Effects','Matte gray'],
 ['tpu-phantom-red','TPU Starry Phantom Red','TPU星空尊崇幻红','Special Effects','Red'],
 ['tpu-flow-black-red','TPU Flowing Black / Red','TPU流光黑魅红','Special Effects','Black / red'],
 ['tpu-satin-gray','TPU Satin Flowing Gray','TPU缎面流光灰','Special Effects','Satin gray'],
 ['tpu-clear-carbon','TPU Ultra-clear Carbon Fiber','TPU超透明碳纤','Carbon Fiber','Clear carbon effect'],
 ['tpu-satin-carbon','TPU Satin Carbon Fiber','TPU缎面碳纤','Carbon Fiber','Satin carbon effect'],
 ['tpu-gloss-carbon','TPU High-gloss Carbon Fiber','TPU超亮碳纤','Carbon Fiber','Gloss carbon effect'],
];
export const colorProducts=colorRows.map(([slug,name,chineseName,series,finish])=>({
  slug,name,chineseName,category:'color-ppf',series,finish,image:'/images/color-application.webp',
  imageNote:'Collection application illustration only. It does not show this named color. Confirm the finish using a physical sample.',
  description:`${name} is listed in the AT Color PPF brochure. The collection combines color expression with TPU paint protection. A physical sample is needed to confirm the actual finish.`,
  features:['TPU color paint protection film','Scratch-recovery coating described in the brochure','Listed as part of the AT Color PPF collection'],
  specs:[['Collection',series],['Listed finish / color',finish],['Film thickness','7.5 mil ± 5%'],['Roll size','1.524 × 15 m'],['Brochure warranty period','5 years (conditions apply)']],
  highlights:['7.5 mil ± 5%', '1.524 × 15 m'], thickness:7.5,warrantyYears:5,
  performance:['color-tpu',...(series==='Carbon Fiber'?['carbon-fiber-effect']:[])].join(' '),
  care:['The brochure describes lightly wet installation for gloss TPU.','Matte TPU is described as dry-applied with an air-channel liner; large areas may be wet-applied.','Have a qualified installer confirm the method for the selected material.'],
  warrantyNote:'The brochure lists a 5-year conditional warranty and 3 years for natural color fading. It requires authorized installation and an electronic warranty. Overseas applicability has not been confirmed.',
  source:{file:sources.color,page:31,additionalPages:[9,10,21]},
  reviewNotes:['English color names are descriptive translations, not verified official export names. Individual color photography is not supplied.'],
}));

const windowRows = [
 ['ae-7095','AE HD Ceramic 7095','AE高清陶瓷7095','AE',71,8,99,93,45,2,5],
 ['ae-1595','AE HD Ceramic 1595','AE高清陶瓷1595','AE',16,8,99,95,64,2,5],
 ['ae-2595','AE HD Ceramic 2595','AE高清陶瓷2595','AE',25,8,99,94,60,2,5],
 ['ae-3595','AE HD Ceramic 3595','AE高清陶瓷3595','AE',35,8,99,95,56,2,5],
 ['at-70s','AT Dual Silver 70S','AT磁控双银70S','AT',73,9,99,85,55,2,7],
 ['at-70','AT Dual Silver 70','AT磁控双银70','AT',73,9,99,84,54,3,7],
 ['at-40','AT Dual Silver 40','AT磁控双银40','AT',37,8,99,89,62,2,7],
 ['at-20','AT Dual Silver 20','AT磁控双银20','AT',22,10,99,91,69,2,7],
 ['at-bronze-35cp','AT Bronze Dual Silver 35CP','AT磁控双银古铜色35CP','AT',33,12,99,90,63,2,7],
 ['at-bronze-10cp','AT Bronze Dual Silver 10CP','AT磁控双银古铜色10CP','AT',10,12,99,92,65,3,7],
 ['at-titanium-40','AT Titanium Nitride Ceramic 40','AT氮化钛陶瓷40','AT',39,9,99,95,51,3,7],
 ['at-titanium-30','AT Titanium Nitride Ceramic 30','AT氮化钛陶瓷30','AT',28,9,99,95,55,2,7],
 ['t-9070','T Original-color Ceramic 9070','T原色陶瓷9070','T',71,8,99,90,44,2,9],
 ['t-5090','T Original-color Ceramic 5090','T原色陶瓷5090','T',53,8,99,91,52,2,9],
 ['t-3590','T Original-color Ceramic 3590','T原色陶瓷3590','T',35,8,99,89,55,2,9],
 ['t-2090','T Original-color Ceramic 2090','T原色陶瓷2090','T',20,8,99,91,58,2,9],
 ['t-30590','T Original-color Ceramic 30590','T原色陶瓷30590','T',7,8,99,92,62,2,9],
 ['ak-6098s','AK Metal Ceramic 6098S','AK金属陶瓷6098S','AK',69,11,99,91,58,2,11],
 ['ak-1595s','AK Metal Ceramic 1595S','AK金属陶瓷1595S','AK',17,10,99,93,68,3,11],
 ['ak-2595s','AK Metal Ceramic 2595S','AK金属陶瓷2595S','AK',23,10,99,93,63,2,11],
 ['ak-3595s','AK Metal Ceramic 3595S','AK金属陶瓷3595S','AK',33,11,99,91,60,2,11],
];
const windowTech = {AE:'Nano-ceramic particle composite technology',AT:'Magnetron-sputtered film technology',T:'Original-color and nano-ceramic construction',AK:'Titanium nitride sputtering and nano-ceramic composite technology'};
export const windowProducts=windowRows.map(([slug,name,chineseName,series,vlt,reflect,uv,ir,ts,totalThickness,page])=>({
  slug,name,chineseName,category:'window-film',series:`${series} Series`,finish:'Solar-control window film',
  image:`/images/window-${series.toLowerCase()}.webp`,imageNote:'Collection illustration from the window film brochure, not a measured tint sample. Vehicle imagery is not a fitment or endorsement claim.',
  description:`${name} is an automotive window film with ${vlt}% visible light transmission and ${ts}% total solar energy rejection as listed in the brochure.`,
  features:[windowTech[series],'99% UV rejection listed in the brochure','Designed for automotive glazing'],
  specs:[['Visible light transmission (VLT)',`${vlt}%`],['Interior visible light reflectance',`${reflect}%`],['UV rejection',`${uv}%`],['Infrared rejection',`${ir}%`],['Total solar energy rejection (TSER)',`${ts}%`],['Film thickness',`${totalThickness} mil`],['Brochure warranty period','10 years']],
  highlights:[`${vlt}% VLT`,`${ts}% TSER`],vlt,tser:ts,thickness:totalThickness,warrantyYears:10,
  performance:['solar-control',...(vlt>=50?['high-vlt']:[]),...(ts>=60?['high-tser']:[])].join(' '),
  care:['The window film brochure says not to clean the film for at least 30 days after installation.','Confirm installation and aftercare instructions with the installer for your selected film.'],
  warrantyNote:'The table lists 10 years. Regional terms, exclusions and overseas coverage are not supplied; confirm them before purchase.',
  source:{file:sources.window,page},evidence:`/evidence/window-${page}.webp`,
  reviewNotes:slug==='t-30590'?['Model number 30590 is reproduced exactly as printed. Confirm with the brand before final publication.']:[],
}));
export const products=[...ppfProducts,...colorProducts,...windowProducts];

export const faq = [
 {group:'Choosing a film',q:'What is the difference between PPF and window film?',a:'Paint protection film is applied to painted body panels. Automotive window film is applied to glazing for light and solar control. The two product lines serve different surfaces and purposes.',source:'PPF brochure pp. 16–27; window brochure pp. 5–11.'},
 {group:'Choosing a film',q:'Can I choose a matte or black PPF?',a:'Yes. The supplied catalogue includes T75M and A75M matte models, AT Super Black and AT Super Matte Black, alongside clear gloss products.',source:'PPF brochure pp. 16–27.'},
 {group:'Choosing a film',q:'How do I compare window film specifications?',a:'VLT describes visible light transmission. The brochure separately lists UV rejection, infrared rejection and total solar energy rejection (TSER). Compare the same metric across products; infrared rejection and TSER are different figures.',source:'Window brochure pp. 5, 7, 9, 11.'},
 {group:'Choosing a film',q:'Do the vehicle photos show every exact TPU color?',a:'No. The supplied photos illustrate the collection. Confirm a specific color or carbon effect with a physical sample before making a selection.',source:'TPU brochure pp. 28, 31; asset review.'},
 {group:'Installation & care',q:'How soon can I wash a vehicle after PPF installation?',a:'The PPF brochure recommends avoiding contact with film edges for the first 3 days and washing approximately one week after installation once the film is fully dry. It also advises against brushes and abrasive cleaning materials.',source:'PPF brochure p. 39.'},
 {group:'Installation & care',q:'When can I clean newly installed window film?',a:'The window film brochure says not to clean the film for at least 30 days after installation. Confirm the appropriate care instructions with your installer.',source:'Window brochure pp. 5, 7, 9, 11.'},
 {group:'Installation & care',q:'What should I know about color TPU installation?',a:'The TPU brochure describes lightly wet installation for gloss material and dry application for matte material with an air-channel liner, with wet application possible on larger areas. The installer should confirm the method for the selected product.',source:'TPU brochure p. 21.'},
 {group:'Product inquiries',q:'Is overseas warranty coverage confirmed?',a:'No. Periods shown on product pages are taken from the supplied Chinese brochures. Overseas coverage, local terms and installer eligibility need confirmation. Color PPF has additional conditions and a separate natural-fading period.',source:'PPF brochure p. 38; TPU brochure p. 31; window brochure specification tables.'},
 {group:'Product inquiries',q:'Can I purchase film directly on this website?',a:'This is a product catalogue for inquiries. Use the product inquiry form to prepare your requirements; no online purchase is available.',source:'Project scope.'},
];
