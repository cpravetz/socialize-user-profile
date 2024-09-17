/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { User } from 'meteor/socialize:user-model';
/* eslint-enable import/no-unresolved */

import './publications.js';
import { Profile, ProfilesCollection } from '../common/common.js';

ProfilesCollection.allow({
    insert(userId, document) {
        return document.checkOwnership();
    },
    update(userId, document) {
        return document.checkOwnership();
    },
});

Meteor.users.after.insert(function afterInsertUser(userId, document) {
    if (!User.disableProfileCreation) {
        const profile = {
            _id: document._id,
        };

        if (document.username) {
            profile.username = document.username;
        }

        ProfilesCollection.insertAsync(profile);
    }
});

Meteor.users.after.remove(function afterRemoveUser(userId) {
    ProfilesCollection.removeAsync({ userId });
});

Meteor.users.deny({
    update() {
        return true;
    },
});

export { Profile, ProfilesCollection };
