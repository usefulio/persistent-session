UserSessionVariables = new Mongo.Collection('useful:usersession/variables');

UserSession = function (nameOrSelector) {
  this.query = transformSelector(nameOrSelector);
  if (Meteor.isClient)
    this.subscription = Meteor.subscribe('useful:usersession/variables', this.query);
}
var transformSelector = UserSession._transformSelector = function(sessionSelector) {
  if (_.isString(sessionSelector))
    return { name: sessionSelector };
  else if (_.isObject(sessionSelector))
    return sessionSelector;
  else if (_.isUndefined(sessionSelector) || _.isNull(sessionSelector))
    return {};
  else
    throw new Meteor.Error('unrecognized-sessionSelector', 'The selector should be of type string, object, null, or undefined, is of type: ' + typeof sessionSelector, {
      selector: sessionSelector
    });
};
UserSession.prototype._makeQuery = function (key) {
  return _.extend({}, this.query, {
    key: key
    , userId: Meteor.userId()
  });
}
UserSession.prototype.get = function (key) {
  var query = this._makeQuery(key);
  var variable = UserSessionVariables.findOne(query);
  return variable && variable.value;
}
UserSession.prototype.set = function (key, value) {
  Meteor.call('useful:usersession/variables/set', this._makeQuery(key), value);
}
UserSession.prototype.destroy = function () {
  if (this.subscription)
    this.subscription.stop();
}

Meteor.methods({
  'useful:usersession/variables/set': function (selector, value) {
    if (selector.userId !== Meteor.userId() || !Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    return UserSessionVariables.upsert(selector, {
      $set: {
        value: value
      }
    });
  }
});

UserSession.mixin = function (template, {
  fields
  , name
}) {
  name = name || template.viewName;
  template.onCreated(function () {
    var tmpl = this;

    // Should run only once, ensures that any reactive variables or
    // subscriptions created by UserSession are cleaned up/stopped when the
    // template is destroyed
    tmpl.autorun(function () {
      tmpl.variables = new UserSession(tmpl.view.name);
    });
    
    tmpl.get = function (key) { return tmpl.variables.get(key); };
    tmpl.set = function (key, value) { return tmpl.variables.set(key, value); };
  });

  if (fields) {
    check(fields, [String]);
    var helpers = {};
    _.each(fields, function (field) {
      helpers[field] = function () {
        var tmpl = Template.instance();
        return tmpl.get(field);
      }
    });
    template.helpers(helpers);
  }
};
