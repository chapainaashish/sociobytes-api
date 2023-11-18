let server;
const request = require('supertest')
const { User } = require('../../models/user')
const { Profile } = require('../../models/profile')
let user
let profile

describe('api/profile', () => {
    beforeEach(() => {
        server = require('../../index');
        user = {
            username: 'abcd',
            email: 'abcd@gmail.com',
            password: '123456789',
        };

        profile = {
            name: "Aashish",
        }
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
            const user_res = await request(server).post('/api/user').send(user)
            const res = await request(server).get(`/api/profile/${user_res.body.username}`)
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('_id')
        })
    })

    describe('PUT', () => {
        it('should return 401 if token not provided', async () => {
            await request(server).post('/api/user').send(user)
            const res = await request(server).put("/api/profile/aashish").send(user)
            expect(res.status).toBe(401)
        })

        it('should return 400 if invalid token is provided', async () => {
            await request(server).post('/api/user').send(user)
            const res = await request(server).put("/api/profile/aashish").set('x-auth-token', '1').send(profile)
            expect(res.status).toBe(400)
        })

        it('should return 400 if token is valid but user is unauthorized', async () => {
            const user_res = await request(server).post('/api/user').send(user)
            const token = User().generateToken()
            const res = await request(server).put(`/api/profile/${user_res.body.username}`).set('x-auth-token', token).send(profile)
            expect(res.status).toBe(400)
        })

        it('should return 400 if token is valid, authorized but data is invalid', async () => {
            profile.name = ''
            const user_res = await request(server).post('/api/user').send(user)
            const saved_user = await User.findOne({ username: user_res.body.username })
            const token = saved_user.generateToken()
            const res = await request(server).put(`/api/profile/${saved_user.username}`).set('x-auth-token', token).send(profile)
            expect(res.status).toBe(400)
        })

        it('should return 200 if token is valid, authorized and data is valid', async () => {
            const user_res = await request(server).post('/api/user').send(user)
            const saved_user = await User.findOne({ username: user_res.body.username })
            const token = saved_user.generateToken()
            const res = await request(server).put(`/api/profile/${saved_user.username}`).set('x-auth-token', token).send(profile)
            expect(res.status).toBe(200)
        })
    })

})