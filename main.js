const addressEle = document.getElementById('safemoon_address');
const speedEle = document.getElementById('speed');
const speedElev1 = document.getElementById('speedv1');
const totalEle = document.getElementById('total');
const statEle = document.getElementById('statBox');
const tokenAddress = '0x42981d0bfbAf196529376EE702F2a9Eb9092fcB5'
const bscToken = 'RE9CWGZITE33WWS7KT8H3B4MCVSPV1R5NF';
const bscscan_url = 'https://bscscan.com/token/0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3?a=';


function getSafemoonAccount(address) {
    let fetchurl = `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=${tokenAddress}&address=${address}&tag=latest&apikey=${bscToken}`;
    return new Promise((resolve, reject) => {
        fetch(fetchurl).then(response => response.json())
        .then(response => {
            let amount = response['result'] * 0.000000001; //9 decimal places
            resolve({
                amount: amount,
                timestamp: new Date()
            });
        });
    });
}

let speed = 0;
let accumulate = {
    amount: 0,
    seconds: 0
};
let previousUpdate;


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateResults(updateVal) {
    if(!previousUpdate) {
        previousUpdate = updateVal;
    }

    let rep = updateVal['amount'].toString().split('.');
    totalEle.innerHTML = `${numberWithCommas(rep[0])}.<span style="font-size: 14px;">${rep[1]}</span> SAFEMOON`;

    if(statEle.style.display == 'none' || !statEle.style.display) {
        statEle.style.display = 'inline-block';
    }

    let diff = {
        diffAmount: updateVal['amount'] - previousUpdate['amount'],
        diffTime: (updateVal['timestamp'] - previousUpdate['timestamp'])/1000
    }

    accumulate = {
        amount: accumulate['amount'] + diff['diffAmount'],
        seconds: accumulate['seconds'] + diff['diffTime']
    }

    speed = accumulate['amount']/accumulate['seconds'];
    if(speed > 0) {
        speedEle.innerHTML = `${speed} SAFEMOON per Second!`;
        speedElev1.innerHTML = `${speed*1000} SAFEMOON V1 per second. (comparison)`;
    }
    console.log(accumulate)
}

function runStats() {
    let address = addressEle.value;
    console.log('address', address);
    if(address.length > 0) {
        let interval = setInterval(() => {
            getSafemoonAccount(address).then(result => {
                updateResults(result)
            })
        }, 1000);
    }
}

