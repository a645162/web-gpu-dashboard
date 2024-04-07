export const padTime = (num: number) => {
    return String(num).padStart(2, '0');
};

export const getTimeStrFromTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);

    const date_part_1 = date.getFullYear();
    const date_part_2 = padTime(date.getMonth() + 1);
    const date_part_3 = padTime(date.getDate());
    const dateString =
        `${date_part_1}-${date_part_2}-${date_part_3}`;

    const time_part_1 = padTime(date.getHours());
    const time_part_2 = padTime(date.getMinutes());
    const time_part_3 = padTime(date.getSeconds());
    const timeString =
        `${time_part_1}:${time_part_2}:${time_part_3}`;

    return `${dateString} ${timeString}`;
};
