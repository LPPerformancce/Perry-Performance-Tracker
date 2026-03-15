import { useState } from "react";

interface AnatomyBodyMapProps {
  trainedMuscles?: string[];
  onMuscleClick?: (muscleId: string) => void;
  className?: string;
}

const MUSCLE_LABELS: Record<string, string> = {
  neck_front_l: "Neck", neck_front_r: "Neck",
  upper_traps_l: "Traps", upper_traps_r: "Traps",
  front_delt_l: "Shoulders", front_delt_r: "Shoulders",
  mid_delt_l: "Shoulders", mid_delt_r: "Shoulders",
  pec_upper_l: "Chest", pec_upper_r: "Chest",
  pec_lower_l: "Chest", pec_lower_r: "Chest",
  pec_inner: "Chest",
  bicep_long_l: "Biceps", bicep_long_r: "Biceps",
  bicep_short_l: "Biceps", bicep_short_r: "Biceps",
  brachialis_l: "Biceps", brachialis_r: "Biceps",
  forearm_flexor_l: "Forearms", forearm_flexor_r: "Forearms",
  forearm_brachioradialis_l: "Forearms", forearm_brachioradialis_r: "Forearms",
  serratus_l: "Core", serratus_r: "Core",
  oblique_l: "Core", oblique_r: "Core",
  rectus_ab_1: "Core", rectus_ab_2: "Core", rectus_ab_3: "Core", rectus_ab_4: "Core",
  rectus_ab_1r: "Core", rectus_ab_2r: "Core", rectus_ab_3r: "Core", rectus_ab_4r: "Core",
  adductor_l: "Quads", adductor_r: "Quads",
  quad_vastus_lat_l: "Quads", quad_vastus_lat_r: "Quads",
  quad_rectus_l: "Quads", quad_rectus_r: "Quads",
  quad_vastus_med_l: "Quads", quad_vastus_med_r: "Quads",
  sartorius_l: "Quads", sartorius_r: "Quads",
  tibialis_l: "Calves", tibialis_r: "Calves",
  shin_l: "Calves", shin_r: "Calves",

  rear_delt_l: "Shoulders", rear_delt_r: "Shoulders",
  traps_mid_l: "Traps", traps_mid_r: "Traps",
  traps_lower: "Traps",
  infraspinatus_l: "Back", infraspinatus_r: "Back",
  teres_major_l: "Back", teres_major_r: "Back",
  rhomboid_l: "Back", rhomboid_r: "Back",
  lat_upper_l: "Back", lat_upper_r: "Back",
  lat_lower_l: "Back", lat_lower_r: "Back",
  erector_l: "Lower Back", erector_r: "Lower Back",
  tricep_long_l: "Triceps", tricep_long_r: "Triceps",
  tricep_lat_l: "Triceps", tricep_lat_r: "Triceps",
  tricep_med_l: "Triceps", tricep_med_r: "Triceps",
  forearm_ext_l: "Forearms", forearm_ext_r: "Forearms",
  glute_max_l: "Glutes", glute_max_r: "Glutes",
  glute_med_l: "Glutes", glute_med_r: "Glutes",
  hamstring_bicep_l: "Hamstrings", hamstring_bicep_r: "Hamstrings",
  hamstring_semi_l: "Hamstrings", hamstring_semi_r: "Hamstrings",
  calf_gastro_lat_l: "Calves", calf_gastro_lat_r: "Calves",
  calf_gastro_med_l: "Calves", calf_gastro_med_r: "Calves",
  soleus_l: "Calves", soleus_r: "Calves",
};

