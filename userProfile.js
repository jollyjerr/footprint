class UserProfile {
    constructor(jwt, name, vehicles, houses) {
        this.jwt = jwt
        this.name = name
        this.vehicles = vehicles,
        this.houses = houses
    }
}

module.exports.UserProfile = UserProfile;