Meteor.publish('useful:usersession/variables', function (nameOrSelector) {
  if (!this.userId)
    return this.ready();

  var selector = transformSelector(nameOrSelector);
  selector.userId = this.userId;
  return UserSessionVariables.find(selector);
});
