# User Profile

This package provides the bare minimum required for a user profile and is intended to be built upon to create a custom profile class that meets your needs.

>>This is a [Meteor][meteor] package with part of it's code published as a companion NPM package made to work with clients other than Meteor. For example your server is Meteor, but you want to build a React Native app for the client. This allows you to share code between your Meteor server and other clients to give you a competitive advantage when bringing your mobile and web application to market.

<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->
- [Supporting The Project](#supporting-the-project)
- [Meteor Installation](#meteor-installation)
- [NPM Installation](#npm-installation)
- [Usage Outside Meteor](#usage-outside-meteor)
  - [React Native](#react-native)
- [Automatic Profile Creation](#automatic-profile-creation)
- [Basic Usage](#basic-usage)
  - [Extending using methods()](#extending-using-methods)
  - [Extending Profile class](#extending-profile-class)
  - [Extending The Schema](#extending-the-schema)
  - [User Extensions](#user-extensions)
- [Advanced Usage](#advanced-usage)
<!-- /TOC -->

## Supporting The Project

Finding the time to maintain FOSS projects can be quite difficult. I am myself responsible for over 30 personal projects across 2 platforms, as well as Multiple others maintained by the [Meteor Community Packages](https://github.com/meteor-community-packages) organization. Therfore, if you appreciate my work, I ask that you either sponsor my work through GitHub, or donate via Paypal or Patreon. Every dollar helps give cause for spending my free time fielding issues, feature requests, pull requests and releasing updates. Info can be found in the "Sponsor this project" section of the [GitHub Repo](https://github.com/copleykj/socialize-user-profile)

## Meteor Installation

This package relies on the npm package `simpl-schema` so you will need to make sure it is installed as well.

```shell
meteor npm install --save simpl-schema
meteor add socialize:user-profile
```

> **Note**
>
> This package completely disables updates to the users collection from the client to remove the ability of users to arbitrarily update the profile field on the user document.

## NPM Installation

When using this package with React Native, the dependency tree ensures that `simpl-schema` is loaded so there's no need to install it as when using within Meteor.

```shell
npm install --save @socialize/user-profile
```

## Usage Outside Meteor

The client side parts of this package are published to NPM as `@socialize/cloudinary` for use in front ends outside of Meteor.

When using the npm package you'll need to connect to a server, which hosts the server side Meteor code for your app, using `Meteor.connect` as per the [@socialize/react-native-meteor usage example](https://github.com/copleykj/react-native-meteor#example-usage) documentation.

 ```javascript
Meteor.connect('ws://192.168.X.X:3000/websocket');
 ```

### React Native

When using this package with React Native there is some minor setup required by the `@socialize/react-native-meteor` package. See [@socialize/react-native-meteor react-native](https://github.com/copleykj/react-native-meteor#react-native) for necessary instructions.

## Automatic Profile Creation

This package will automatically create user profiles when a new user is created. To disable this behavior you can set `User.disableProfileCreation = true`.

```javascript
import { User } from 'meteor/socialize:user-model';

User.disableProfileCreation = true;
```

## Basic Usage

The `Profile` class provides your starting point. From there you may want to add methods to the class, and extend the schema to build out a custom user profile for your particular application.  You can add methods in two ways, either by using the `methods` method provided by the BaseModel class, or by extending the profile class directly and including the new methods as part of the new class. If you extend the class directly though, you will need to call the `updateTransformFunction()` method of the new class You could also extend the class instead and provide the methods as part of the new class so that `find` and `findOne` calls would return instances of the new class.

Depending on the environment, Meteor or React Native, you'll need to import classes slightly differently. Apart from imports the rest of the code works exactly the same in both environments.

```javascript
// Meteor Imports
import { Profile, ProfilesCollection } from 'meteor/socialize:user-profile';
```

```javascript
// React Native Imports
import { Profile, ProfilesCollection } from '@socialize/user-profile';
```

### Extending using methods()

```javascript
Profile.methods({
    fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
});

var userProfile = ProfilesCollection.findOneAsync();

userProfile.fullName(); //=> "John Doe"
```

### Extending Profile class

```javascript
export class EnhancedProfile extends Profile{
    fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

var userProfile = ProfilesCollection.findOneAsync();

userProfile.fullName(); //=> "John Doe"
```

### Extending The Schema

Currently the schema for `Profile` has the following definition.

```javascript
{
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoValue() {
            if (this.isInsert && !this.isFromTrustedCode) {
                return this.userId;
            }
            return undefined;
        },
    },
    username: {
        type: String,
        index: 1,
        unique: true,
        optional: true,
        denyUpdate: true,
    },
    createdAt: {
        type: Date,
        autoValue() {
            if (this.isInsert) {
                return ServerTime.date();
            }
            return undefined;
        },
        denyUpdate: true,
    },
    updatedAt: {
        type: Date,
        autoValue() {
            return ServerTime.date();
        },
    }
}
```

As part of the above examples, in the `fullName` method we return a string containing the `firstName` and `lastName` properties of the document. For these to be allowed as part of the profile document, you will need to add them to the schema for `Profile`. This can be accomplished by using the `attachSchema` method inherited from `BaseModel`.

The schema is handled by `SimpleSchema` so passing a new schema instance to the `attachSchema` method will merge the new schema into the old one .

```javascript
    Profile.attachSchema({
        "firstName":{
            type:String,
            required: true
        },
        "lastName":{
            type:String,
            required: true
        }
    })
```

### User Extensions

This package extends the socialize:user-model package with a `profile` method which will return the profile for the found user.

When using with React Native you'll need to import the package so that it properly extends the user class with the `profile` method.

```javascript
import '@socialize/user-profile';
```

```javascript
let user = Meteor.users.findOneAsync();

user.profile();


Meteor.user().profile(); // the current users profile
```

>**Note**
>
>`user.profile()` will be undefined on the client if profile is not published from the server.

## Advanced Usage

The `Profile` class extends the `LinkParent` class provided by _socialize:linkable-model_. This allows you to extend the `Profile` class using linkable packages such as _socialize:likeable_, _socialize:commentable_, and _socialize:postable_.

For example you could create a profile that would allow other users to add posts to it.

```javascript
// Meteor Imports
import { PostableModel } from 'meteor/socialize:postable';
import { Profile } from 'meteor/socialize:user-profile';
import { LinkableModel } from 'meteor/socialize:linkable-model';
```

```javascript
// React Native Imports
import { PostableModel } from '@socialize/postable';
import { Profile } from '@socialize/user-profile';
import { LinkableModel } from '@socialize/linkable-model';
```

```javascript
export class PostableProfile extends PostableModel(Profile){
    //methods here
}

PostableProfile.updateTransformFunction();

LinkableModel.registerParentModel(PostableProfile);
```

For more information on using this package, please refer to [API.md][api]

[meteor]: https://meteor.com
[socialize]: https://atmospherejs.com/socialize
[api]: https://github.com/copleykj/socialize-user-profile/blob/master/API.md
