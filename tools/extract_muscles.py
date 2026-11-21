"""Run in Blender background against Z-Anatomy Startup.blend.
Produces a candidate muscle manifest and an export GLB for manual review.
Does not assume collection names or third-party licensing are validated.
"""
import bpy, json, re, os, sys
from pathlib import Path
out=Path(os.environ.get('IRON_EXPORT_DIR',str(Path.cwd()/'iron-muscle-export')))
out.mkdir(parents=True,exist_ok=True)
# Inspect collections first. Z-Anatomy has complex hierarchy and may include nonmuscular anatomy.
collections=[{'name':c.name,'objects':len(c.objects),'parentCollections':[p.name for p in bpy.data.collections if c.name in p.children]} for c in bpy.data.collections]
(out/'collections.json').write_text(json.dumps(collections,indent=2),encoding='utf-8')
keywords=('muscle','muscular','muscles','skeletal muscle')
selected=[]
for obj in bpy.data.objects:
 if obj.type!='MESH':continue
 lineage=[c.name for c in obj.users_collection]
 if any(any(k in c.lower() for k in keywords) for c in lineage):
  selected.append(obj)
manifest=[{'name':o.name,'collections':[c.name for c in o.users_collection],'vertices':len(o.data.vertices),'polygons':len(o.data.polygons)} for o in selected]
(out/'muscle_candidates.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
print(f'Found {len(selected)} candidate muscle meshes. Review collections.json and muscle_candidates.json before publishing.')
if not selected:
 print('No muscle collection matched. No GLB exported; inspect collection names and adjust selection.');sys.exit(0)
bpy.ops.object.select_all(action='DESELECT')
for o in selected:o.select_set(True)
bpy.context.view_layer.objects.active=selected[0]
# No destructive decimation or mesh merging: first export is for inspection.
bpy.ops.export_scene.gltf(filepath=str(out/'muscle_candidates.glb'),export_format='GLB',use_selection=True,export_apply=True)
print('Exported candidate GLB for visual and licensing review. NOT production optimized.')
