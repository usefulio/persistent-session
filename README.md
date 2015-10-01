Useful User Session
======

As a replacement for the Session variable, this package exposes the UserSession variable with the following features:

1. You can create different instances of UserSession to namespace your variables, for example 1 namespace per route
2. All variables are synced to the server and stored in a collection, so that they are persistant across all connections
3. You can access variables via UserSession.get(key) and set variables via UserSession.set(key, value)
4. Variables are per user, so each user will only get variables which specific to them
5. UserSession.mixin will extend your template allowing you to persist state for that template across multiple sessions

How to Use
===

It's pretty easy to just use the UserSession constructor anywhere in your client side code. (UserSession also works on the server but is not reactive)

```javascript

// Create a session
var gameSession = new UserSession('game');

Tracker.autorun(function () {
  // will log whichever game the user is currently watching, which
  // might be undefined, or might exist from a previous session
  console.log('watching: ', gameSession.get('watching'))
});

// somewhere in your code the user update's their 'watching' game
gameSession.set('watching', 'Broncos');

```

The most common use case for UserSession is likely to persist some view related state which you think the user won't want to set everytime they reload the app, for example in the todos example we have a switch to show uncompleted vs. all tasks, let's make this checkbox keep it's most recent value by using the UserSession.mixin variable to set some state variables.

```javascript
// We just need to call mixin to add our helpers to the template
// we don't need to pass a name for our session, the mixin will use
// the name of our template 'Template.body'
UserSession.mixin(Template.body, {
  // the fields option is optional, but if we specify some fields here,
  // they will be automatically added as template helpers to our template.
  fields: ['hideCompleted']
});

// instead of calling Session.set, we're going to call tmpl.set
Template.body.events({
  "change .hide-completed input": function (e, tmpl) {
    tmpl.set("hideCompleted", event.target.checked);
  }
});

// instead of calling Session.get, we're going to call tmpl.get
Template.body.helpers({
  tasks: function () {
    var tmpl = Template.instance();
    if (tmpl.get("hideCompleted")) {
      // If hide completed is checked, filter tasks
      return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
    } else {
      // Otherwise, return all of the tasks
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  }
});
```

