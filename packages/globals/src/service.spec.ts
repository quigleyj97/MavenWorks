import { GlobalsService } from "./service"

describe("GlobalsService", () => {
    test("#constructor", () => {
        expect(() => {
            const service = new GlobalsService();
            service.dispose();
        }).not.toThrow();
    });

    test("Create globals with initial values", () => {
        const TEST_GLOBALS = {
            "foo": 42,
            "bar": "test"
        };
        const service = new GlobalsService(TEST_GLOBALS);
        expect(service.getValue("foo")).toEqual(42);
        expect(service.getValue("bar")).toEqual("test");
    });
});
