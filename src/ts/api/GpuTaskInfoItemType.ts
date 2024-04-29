// 定义GpuTaskInfoItemType接口
export interface GpuTaskInfoItemType {
    id: number;
    name: string;

    debugMode: boolean;

    projectName: string;
    pyFileName: string;

    runTime: string;
    startTimestamp: number;

    gpuMemoryUsage: number;

    worldSize: number;
    localRank: number;
    condaEnv: string;
    screenSessionName: string;

    pythonVersion: string;

    mainName: string;

    command: string;

    taskMainMemoryMB: number;
}

// 创建GpuTaskInfoItemType的实例
export function createGpuTaskInfoItem(
    id: number,
    name: string,
    debugMode: boolean,
    projectName: string,
    pyFileName: string,
    runTime: string,
    startTimestamp: number,
    gpuMemoryUsage: number,
    worldSize: number,
    localRank: number,
    condaEnv: string,
    screenSessionName: string,
    pythonVersion: string,
    mainName: string,
    command: string,
    taskMainMemoryMB: number,
): GpuTaskInfoItemType {
    return {
        id,
        name,

        debugMode,

        projectName,
        pyFileName,

        runTime,
        startTimestamp,

        gpuMemoryUsage,

        worldSize,
        localRank,
        condaEnv,
        screenSessionName,

        pythonVersion,

        mainName,

        command,

        taskMainMemoryMB,
    };
}

export function updateTaskMainName(gpuTaskInfoItemType: GpuTaskInfoItemType): string {
    if (
        gpuTaskInfoItemType.screenSessionName === undefined ||
        gpuTaskInfoItemType.screenSessionName === null
    ) {
        gpuTaskInfoItemType.mainName = gpuTaskInfoItemType.projectName;
    } else if (gpuTaskInfoItemType.screenSessionName.trim().length === 0) {
        gpuTaskInfoItemType.mainName = gpuTaskInfoItemType.projectName;
    } else {
        gpuTaskInfoItemType.mainName = gpuTaskInfoItemType.screenSessionName.trim();
    }

    return gpuTaskInfoItemType.mainName;
}

export function updateAllTaskInfo(gpuTaskInfoList: GpuTaskInfoItemType[]): void {
    for (const gpuTaskInfo of gpuTaskInfoList) {
        updateTaskMainName(gpuTaskInfo);
    }
}
