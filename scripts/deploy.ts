import { ethers } from "hardhat";

async function main() {
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy the Token contract
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy("ContentCP", "CCP");
    await token.deployed();
    console.log("Token deployed to:", token.address);

    // Deploy the Authorization contract
    const Authorization = await ethers.getContractFactory("Authorization");
    const authorization = await Authorization.deploy();
    await authorization.deployed();
    console.log("Authorization deployed to:", authorization.address);

    // Deploy the Analytics contract
    const Analytics = await ethers.getContractFactory("Analytics");
    const analytics = await Analytics.deploy();
    await analytics.deployed();
    console.log("Analytics deployed to:", analytics.address);

    // Deploy the Vault contract
    const Vault = await ethers.getContractFactory("Vault");
    const vault = await Vault.deploy(token.address);
    await vault.deployed();
    console.log("Vault deployed to:", vault.address);

    // Deploy the Subscription contract
    const Subscription = await ethers.getContractFactory("Subscription");
    const subscription = await Subscription.deploy(token.address, vault.address, authorization.address);
    await subscription.deployed();
    console.log("Subscription deployed to:", subscription.address);

    // Deploy the CCP contract
    const CCP = await ethers.getContractFactory("CCP");
    const ccp = await CCP.deploy(authorization.address, analytics.address, subscription.address);
    await ccp.deployed();
    console.log("CCP deployed to:", ccp.address);
}

// Execute the deployment script
main()
    .then(() => process.exit(0))  // Exit with success code
    .catch((error) => {
        console.error("Deployment failed:", error);  // Log the error
        process.exit(1);  // Exit with failure code
    });