const FRONT_PATHS: Record<string, string> = {
  neck_front_l: "M 93,46 C 91,48 90,52 89,56 L 86,58 C 88,54 90,50 93,46 Z",
  neck_front_r: "M 107,46 C 109,48 110,52 111,56 L 114,58 C 112,54 110,50 107,46 Z",
  upper_traps_l: "M 86,58 C 83,60 78,64 74,68 L 70,72 L 78,70 C 82,66 85,62 88,58 Z",
  upper_traps_r: "M 114,58 C 117,60 122,64 126,68 L 130,72 L 122,70 C 118,66 115,62 112,58 Z",

  front_delt_l: "M 70,72 C 66,74 63,78 61,83 C 59,88 59,92 60,96 L 66,94 C 66,90 67,85 69,81 C 71,77 74,74 78,72 Z",
  front_delt_r: "M 130,72 C 134,74 137,78 139,83 C 141,88 141,92 140,96 L 134,94 C 134,90 133,85 131,81 C 129,77 126,74 122,72 Z",
  mid_delt_l: "M 60,96 L 66,94 C 67,98 68,100 68,102 L 62,104 C 60,102 59,100 60,96 Z",
  mid_delt_r: "M 140,96 L 134,94 C 133,98 132,100 132,102 L 138,104 C 140,102 141,100 140,96 Z",

  pec_upper_l: "M 78,70 C 82,68 88,68 94,70 L 96,72 L 96,78 C 92,76 86,76 80,78 L 78,74 Z",
  pec_upper_r: "M 122,70 C 118,68 112,68 106,70 L 104,72 L 104,78 C 108,76 114,76 120,78 L 122,74 Z",
  pec_lower_l: "M 80,78 C 86,76 92,78 96,80 L 96,90 C 94,88 90,86 86,88 C 82,90 78,92 76,96 L 72,90 C 74,86 76,82 80,78 Z",
  pec_lower_r: "M 120,78 C 114,76 108,78 104,80 L 104,90 C 106,88 110,86 114,88 C 118,90 122,92 124,96 L 128,90 C 126,86 124,82 120,78 Z",
  pec_inner: "M 96,72 L 100,71 L 104,72 L 104,90 L 100,88 L 96,90 Z",

  bicep_long_l: "M 62,104 C 60,110 58,118 58,126 L 62,128 C 63,120 64,112 66,106 Z",
  bicep_short_l: "M 66,106 C 64,112 63,120 62,128 L 66,130 C 67,122 68,114 68,106 Z",
  brachialis_l: "M 58,126 C 57,130 56,134 56,138 L 62,140 C 62,136 62,132 62,128 Z",
  bicep_long_r: "M 138,104 C 140,110 142,118 142,126 L 138,128 C 137,120 136,112 134,106 Z",
  bicep_short_r: "M 134,106 C 136,112 137,120 138,128 L 134,130 C 133,122 132,114 132,106 Z",
  brachialis_r: "M 142,126 C 143,130 144,134 144,138 L 138,140 C 138,136 138,132 138,128 Z",

  forearm_brachioradialis_l: "M 56,138 C 54,146 52,154 50,162 L 54,164 C 56,156 57,148 58,142 Z",
  forearm_flexor_l: "M 58,142 C 57,148 56,156 54,164 L 60,166 C 60,158 60,150 62,142 Z",
  forearm_brachioradialis_r: "M 144,138 C 146,146 148,154 150,162 L 146,164 C 144,156 143,148 142,142 Z",
  forearm_flexor_r: "M 142,142 C 143,148 144,156 146,164 L 140,166 C 140,158 140,150 138,142 Z",

  serratus_l: "M 76,96 C 78,98 80,100 80,104 L 84,106 C 84,102 82,98 80,94 Z",
  serratus_r: "M 124,96 C 122,98 120,100 120,104 L 116,106 C 116,102 118,98 120,94 Z",
  oblique_l: "M 80,104 C 78,112 78,122 80,130 L 86,128 C 86,120 86,112 86,106 L 84,106 Z",
  oblique_r: "M 120,104 C 122,112 122,122 120,130 L 114,128 C 114,120 114,112 114,106 L 116,106 Z",

  rectus_ab_1: "M 94,82 L 100,80 L 100,96 L 94,98 Z",
  rectus_ab_1r: "M 106,82 L 100,80 L 100,96 L 106,98 Z",
  rectus_ab_2: "M 94,100 L 100,98 L 100,114 L 94,116 Z",
  rectus_ab_2r: "M 106,100 L 100,98 L 100,114 L 106,116 Z",
  rectus_ab_3: "M 92,118 L 100,116 L 100,130 L 92,132 Z",
  rectus_ab_3r: "M 108,118 L 100,116 L 100,130 L 108,132 Z",
  rectus_ab_4: "M 90,134 L 100,132 L 100,144 L 90,146 Z",
  rectus_ab_4r: "M 110,134 L 100,132 L 100,144 L 110,146 Z",

  adductor_l: "M 90,158 C 92,168 94,180 96,192 L 100,194 L 100,162 C 98,158 94,156 90,158 Z",
  adductor_r: "M 110,158 C 108,168 106,180 104,192 L 100,194 L 100,162 C 102,158 106,156 110,158 Z",
  quad_vastus_lat_l: "M 82,156 C 78,168 76,184 76,200 L 82,204 C 82,188 84,172 86,160 Z",
  quad_vastus_lat_r: "M 118,156 C 122,168 124,184 124,200 L 118,204 C 118,188 116,172 114,160 Z",
  quad_rectus_l: "M 86,160 C 84,172 84,188 84,204 L 92,206 C 92,190 92,174 92,160 Z",
  quad_rectus_r: "M 114,160 C 116,172 116,188 116,204 L 108,206 C 108,190 108,174 108,160 Z",
  quad_vastus_med_l: "M 92,160 C 92,174 92,190 92,206 L 96,208 C 96,192 96,176 96,162 Z",
  quad_vastus_med_r: "M 108,160 C 108,174 108,190 108,206 L 104,208 C 104,192 104,176 104,162 Z",
  sartorius_l: "M 88,152 C 90,156 92,160 92,164 L 96,170 C 96,166 94,160 92,154 Z",
  sartorius_r: "M 112,152 C 110,156 108,160 108,164 L 104,170 C 104,166 106,160 108,154 Z",

  tibialis_l: "M 82,220 C 80,234 80,250 82,264 L 88,262 C 86,248 86,234 86,220 Z",
  tibialis_r: "M 118,220 C 120,234 120,250 118,264 L 112,262 C 114,248 114,234 114,220 Z",
  shin_l: "M 88,220 C 90,234 92,250 90,264 L 84,266 C 84,252 84,236 84,220 Z",
  shin_r: "M 112,220 C 110,234 108,250 110,264 L 116,266 C 116,252 116,236 116,220 Z",
};

