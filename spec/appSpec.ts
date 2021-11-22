import { dropTables, startServer, stopServer } from "./utils";
import { get, post, put, deleteApi } from "./request-promise";
import { createAdmin } from "../utils/default-scripts";
let adminToken = "", userslist: any = [], userToken = "", groups = [];
describe("App tests", () => {
    beforeAll(async (done) => {
        await dropTables();
        await startServer();
        await createAdmin();
        setTimeout(() => {
            done();
        }, 2000);
    });

    afterAll(async (done) => {
        await stopServer();
        done();
    });
    it("should login the admin", async (done) => {
        let { response, body } = await post(`/api/admin/login`, {
            body: { email: "admin@gmail.com", password: "Hello@123" },
            json: true
        });
        expect(response.statusCode).toBe(200);
        adminToken = response.body.token;
        done();
    });
    it("should create user", async (done) => {
        let { response } = await post(`/api/admin/users/create`, {
            body: { email: "sai1@ymail.com", password: "Helloabc" },
            headers: { "Authorization": `Bearer ${adminToken}` },
            json: true
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.email).toEqual("sai1@ymail.com");
        done();
    });
    it("should create user", async (done) => {
        let { response } = await post(`/api/admin/users/create`, {
            body: { email: "sai2@ymail.com", password: "Helloabc" },
            headers: { "Authorization": `Bearer ${adminToken}` },
            json: true
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.email).toEqual("sai2@ymail.com");
        done();
    });
    it("should get users list", async (done) => {
        let { response } = await get(`/api/admin/users/list`, {
            headers: { "Authorization": `Bearer ${adminToken}` },
        });
        expect(response.statusCode).toBe(200);
        userslist = JSON.parse(response.body);
        expect(userslist.length).toEqual(2);
        done();
    });
    it("should edit user", async (done) => {
        let { response } = await put(`/api/admin/users/${userslist[0]._id}`, {
            body: { email: "sai1@ymail.com", password: "Helloabd" },
            headers: { "Authorization": `Bearer ${adminToken}` },
            json: true
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.email).toEqual("sai1@ymail.com");
        done();
    });
    it("should throw error while edit user", async (done) => {
        let { response } = await put(`/api/admin/users/${userslist[0]._id}`, {
            body: { email: "sai1@ymail.com" },
            headers: { "Authorization": `Bearer ${adminToken}` },
            json: true
        });
        expect(response.statusCode).toBe(400);
        done();
    });
    it("should login the user", async (done) => {
        let { response } = await post(`/api/users/login`, {
            body: { email: "sai1@ymail.com", password: "Helloabd" },
            json: true
        });
        expect(response.statusCode).toBe(200);
        userToken = response.body.token;
        done();
    });
    it("should search the user", async (done) => {
        let { response } = await get(`/api/users/search`,
            {
                headers: { "Authorization": `Bearer ${userToken}` },
                qs: { searchKey: "ppgah" }
            },
        );
        expect(response.statusCode).toBe(200);
        let searchedUsers = JSON.parse(response.body);
        expect(searchedUsers.length).toEqual(0);
        done();
    });
    it("should create group", async (done) => {
        let { response } = await post(`/api/groups/create`, {
            body: { name: "Family 123" },
            headers: { "Authorization": `Bearer ${userToken}` },
            json: true
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toEqual("Family 123");
        done();
    });
    it("should list the groups", async (done) => {
        let { response } = await get(`/api/groups/list`, {
            headers: { "Authorization": `Bearer ${userToken}` }
        });
        expect(response.statusCode).toBe(200);
        groups = JSON.parse(response.body);
        expect(groups.length).toEqual(1);
        done();
    });
});