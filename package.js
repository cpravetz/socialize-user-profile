/* global Package */
Package.describe({
    name: 'socialize:user-profile',
    summary: 'An extensible model for a users profile',
    version: '1.0.6',
    git: 'https://github.com/copleykj/socialize-user-profile.git',
});

Package.onUse(function _(api) {
    api.versionsFrom(['1.10.2', '2.3','3.0']);

    api.use('socialize:user-blocking');
    api.use('socialize:friendships', { weak: true });

    api.mainModule('server/server.js', 'server');
    api.mainModule('common/common.js', 'client');
});
