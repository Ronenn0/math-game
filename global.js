
const random = (minN, maxN) => {
    let min, max;
    if(!maxN) {
        min = 0;
        max = minN;
    } else {
        min = minN;
        max = maxN;
    }
    return Math.floor(min + Math.random() * (max - min));
};

function sleep(milliSeconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliSeconds);
    });
}
