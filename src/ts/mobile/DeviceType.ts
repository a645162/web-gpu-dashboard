export interface DeviceType {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
}

export function getDeviceType(): DeviceType {
    const userAgent = navigator.userAgent;

    return {
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
        isTablet: /iPad/i.test(userAgent) && !/iPhone/i.test(userAgent),
        isDesktop: !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent))
    };
}
