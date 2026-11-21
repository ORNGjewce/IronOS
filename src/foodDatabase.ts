import usdaBrandedFoods from './usdaBrandedFoods.json';
import usdaFoods from './usdaFoods.json';
// Independently assembled generic food examples. Nutrients are approximate per stated serving,
// not authoritative lab values. Users can edit any entry. No external dataset copied.
export type Food={id:string;name:string;portion:string;calories:number;protein:number;carbs:number;fat:number;fiber:number;sodium:number;brand?:string;barcode?:string;countries?:string[];source?:string;servingVerified?:boolean};
const raw:[string,string,number,number,number,number,number,number][]=[
['Egg, large','1 egg (50 g)',72,6.3,.4,4.8,0,71],['Egg white','1 large (33 g)',17,3.6,.2,0,0,55],['Oatmeal, cooked','1 cup (234 g)',154,6,27,2.6,4,2],['Milk, whole','1 cup (244 mL)',149,7.7,11.7,8,0,105],['Milk, 2%','1 cup (244 mL)',122,8,12,4.8,0,115],['Greek yogurt, plain nonfat','170 g',100,17,6,0,0,60],['Cheddar cheese','1 oz (28 g)',115,6.5,.4,9.5,0,180],['Cottage cheese, 2%','1/2 cup (113 g)',92,12,4.5,2.5,0,350],['Banana','1 medium (118 g)',105,1.3,27,.4,3.1,1],['Apple, with skin','1 medium (182 g)',95,.5,25,.3,4.4,2],['Orange','1 medium (131 g)',62,1.2,15.4,.2,3.1,0],['Strawberries','1 cup halves (152 g)',49,1,11.7,.5,3,2],['Blueberries','1 cup (148 g)',84,1.1,21.4,.5,3.6,1],['Avocado','1/2 medium (75 g)',120,1.5,6.4,11,5,5],['Broccoli, cooked','1 cup (156 g)',55,3.7,11.2,.6,5.1,64],['Spinach, raw','1 cup (30 g)',7,.9,1.1,.1,.7,24],['Carrots, raw','1 medium (61 g)',25,.6,6,.1,1.7,42],['Potato, baked','1 medium (173 g)',161,4.3,36.6,.2,3.8,17],['Sweet potato, baked','1 medium (114 g)',103,2.3,23.6,.2,3.8,41],['White rice, cooked','1 cup (158 g)',205,4.3,44.5,.4,.6,2],['Brown rice, cooked','1 cup (195 g)',216,5,44.8,1.8,3.5,10],['Pasta, cooked','1 cup (140 g)',221,8.1,43.2,1.3,2.5,1],['Bread, whole wheat','1 slice (28 g)',80,4,14,1,2,150],['Peanut butter','2 tbsp (32 g)',190,7,7,16,2,140],['Almonds','1 oz (28 g)',164,6,6,14.2,3.5,0],['Chicken breast, cooked','100 g',165,31,0,3.6,0,74],['Ground beef, 90% lean, cooked','100 g',217,26,0,12,0,75],['Salmon, cooked','100 g',206,22,0,12,0,60],['Tuna, canned in water, drained','100 g',116,26,0,.8,0,50],['Tofu, firm','100 g',144,17,3,9,2,14],['Black beans, cooked','1 cup (172 g)',227,15.2,40.8,.9,15,2],['Lentils, cooked','1 cup (198 g)',230,17.9,39.9,.8,15.6,4],['Olive oil','1 tbsp (13.5 g)',119,0,0,13.5,0,0],['Butter','1 tbsp (14 g)',102,.1,0,11.5,0,82],['Honey','1 tbsp (21 g)',64,0,17.3,0,0,1],['Granola, generic','1/2 cup (55 g)',235,5,35,9,3,35]
];
// USDA records are generated from the official downloadable FoodData Central CSV export.
// Empty until the user runs tools/import_usda.py against the downloaded USDA archive.
export const usdaOfflineFoods:Food[]=usdaFoods as Food[];
export const usdaBrandedOfflineFoods:Food[]=usdaBrandedFoods as Food[];
export const offlineFoods:Food[]=raw.map(([name,portion,calories,protein,carbs,fat,fiber,sodium],i)=>({id:`offline-${i}`,name,portion,calories,protein,carbs,fat,fiber,sodium}));

// Small emergency offline examples for common searches before a USDA catalog is imported.
// These are approximate generic estimates, NOT USDA-sourced values.
export const commonFoodFallback:Food[]=[
 {id:'fallback-bacon-cooked',name:'Bacon, pork, cooked',portion:'2 slices (16 g)',calories:86,protein:6,carbs:0.2,fat:6.7,fiber:0,sodium:280,source:'Generic estimate'},
 {id:'fallback-bacon-raw',name:'Bacon, pork, raw',portion:'2 slices (28 g)',calories:115,protein:3.5,carbs:0.3,fat:11,fiber:0,sodium:480,source:'Generic estimate'},
 {id:'fallback-turkey-bacon',name:'Turkey bacon, cooked',portion:'2 slices (30 g)',calories:70,protein:5,carbs:1,fat:5,fiber:0,sodium:390,source:'Generic estimate'},
 {id:'fallback-canadian-bacon',name:'Canadian bacon',portion:'2 slices (42 g)',calories:50,protein:9,carbs:1,fat:1.5,fiber:0,sodium:420,source:'Generic estimate'}
];
