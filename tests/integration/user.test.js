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
            const profile = await Profile.findOne()
        })
    })

})