export const getMemoryString = (memory: number) => {
    let roundedNumber = Math.round(memory * 10) / 10;
    if (roundedNumber < 0.1) {
        roundedNumber = 0.1
    }

    return String(roundedNumber.toFixed(1));
};

export const convertFromMBToGB = (memoryMB: number) => {
    const memoryGB = memoryMB / 1024;
    return Math.round(memoryGB * 10) / 10;
};
