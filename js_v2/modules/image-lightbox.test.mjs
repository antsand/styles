import assert from 'node:assert/strict';
import test from 'node:test';
import { clampPan, zoomAroundPoint } from './image-lightbox.js';

test('zoom keeps the content point under the pointer', () => {
    const state = { zoom: 1.5, panX: 20, panY: -10 };
    const pointer = { x: 120, y: -40 };
    const next = zoomAroundPoint(state, 2.5, pointer.x, pointer.y);
    const contentX = (pointer.x - state.panX) / state.zoom;
    const contentY = (pointer.y - state.panY) / state.zoom;
    assert.equal(next.panX + next.zoom * contentX, pointer.x);
    assert.equal(next.panY + next.zoom * contentY, pointer.y);
});

test('pan stays inside scaled image bounds', () => {
    assert.equal(clampPan(1000, 2, 300, 400), 100);
    assert.equal(clampPan(-1000, 2, 300, 400), -100);
    assert.equal(clampPan(40, 1, 300, 400), 0);
    assert.equal(clampPan(40, 2, 100, 400), 0);
});
