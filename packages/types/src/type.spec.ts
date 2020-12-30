import {Type} from "./type";

const TOP_TYPE = Type.CreateType("TopType");
const TYPE_A = Type.CreateType("TypeA", TOP_TYPE);
const TYPE_A_CLONE = Type.CreateType("TypeA", TOP_TYPE);
const TYPE_B = Type.CreateType("TypeB", TOP_TYPE);
const BOTTOM_TYPE = Type.CreateType("BottomType");

describe("Type", () => {
    test("Should create types successfully", () => {
        const test = Type.CreateType("Foo", TOP_TYPE);
        expect(test).not.toBeUndefined();
        expect(test.getSuperType()).toEqual(TOP_TYPE);
    });

    test("Should format names correctly", () => {
        expect(TYPE_A.getTypeName()).toEqual("TypeA");
        expect(""+TYPE_A).toEqual("[object Type<TypeA>]");
    });

    test("Should test equality correctly", () => {
        expect(TYPE_A.equals(BOTTOM_TYPE)).toBeFalsy();
        expect(BOTTOM_TYPE.equals(TOP_TYPE)).toBeFalsy();
        expect(TYPE_B.equals(TYPE_A)).toBeFalsy();
        expect(TYPE_A.equals(TYPE_A)).toBeTruthy();
    });

    test("Should test assignability corectly", () => {
        expect(TYPE_A.isAssignableTo(BOTTOM_TYPE)).toBeFalsy();
        expect(BOTTOM_TYPE.isAssignableTo(TOP_TYPE)).toBeFalsy();
        expect(TYPE_B.isAssignableTo(TYPE_A)).toBeFalsy();
        expect(TYPE_A.isAssignableTo(TYPE_A)).toBeTruthy();
        expect(TYPE_A.isAssignableTo(TOP_TYPE)).toBeTruthy();
    });

    test("Should not require reference equivalence for equality or assignability", () => {
        expect(TYPE_A.equals(TYPE_A_CLONE)).toBeTruthy();
        expect(TYPE_A.isAssignableTo(TYPE_A_CLONE)).toBeTruthy();
    });
});
