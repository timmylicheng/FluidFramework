import * as assert from "assert";
import { ISegment } from "../mergeTree";
import { TextSegment } from "../textSegment";

describe("segmentGroupCollection", () => {
    let segment: ISegment;
    beforeEach(() => {
        segment = TextSegment.Make("abc");
    });
    it(".empty", () => {
        assert(segment.segmentGroups.empty);
    });

    it(".size", () => {
        assert.equal(segment.segmentGroups.size, 0);
    });

    it(".enqueue", () => {
        const  segmentGroup = { segments: [] };
        segment.segmentGroups.enqueue(segmentGroup);

        assert(!segment.segmentGroups.empty);
        assert.equal(segment.segmentGroups.size, 1);
        assert.equal(segmentGroup.segments.length, 1);
        assert.equal(segmentGroup.segments[0], segment);
    });

    it(".dequeue", () => {
        const segmentGroup = { segments: [] };
        segment.segmentGroups.enqueue(segmentGroup);
        const segmentGroupCount = 6;
        while (segment.segmentGroups.size < segmentGroupCount) {
            segment.segmentGroups.enqueue({ segments: [] });
        }

        const dequeuedSegmentGroup = segment.segmentGroups.dequeue();

        assert.equal(segment.segmentGroups.size, segmentGroupCount - 1);
        assert.equal(dequeuedSegmentGroup.segments.length, 1);
        assert.equal(dequeuedSegmentGroup.segments[0], segment);
        assert.equal(dequeuedSegmentGroup, segmentGroup);
    });

    it(".clear", () => {
        const  segmentGroup = { segments: [] };
        segment.segmentGroups.enqueue(segmentGroup);
        const segmentGroupCount = 6;
        while (segment.segmentGroups.size < segmentGroupCount) {
            segment.segmentGroups.enqueue({ segments: [] });
        }

        segment.segmentGroups.clear();

        assert(segment.segmentGroups.empty);
        assert.equal(segment.segmentGroups.size, 0);

        assert.equal(segmentGroup.segments.length, 1);
        assert.equal(segmentGroup.segments[0], segment);
    });

    it(".copyTo", () => {
        const segmentGroupCount = 6;
        while (segment.segmentGroups.size < segmentGroupCount) {
            segment.segmentGroups.enqueue({ segments: [] });
        }

        const segmentCopy = TextSegment.Make("");
        segment.segmentGroups.copyTo(segmentCopy);

        assert.equal(segment.segmentGroups.size, segmentGroupCount);
        assert.equal(segmentCopy.segmentGroups.size, segmentGroupCount);

        while (!segment.segmentGroups.empty || !segmentCopy.segmentGroups.empty) {

            const segmentGroup = segment.segmentGroups.dequeue();
            const copySegmentGroup = segmentCopy.segmentGroups.dequeue();

            assert.equal(segmentGroup, copySegmentGroup);
            assert.equal(segmentGroup.segments.length, 2);
            assert.equal(segmentGroup.segments[0], segment);
            assert.equal(segmentGroup.segments[1], segmentCopy);
        }
    });
});
