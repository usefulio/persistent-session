Package.describe({
  name: 'useful:usersession',
  version: '0.0.1-rc1',
  // Brief, one-line summary of the package.
  summary: 'Persistent variables unique to each user',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  
  api.use('ecmascript');
  api.use('mongo');
  api.use('underscore');
  api.use('templating');
  api.use('check');
  api.use('accounts-base');

  api.addFiles('usersession.js');
  api.addFiles('usersession-server.js', 'server');

  api.export('UserSession');
  api.export('UserSessionVariables');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('underscore');
  api.use('jquery');
  api.use('templating');
  api.use('accounts-password');


  api.use('useful:usersession');
  api.addFiles('usersession-tests.html');
  api.addFiles('usersession-tests.js');
});