const BACK_PATHS: Record<string, string> = {
  rear_delt_l: "M 70,72 C 66,76 62,82 60,88 C 58,94 59,98 60,102 L 66,100 C 66,96 66,90 68,84 C 70,78 72,74 76,72 Z",
  rear_delt_r: "M 130,72 C 134,76 138,82 140,88 C 142,94 141,98 140,102 L 134,100 C 134,96 134,90 132,84 C 130,78 128,74 124,72 Z",

  traps_mid_l: "M 86,56 C 82,60 78,64 74,68 L 70,72 L 76,72 C 80,68 84,64 88,60 Z",
  traps_mid_r: "M 114,56 C 118,60 122,64 126,68 L 130,72 L 124,72 C 120,68 116,64 112,60 Z",
  traps_lower: "M 88,60 C 92,64 96,66 100,66 C 104,66 108,64 112,60 L 108,74 C 104,72 100,72 96,72 L 92,74 Z",

  infraspinatus_l: "M 76,72 C 78,72 82,74 86,76 L 88,82 C 84,80 80,80 76,82 L 72,86 C 72,82 72,78 76,72 Z",
  infraspinatus_r: "M 124,72 C 122,72 118,74 114,76 L 112,82 C 116,80 120,80 124,82 L 128,86 C 128,82 128,78 124,72 Z",
  teres_major_l: "M 72,86 C 76,84 80,84 84,86 L 82,92 C 78,90 74,90 70,92 Z",
  teres_major_r: "M 128,86 C 124,84 120,84 116,86 L 118,92 C 122,90 126,90 130,92 Z",
  rhomboid_l: "M 92,74 C 94,78 96,82 96,88 L 100,90 L 100,72 C 98,72 96,72 92,74 Z",
  rhomboid_r: "M 108,74 C 106,78 104,82 104,88 L 100,90 L 100,72 C 102,72 104,72 108,74 Z",

  lat_upper_l: "M 70,92 C 72,94 76,94 80,94 L 82,92 L 84,100 C 80,100 76,100 72,100 C 68,100 68,96 70,92 Z",
  lat_upper_r: "M 130,92 C 128,94 124,94 120,94 L 118,92 L 116,100 C 120,100 124,100 128,100 C 132,100 132,96 130,92 Z",
  lat_lower_l: "M 72,100 C 76,100 80,100 84,100 L 86,112 C 84,116 82,118 80,120 L 78,116 C 74,112 72,106 72,100 Z",
  lat_lower_r: "M 128,100 C 124,100 120,100 116,100 L 114,112 C 116,116 118,118 120,120 L 122,116 C 126,112 128,106 128,100 Z",

  erector_l: "M 96,90 C 96,100 94,110 92,120 L 92,134 L 96,136 L 100,134 L 100,90 Z",
  erector_r: "M 104,90 C 104,100 106,110 108,120 L 108,134 L 104,136 L 100,134 L 100,90 Z",

  tricep_long_l: "M 62,102 C 60,108 58,116 58,124 L 62,126 C 62,118 63,110 64,104 Z",
  tricep_lat_l: "M 64,104 C 63,110 62,118 62,126 L 66,128 C 66,120 66,112 66,104 Z",
  tricep_med_l: "M 66,104 C 66,112 66,120 66,128 L 68,130 C 68,122 68,114 68,106 Z",
  tricep_long_r: "M 138,102 C 140,108 142,116 142,124 L 138,126 C 138,118 137,110 136,104 Z",
  tricep_lat_r: "M 136,104 C 137,110 138,118 138,126 L 134,128 C 134,120 134,112 134,104 Z",
  tricep_med_r: "M 134,104 C 134,112 134,120 134,128 L 132,130 C 132,122 132,114 132,106 Z",

  forearm_ext_l: "M 56,132 C 54,142 52,152 50,162 L 58,164 C 58,154 58,144 60,134 Z",
  forearm_ext_r: "M 144,132 C 146,142 148,152 150,162 L 142,164 C 142,154 142,144 140,134 Z",

  glute_med_l: "M 82,134 C 78,138 76,144 76,150 L 84,150 C 84,146 84,142 86,138 Z",
  glute_med_r: "M 118,134 C 122,138 124,144 124,150 L 116,150 C 116,146 116,142 114,138 Z",
  glute_max_l: "M 84,150 C 82,156 82,164 84,170 L 96,168 C 94,162 94,156 92,150 Z",
  glute_max_r: "M 116,150 C 118,156 118,164 116,170 L 104,168 C 106,162 106,156 108,150 Z",

  hamstring_bicep_l: "M 78,172 C 76,184 76,198 78,210 L 86,208 C 86,196 86,182 86,172 Z",
  hamstring_semi_l: "M 86,172 C 88,182 90,196 90,210 L 96,208 C 96,196 94,182 92,172 Z",
  hamstring_bicep_r: "M 122,172 C 124,184 124,198 122,210 L 114,208 C 114,196 114,182 114,172 Z",
  hamstring_semi_r: "M 114,172 C 112,182 110,196 110,210 L 104,208 C 104,196 106,182 108,172 Z",

  calf_gastro_lat_l: "M 78,218 C 76,230 76,244 78,256 L 84,254 C 82,242 82,230 82,218 Z",
  calf_gastro_med_l: "M 84,218 C 86,230 88,244 86,256 L 80,258 C 80,246 80,232 80,218 Z",
  soleus_l: "M 80,258 C 80,262 82,266 84,268 L 88,266 C 88,262 86,258 84,256 Z",
  calf_gastro_lat_r: "M 122,218 C 124,230 124,244 122,256 L 116,254 C 118,242 118,230 118,218 Z",
  calf_gastro_med_r: "M 116,218 C 114,230 112,244 114,256 L 120,258 C 120,246 120,232 120,218 Z",
  soleus_r: "M 120,258 C 120,262 118,266 116,268 L 112,266 C 112,262 114,258 116,256 Z",
};

