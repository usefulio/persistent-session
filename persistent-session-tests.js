if (Meteor.isServer)
  UserSessionVariables.remove({});

Meteor.userId = function () {
  return 'x';
}

// I've placed these sessions outside of the test code to ensure that their
// subscriptions are ready before the tests run
var session1 = new UserSession('1');
var session2 = new UserSession('2');
var session3 = new UserSession('3');

if (Meteor.isClient)
  UserSession.mixin(Template.usersessionTestTemplate, {
    fields: ['x']
  });

Tinytest.add('UserSession - get/set - gets/sets a value', function (test) {
  session1.set('x', 'y');
  var resultingValue = session1.get('x');
  test.equal(resultingValue, 'y');
});

if (Meteor.isClient) {
  Tinytest.add('UserSession - mixin - extends template', function (test) {
    var div = $('<div>')[0];
    var view = Blaze.render(Template.usersessionTestTemplate, div);
    var tmpl = view.templateInstance();

    test.equal(tmpl.get('x'), undefined);
    tmpl.set('x', 5);
    test.equal(tmpl.get('x'), 5);
  });
  Tinytest.add('UserSession - mixin - adds helpers', function (test) {
    var div = $('<div>')[0];
    var view = Blaze.render(Template.usersessionTestTemplate, div);
    var tmpl = view.templateInstance();

    Blaze._withCurrentView(view, function () {
      test.equal(view.lookup('x')(), tmpl.get('x'));
    });
  });
}
