const { boolToInt } = require("../database");

test("BoolToInt works", () => {
    expect(boolToInt(true)).toBe(1);
    expect(boolToInt(false)).toBe(0);
});