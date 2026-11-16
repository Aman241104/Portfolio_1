# Model Refinement Pipeline

1. **Source / Procedural Geometry:** Extruded shapes with beveled edges (`bevelEnabled: true`), smooth normals, and centered origins.
2. **PBR Material Calibration:** Calibrated `metalness`, `roughness`, `clearcoat`, `transmission`, `thickness`, `ior`, and `iridescence` (`MachineModel.jsx` `mat`).
3. **Environment Reflections:** Single-frame `<Environment frames={1}>` with studio `Lightformer` strips (no per-frame cubemap re-baking).
4. **GPU Memory Disposal:** Explicit `.dispose()` lifecycle hooks on procedural `CanvasTexture`s (`Reel`, `Counter`, `Ground`) and `MeshPhysicalMaterial`s (`AtelierRig` `orbMat`).
