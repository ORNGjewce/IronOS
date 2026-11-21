// Original IRON//OS offline exercise additions. No external text, images or APIs.
export type ExerciseMuscle='chest'|'shoulders'|'biceps'|'triceps'|'forearms'|'upper_back'|'lats'|'abs'|'obliques'|'glutes'|'quads'|'hamstrings'|'calves'|'adductors'|'hip_flexors'|'shins'|'abductors';
export type AddedExercise={id:string;name:string;primary:ExerciseMuscle;secondary:ExerciseMuscle[];equipment:string;steps:string[]};
export const addedExercises:AddedExercise[]=[
 {
  "id": "flatdb",
  "name": "Flat dumbbell bench press",
  "primary": "chest",
  "secondary": [
   "shoulders",
   "triceps"
  ],
  "equipment": "Dumbbells / bench",
  "steps": [
   "Lie on a bench with dumbbells above your chest.",
   "Lower both weights slowly to a comfortable depth.",
   "Press upward with control."
  ]
 },
 {
  "id": "closebench",
  "name": "Close-grip bench press",
  "primary": "triceps",
  "secondary": [
   "chest",
   "shoulders"
  ],
  "equipment": "Barbell / bench",
  "steps": [
   "Use a comfortable narrow grip with wrists aligned.",
   "Lower the bar in control toward your chest.",
   "Press upward without bouncing."
  ]
 },
 {
  "id": "pecdeck",
  "name": "Pec deck fly",
  "primary": "chest",
  "secondary": [
   "shoulders"
  ],
  "equipment": "Pec deck machine",
  "steps": [
   "Adjust the seat so handles align with your chest.",
   "Bring your arms together smoothly.",
   "Return slowly without overstretching."
  ]
 },
 {
  "id": "inclinepush",
  "name": "Incline push-up",
  "primary": "chest",
  "secondary": [
   "triceps",
   "shoulders"
  ],
  "equipment": "Stable elevated surface",
  "steps": [
   "Place hands on a stable elevated surface.",
   "Lower your chest toward your hands.",
   "Push back to the starting position."
  ]
 },
 {
  "id": "declinepush",
  "name": "Decline push-up",
  "primary": "chest",
  "secondary": [
   "triceps",
   "shoulders"
  ],
  "equipment": "Bodyweight / stable platform",
  "steps": [
   "Place feet on a low stable platform and hands on the floor.",
   "Lower your body while keeping a steady trunk.",
   "Push upward with control."
  ]
 },
 {
  "id": "chestpress",
  "name": "Seated chest press",
  "primary": "chest",
  "secondary": [
   "triceps",
   "shoulders"
  ],
  "equipment": "Chest press machine",
  "steps": [
   "Adjust the seat and grips to a comfortable position.",
   "Press the handles forward smoothly.",
   "Return without letting the weight stack slam."
  ]
 },
 {
  "id": "lowcablefly",
  "name": "Low-to-high cable fly",
  "primary": "chest",
  "secondary": [
   "shoulders"
  ],
  "equipment": "Cable machine",
  "steps": [
   "Set handles low and stand in a stable stance.",
   "Bring the handles upward and inward in front of your chest.",
   "Return slowly without swinging."
  ]
 },
 {
  "id": "landminepress",
  "name": "Single-arm landmine press",
  "primary": "shoulders",
  "secondary": [
   "chest",
   "triceps"
  ],
  "equipment": "Landmine / barbell",
  "steps": [
   "Stand steadily holding the bar end near your shoulder.",
   "Press diagonally upward and forward.",
   "Lower under control before switching arms."
  ]
 },
 {
  "id": "arnoldpress",
  "name": "Arnold press",
  "primary": "shoulders",
  "secondary": [
   "triceps"
  ],
  "equipment": "Dumbbells",
  "steps": [
   "Begin with dumbbells near shoulder height.",
   "Rotate your palms outward as you press overhead.",
   "Reverse the motion slowly."
  ]
 },
 {
  "id": "frontraise",
  "name": "Dumbbell front raise",
  "primary": "shoulders",
  "secondary": [],
  "equipment": "Dumbbells",
  "steps": [
   "Stand tall with dumbbells by your thighs.",
   "Raise one or both arms forward to a comfortable height.",
   "Lower slowly without swinging."
  ]
 },
 {
  "id": "cablelateral",
  "name": "Cable lateral raise",
  "primary": "shoulders",
  "secondary": [],
  "equipment": "Cable machine",
  "steps": [
   "Stand sideways to a low cable with a stable stance.",
   "Raise the working arm out to the side.",
   "Lower slowly and repeat on the other side."
  ]
 },
 {
  "id": "uprightrow",
  "name": "Cable upright row",
  "primary": "shoulders",
  "secondary": [
   "upper_back",
   "biceps"
  ],
  "equipment": "Cable machine",
  "steps": [
   "Hold the cable handle in front of your thighs.",
   "Draw elbows upward only within a comfortable shoulder range.",
   "Lower with control."
  ]
 },
 {
  "id": "reversepec",
  "name": "Reverse pec deck",
  "primary": "shoulders",
  "secondary": [
   "upper_back"
  ],
  "equipment": "Reverse fly machine",
  "steps": [
   "Set the seat so handles align with your shoulders.",
   "Move your arms outward without shrugging.",
   "Return slowly."
  ]
 },
 {
  "id": "shrugs",
  "name": "Dumbbell shrug",
  "primary": "upper_back",
  "secondary": [
   "forearms"
  ],
  "equipment": "Dumbbells",
  "steps": [
   "Stand tall holding dumbbells at your sides.",
   "Lift shoulders straight up without rolling them.",
   "Lower slowly."
  ]
 },
 {
  "id": "barbellshrug",
  "name": "Barbell shrug",
  "primary": "upper_back",
  "secondary": [
   "forearms"
  ],
  "equipment": "Barbell",
  "steps": [
   "Hold a bar in front of your thighs.",
   "Raise shoulders toward your ears without bending elbows.",
   "Lower slowly."
  ]
 },
 {
  "id": "chestsupportedrow",
  "name": "Chest-supported dumbbell row",
  "primary": "upper_back",
  "secondary": [
   "lats",
   "biceps"
  ],
  "equipment": "Dumbbells / incline bench",
  "steps": [
   "Lie chest-down on an inclined bench.",
   "Pull dumbbells toward your lower ribs.",
   "Lower slowly while keeping chest supported."
  ]
 },
 {
  "id": "widecablerow",
  "name": "Wide-grip cable row",
  "primary": "upper_back",
  "secondary": [
   "biceps",
   "lats"
  ],
  "equipment": "Cable machine",
  "steps": [
   "Sit upright with a wide cable handle.",
   "Pull elbows backward while keeping shoulders relaxed.",
   "Return under control."
  ]
 },
 {
  "id": "proneyraise",
  "name": "Prone Y raise",
  "primary": "upper_back",
  "secondary": [
   "shoulders"
  ],
  "equipment": "Mat / light dumbbells",
  "steps": [
   "Lie face down with arms angled overhead in a Y shape.",
   "Raise arms slightly without arching your lower back.",
   "Lower slowly."
  ]
 },
 {
  "id": "bandpullapart",
  "name": "Resistance band pull-apart",
  "primary": "upper_back",
  "secondary": [
   "shoulders"
  ],
  "equipment": "Resistance band",
  "steps": [
   "Hold a band at chest height with arms nearly straight.",
   "Separate hands while bringing shoulder blades together.",
   "Return slowly."
  ]
 },
 {
  "id": "straightpulldown",
  "name": "Straight-arm pulldown",
  "primary": "lats",
  "secondary": [
   "triceps"
  ],
  "equipment": "Cable machine",
  "steps": [
   "Stand facing a high cable with arms almost straight.",
   "Pull the handle toward your thighs.",
   "Return slowly without swinging."
  ]
 },
 {
  "id": "onearmrow",
  "name": "One-arm dumbbell row",
  "primary": "lats",
  "secondary": [
   "upper_back",
   "biceps"
  ],
  "equipment": "Dumbbell / bench",
  "steps": [
   "Support one hand on a stable bench.",
   "Pull the dumbbell toward your hip.",
   "Lower slowly and switch sides."
  ]
 },
 {
  "id": "neutralpulldown",
  "name": "Neutral-grip lat pulldown",
  "primary": "lats",
  "secondary": [
   "biceps",
   "upper_back"
  ],
  "equipment": "Cable machine",
  "steps": [
   "Sit securely and grasp neutral handles.",
   "Pull handles toward your upper chest.",
   "Return under control."
  ]
 },
 {
  "id": "chinup",
  "name": "Chin-up",
  "primary": "lats",
  "secondary": [
   "biceps",
   "upper_back"
  ],
  "equipment": "Pull-up bar",
  "steps": [
   "Hang from a secure bar with palms facing you.",
   "Pull upward smoothly without kicking.",
   "Lower with control."
  ]
 },
 {
  "id": "assistedpullup",
  "name": "Assisted pull-up",
  "primary": "lats",
  "secondary": [
   "biceps",
   "upper_back"
  ],
  "equipment": "Assisted pull-up machine",
  "steps": [
   "Set assistance and take a secure grip.",
   "Pull your torso upward while keeping movement controlled.",
   "Lower slowly."
  ]
 },
 {
  "id": "meadowsrow",
  "name": "Landmine row",
  "primary": "lats",
  "secondary": [
   "upper_back",
   "biceps"
  ],
  "equipment": "Landmine / barbell",
  "steps": [
   "Hinge at the hips with a neutral back.",
   "Pull the bar end toward your hip.",
   "Lower under control and change sides."
  ]
 },
 {
  "id": "preachercurl",
  "name": "Preacher curl",
  "primary": "biceps",
  "secondary": [
   "forearms"
  ],
  "equipment": "Preacher bench / barbell",
  "steps": [
   "Rest upper arms on the bench pad.",
   "Curl the weight without lifting elbows.",
   "Lower slowly."
  ]
 },
 {
  "id": "concentrationcurl",
  "name": "Concentration curl",
  "primary": "biceps",
  "secondary": [
   "forearms"
  ],
  "equipment": "Dumbbell",
  "steps": [
   "Sit with the working upper arm supported against your thigh.",
   "Curl the dumbbell without swinging.",
   "Lower slowly and change arms."
  ]
 },
 {
  "id": "inclinecurl",
  "name": "Incline dumbbell curl",
  "primary": "biceps",
  "secondary": [
   "forearms"
  ],
  "equipment": "Dumbbells / incline bench",
  "steps": [
   "Sit back on an incline bench with arms hanging comfortably.",
   "Curl the dumbbells while keeping upper arms steady.",
   "Lower slowly."
  ]
 },
 {
  "id": "cablecurl",
  "name": "Standing cable curl",
  "primary": "biceps",
  "secondary": [
   "forearms"
  ],
  "equipment": "Cable machine",
  "steps": [
   "Stand facing a low cable handle.",
   "Curl the handle toward your shoulders.",
   "Return with control."
  ]
 },
 {
  "id": "reversecurl",
  "name": "Reverse-grip curl",
  "primary": "forearms",
  "secondary": [
   "biceps"
  ],
  "equipment": "Barbell / dumbbells",
  "steps": [
   "Hold the weight with palms facing downward.",
   "Curl using a comfortable range of motion.",
   "Lower slowly while keeping wrists aligned."
  ]
 },
 {
  "id": "zottmancurl",
  "name": "Zottman curl",
  "primary": "biceps",
  "secondary": [
   "forearms"
  ],
  "equipment": "Dumbbells",
  "steps": [
   "Curl dumbbells with palms facing upward.",
   "Rotate palms downward near the top.",
   "Lower slowly and reset your grip."
  ]
 },
 {
  "id": "spidercurl",
  "name": "Spider curl",
  "primary": "biceps",
  "secondary": [
   "forearms"
  ],
  "equipment": "Dumbbells / incline bench",
  "steps": [
   "Lie chest-down on an inclined bench with arms hanging.",
   "Curl dumbbells without moving upper arms.",
   "Lower slowly."
  ]
 },
 {
  "id": "skullcrusher",
  "name": "Lying triceps extension",
  "primary": "triceps",
  "secondary": [],
  "equipment": "EZ bar / dumbbells",
  "steps": [
   "Lie on a bench with weights above your shoulders.",
   "Bend elbows to lower weights toward the head area in control.",
   "Extend elbows smoothly."
  ]
 },
 {
  "id": "tridip",
  "name": "Bench-supported triceps dip",
  "primary": "triceps",
  "secondary": [
   "chest",
   "shoulders"
  ],
  "equipment": "Stable bench",
  "steps": [
   "Support your hands on a stable bench behind you.",
   "Lower only within a comfortable shoulder range.",
   "Press back upward without bouncing."
  ]
 },
 {
  "id": "ropepush",
  "name": "Rope triceps pushdown",
  "primary": "triceps",
  "secondary": [],
  "equipment": "Cable machine",
  "steps": [
   "Stand with elbows close to your sides.",
   "Extend elbows while separating the rope ends slightly.",
   "Return slowly."
  ]
 },
 {
  "id": "kickback",
  "name": "Dumbbell triceps kickback",
  "primary": "triceps",
  "secondary": [],
  "equipment": "Dumbbell",
  "steps": [
   "Hinge forward with upper arm alongside your torso.",
   "Straighten the elbow without swinging.",
   "Return slowly and switch sides."
  ]
 },
 {
  "id": "closepush",
  "name": "Close-hand push-up",
  "primary": "triceps",
  "secondary": [
   "chest",
   "shoulders"
  ],
  "equipment": "Bodyweight",
  "steps": [
   "Place hands comfortably close under your chest.",
   "Lower while keeping elbows controlled.",
   "Press upward steadily."
  ]
 },
 {
  "id": "overheadrope",
  "name": "Overhead cable triceps extension",
  "primary": "triceps",
  "secondary": [],
  "equipment": "Cable machine",
  "steps": [
   "Face away from a cable with elbows bent overhead.",
   "Extend elbows without moving your torso.",
   "Return under control."
  ]
 },
 {
  "id": "wristreverse",
  "name": "Reverse wrist curl",
  "primary": "forearms",
  "secondary": [],
  "equipment": "Dumbbell / barbell",
  "steps": [
   "Support forearms with palms facing downward.",
   "Raise hands at the wrists in a small controlled motion.",
   "Lower slowly."
  ]
 },
 {
  "id": "pronation",
  "name": "Forearm pronation and supination",
  "primary": "forearms",
  "secondary": [],
  "equipment": "Light dumbbell",
  "steps": [
   "Support one forearm with elbow bent.",
   "Rotate your palm gently upward and downward.",
   "Move slowly and switch arms."
  ]
 },
 {
  "id": "gripcarry",
  "name": "Suitcase carry",
  "primary": "forearms",
  "secondary": [
   "obliques",
   "upper_back"
  ],
  "equipment": "Dumbbell / kettlebell",
  "steps": [
   "Hold one weight at your side and stand tall.",
   "Walk with steady steps without leaning.",
   "Switch hands after a comfortable distance."
  ]
 },
 {
  "id": "platepinch",
  "name": "Plate pinch hold",
  "primary": "forearms",
  "secondary": [],
  "equipment": "Weight plates",
  "steps": [
   "Hold a light plate securely between fingers and thumb.",
   "Maintain a comfortable grip for a brief hold.",
   "Set it down carefully."
  ]
 },
 {
  "id": "towelhang",
  "name": "Towel grip hang",
  "primary": "forearms",
  "secondary": [
   "lats",
   "biceps"
  ],
  "equipment": "Secure bar / towel",
  "steps": [
   "Drape a secure towel over a sturdy bar.",
   "Grip both ends and support only as much weight as comfortable.",
   "Release safely when finished."
  ]
 },
 {
  "id": "legraise",
  "name": "Lying leg raise",
  "primary": "abs",
  "secondary": [
   "obliques"
  ],
  "equipment": "Mat",
  "steps": [
   "Lie on your back with hands comfortably at your sides.",
   "Lift bent or straight legs without arching your lower back.",
   "Lower slowly."
  ]
 },
 {
  "id": "reversecrunch",
  "name": "Reverse crunch",
  "primary": "abs",
  "secondary": [
   "obliques"
  ],
  "equipment": "Mat",
  "steps": [
   "Lie on your back with knees bent above your hips.",
   "Curl your pelvis slightly upward using your trunk.",
   "Lower gently."
  ]
 },
 {
  "id": "cablecrunch",
  "name": "Kneeling cable crunch",
  "primary": "abs",
  "secondary": [],
  "equipment": "Cable machine",
  "steps": [
   "Kneel facing a high cable with the handle near your head.",
   "Curl your upper trunk downward without pulling with your arms.",
   "Return slowly."
  ]
 },
 {
  "id": "hollowhold",
  "name": "Hollow-body hold",
  "primary": "abs",
  "secondary": [],
  "equipment": "Mat",
  "steps": [
   "Lie on your back and gently brace your trunk.",
   "Raise arms and legs only as far as you can keep control.",
   "Breathe normally during a short hold."
  ]
 },
 {
  "id": "mountainclimber",
  "name": "Slow mountain climber",
  "primary": "abs",
  "secondary": [
   "shoulders",
   "quads"
  ],
  "equipment": "Bodyweight",
  "steps": [
   "Start in a stable high-plank position.",
   "Bring one knee forward without rocking your hips.",
   "Alternate slowly."
  ]
 },
 {
  "id": "rollout",
  "name": "Stability-ball rollout",
  "primary": "abs",
  "secondary": [
   "shoulders"
  ],
  "equipment": "Stability ball",
  "steps": [
   "Kneel with forearms supported on a stability ball.",
   "Roll forward a short distance while keeping your trunk steady.",
   "Return under control."
  ]
 },
 {
  "id": "russiantwist",
  "name": "Seated trunk rotation",
  "primary": "obliques",
  "secondary": [
   "abs"
  ],
  "equipment": "Mat",
  "steps": [
   "Sit upright with knees bent and feet supported.",
   "Rotate your upper torso gently side to side.",
   "Keep the movement controlled rather than fast."
  ]
 },
 {
  "id": "sidebend",
  "name": "Dumbbell side bend",
  "primary": "obliques",
  "secondary": [],
  "equipment": "Dumbbell",
  "steps": [
   "Stand upright holding a dumbbell in one hand.",
   "Lean slightly to the opposite side without twisting.",
   "Return to neutral and switch sides."
  ]
 },
 {
  "id": "woodchop",
  "name": "Cable wood chop",
  "primary": "obliques",
  "secondary": [
   "abs",
   "shoulders"
  ],
  "equipment": "Cable machine",
  "steps": [
   "Stand sideways to a cable with both hands on the handle.",
   "Rotate your trunk smoothly through a comfortable range.",
   "Return slowly and repeat on the other side."
  ]
 },
 {
  "id": "highlowchop",
  "name": "High-to-low cable chop",
  "primary": "obliques",
  "secondary": [
   "abs",
   "shoulders"
  ],
  "equipment": "Cable machine",
  "steps": [
   "Set a cable handle above shoulder height.",
   "Pull diagonally across your torso with controlled rotation.",
   "Return slowly and change sides."
  ]
 },
 {
  "id": "sideplankreach",
  "name": "Side plank with reach",
  "primary": "obliques",
  "secondary": [
   "abs",
   "shoulders"
  ],
  "equipment": "Mat",
  "steps": [
   "Hold a comfortable side-plank position.",
   "Reach the upper arm forward without losing balance.",
   "Return and repeat on both sides."
  ]
 },
 {
  "id": "resistedrotation",
  "name": "Standing band rotation",
  "primary": "obliques",
  "secondary": [
   "abs"
  ],
  "equipment": "Resistance band",
  "steps": [
   "Stand sideways to a secure band anchor.",
   "Rotate your torso gently away from the anchor.",
   "Return slowly and switch sides."
  ]
 },
 {
  "id": "clamshell",
  "name": "Side-lying clamshell",
  "primary": "glutes",
  "secondary": [],
  "equipment": "Mini resistance band / mat",
  "steps": [
   "Lie on your side with knees bent and hips stacked.",
   "Lift the top knee without rolling backward.",
   "Lower slowly and switch sides."
  ]
 },
 {
  "id": "hipabduction",
  "name": "Standing hip abduction",
  "primary": "glutes",
  "secondary": [],
  "equipment": "Cable machine / resistance band",
  "steps": [
   "Stand upright holding a stable support.",
   "Move one leg outward without leaning.",
   "Return slowly and switch legs."
  ]
 },
 {
  "id": "reversehyper",
  "name": "Prone hip extension",
  "primary": "glutes",
  "secondary": [
   "hamstrings"
  ],
  "equipment": "Mat / bench",
  "steps": [
   "Lie face down with legs extended.",
   "Lift one leg slightly using the hip without arching your back.",
   "Lower and switch legs."
  ]
 },
 {
  "id": "cablekick",
  "name": "Cable glute kickback",
  "primary": "glutes",
  "secondary": [
   "hamstrings"
  ],
  "equipment": "Cable machine",
  "steps": [
   "Attach a low cable to one ankle and hold a stable support.",
   "Extend the leg backward without arching your lower back.",
   "Return slowly and switch legs."
  ]
 },
 {
  "id": "frogpump",
  "name": "Frog pump",
  "primary": "glutes",
  "secondary": [],
  "equipment": "Mat",
  "steps": [
   "Lie on your back with soles of feet together.",
   "Lift hips while keeping movement comfortable.",
   "Lower slowly."
  ]
 },
 {
  "id": "singlebridge",
  "name": "Single-leg glute bridge",
  "primary": "glutes",
  "secondary": [
   "hamstrings",
   "abs"
  ],
  "equipment": "Mat",
  "steps": [
   "Lie on your back with one foot planted.",
   "Lift hips while keeping the pelvis level.",
   "Lower and switch sides."
  ]
 },
 {
  "id": "splitquat",
  "name": "Bulgarian split squat",
  "primary": "quads",
  "secondary": [
   "glutes",
   "hamstrings"
  ],
  "equipment": "Bench / dumbbells optional",
  "steps": [
   "Place one foot behind you on a low stable support.",
   "Bend the front knee within a comfortable range.",
   "Stand smoothly and switch sides."
  ]
 },
 {
  "id": "frontsquat",
  "name": "Front squat",
  "primary": "quads",
  "secondary": [
   "glutes",
   "abs"
  ],
  "equipment": "Barbell",
  "steps": [
   "Hold the bar securely at the front of your shoulders.",
   "Lower into a comfortable squat with your torso upright.",
   "Stand with control."
  ]
 },
 {
  "id": "hacksquat",
  "name": "Hack squat machine",
  "primary": "quads",
  "secondary": [
   "glutes"
  ],
  "equipment": "Hack squat machine",
  "steps": [
   "Position shoulders and feet according to the machine setup.",
   "Lower to a comfortable knee bend.",
   "Press upward without snapping knees straight."
  ]
 },
 {
  "id": "wallseat",
  "name": "Wall sit",
  "primary": "quads",
  "secondary": [
   "glutes"
  ],
  "equipment": "Wall",
  "steps": [
   "Lean against a wall with feet ahead of you.",
   "Slide down to a comfortable seated angle.",
   "Hold briefly while breathing normally."
  ]
 },
 {
  "id": "sissysquat",
  "name": "Assisted heel-elevated squat",
  "primary": "quads",
  "secondary": [
   "glutes"
  ],
  "equipment": "Stable support / heel wedge",
  "steps": [
   "Hold a stable support with heels slightly elevated.",
   "Bend knees in a comfortable range while staying balanced.",
   "Return to standing with control."
  ]
 },
 {
  "id": "walkinglunge",
  "name": "Walking lunge",
  "primary": "quads",
  "secondary": [
   "glutes",
   "hamstrings"
  ],
  "equipment": "Bodyweight / dumbbells",
  "steps": [
   "Step forward into a comfortable split stance.",
   "Lower smoothly and push through the front foot.",
   "Continue alternating legs."
  ]
 },
 {
  "id": "boxsquat",
  "name": "Box squat",
  "primary": "quads",
  "secondary": [
   "glutes"
  ],
  "equipment": "Stable box / barbell optional",
  "steps": [
   "Stand in front of a stable box.",
   "Lower until you gently contact the box.",
   "Stand without rocking backward."
  ]
 },
 {
  "id": "singlelegpress",
  "name": "Single-leg press",
  "primary": "quads",
  "secondary": [
   "glutes"
  ],
  "equipment": "Leg press machine",
  "steps": [
   "Adjust the machine for a comfortable starting position.",
   "Press with one leg without twisting your pelvis.",
   "Return slowly and switch legs."
  ]
 },
 {
  "id": "nordicassist",
  "name": "Assisted Nordic hamstring curl",
  "primary": "hamstrings",
  "secondary": [
   "glutes"
  ],
  "equipment": "Mat / partner or anchor",
  "steps": [
   "Kneel with ankles securely supported.",
   "Lean forward a short distance while controlling the descent.",
   "Use hands for assistance to return."
  ]
 },
 {
  "id": "stiffleg",
  "name": "Stiff-leg dumbbell deadlift",
  "primary": "hamstrings",
  "secondary": [
   "glutes",
   "upper_back"
  ],
  "equipment": "Dumbbells",
  "steps": [
   "Stand with knees softly bent and dumbbells near thighs.",
   "Hinge at hips while keeping the weights close.",
   "Return upright smoothly."
  ]
 },
 {
  "id": "singlelegRDL",
  "name": "Single-leg Romanian deadlift",
  "primary": "hamstrings",
  "secondary": [
   "glutes",
   "abs"
  ],
  "equipment": "Dumbbell optional",
  "steps": [
   "Balance on one foot with a slight knee bend.",
   "Hinge at the hip while extending the other leg backward.",
   "Return upright and switch sides."
  ]
 },
 {
  "id": "lyinglegcurl",
  "name": "Lying leg curl",
  "primary": "hamstrings",
  "secondary": [],
  "equipment": "Leg curl machine",
  "steps": [
   "Adjust the machine to align the knee pivot.",
   "Bend knees to move the pad toward your body.",
   "Lower slowly."
  ]
 },
 {
  "id": "slidercurl",
  "name": "Sliding hamstring curl",
  "primary": "hamstrings",
  "secondary": [
   "glutes",
   "abs"
  ],
  "equipment": "Sliders / towel",
  "steps": [
   "Lie on your back with heels on sliders.",
   "Lift hips gently and draw heels toward you.",
   "Slide heels away under control."
  ]
 },
 {
  "id": "goodmorning",
  "name": "Light good morning",
  "primary": "hamstrings",
  "secondary": [
   "glutes",
   "upper_back"
  ],
  "equipment": "Light barbell / bodyweight",
  "steps": [
   "Stand tall with soft knees and hands or bar secured.",
   "Hinge at the hips without rounding your back.",
   "Return upright using a controlled motion."
  ]
 },
 {
  "id": "hiphinge",
  "name": "Bodyweight hip hinge",
  "primary": "hamstrings",
  "secondary": [
   "glutes"
  ],
  "equipment": "Bodyweight",
  "steps": [
   "Stand with knees softly bent.",
   "Move hips backward while keeping a neutral trunk.",
   "Stand upright smoothly."
  ]
 },
 {
  "id": "calfpress",
  "name": "Leg press calf raise",
  "primary": "calves",
  "secondary": [],
  "equipment": "Leg press machine",
  "steps": [
   "Place the balls of your feet securely on the platform.",
   "Raise heels using your ankles with knees steady.",
   "Lower slowly within a comfortable range."
  ]
 },
 {
  "id": "donkeycalf",
  "name": "Bent-over calf raise",
  "primary": "calves",
  "secondary": [],
  "equipment": "Stable support",
  "steps": [
   "Lean forward with hands on a stable support.",
   "Rise onto the balls of your feet.",
   "Lower slowly."
  ]
 },
 {
  "id": "singlecalf",
  "name": "Single-leg calf raise",
  "primary": "calves",
  "secondary": [],
  "equipment": "Stable support",
  "steps": [
   "Hold a stable support and balance on one foot.",
   "Rise onto the ball of the standing foot.",
   "Lower slowly and switch legs."
  ]
 },
 {
  "id": "bentkneecalf",
  "name": "Bent-knee calf raise",
  "primary": "calves",
  "secondary": [],
  "equipment": "Bodyweight / dumbbell optional",
  "steps": [
   "Stand with knees slightly bent and hold a stable support.",
   "Raise heels without straightening your knees.",
   "Lower slowly."
  ]
 },
 {
  "id": "seatedbandcalf",
  "name": "Seated band plantar flexion",
  "primary": "calves",
  "secondary": [],
  "equipment": "Resistance band",
  "steps": [
   "Sit with one leg extended and band secured around the forefoot.",
   "Point the foot gently against the band's resistance.",
   "Return slowly and switch feet."
  ]
 },
 {
  "id": "tibialisraise",
  "name": "Wall-supported toe raise",
  "primary": "calves",
  "secondary": [],
  "equipment": "Wall",
  "steps": [
   "Lean against a wall with heels on the floor.",
   "Lift the front of your feet while keeping heels planted.",
   "Lower slowly."
  ]
 },

 {"id": "adductor_machine", "name": "Seated hip adduction machine", "primary": "adductors", "secondary": ["glutes"], "equipment": "Hip adduction machine", "steps": ["Adjust the machine to a comfortable starting position.", "Bring your legs inward smoothly without jerking.", "Return slowly to the starting position."]},
 {"id": "cable_adduction", "name": "Standing cable hip adduction", "primary": "adductors", "secondary": ["abs"], "equipment": "Low cable / ankle strap", "steps": ["Stand tall beside a cable machine and hold a support.", "Bring the working leg inward across your body.", "Return with control and switch sides."]},
 {"id": "side_adduction", "name": "Side-lying hip adduction", "primary": "adductors", "secondary": [], "equipment": "Mat", "steps": ["Lie on your side with the upper leg supported in front.", "Lift the lower leg a short distance without twisting your hips.", "Lower slowly and repeat on the other side."]},
 {"id": "standing_knee_raise", "name": "Standing knee raise", "primary": "hip_flexors", "secondary": ["abs"], "equipment": "Bodyweight", "steps": ["Stand upright near a stable support.", "Raise one knee toward your waist without leaning back.", "Lower slowly and alternate legs."]},
 {"id": "seated_knee_raise", "name": "Seated knee raise", "primary": "hip_flexors", "secondary": ["abs"], "equipment": "Chair / bench", "steps": ["Sit upright with both feet on the floor.", "Lift one knee without rocking your torso.", "Lower with control and alternate."]},
 {"id": "band_hip_flexion", "name": "Band-resisted hip flexion", "primary": "hip_flexors", "secondary": ["abs"], "equipment": "Light resistance band", "steps": ["Anchor a light band securely behind you at ankle height.", "Lift the working knee forward while standing tall.", "Return slowly and repeat on the other side."]},
 {"id": "tibialis_raise", "name": "Wall-supported tibialis raise", "primary": "shins", "secondary": [], "equipment": "Wall", "steps": ["Lean your upper back against a wall with feet slightly forward.", "Keep heels planted and lift your toes toward your shins.", "Lower your toes slowly."]},
 {"id": "band_dorsiflexion", "name": "Band-resisted ankle dorsiflexion", "primary": "shins", "secondary": [], "equipment": "Resistance band", "steps": ["Sit with one leg supported and the band anchored in front.", "Pull your toes toward your shin against gentle resistance.", "Return slowly without twisting your ankle."]},
 {"id": "heel_walk", "name": "Short heel walk", "primary": "shins", "secondary": [], "equipment": "Bodyweight", "steps": ["Stand near a support on level ground.", "Lift your forefeet while keeping heels on the floor.", "Take a few controlled steps and rest."]},
 {"id": "cable_abduction", "name": "Standing cable hip abduction", "primary": "abductors", "secondary": ["glutes"], "equipment": "Low cable / ankle strap", "steps": ["Stand tall beside a cable machine and hold a support.", "Move one leg gently outward without tilting your trunk.", "Return slowly and switch sides."]},
 {"id": "side_leg_raise", "name": "Side-lying leg raise", "primary": "abductors", "secondary": ["glutes"], "equipment": "Mat", "steps": ["Lie on your side with hips stacked.", "Raise your upper leg without rotating your pelvis.", "Lower slowly and repeat on the other side."]},
 {"id": "lateral_band_walk", "name": "Lateral band walk", "primary": "abductors", "secondary": ["glutes", "quads"], "equipment": "Resistance band", "steps": ["Place a light band above your knees.", "Keep a comfortable knee bend and step sideways.", "Maintain tension while taking controlled steps in both directions."]},
];
