/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { LinkableModel, LinkParent } from 'meteor/socialize:linkable-model';
import SimpleSchema from 'simpl-schema';
/* eslint-disable import/no-unresolved */

export const ProfilesCollection = new Mongo.Collection('profiles');

/**
 * Represents a Profile
 * @class Profile
 * @param {Object} document An object representing a users profile usually a Mongo document
 */
export class Profile extends LinkParent {
    user() {
        return Meteor.users.findOne(this.userId);
    }
}

Profile.attachCollection(ProfilesCollection);

// attach or append
Profile.appendSchema({
    userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoValue() {
            if (!this.value && this.isInsert) {
                return this.userId;
            }
            return undefined;
        },
        index: 1,
        unique: true,
        denyUpdate: true,
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
                return new Date();
            }
            return undefined;
        },
        denyUpdate: true,
    },
    lastUpdate: {
        type: Date,
        autoValue() {
            return new Date();
        },
    },
});

LinkableModel.registerParentModel(Profile);
