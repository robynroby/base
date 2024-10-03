import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers";

describe("Authorization Contract", function () {
    let authorization: Contract;
    let owner: any;
    let user1: any;
    let user2: any;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        // Deploy the Authorization contract
        const Authorization = await ethers.getContractFactory("Authorization");
        authorization = await Authorization.deploy();
        await authorization.deployed();
    });

    it("should register a new user", async function () {
        const username = "user1";
        const profileImage = "user1.png";

        await authorization.connect(user1).registerUser(username, profileImage);

        const registeredUser = await authorization.getUserDetails(user1.address);
        expect(registeredUser[0]).to.equal(username);
        expect(registeredUser[1]).to.equal(user1.address);
        expect(registeredUser[2]).to.equal(profileImage);

        const isRegistered = await authorization.checkRegisteredUsers(user1.address);
        expect(isRegistered).to.be.true;

        const userAddress = await authorization.getUserAddress(username);
        expect(userAddress).to.equal(user1.address);
    });

    it("should prevent registering the same user twice", async function () {
        const username = "user1";
        const profileImage = "user1.png";

        await authorization.connect(user1).registerUser(username, profileImage);

        await expect(
            authorization.connect(user1).registerUser(username, profileImage)
        ).to.be.revertedWith("User is already registered");
    });

    it("should edit user profile image", async function () {
        const username = "user1";
        const profileImage = "user1.png";
        const newProfileImage = "user1_new.png";

        await authorization.connect(user1).registerUser(username, profileImage);

        await authorization.connect(user1).editProfile(newProfileImage);

        const updatedUser = await authorization.getUserDetails(user1.address);
        expect(updatedUser[2]).to.equal(newProfileImage);
    });

    it("should revert if non-registered user tries to edit profile", async function () {
        await expect(
            authorization.connect(user2).editProfile("new_image.png")
        ).to.be.revertedWith("User is not registered");
    });

    it("should not allow two users to have the same username", async function () {
        const username = "user1";
        const profileImage = "user1.png";

        await authorization.connect(user1).registerUser(username, profileImage);

        await expect(
            authorization.connect(user2).registerUser(username, "user2.png")
        ).to.be.revertedWith("Username is already taken");
    });

    it("should return all registered users", async function () {
        await authorization.connect(user1).registerUser("user1", "user1.png");
        await authorization.connect(user2).registerUser("user2", "user2.png");

        const allUsers = await authorization.getAllUsers();

        expect(allUsers.length).to.equal(2);
        expect(allUsers[0].username).to.equal("user1");
        expect(allUsers[1].username).to.equal("user2");
    });
});
