Package.describe({
  name: 'useful:persistent-session',
  version: '0.0.1-rc1',
  // Brief, one-line summary of the package.
  summary: 'Persistent state variables unique to each user',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/usefulio/persistent-session.git',
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

  api.addFiles('persistent-session.js');
  api.addFiles('persistent-session-server.js', 'server');

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


  api.use('useful:persistent-session');
  api.addFiles('persistent-session-tests.html');
  api.addFiles('persistent-session-tests.js');
});
