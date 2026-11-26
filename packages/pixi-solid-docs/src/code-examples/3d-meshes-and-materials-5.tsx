import { SphereGeometry, Material3D } from "@pixi/3d";
import { Mesh3D } from "pixi-solid-3d";
import { For } from "solid-js";

// Instantiated once at module level (shared GPU memory across all instances)
const SHARED_SPHERE = new SphereGeometry({ radius: 0.5 });
const ENEMY_MATERIAL = new Material3D({ baseColor: "#ef4444", roughness: 0.3 });

export const EnemySwarm = (props: {
  enemies: Array<{ id: string; x: number; y: number; z: number }>;
}) => {
  return (
    <For each={props.enemies}>
      {(enemy) => (
        // When an individual enemy unmounts, SHARED_SPHERE and ENEMY_MATERIAL remain alive!
        <Mesh3D
          x={enemy.x}
          y={enemy.y}
          z={enemy.z}
          geometry={SHARED_SPHERE}
          material={ENEMY_MATERIAL}
        />
      )}
    </For>
  );
};
