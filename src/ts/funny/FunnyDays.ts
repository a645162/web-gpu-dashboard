export const isAprilFoolsDay = (date: Date): boolean => {
    return date.getMonth() === 3 && date.getDate() === 1;
}

export const todayIsAprilFoolsDay =
    isAprilFoolsDay(new Date());
