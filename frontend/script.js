const contractAddress = "0xf1cc482248d4762a38e3e682524383389d5e0ca0";
const contractABI = [[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "badgeId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			}
		],
		"name": "BadgeBought",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "badgeId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "BadgeCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "badgeId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "BadgeListedForSale",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "badgeId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "BadgeTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "badges",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "forSale",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_badgeId",
				"type": "uint256"
			}
		],
		"name": "buyBadge",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			}
		],
		"name": "createBadge",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "getOwnedBadges",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_badgeId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "listBadgeForSale",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "ownedBadges",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_badgeId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			}
		],
		"name": "transferBadge",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
    // Replace with your contract's ABI
];

let web3;
let contract;

async function connectBlockchain() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        contract = new web3.eth.Contract(contractABI, contractAddress);
        console.log("Connected to Blockchain", accounts[0]);
    } else {
        alert("Please install MetaMask!");
    }
}

async function registerEvent() {
    const eventName = document.getElementById("eventName").value;
    const accounts = await web3.eth.getAccounts();
    try {
        await contract.methods.registerForEvent(eventName).send({ from: accounts[0] });
        alert(`Successfully registered for ${eventName}`);
    } catch (error) {
        console.error(error);
        alert("Error registering for event");
    }
}

async function claimBadge() {
    const eventName = document.getElementById("badgeEventName").value;
    const accounts = await web3.eth.getAccounts();
    try {
        await contract.methods.claimBadge(eventName).send({ from: accounts[0] });
        alert(`Badge claimed for ${eventName}`);
    } catch (error) {
        console.error(error);
        alert("Error claiming badge");
    }
}

async function getParticipation() {
    const accounts = await web3.eth.getAccounts();
    try {
        const events = await contract.methods.getUserEvents(accounts[0]).call();
        const participationList = document.getElementById("participationList");
        participationList.innerHTML = "";
        events.forEach(event => {
            const li = document.createElement("li");
            li.textContent = event;
            participationList.appendChild(li);
        });
    } catch (error) {
        console.error(error);
        alert("Error fetching participation data");
    }
}

window.onload = connectBlockchain;
