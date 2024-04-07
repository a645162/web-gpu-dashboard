// 定义MachineListItem接口
export interface MachineListItem {
    machineName: string;
    machineUrl: string;
    urlKeywords: string;
}

// 创建MachineListItem的实例
export function createMachineListItem(
    machineName: string,
    machineUrl: string,
    urlKeywords: string = '',
): MachineListItem {
    return {
        machineName,
        machineUrl,
        urlKeywords
    };
}
