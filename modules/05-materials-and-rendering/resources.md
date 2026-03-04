# Module 05: Resources - Materials and Rendering

## Essential Tutorials

### Ben Cloward's Material Tutorial Series (YouTube)
**https://www.youtube.com/@BenCloward**
The gold standard for Unreal material tutorials. Ben is a Technical Artist at Epic Games and his series covers everything from basic PBR setup to advanced shader techniques. Each video focuses on a single material concept with clear node graph explanations. Start with his "Shader Basics" playlist, then move to advanced topics like triplanar mapping, procedural textures, and distance-based blending. Particularly relevant for our project: his videos on material blending, lerp techniques, and emissive effects.

### PrismaticaDev Material Tutorials (YouTube)
**https://www.youtube.com/@PrismaticaDev**
Focused, practical material tutorials for UE5. Covers Material Instances, Material Parameter Collections, and dynamic materials with clear project-based examples. Good for learners who want short, focused videos on specific topics rather than a long series.

---

## Official Documentation

### UE5 Materials Documentation
**https://docs.unrealengine.com/5.0/en-US/unreal-engine-materials/**
The official reference for the material system. Covers the Material Editor interface, all material expressions (nodes), shading models, blend modes, and material domains. Use this as a reference when you need to look up a specific node or feature.

### Nanite Virtualised Geometry
**https://docs.unrealengine.com/5.0/en-US/nanite-virtualized-geometry-in-unreal-engine/**
Official documentation for Nanite. Covers supported mesh types, performance characteristics, known limitations, and best practices. Essential reading before deciding which meshes in your project should use Nanite.

### Lumen Global Illumination and Reflections
**https://docs.unrealengine.com/5.0/en-US/lumen-global-illumination-and-reflections-in-unreal-engine/**
Official documentation for Lumen. Covers the software and hardware ray tracing paths, quality settings, performance tuning, and scene setup requirements. Includes guidance on lighting best practices for Lumen-lit scenes.

### Render Targets Documentation
**https://docs.unrealengine.com/5.0/en-US/render-targets-in-unreal-engine/**
Official docs on creating and using Render Targets, Scene Capture components, and render-to-texture workflows. Directly relevant to the tabletop map system.

### Post Process Effects
**https://docs.unrealengine.com/5.0/en-US/post-process-effects-in-unreal-engine/**
Reference for all post-processing features: bloom, depth of field, colour grading, auto exposure, motion blur, ambient occlusion, and more. Useful for setting up mood-specific post-processing profiles.

---

## Video Overviews

### UE5 Nanite and Lumen Overview (Unreal Engine YouTube)
**https://www.youtube.com/@UnrealEngine**
Epic's official YouTube channel has multiple deep-dive presentations on Nanite and Lumen from Unreal Fest and GDC talks. Search for "Nanite Deep Dive" and "Lumen in UE5" for the most detailed technical presentations. These are given by the engineers who built the systems and cover internal architecture, performance profiling, and optimal scene setup.

### William Faucher (YouTube)
**https://www.youtube.com/@WilliamFaucher**
High-quality UE5 rendering and material tutorials focused on achieving cinematic quality. Covers Lumen lighting setups, material layering, and post-processing for specific moods. His videos on realistic interior lighting are directly applicable to the tabletop scene's warm lamp-lit atmosphere.

---

## Texture Resources

### Quixel Megascans (via Fab)
**https://www.fab.com/**
Library of photogrammetry-scanned materials and assets, many available for free with an Unreal Engine license. Provides complete PBR texture sets (base colour, normal, roughness, metallic, displacement) for hundreds of real-world surfaces. Use these for rapid prototyping and final assets: stone, wood, metal, fabric, and more.

### Poly Haven
**https://polyhaven.com/**
Free, CC0-licensed PBR textures, HDRIs, and 3D models. All textures come in full PBR sets. Excellent for learning materials without worrying about licensing. The wood, stone, and metal textures are well-suited to a fantasy RPG project.

### ambientCG
**https://ambientcg.com/**
Another free CC0 PBR texture library. Particularly strong in architectural materials (brick, concrete, tile, marble) and natural surfaces (soil, grass, rock). All textures include full PBR channel maps.

---

## Advanced Topics

### Material Layering and Material Functions
**https://docs.unrealengine.com/5.0/en-US/material-functions-in-unreal-engine/**
When your materials become complex (the miniature-to-character crossfade with additional effects), Material Functions let you encapsulate reusable logic into modular blocks. This keeps your material graphs manageable and lets you share common operations across multiple materials.

### Substrate (Experimental Material System)
**https://docs.unrealengine.com/5.0/en-US/substrate-in-unreal-engine/**
UE5's next-generation material system (formerly Strata). It replaces the fixed shading models with a more flexible, layered approach. While still experimental, it is worth being aware of for future-proofing your material knowledge.

---

## Recommended Study Order

1. Start with Ben Cloward's "Shader Basics" playlist for foundational material concepts
2. Read the official Materials documentation for the Material Editor interface
3. Follow PrismaticaDev's tutorials for Material Instances and MPCs
4. Study the Nanite and Lumen documentation and watch the official deep-dive videos
5. Download free textures from Quixel/Poly Haven and practice building PBR materials
6. Watch William Faucher's lighting videos for mood-specific post-processing setup
7. Study Material Functions documentation when your materials grow complex
