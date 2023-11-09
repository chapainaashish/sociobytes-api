let server;
const request = require('supertest')
const { User } = require('../../models/user')
const { Profile } = require('../../models/profile')
let user

describe('api/user', () => {
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

    describe('POST /', () => {
        it('should return 400 if username field is missing', async () => {
            delete user.username
            const res = await request(server).post('/api/user').send(user)
            expect(res.status).toBe(400)
        })

        it('should return 400 if username is invalid', async () => {
            user.username = ''
            const res = await request(server).post('/api/user').send(user)
            expect(res.status).toBe(400)
        })

        it('should return 400 if username is already taken', async () => {
            new User(user).save()
            const res = await request(server).post('/api/user').send(user)
            expect(res.status).toBe(400)
        })

        it('should return 400 if email field is missing', async () => {
            delete user.email
            const res = await request(server).post('/api/user').send(user)
            expect(res.status).toBe(400)
        })

        it('should return 400 if email is invalid', async () => {
            user.email = 'abcd.com'
            const res = await request(server).post('/api/user').send(user)
            expect(res.status).toBe(400)
        })

        it('should return 400 if email is already taken', async () => {
            new User(user).save()
            const res = await request(server).post('/api/user').send(user)
            expect(res.status).toBe(400)
        })

        it('should return 400 if password field is missing', async () => {
            delete user.password
            const res = await request(server).post('/api/user').send(user)
            expect(res.status).toBe(400)
        })

        it('should return 400 if password is less than 8 character', async () => {
            user.password = '12345'
            const res = await request(server).post('/api/user').send(user)
            expect(res.status).toBe(400)
        })

        it('should be saved in User model if user is valid', async () => {
            const res = await request(server).post('/api/user').send(user)
            const saved_user = await User.findOne({ username: user.username })
            expect(saved_user).not.toBeNull();
            expect(saved_user.username).toContain(user.username)
        })

        it('should return 200 if user is valid', async () => {
            const res = await request(server).post('/api/user').send(user)
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('username', user.username)
        })

        it('should create user profile if user is valid', async () => {
            const res = await request(server).post('/api/user').send(user)
            const saved_user = await User.findOne({ username: user.username })
            const profile = await Profile.findOne({
                user: saved_user._id.toHexString()
            })
            expect(saved_user._id.toHexString()).toEqual(profile.user.toHexString())

        })

        it('should return x-auth-token header if user is valid', async () => {
            const res = await request(server).post('/api/user').send(user)
            expect(res.headers['x-auth-token']).toBeDefined();
        })
    })

    describe('GET /', () => {
        it('should return 404 if user not exist', async () => {
            const res = await request(server).get("/api/user/aashish")
            expect(res.status).toBe(404)
        })

        it('should return 200 if user exist', async () => {
            const saved_user = await new User(user).save()
            const res = await request(server).get(`/api/user/${saved_user.username}`)
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('username', saved_user.username)
        })
    })

    describe('PUT', () => {

        it('should return 401 if token not provided', async () => {
            const res = await request(server).put("/api/user/aashish").send(user)
            expect(res.status).toBe(401)
        })

        it('should return 400 if invalid token is provided', async () => {
            const res = await request(server).put("/api/user/aashish").set('x-auth-token', '1').send(user)
            expect(res.status).toBe(400)
        })

        it('should return 400 if token is valid but user is unauthorized', async () => {
            const saved_user = await new User(user).save()
            const token = User().generateToken()
            const res = await request(server).put(`/api/user/${saved_user.username}`).set('x-auth-token', token).send(user)
            expect(res.status).toBe(400)
        })

        it('should return 400 if token is valid, authorized but data is invalid', async () => {
            const saved_user = await new User(user).save()
            const token = saved_user.generateToken()
            const res = await request(server).put(`/api/user/${saved_user.username}`).set('x-auth-token', token).send(user)
            expect(res.status).toBe(400)
        })

        it('should return 200 if token is valid, authorized and data is valid', async () => {
            const saved_user = await new User(user).save()
            const token = saved_user.generateToken()
            user.username = 'aashish1'
            delete user.email
            const res = await request(server).put(`/api/user/${saved_user.username}`).set('x-auth-token', token).send(user)
            expect(res.status).toBe(200)
        })
    })

    describe('DELETE', () => {
        it('should return 401 if token not provided', async () => {
            const res = await request(server).delete("/api/user/aashish")
            expect(res.status).toBe(401)
        })

        it('should return 400 if invalid token is provided', async () => {
            const res = await request(server).delete("/api/user/aashish").set('x-auth-token', '1')
            expect(res.status).toBe(400)
        })

        it('should return 400 if token is valid but user is unauthorized', async () => {
            const saved_user = await new User(user).save()
            const token = User().generateToken()
            const res = await request(server).delete(`/api/user/${saved_user.username}`).set('x-auth-token', token)
            expect(res.status).toBe(400)
        })

        it('should return 200 if token is valid and user is authorized', async () => {
            const saved_user = await new User(user).save()
            const token = saved_user.generateToken()
            const res = await request(server).delete(`/api/user/${saved_user.username}`).set('x-auth-token', token)
            expect(res.status).toBe(200)
        })
    })

})