function isMuscleActive(muscleId: string, trainedMuscles: string[]): boolean {
  const group = MUSCLE_LABELS[muscleId];
  if (!group) return false;
  return trainedMuscles.some(m => m.toLowerCase() === group.toLowerCase());
}

function BodyOutlineFront() {
  return (
    <g opacity="0.35">
      <ellipse cx="100" cy="28" rx="16" ry="20" fill="hsl(0,0%,14%)" stroke="hsl(0,0%,30%)" strokeWidth="0.8" />
      <path d="M 88,46 Q 86,48 84,52 L 80,56 Q 74,62 70,68 C 66,72 62,78 60,84 Q 56,94 54,110 C 52,126 50,142 48,158 L 50,160 Q 52,164 54,166 L 56,164 C 54,148 56,130 58,116 Q 60,104 62,96 M 112,46 Q 114,48 116,52 L 120,56 Q 126,62 130,68 C 134,72 138,78 140,84 Q 144,94 146,110 C 148,126 150,142 152,158 L 150,160 Q 148,164 146,166 L 144,164 C 146,148 144,130 142,116 Q 140,104 138,96"
        fill="none" stroke="hsl(0,0%,30%)" strokeWidth="0.8" />
      <path d="M 80,148 Q 78,154 76,162 C 74,176 74,192 76,208 Q 78,214 80,218 C 78,230 76,248 78,264 Q 80,272 84,276 L 94,276 Q 96,272 96,268 C 94,252 92,236 92,220 Q 94,210 96,202 Q 98,194 100,188 Q 102,194 104,202 Q 106,210 108,220 C 108,236 106,252 104,268 Q 104,272 106,276 L 116,276 Q 120,272 122,264 C 124,248 122,230 120,218 Q 122,214 124,208 C 126,192 126,176 124,162 Q 122,154 120,148"
        fill="none" stroke="hsl(0,0%,30%)" strokeWidth="0.8" />
    </g>
  );
}

