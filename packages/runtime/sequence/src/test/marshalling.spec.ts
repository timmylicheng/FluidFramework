import {
    LocalClientId,
    Marker,
    ReferenceType,
    TextSegment,
    UniversalSequenceNumber,
} from "@prague/merge-tree";
import * as assert from "assert";
import { SubSequence } from "../sharedSequence";

const segmentTypes = [
    {
        ctor: () => new TextSegment("text", UniversalSequenceNumber, LocalClientId),
        fromJSON: TextSegment.FromJSONObject,
        name: "TextSegment",
    },
    {
        ctor: () => new Marker(ReferenceType.Simple, UniversalSequenceNumber, LocalClientId),
        fromJSON: Marker.fromJSONObject,
        name: "Marker",
    },
    {
        ctor: () => new SubSequence([0], UniversalSequenceNumber, LocalClientId),
        fromJSON: SubSequence.fromJSONObject,
        name: "SubSequence",
    },
];

describe("Segment Marshalling", () => {
    for (const {name, ctor, fromJSON} of segmentTypes) {
        describe(name, () => {
            describe("to/from spec", () => {
                // Ensure that a segment w/no 'props' correctly round-trips
                it("unannotated", () => {
                    const expected = ctor();
                    const spec = expected.toJSONObject();
                    const actual = fromJSON(spec);
                    assert.deepStrictEqual(expected, actual);
                });

                // Ensure that a segment w/'props' correctly round-trips
                it("annotated", () => {
                    const expected = ctor();
                    expected.addProperties({ hasProperties: true, numProperties: 2 });
                    const spec = expected.toJSONObject();
                    const actual = fromJSON(spec);
                    assert.deepStrictEqual(expected, actual);
                });

                // Ensure that 'fromJSON()' returns undefined for an unrecognized JSON spec.
                it("returns 'undefined' for unrecognized JSON spec", () => {
                    // Test some potentially problematic values that are not used by any of the defined segment types.
                    for (const unrecognized of [{}, Symbol(), NaN, undefined, null, true, false]) {
                        assert.strictEqual(undefined, fromJSON(unrecognized));
                    }
                });
            });
        });
    }
});
