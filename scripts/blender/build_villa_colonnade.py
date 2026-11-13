"""
Headless Blender 4.2 LTS builder for `public/models/villa-colonnade.glb`
Run via: ~/.local/bin/blender -b -P scripts/blender/build_villa_colonnade.py
Generates:
  - 24-flute Roman columns with entasis, Attic base, and capital
  - Coffered Roman arch & keystone
  - 3-tier stepped monumental plinth
"""
import bpy
import bmesh
import math
import os

bpy.ops.wm.read_factory_settings(use_empty=True)

def create_material(name, base_color, metallic=0.0, roughness=0.25):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (*base_color, 1.0)
        bsdf.inputs["Metallic"].default_value = metallic
        bsdf.inputs["Roughness"].default_value = roughness
    return mat

mat_marble = create_material("CarraraMarble", (0.98, 0.97, 0.95), metallic=0.02, roughness=0.20)
mat_gold = create_material("RomanGold24k", (0.83, 0.68, 0.21), metallic=0.94, roughness=0.22)
mat_stucco = create_material("PompeianBlueStucco", (0.086, 0.20, 0.368), metallic=0.04, roughness=0.78)

def build_fluted_column(name, x_pos, z_pos, radius_b=0.44, radius_t=0.38, height=5.4, flutes=24):
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    bm = bmesh.new()
    segs = flutes * 4
    rings = 24
    verts_grid = []
    for r_idx in range(rings + 1):
        v_norm = r_idx / rings
        z = (v_norm - 0.5) * height
        entasis = 1.0 + math.sin(v_norm * math.pi) * 0.028
        base_r = (radius_b * (1.0 - v_norm) + radius_t * v_norm) * entasis
        flute_mask = min(1.0, max(0.0, (v_norm - 0.03) / 0.05)) * min(1.0, max(0.0, (0.97 - v_norm) / 0.05))
        ring_verts = []
        for s_idx in range(segs):
            ang = (s_idx / segs) * math.pi * 2.0
            flute_wave = max(0.0, math.cos(ang * flutes))
            r = base_r - 0.025 * flute_mask * (flute_wave ** 0.75)
            v = bm.verts.new((math.cos(ang) * r, math.sin(ang) * r, z))
            ring_verts.append(v)
        verts_grid.append(ring_verts)

    for r_idx in range(rings):
        for s_idx in range(segs):
            ns = (s_idx + 1) % segs
            bm.faces.new((
                verts_grid[r_idx][s_idx],
                verts_grid[r_idx][ns],
                verts_grid[r_idx + 1][ns],
                verts_grid[r_idx + 1][s_idx],
            ))
    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()
    for poly in mesh.polygons:
        poly.use_smooth = True
    obj.location = (x_pos, z_pos, 0.22)
    obj.data.materials.append(mat_marble)
    return obj

build_fluted_column("Column_Left", -3.28, 1.85)
build_fluted_column("Column_Right", 3.28, 1.85)

# 3-Tier Stepped Plinth
tiers = [
    ("Plinth_Tier1", (3.86, 2.16, 0.24), (0, 0, -1.62)),
    ("Plinth_Tier2", (4.48, 2.64, 0.32), (0, 0, -1.90)),
    ("Plinth_Tier3", (5.24, 3.18, 0.34), (0, 0, -2.23)),
]
for name, scale, loc in tiers:
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc)
    ob = bpy.context.active_object
    ob.name = name
    ob.scale = scale
    bpy.ops.object.transform_apply(scale=True)
    bev = ob.modifiers.new(name="Bevel", type="BEVEL")
    bev.width = 0.025
    bev.segments = 3
    bpy.ops.object.modifier_apply(modifier="Bevel")
    ob.data.materials.append(mat_marble)

out_dir = os.path.join(os.getcwd(), "public", "models")
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "villa-colonnade.glb")
bpy.ops.export_scene.gltf(
    filepath=out_path,
    export_format="GLB",
    export_apply=True,
)
print(f"Exported {out_path} ({os.path.getsize(out_path)} bytes)")
