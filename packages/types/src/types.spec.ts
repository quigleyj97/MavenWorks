import { Types } from "./types"

describe("Builtin Types", () => {
    test("Top type", () => {
        expect(Types.Integer.isAssignableTo(Types.Unknown)).toBeTruthy();
    });

    test("Numbers", () => {
        expect(Types.Integer.isAssignableTo(Types.Number)).toBeTruthy();
        expect(Types.Integer.getSuperType()).toEqual(Types.Number);
        expect(Types.Float.isAssignableTo(Types.Integer)).toBeFalsy();
    });
});
