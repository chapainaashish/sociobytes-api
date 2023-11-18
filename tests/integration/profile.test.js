let server;
const request = require('supertest')
const { User } = require('../../models/user')
const { Profile } = require('../../models/profile')
let user

describe('api/profile', () => {
    beforeEach(() => {
        server = require('../../index');
        user = {
            username: 'abcd',
            email: 'abcd@gmail.com',
            password: '123456789',
        };
    })
    afterEach(async () => {
        server.close();
        await User.deleteMany({})
        await Profile.deleteMany({})
    })

    describe('GET /', () => {
        it('should return 404 if profile not exist', async () => {
            const res = await request(server).get("/api/profile/aashish")
            expect(res.status).toBe(404)
        })

        it('should return 200 if profile exist', async () => {
            const saved_user = await new User(user).save()
            const res = await request(server).get(`/api/profile/${saved_user.username}`)
            expect(res.status).toBe(200)
        })
    })

})