import { dropTables, startServer, stopServer } from "./utils";
import { get, post, put, deleteApi } from "./request-promise";
import { createAdmin } from "../utils/default-scripts";
let adminToken = "",
    userslist: any = [],
    userToken = "",
    groups: any = [],
    searchedUsers: any = [],
    messages: any = [];
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
    it("should add new member to group", async (done) => {
        let { response } = await get(`/api/users/search`,
            {
                headers: { "Authorization": `Bearer ${userToken}` },
                qs: { searchKey: "sai2" }
            },
        );
        console.log(response.body);
        searchedUsers = JSON.parse(response.body);
        let { response: groupResponse } = await post(`/api/groups/${groups[0]._id}/add-member`, {
            body: { member: searchedUsers[0]._id },
            json: true,
            headers: { "Authorization": `Bearer ${userToken}` }
        });
        expect(groupResponse.statusCode).toBe(200);
        expect(groupResponse.body.members.length).toEqual(1);
        done();
    });
    it("should get members list", async (done) => {
        let { response: groupResponse } = await get(`/api/groups/${groups[0]._id}/members`, {
            headers: { "Authorization": `Bearer ${userToken}` }
        });
        let rep = JSON.parse(groupResponse.body);
        expect(groupResponse.statusCode).toBe(200);
        expect(rep.members.length).toEqual(1);
        done();
    });
    it("should remove member from group", async (done) => {
        let { response: groupResponse } = await post(`/api/groups/${groups[0]._id}/delete-member`, {
            body: { member: searchedUsers[0]._id },
            json: true,
            headers: { "Authorization": `Bearer ${userToken}` }
        });
        expect(groupResponse.statusCode).toBe(200);
        expect(groupResponse.body.members.length).toEqual(0);
        done();
    });
    it("should return error for invalid member", async (done) => {
        let { response: groupResponse } = await post(`/api/groups/${groups[0]._id}/delete-member`, {
            body: { member: "" },
            json: true,
            headers: { "Authorization": `Bearer ${userToken}` }
        });
        expect(groupResponse.statusCode).toBe(400);
        done();
    });
    it("should send message to group", async (done) => {
        let { response } = await post(`/api/groups/${groups[0]._id}/messages/send`, {
            body: { message: "Helo" },
            json: true,
            headers: { "Authorization": `Bearer ${userToken}` }
        });
        expect(response.statusCode).toBe(200);
        done();
    });
    it("should get messages of a group", async (done) => {
        let { response } = await get(`/api/groups/${groups[0]._id}/messages`, {
            headers: { "Authorization": `Bearer ${userToken}` }
        });
        let resp = JSON.parse(response.body);
        expect(response.statusCode).toBe(200);
        messages = resp;
        expect(resp.length).toEqual(1);
        done();
    });
    it("should add likes to message", async (done) => {
        let { response } = await get(`/api/groups/${groups[0]._id}/messages/${messages[0]._id}/like`, {
            headers: { "Authorization": `Bearer ${userToken}` }
        });
        let resp = JSON.parse(response.body);
        expect(response.statusCode).toBe(200);
        expect(resp.likes.length).toEqual(1);
        done();
    });
    it("undo like a message", async (done) => {
        let { response } = await get(`/api/groups/${groups[0]._id}/messages/${messages[0]._id}/undo-like`, {
            headers: { "Authorization": `Bearer ${userToken}` }
        });
        let resp = JSON.parse(response.body);
        expect(response.statusCode).toBe(200);
        expect(resp.likes.length).toEqual(0);
        done();
    });
    it("should add dislikes to message", async (done) => {
        let { response } = await get(`/api/groups/${groups[0]._id}/messages/${messages[0]._id}/dislike`, {
            headers: { "Authorization": `Bearer ${userToken}` }
        });
        let resp = JSON.parse(response.body);
        expect(response.statusCode).toBe(200);
        expect(resp.dislikes.length).toEqual(1);
        done();
    });
    it("undo dislike a message", async (done) => {
        let { response } = await get(`/api/groups/${groups[0]._id}/messages/${messages[0]._id}/undo-dislike`, {
            headers: { "Authorization": `Bearer ${userToken}` }
        });
        let resp = JSON.parse(response.body);
        expect(response.statusCode).toBe(200);
        expect(resp.dislikes.length).toEqual(0);
        done();
    });
    it("undo dislike a message", async (done) => {
        let { response } = await get(`/api/groups/${groups[0]._id}/messages/${messages[0]._id}/unsend`, {
            headers: { "Authorization": `Bearer ${userToken}` }
        });
        let resp = JSON.parse(response.body);
        expect(response.statusCode).toBe(200);
        done();
    });
    it("should get messages of a group", async (done) => {
        let { response } = await get(`/api/groups/${groups[0]._id}/messages`, {
            headers: { "Authorization": `Bearer ${userToken}` }
        });
        let resp = JSON.parse(response.body);
        expect(response.statusCode).toBe(200);
        expect(resp.length).toEqual(0);
        done();
    });
});