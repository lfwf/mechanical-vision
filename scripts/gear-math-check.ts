import assert from "node:assert/strict";
import {
  GEAR_MODULE,
  MAX_DEMO_TEETH,
  MIN_STANDARD_TEETH,
  PRESSURE_ANGLE_RADIANS,
  getBasePitch,
  getBaseRadius,
  getCenterDistance,
  getContactGeometry,
  getDrivenRpm,
  getExternalMeshPhaseOffset,
  getOuterRadius,
  getPitchRadius,
  getRootRadius,
} from "../src/lib/gearMath.ts";
import { createInvoluteGearProfile } from "../src/lib/involuteProfile.ts";

const EPSILON = 1e-10;
let pairCount = 0;
let minimumContactRatio = Number.POSITIVE_INFINITY;

for (let teeth = MIN_STANDARD_TEETH; teeth <= MAX_DEMO_TEETH; teeth += 1) {
  const rootRadius = getRootRadius(teeth);
  const baseRadius = getBaseRadius(teeth);
  const pitchRadius = getPitchRadius(teeth);
  const outerRadius = getOuterRadius(teeth);

  assert(rootRadius < pitchRadius, `${teeth} 齿：齿根圆必须小于节圆`);
  assert(baseRadius < pitchRadius, `${teeth} 齿：基圆必须小于节圆`);
  assert(pitchRadius < outerRadius, `${teeth} 齿：节圆必须小于齿顶圆`);
  assert.equal(pitchRadius, (GEAR_MODULE * teeth) / 2);
  assert.equal(baseRadius, pitchRadius * Math.cos(PRESSURE_ANGLE_RADIANS));

  const profile = createInvoluteGearProfile(teeth);
  assert(profile.outline.length > teeth * 20, `${teeth} 齿：轮廓采样点过少`);
  assert(profile.outline.every((point) => Number.isFinite(point.x) && Number.isFinite(point.y)));

  const radii = profile.outline.map((point) => Math.hypot(point.x, point.y));
  assert(Math.min(...radii) >= rootRadius - EPSILON);
  assert(Math.max(...radii) <= outerRadius + EPSILON);
}

for (
  let driverTeeth = MIN_STANDARD_TEETH;
  driverTeeth <= MAX_DEMO_TEETH;
  driverTeeth += 1
) {
  for (
    let drivenTeeth = MIN_STANDARD_TEETH;
    drivenTeeth <= MAX_DEMO_TEETH;
    drivenTeeth += 1
  ) {
    pairCount += 1;
    const centerDistance = getCenterDistance(driverTeeth, drivenTeeth);
    assert.equal(
      centerDistance,
      getPitchRadius(driverTeeth) + getPitchRadius(drivenTeeth),
    );

    for (const direction of [-1, 1] as const) {
      const inputRpm = 137;
      const drivenRpm = getDrivenRpm(
        inputRpm,
        direction,
        driverTeeth,
        drivenTeeth,
      );
      assert(
        Math.abs(inputRpm * direction * driverTeeth + drivenRpm * drivenTeeth) < EPSILON,
        `${driverTeeth}/${drivenTeeth} 齿：速度关系错误`,
      );
      assert(Math.sign(drivenRpm) === -direction, "外啮合方向必须相反");
    }

    const phase = getExternalMeshPhaseOffset(drivenTeeth);
    const toothPitch = (Math.PI * 2) / drivenTeeth;
    const localSlotCenterAtContact = Math.PI / drivenTeeth - phase;
    const phaseError = Math.abs(localSlotCenterAtContact - Math.PI);
    assert(phaseError < EPSILON, `${drivenTeeth} 齿：初始齿槽相位错误`);
    assert(toothPitch > 0);

    const contact = getContactGeometry(driverTeeth, drivenTeeth);
    assert(contact.approachLength > 0, "啮入段必须为正");
    assert(contact.recessLength > 0, "啮出段必须为正");
    assert(contact.pathOfContact > getBasePitch(), "端面重合度应大于 1");
    assert(contact.contactRatio > 1, "端面重合度应大于 1");
    minimumContactRatio = Math.min(minimumContactRatio, contact.contactRatio);
  }
}

console.log(
  `[mechanics] 已检查 ${MIN_STANDARD_TEETH}–${MAX_DEMO_TEETH} 齿，共 ${pairCount} 个齿数组合；最小理论端面重合度 ${minimumContactRatio.toFixed(4)}`,
);
