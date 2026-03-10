const { getAdminProfiles } = require("../../controllers/adminProfilesController");
const db = require("../../database/queries/adminProfilesQuery");
jest.mock("../../database/queries/adminProfilesQuery");

describe("AdminProfiles Controller", () => {

    test("getAdminProfiles sikeres lekérés", async () => {
        const req = {};
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        const mockProfiles = [
            { user_id: 1, first_name: "John", last_name: "Doe", email: "john@example.com" },
            { user_id: 2, first_name: "Jane", last_name: "Doe", email: "jane@example.com" }
        ];

        db.getAllProfiles.mockResolvedValue(mockProfiles);

        await getAdminProfiles(req, res);

        expect(db.getAllProfiles).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(mockProfiles);
    });

    test("getAdminProfiles hibát dob", async () => {
        const req = {};
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        const error = new Error("DB hiba");

        db.getAllProfiles.mockRejectedValue(error);

        await getAdminProfiles(req, res);

        expect(db.getAllProfiles).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Hiba a profilok lekérésekor!" });
    });

});

