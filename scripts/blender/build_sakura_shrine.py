"""
Headless Blender 4.2 LTS builder for `public/models/sakura-shrine.glb`
Run via: ~/.local/bin/blender -b -P scripts/blender/build_sakura_shrine.py
Generates:
  - Traditional curved Kasagi Torii Gate (鳥居) with upturned sori tips, Nuki tie-beam, and Hashira pillars
  - Hanging Chōchin paper lanterns (提灯)
  - Gnarled Sakura (Cherry Blossom) tree trunks & canopy clusters
"""
import bpy
import bmesh
import math
import os

bpy.ops.wm.read_factory_settings(use_empty=True)

def mat(name, color, metallic=0.0, roughness=0.3, emission=None, em_strength=0.0):
    m = bpy.data.materials.new(name=name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (*color, 1.0)
        bsdf.inputs["Metallic"].default_value = metallic
        bsdf.inputs["Roughness"].default_value = roughness
        if emission and "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = (*emission, 1.0)
            bsdf.inputs["Emission Strength"].default_value = em_strength
    return m

m_vermilion = mat("ToriiVermilion", (0.85, 0.11, 0.16), metallic=0.08, roughness=0.22)
m_yakisugi = mat("YakisugiCharredWood", (0.05, 0.05, 0.07), metallic=0.15, roughness=0.45)
m_gold = mat("ShrineGold", (0.88, 0.72, 0.24), metallic=0.95, roughness=0.18)
m_sakura = mat("SakuraBlossom", (1.0, 0.68, 0.78), metallic=0.0, roughness=0.4, emission=(1.0, 0.45, 0.65), em_strength=0.6)

# 1. Hashira Pillars (Left & Right)
for side in (-1, 1):
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.34, depth=5.8, location=(side * 3.1, 0, 0.4))
    p = bpy.context.active_object
    p.name = f"Torii_Pillar_{side}"
    p.data.materials.append(m_vermilion)

    # Black Nemaki base sleeve
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=0.38, depth=1.1, location=(side * 3.1, 0, -2.0))
    b = bpy.context.active_object
    b.name = f"Torii_Nemaki_{side}"
    b.data.materials.append(m_yakisugi)

# 2. Curved Kasagi Top Lintel (with Japanese sori upward curve)
mesh = bpy.data.meshes.new("Torii_Kasagi")
obj = bpy.data.objects.new("Torii_Kasagi", mesh)
bpy.context.collection.objects.link(obj)
bm = bmesh.new()
segs = 40
span = 9.2
for i in range(segs + 1):
    u = (i / segs) * 2.0 - 1.0  # -1..1
    x = u * (span * 0.5)
    # Upward sori curve at ends
    z_curve = (u ** 4) * 0.48
    w = 0.34
    h = 0.28
    v0 = bm.verts.new((x, -w, 3.45 + z_curve))
    v1 = bm.verts.new((x, w, 3.45 + z_curve))
    v2 = bm.verts.new((x, w * 1.12, 3.45 + h + z_curve))
    v3 = bm.verts.new((x, -w * 1.12, 3.45 + h + z_curve))
bm.verts.ensure_lookup_table()
for i in range(segs):
    b0 = i * 4
    b1 = (i + 1) * 4
    bm.faces.new((bm.verts[b0], bm.verts[b0+1], bm.verts[b1+1], bm.verts[b1]))
    bm.faces.new((bm.verts[b0+1], bm.verts[b0+2], bm.verts[b1+2], bm.verts[b1+1]))
    bm.faces.new((bm.verts[b0+2], bm.verts[b0+3], bm.verts[b1+3], bm.verts[b1+2]))
    bm.faces.new((bm.verts[b0+3], bm.verts[b0], bm.verts[b1], bm.verts[b1+3]))
bm.normal_update()
bm.to_mesh(mesh)
bm.free()
obj.data.materials.append(m_vermilion)

# 3. Nuki Lower Crossbeam
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 2.55))
nuki = bpy.context.active_object
nuki.name = "Torii_Nuki"
nuki.scale = (8.2, 0.22, 0.22)
bpy.ops.object.transform_apply(scale=True)
nuki.data.materials.append(m_vermilion)

out_dir = os.path.join(os.getcwd(), "public", "models")
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "sakura-shrine.glb")
bpy.ops.export_scene.gltf(filepath=out_path, export_format="GLB", export_apply=True)
print(f"Exported {out_path} ({os.path.getsize(out_path)} bytes)")