function BodyOutlineBack() {
  return (
    <g opacity="0.35">
      <ellipse cx="100" cy="28" rx="16" ry="20" fill="hsl(0,0%,14%)" stroke="hsl(0,0%,30%)" strokeWidth="0.8" />
      <path d="M 88,46 Q 86,48 84,52 L 80,56 Q 74,62 70,68 C 66,72 62,78 60,84 Q 56,94 54,110 C 52,126 50,142 48,158 L 50,160 Q 52,164 54,166 L 56,164 C 54,148 56,130 58,116 Q 60,104 62,96 M 112,46 Q 114,48 116,52 L 120,56 Q 126,62 130,68 C 134,72 138,78 140,84 Q 144,94 146,110 C 148,126 150,142 152,158 L 150,160 Q 148,164 146,166 L 144,164 C 146,148 144,130 142,116 Q 140,104 138,96"
        fill="none" stroke="hsl(0,0%,30%)" strokeWidth="0.8" />
      <path d="M 80,140 Q 78,148 76,158 C 74,172 74,188 76,204 Q 78,212 80,218 C 78,230 76,248 78,264 Q 80,272 84,276 L 94,276 Q 96,272 96,268 C 94,252 92,236 92,220 Q 94,210 96,202 Q 98,194 100,188 Q 102,194 104,202 Q 106,210 108,220 C 108,236 106,252 104,268 Q 104,272 106,276 L 116,276 Q 120,272 122,264 C 124,248 122,230 120,218 Q 122,212 124,204 C 126,188 126,172 124,158 Q 122,148 120,140"
        fill="none" stroke="hsl(0,0%,30%)" strokeWidth="0.8" />
    </g>
  );
}

