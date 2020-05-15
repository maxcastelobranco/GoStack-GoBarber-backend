export default {
    jwt: {
        secret: process.env.APP_SECRET || 'default-penis-app-secret',
        expiresIn: '1d',
    },
};
