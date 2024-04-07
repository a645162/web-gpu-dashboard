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

        command,

        taskMainMemoryMB,
    };
}