function MuscleLayer({
  muscles,
  trainedMuscles,
  hoveredMuscle,
  onHover,
  onLeave,
  onClick,
}: {
  muscles: Record<string, string>;
  trainedMuscles: string[];
  hoveredMuscle: string | null;
  onHover: (id: string) => void;
  onLeave: () => void;
  onClick?: (id: string) => void;
}) {
  return (
    <>
      {Object.entries(muscles).map(([muscleId, d]) => {
        const isActive = isMuscleActive(muscleId, trainedMuscles);
        const isHovered = hoveredMuscle === muscleId;
        const group = MUSCLE_LABELS[muscleId];
        const isGroupHovered = hoveredMuscle !== null && MUSCLE_LABELS[hoveredMuscle] === group;

        let fillColor: string;
        let fillOp: number;
        let strokeColor: string;

        if (isActive) {
          fillColor = isHovered ? "hsl(45, 95%, 62%)" : isGroupHovered ? "hsl(45, 90%, 55%)" : "hsl(45, 85%, 48%)";
          fillOp = isHovered ? 0.95 : isGroupHovered ? 0.88 : 0.78;
          strokeColor = "hsl(45, 70%, 35%)";
        } else {
          fillColor = isHovered ? "hsl(0, 0%, 38%)" : isGroupHovered ? "hsl(0, 0%, 32%)" : "hsl(0, 0%, 22%)";
          fillOp = isHovered ? 0.7 : isGroupHovered ? 0.55 : 0.45;
          strokeColor = isHovered ? "hsl(0, 0%, 45%)" : "hsl(0, 0%, 30%)";
        }

        return (
          <path
            key={muscleId}
            d={d}
            className="transition-all duration-200 cursor-pointer"
            fill={fillColor}
            fillOpacity={fillOp}
            stroke={strokeColor}
            strokeWidth={isActive ? 0.7 : 0.5}
            strokeLinejoin="round"
            onMouseEnter={() => onHover(muscleId)}
            onMouseLeave={onLeave}
            onTouchStart={() => onHover(muscleId)}
            onClick={() => onClick?.(muscleId)}
          />
        );
      })}
    </>
  );
}

function CenterLine() {
  return (
    <line x1="100" y1="70" x2="100" y2="145" stroke="hsl(0,0%,18%)" strokeWidth="0.3" opacity="0.4" strokeDasharray="2,2" />
  );
}

export default function AnatomyBodyMap({ trainedMuscles = [], onMuscleClick, className = "" }: AnatomyBodyMapProps) {
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);
  const [view, setView] = useState<"front" | "back">("front");

  const hoveredLabel = hoveredMuscle ? MUSCLE_LABELS[hoveredMuscle] || null : null;
  const isHoveredActive = hoveredMuscle ? isMuscleActive(hoveredMuscle, trainedMuscles) : false;

  return (
    <div className={`relative select-none ${className}`}>
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex gap-1 bg-secondary/50 p-0.5 rounded-lg">
          <button
            className={`text-[10px] font-semibold px-3 py-1.5 rounded-md transition-all ${
              view === "front"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setView("front")}
            data-testid="button-bodymap-front"
          >
            Front
          </button>
          <button
            className={`text-[10px] font-semibold px-3 py-1.5 rounded-md transition-all ${
              view === "back"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setView("back")}
            data-testid="button-bodymap-back"
          >
            Back
          </button>
        </div>
        <div className="h-6 flex items-center">
          {hoveredLabel ? (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md animate-in fade-in duration-150 ${
              isHoveredActive ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-secondary text-muted-foreground border border-border'
            }`}>
              {hoveredLabel} {isHoveredActive ? "• Trained" : "• Fresh"}
            </span>
          ) : (
            <span className="text-[10px] text-muted-foreground/50">Hover to identify</span>
          )}
        </div>
      </div>

      <div className="flex justify-center" onMouseLeave={() => setHoveredMuscle(null)}>
        <svg
          viewBox="30 0 140 290"
          className="w-full max-w-[240px] h-auto"
          style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))" }}
        >
          <defs>
            <radialGradient id="bodyGlow" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="hsl(0,0%,16%)" />
              <stop offset="100%" stopColor="hsl(0,0%,6%)" />
            </radialGradient>
          </defs>

          {view === "front" ? <BodyOutlineFront /> : <BodyOutlineBack />}

          <MuscleLayer
            muscles={view === "front" ? FRONT_PATHS : BACK_PATHS}
            trainedMuscles={trainedMuscles}
            hoveredMuscle={hoveredMuscle}
            onHover={setHoveredMuscle}
            onLeave={() => setHoveredMuscle(null)}
            onClick={onMuscleClick}
          />

          <CenterLine />
        </svg>
      </div>

      <div className="flex items-center justify-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: "hsl(45, 85%, 48%)", opacity: 0.78 }} />
          <span className="text-[9px] text-muted-foreground font-medium">Trained</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: "hsl(0, 0%, 22%)", opacity: 0.45 }} />
          <span className="text-[9px] text-muted-foreground font-medium">Fresh</span>
        </div>
      </div>
    </div>
  );
}
