const main = async() => {
    const [owner, somePerson] = await hre.ethers.getSigners();
    const waveContractFacotry = await hre.ethers.getContractFactory("WavePortal")

    const waveContract = await waveContractFacotry.deploy({value: hre.ethers.utils.parseEther('0.1'), })

    await waveContract.deployed()

    console.log("contract deployed to: " + waveContract.address)
    console.log("contract deployed by: " + owner.address)

    getBalance(waveContract)

    console.log("run.js: Total Wave count: " + await waveContract.getTotalWaves())

    let startTime = new Date().getTime()
    let waveTxn = await waveContract.wave("A message");
    await waveTxn.wait();
    console.log("run.js: time to wave: " + (new Date().getTime() - startTime))
    console.log("run.js: Total Wave count: " + await waveContract.getTotalWaves())

    getBalance(waveContract)

    startTime = new Date().getTime()
    waveTxn = await waveContract.connect(somePerson).wave("Some person's message 1")
    await waveTxn.wait()
    getBalance(waveContract)

    waveTxn = await waveContract.connect(somePerson).wave("Some person's message 2")
    await waveTxn.wait()
    console.log("run.js: time for some person to wave: " + (new Date().getTime() - startTime))

    console.log("run.js: Total Wave count: " + await waveContract.connect(somePerson).getTotalWaves())

    await waveContract.getTotalWavesBy(owner.address);
    await waveContract.getTotalWavesBy(somePerson.address);

    getBalance(waveContract)

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);  
}

const getBalance = async(waveContract) => {
    let contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
    );
    console.log(
        'Contract balance:',
        hre.ethers.utils.formatEther(contractBalance)
    );
    return contractBalance;
}

const runMain = async() => {
    try {
        await main();
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

runMain();