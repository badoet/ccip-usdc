import hre from "hardhat";

// Define a test suite for Sender and Receiver contracts.
describe("Sender and Receiver", function () {
  // Define a chain selector for the test scenario.
  const chainSelector = "14767482510784806043"; // fuji testnet

  // Test scenario to send a CCIP message from sender to receiver and assess gas usage.
  it("should CCIP message from sender to receiver", async function () {
    // Deploy contracts and load their instances.
    console.log("loadFixture");
    console.log("1");
    const Router = await hre.ethers.getContractFactory("MockCCIPRouter");
    console.log("Router");
    const TransferUSDC = await hre.ethers.getContractFactory("TransferUSDC");
    console.log("TransferUSDC");
    const Receiver = await hre.ethers.getContractFactory("Receiver");
    console.log("Receiver");

    console.log("2");
    // Instantiate the contracts.
    const router = await Router.deploy();
    const routerAddress = await router.getAddress();
    const sender = await TransferUSDC.deploy(
      routerAddress,
      "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
      "0x5425890298aed601595a70AB815c96711a31Bc65"
    );
    const receiver = await Receiver.deploy(routerAddress);

    console.log("3");

    const senderAddress = await sender.getAddress();

    // Setup allowlists for chains and sender addresses for the test scenario.
    await sender.allowlistDestinationChain(chainSelector, true);
    await receiver.allowlistSourceChain(chainSelector, true);
    await receiver.allowlistSender(senderAddress, true);

    // Define parameters for the tests, including gas limit and iterations for messages.
    const gasLimit = 400000;
    const testParams = [1, 2]; // Different iteration values for testing.
    const gasUsageReport = []; // To store reports of gas used for each test.

    const receiverAddress = await receiver.getAddress();

    console.log("iterating");
    // Loop through each test parameter to send messages and record gas usage.
    for (const iterations of testParams) {
      console.log("iterate", iterations);
      await sender.transferUsdc(
        chainSelector,
        receiverAddress,
        iterations,
        gasLimit
      );

      console.log("mockRouterEvents");

      // Retrieve gas used from the last message executed by querying the router's events.
      const mockRouterEvents = await router.queryFilter(
        router.filters.MsgExecuted
      );
      const mockRouterEvent = mockRouterEvents[mockRouterEvents.length - 1]; // check last event
      const gasUsed = mockRouterEvent.args.gasUsed;
      console.log(mockRouterEvent);

      // Push the report of iterations and gas used to the array.
      gasUsageReport.push({
        iterations,
        gasUsed: gasUsed.toString(),
      });
    }

    // Log the final report of gas usage for each iteration.
    console.log("Final Gas Usage Report:");
    gasUsageReport.forEach((report) => {
      console.log(
        "Number of iterations %d - Gas used: %d",
        report.iterations,
        report.gasUsed
      );
    });
  });
});
