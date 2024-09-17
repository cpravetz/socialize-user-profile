export default ({ User, ProfilesCollection }) => {
    User.methods({
        async profile() {
            const profile = await ProfilesCollection.findOneAsync({ _id: this._id });
            return profile;
        },
    });
};
