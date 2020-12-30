import { GenericType } from "./generic"
import { Types } from "./types"

describe("Generics", () => {
    test("Should allow construction by factory", () => {
        const TestGeneric = GenericType.CreateGenericFactory("TestGeneric");
        expect(TestGeneric).not.toBeUndefined();
    });

    test("Factory should validate number of generic arguments", () => {
        expect(Types.Array.bind(void 0, Types.Number)).not.toThrow();
        expect(Types.Array.bind(void 0, Types.Integer, Types.Float)).toThrow();
    });

    test("Should perform equivalence checks", () => {
        const Array1 = Types.Array(Types.Number);
        const Array2 = Types.Array(Types.Number);
        const Array3 = Types.Array(Types.Integer);
        expect(Array1.equals(Array2)).toBeTruthy();
        expect(Array1.equals(Array3)).toBeFalsy();
        expect(Array1.baseTypeEquals(Array3)).toBeTruthy();
    });

    test("Should perform covariant structural assignability checks", () => {
        const Map1 = Types.Map(Types.String, Types.Number);
        const Map2 = Types.Map(Types.String, Types.Integer);

        expect(Map1.isAssignableTo(Map1)).toBeTruthy();
        // assignability should be covariant
        expect(Map2.isAssignableTo(Map1)).toBeTruthy();
        expect(Map1.isAssignableTo(Map2)).toBeFalsy();
    });

    test("Should format human readable strings correctly", () => {
        const IntArray = Types.Array(Types.Integer);
        const StringIntMap = Types.Map(Types.String, Types.Integer);
        expect(IntArray.getHumanReadableName()).toEqual("Array<Integer>");
        expect(StringIntMap.getHumanReadableName()).toEqual("Map<String, Integer>");
    });

    test("Should validate length of generic args in factory", () => {
        const TestType = GenericType.CreateGenericFactory("TestType", Types.Object, 2);
        expect(() => TestType(Types.String, Types.Unknown, Types.Unknown)).toThrow("Incorrect number of generic arguments provided: Expected 2, got 3");
        expect(() => TestType(Types.String)).toThrow("Incorrect number of generic arguments provided: Expected 2, got 1");
        expect(() => TestType()).toThrow("Incorrect number of generic arguments provided: Expected 2, got 0");
        expect(() => TestType(Types.String, Types.Unknown)).not.toThrow();
    })
});